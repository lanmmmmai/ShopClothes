import pkg from '@prisma/client';
const { CoinTransactionType, VoucherSource } = pkg;
import { z } from 'zod';
import { prisma } from '../config/prisma.js';

const voucherSelect = {
  id: true,
  code: true,
  title: true,
  description: true,
  discountType: true,
  discountValue: true,
  minOrderAmount: true,
  maxDiscount: true,
  startsAt: true,
  expiresAt: true,
  coinCost: true,
  quantity: true,
  usedCount: true,
  isActive: true,
  isSpinEnabled: true,
};


async function hasUserOwnedVoucher(userId, voucherId) {
  const existing = await prisma.userVoucher.findFirst({
    where: { userId, voucherId },
    select: { id: true },
  });
  return Boolean(existing);
}

function isVoucherCurrentlyValid(voucher, now = new Date()) {
  if (!voucher || !voucher.isActive) return false;
  if (voucher.quantity <= voucher.usedCount) return false;
  if (voucher.startsAt && new Date(voucher.startsAt) > now) return false;
  if (voucher.expiresAt && new Date(voucher.expiresAt) < now) return false;
  return true;
}

export async function rewardDashboard(req, res) {
  const [user, settings, tasks, claims, storeVouchers, myVouchers, transactions] = await Promise.all([
    prisma.user.findUnique({ where: { id: req.user.id }, select: { coinBalance: true } }),
    prisma.rewardSetting.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default', spinCost: 50 } }),
    prisma.task.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
    prisma.taskClaim.findMany({ where: { userId: req.user.id }, select: { taskId: true } }),
    prisma.voucher.findMany({ where: { isActive: true }, select: voucherSelect, orderBy: { createdAt: 'desc' } }),
    prisma.userVoucher.findMany({
      where: { userId: req.user.id },
      include: { voucher: { select: voucherSelect } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.coinTransaction.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' }, take: 20 }),
  ]);

  const now = new Date();
  const claimedTaskIds = new Set(claims.map((item) => item.taskId));
  const ownedVoucherIds = new Set(myVouchers.map((item) => item.voucherId));
  const validStoreVouchers = storeVouchers
    .filter((voucher) => isVoucherCurrentlyValid(voucher, now))
    .map((voucher) => ({ ...voucher, ownedAlready: ownedVoucherIds.has(voucher.id) }));
  const validMyVouchers = myVouchers.map((item) => ({
    ...item,
    isValid: !item.redeemedAt && isVoucherCurrentlyValid(item.voucher, now),
  }));

  res.json({
    coinBalance: user?.coinBalance || 0,
    spinCost: settings.spinCost,
    tasks: tasks.map((task) => ({ ...task, claimed: claimedTaskIds.has(task.id) })),
    storeVouchers: validStoreVouchers,
    myVouchers: validMyVouchers,
    spinVouchers: validStoreVouchers.filter((voucher) => voucher.isSpinEnabled),
    transactions,
  });
}

export async function claimTask(req, res) {
  try {
    const schema = z.object({ taskId: z.string() });
    const { taskId } = schema.parse(req.params);

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || !task.isActive) return res.status(404).json({ message: 'Nhiệm vụ không tồn tại' });

    const existing = await prisma.taskClaim.findUnique({ where: { userId_taskId: { userId: req.user.id, taskId } } });
    if (existing) return res.status(409).json({ message: 'Bạn đã nhận thưởng nhiệm vụ này rồi' });

    const result = await prisma.$transaction(async (tx) => {
      await tx.taskClaim.create({ data: { userId: req.user.id, taskId, rewardCoins: task.coinReward } });
      const user = await tx.user.update({
        where: { id: req.user.id },
        data: { coinBalance: { increment: task.coinReward } },
        select: { coinBalance: true },
      });
      await tx.coinTransaction.create({
        data: {
          userId: req.user.id,
          amount: task.coinReward,
          type: CoinTransactionType.TASK_EARN,
          description: `Nhận thưởng nhiệm vụ: ${task.title}`,
        },
      });
      return user;
    });

    res.json({ message: 'Nhận xu thành công', coinBalance: result.coinBalance });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể nhận nhiệm vụ' });
  }
}

export async function redeemVoucher(req, res) {
  try {
    const schema = z.object({ voucherId: z.string() });
    const { voucherId } = schema.parse(req.params);
    const voucher = await prisma.voucher.findUnique({ where: { id: voucherId } });
    if (!voucher || !isVoucherCurrentlyValid(voucher)) return res.status(404).json({ message: 'Voucher không hợp lệ hoặc đã hết hạn' });

    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { coinBalance: true } });
    const alreadyOwned = await hasUserOwnedVoucher(req.user.id, voucher.id);
    if (alreadyOwned) return res.status(409).json({ message: 'Voucher này chỉ nhận 1 lần trên mỗi tài khoản' });
    if ((user?.coinBalance || 0) < voucher.coinCost) return res.status(400).json({ message: 'Bạn không đủ xu để đổi voucher này' });

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: req.user.id },
        data: { coinBalance: { decrement: voucher.coinCost } },
        select: { coinBalance: true },
      });
      const userVoucher = await tx.userVoucher.create({
        data: { userId: req.user.id, voucherId: voucher.id, source: VoucherSource.REDEEM },
        include: { voucher: { select: voucherSelect } },
      });
      await tx.voucher.update({ where: { id: voucher.id }, data: { usedCount: { increment: 1 } } });
      await tx.coinTransaction.create({
        data: {
          userId: req.user.id,
          amount: -voucher.coinCost,
          type: CoinTransactionType.VOUCHER_REDEEM,
          description: `Đổi voucher ${voucher.code}`,
        },
      });
      return { updatedUser, userVoucher };
    });

    res.json({ message: 'Đổi voucher thành công', coinBalance: result.updatedUser.coinBalance, voucher: result.userVoucher });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể đổi voucher' });
  }
}

export async function spinVoucher(req, res) {
  const settings = await prisma.rewardSetting.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default', spinCost: 50 } });
  const candidates = await prisma.voucher.findMany({ where: { isActive: true, isSpinEnabled: true }, select: voucherSelect });
  const ownedVouchers = await prisma.userVoucher.findMany({ where: { userId: req.user.id }, select: { voucherId: true } });
  const ownedIds = new Set(ownedVouchers.map((item) => item.voucherId));
  const available = candidates.filter((item) => isVoucherCurrentlyValid(item) && !ownedIds.has(item.id));
  if (available.length === 0) return res.status(400).json({ message: 'Chưa có voucher nào cho vòng quay' });

  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { coinBalance: true } });
  if ((user?.coinBalance || 0) < settings.spinCost) {
    return res.status(400).json({ message: 'Bạn không đủ xu để quay vòng quay' });
  }

  const wheelItems = [...available, { id: 'lose', code: 'LOSE', title: 'Chúc bạn may mắn lần sau', description: 'Không nhận được voucher ở lượt này.' }];
  const winner = wheelItems[Math.floor(Math.random() * wheelItems.length)];

  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: req.user.id },
      data: { coinBalance: { decrement: settings.spinCost } },
      select: { coinBalance: true },
    });
    await tx.coinTransaction.create({
      data: { userId: req.user.id, amount: -settings.spinCost, type: CoinTransactionType.SPIN_COST, description: 'Trừ xu quay voucher' },
    });

    if (winner.id === 'lose') {
      return { updatedUser, prize: null };
    }

    const prize = await tx.userVoucher.create({
      data: { userId: req.user.id, voucherId: winner.id, source: VoucherSource.SPIN },
      include: { voucher: { select: voucherSelect } },
    });
    await tx.voucher.update({ where: { id: winner.id }, data: { usedCount: { increment: 1 } } });
    await tx.coinTransaction.create({
      data: { userId: req.user.id, amount: 0, type: CoinTransactionType.SPIN_REWARD, description: `Nhận thưởng vòng quay: ${winner.code}` },
    });
    return { updatedUser, prize };
  });

  res.json({
    message: result.prize ? 'Quay thưởng thành công' : 'Chúc bạn may mắn lần sau',
    coinBalance: result.updatedUser.coinBalance,
    prize: result.prize,
    outcomeCode: result.prize?.voucher.code || 'LOSE',
    spinCost: settings.spinCost,
  });
}
