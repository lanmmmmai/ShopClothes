import pkg from '@prisma/client';
const { CoinTransactionType, OtpType, OrderStatus, PaymentMethod, PaymentStatus, Role } = pkg;
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { sendBillMail, sendOrderPaymentOtpMail } from '../services/mail.service.js';
import { emitToAdmins, emitToUser } from '../socket.js';
import { addMinutes, generateOtp } from '../utils/otp.js';

const orderSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  street: z.string().min(3),
  district: z.string().min(2),
  city: z.string().min(2),
  paymentMethod: z.enum(['COD', 'BANKING']),
  note: z.string().optional(),
  voucherCode: z.string().trim().optional(),
  paymentOtp: z.string().trim().length(6).optional(),
  items: z.array(z.object({
    productId: z.string().optional(),
    productSlug: z.string().optional(),
    productName: z.string().optional(),
    quantity: z.number().int().min(1),
  })).min(1),
});

const requestBankingOtpSchema = z.object({
  paymentMethod: z.enum(['COD', 'BANKING']),
  voucherCode: z.string().trim().optional(),
  items: z.array(z.object({
    productId: z.string().optional(),
    productSlug: z.string().optional(),
    productName: z.string().optional(),
    quantity: z.number().int().min(1),
  })).min(1),
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
});

function createOrderCode() {
  return `ORD-${Date.now()}`;
}

async function resolveProducts(orderItems) {
  const resolved = [];

  for (const item of orderItems) {
    let product = null;

    if (item.productId) {
      product = await prisma.product.findUnique({ where: { id: item.productId } });
    }
    if (!product && item.productSlug) {
      product = await prisma.product.findUnique({ where: { slug: item.productSlug } });
    }
    if (!product && item.productName) {
      product = await prisma.product.findFirst({ where: { name: item.productName } });
    }

    if (!product) return null;
    resolved.push({ item, product });
  }

  return resolved;
}

async function resolveVoucher({ voucherCode, subtotal, userId }) {
  if (!voucherCode) return { voucher: null, discountAmount: 0, userVoucherId: null };

  const voucher = await prisma.voucher.findUnique({ where: { code: voucherCode.trim().toUpperCase() } });
  const now = new Date();
  if (!voucher || !voucher.isActive || (voucher.startsAt && voucher.startsAt > now) || (voucher.expiresAt && voucher.expiresAt < now)) {
    throw new Error('Voucher không tồn tại, không hợp lệ hoặc đã hết hạn');
  }
  if (voucher.quantity <= voucher.usedCount) {
    throw new Error('Voucher đã hết lượt sử dụng');
  }
  if (subtotal < voucher.minOrderAmount) {
    throw new Error(`Đơn hàng chưa đạt giá trị tối thiểu ${voucher.minOrderAmount.toLocaleString('vi-VN')}₫ để dùng voucher`);
  }

  const userVoucher = userId ? await prisma.userVoucher.findFirst({
    where: { userId, redeemedAt: null, voucher: { code: voucher.code } },
    orderBy: { createdAt: 'asc' },
  }) : null;

  if (userId) {
    const usedBefore = await prisma.order.findFirst({
      where: { userId, voucherCode: voucher.code },
      select: { id: true },
    });
    if (usedBefore) {
      throw new Error('Voucher này chỉ áp dụng 1 lần cho mỗi tài khoản');
    }
    if (!userVoucher) {
      const ownedBefore = await prisma.userVoucher.findFirst({
        where: { userId, voucherId: voucher.id },
        select: { id: true },
      });
      if (ownedBefore) {
        throw new Error('Voucher này đã được dùng hoặc đã nhận trước đó trên tài khoản của bạn');
      }
    }
  }

  let discountAmount = voucher.discountType === 'percent'
    ? subtotal * (voucher.discountValue / 100)
    : voucher.discountValue;

  if (voucher.maxDiscount) {
    discountAmount = Math.min(discountAmount, voucher.maxDiscount);
  }

  discountAmount = Math.max(0, Math.min(discountAmount, subtotal));
  return { voucher, discountAmount, userVoucherId: userVoucher?.id || null };
}

async function verifyPaymentOtp(userId, otp) {
  const codeRecord = await prisma.otpCode.findFirst({
    where: {
      userId,
      type: OtpType.ORDER_PAYMENT,
      code: otp,
      verifiedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!codeRecord || codeRecord.expiresAt < new Date()) {
    throw new Error('OTP thanh toán không hợp lệ hoặc đã hết hạn');
  }

  await prisma.otpCode.update({ where: { id: codeRecord.id }, data: { verifiedAt: new Date() } });
}

export async function requestBankingOtp(req, res) {
  try {
    const data = requestBankingOtpSchema.parse(req.body);
    if (data.paymentMethod !== PaymentMethod.BANKING) {
      return res.status(400).json({ message: 'Chỉ cần OTP khi chọn thanh toán chuyển khoản' });
    }

    const resolvedItems = await resolveProducts(data.items);
    if (!resolvedItems || resolvedItems.length !== data.items.length) {
      return res.status(400).json({ message: 'Có sản phẩm không tồn tại' });
    }

    const subtotal = resolvedItems.reduce((sum, { item, product }) => sum + (product.salePrice || product.price) * item.quantity, 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const { discountAmount } = await resolveVoucher({ voucherCode: data.voucherCode, subtotal, userId: req.user.id });
    const amount = Math.max(subtotal + shippingFee - discountAmount, 0);

    const code = generateOtp();
    await prisma.otpCode.create({
      data: {
        code,
        type: OtpType.ORDER_PAYMENT,
        expiresAt: addMinutes(new Date(), 10),
        userId: req.user.id,
      },
    });

    try {
      await sendOrderPaymentOtpMail({ to: req.user.email, fullName: req.user.fullName, code, amount });
    } catch (_mailError) {
      return res.status(201).json({
        message: 'Đã tạo OTP nhưng chưa gửi được Gmail. Hãy kiểm tra lại cấu hình Gmail trong backend/.env',
      });
    }

    res.status(201).json({ message: 'Mã OTP thanh toán đã được gửi về Gmail của bạn' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể gửi OTP thanh toán' });
  }
}

export async function createOrder(req, res) {
  try {
    const data = orderSchema.parse(req.body);
    const resolvedItems = await resolveProducts(data.items);

    if (!resolvedItems || resolvedItems.length !== data.items.length) {
      return res.status(400).json({ message: 'Có sản phẩm không tồn tại' });
    }

    let subtotal = 0;
    const lineItems = resolvedItems.map(({ item, product }) => {
      const unitPrice = product.salePrice || product.price;
      subtotal += unitPrice * item.quantity;
      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        productName: product.name,
      };
    });

    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const { voucher, discountAmount, userVoucherId } = await resolveVoucher({ voucherCode: data.voucherCode, subtotal, userId: req.user.id });
    const finalTotal = Math.max(subtotal + shippingFee - discountAmount, 0);

    if (data.paymentMethod === PaymentMethod.BANKING) {
      if (!data.paymentOtp) {
        return res.status(400).json({ message: 'Vui lòng nhập OTP đã gửi về Gmail để xác nhận chuyển khoản' });
      }
      await verifyPaymentOtp(req.user.id, data.paymentOtp);
    }

    const address = await prisma.address.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        street: data.street,
        district: data.district,
        city: data.city,
        userId: req.user.id,
      },
    });

    const paymentStatus = data.paymentMethod === PaymentMethod.BANKING ? PaymentStatus.PAID : PaymentStatus.PENDING;
    const rewardCoins = Math.floor(finalTotal / 1000);

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderCode: createOrderCode(),
          subtotal,
          shippingFee,
          discountAmount,
          voucherCode: voucher?.code || null,
          totalAmount: finalTotal,
          paymentMethod: data.paymentMethod,
          paymentStatus,
          note: data.note,
          userId: req.user.id,
          addressId: address.id,
          items: { create: lineItems },
        },
        include: {
          items: { include: { product: true } },
          address: true,
          user: true,
        },
      });

      for (const { item, product } of resolvedItems) {
        await tx.product.update({
          where: { id: product.id },
          data: { stock: Math.max(product.stock - item.quantity, 0) },
        });
      }

      if (userVoucherId) {
        await tx.userVoucher.update({ where: { id: userVoucherId }, data: { redeemedAt: new Date() } });
      }

      if (rewardCoins > 0) {
        await tx.user.update({ where: { id: req.user.id }, data: { coinBalance: { increment: rewardCoins } } });
        await tx.coinTransaction.create({
          data: {
            userId: req.user.id,
            amount: rewardCoins,
            type: CoinTransactionType.ORDER_EARN,
            description: `Tích xu từ đơn hàng ${createdOrder.orderCode}`,
          },
        });
      }

      return createdOrder;
    });

    try {
      await sendBillMail({ to: req.user.email, fullName: req.user.fullName, order });
    } catch (_mailError) {
    }

    emitToUser(req.user.id, 'notification:new', {
      id: `server-order-${order.id}-${Date.now()}`,
      title: 'Đặt hàng thành công',
      message: `Đơn hàng #${order.orderCode} đã được tạo thành công.`,
      type: 'order',
      created_at: new Date().toISOString(),
      order_id: order.id,
      action_url: `/account/orders/${order.id}`,
    });
    emitToUser(req.user.id, 'order:updated', {
      orderId: order.id,
      status: order.status,
      updatedAt: order.updatedAt,
    });
    emitToAdmins('admin:order:new', {
      orderId: order.id,
      orderCode: order.orderCode,
      customerName: order.user.fullName,
      createdAt: order.createdAt,
    });

    res.status(201).json({ message: 'Đặt hàng thành công', order, rewardCoins });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể tạo đơn hàng' });
  }
}

export async function myOrders(req, res) {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } }, address: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
}

export async function adminOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        address: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không thể tải danh sách đơn hàng' });
  }
}

export async function adminOrderDetail(req, res) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: { include: { product: true } },
        address: true,
        user: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không thể tải chi tiết đơn hàng' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const data = updateStatusSchema.parse(req.body);
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    const paymentStatus = data.paymentStatus || order.paymentStatus || (data.status === OrderStatus.DELIVERED ? PaymentStatus.PAID : undefined);

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status: data.status,
        ...(paymentStatus ? { paymentStatus } : {}),
      },
      include: {
        items: { include: { product: true } },
        address: true,
        user: { select: { id: true, fullName: true, email: true } },
      },
    });

    emitToUser(updated.user.id, 'notification:new', {
      id: `server-status-${updated.id}-${Date.now()}`,
      title: 'Đơn hàng cập nhật trạng thái',
      message: `Đơn hàng #${updated.orderCode} đã chuyển sang ${String(updated.status).toLowerCase()}.`,
      type: 'order',
      created_at: new Date().toISOString(),
      order_id: updated.id,
      action_url: `/account/orders/${updated.id}`,
    });
    emitToUser(updated.user.id, 'order:updated', { orderId: updated.id, status: updated.status, updatedAt: updated.updatedAt });
    emitToAdmins('admin:order:updated', { orderId: updated.id, status: updated.status, updatedAt: updated.updatedAt });

    res.json({ message: 'Đã cập nhật trạng thái đơn hàng', order: updated });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể cập nhật trạng thái đơn hàng' });
  }
}


async function resolveAccessibleOrder(orderId, user) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { id: true, fullName: true, email: true } } },
  });
  if (!order) return null;
  if (user.role === Role.ADMIN || order.userId === user.id) return order;
  return null;
}

export async function getOrderChatMessages(req, res) {
  try {
    const order = await resolveAccessibleOrder(req.params.id, req.user);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng hoặc bạn không có quyền xem' });

    const messages = await prisma.orderChatMessage.findMany({
      where: { orderId: order.id },
      orderBy: { createdAt: 'asc' },
    });

    if (!messages.length) {
      const seed = await prisma.orderChatMessage.create({
        data: {
          orderId: order.id,
          userId: order.userId,
          senderRole: Role.ADMIN,
          senderName: 'Admin Shop',
          content: 'Shop đã nhận được đơn hàng của bạn. Nếu cần hỗ trợ, hãy nhắn trực tiếp tại đây.',
        },
      });
      return res.json([seed]);
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Không thể tải tin nhắn đơn hàng' });
  }
}

export async function createOrderChatMessage(req, res) {
  try {
    const schema = z.object({ content: z.string().trim().min(1) });
    const { content } = schema.parse(req.body);
    const order = await resolveAccessibleOrder(req.params.id, req.user);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng hoặc bạn không có quyền phản hồi' });

    const senderRole = req.user.role === Role.ADMIN ? Role.ADMIN : Role.USER;
    const message = await prisma.orderChatMessage.create({
      data: {
        orderId: order.id,
        userId: order.userId,
        senderRole,
        senderName: req.user.fullName || (senderRole === Role.ADMIN ? 'Admin Shop' : 'Khách hàng'),
        content,
      },
    });

    emitToUser(order.userId, 'chat:new', { orderId: order.id, message });
    emitToUser(order.userId, 'notification:new', {
      id: `server-chat-${order.id}-${Date.now()}`,
      title: senderRole === Role.ADMIN ? 'Admin vừa phản hồi đơn hàng' : 'Tin nhắn mới trong đơn hàng',
      message: senderRole === Role.ADMIN
        ? `Admin vừa phản hồi đơn hàng #${order.orderCode}.`
        : `Có tin nhắn mới từ khách trong đơn hàng #${order.orderCode}.`,
      type: 'order',
      created_at: new Date().toISOString(),
      order_id: order.id,
      action_url: `/account/orders/${order.id}`,
    });
    emitToAdmins('chat:new', { orderId: order.id, message, customerId: order.userId });

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể gửi tin nhắn' });
  }
}
