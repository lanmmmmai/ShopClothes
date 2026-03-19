import { z } from 'zod';
import { prisma } from '../config/prisma.js';

const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  coinReward: z.number().int().min(1),
  isActive: z.boolean().optional(),
});

const voucherSchema = z.object({
  code: z.string().min(3),
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  discountType: z.enum(['fixed', 'percent']),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscount: z.number().positive().optional().nullable(),
  startsAt: z.string().datetime().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  coinCost: z.number().int().min(0),
  quantity: z.number().int().min(1),
  isActive: z.boolean().optional(),
  isSpinEnabled: z.boolean().optional(),
});

function normalizeVoucherData(data) {
  return {
    ...data,
    code: data.code?.toUpperCase(),
    startsAt: data.startsAt ? new Date(data.startsAt) : null,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
  };
}

export async function getAdminRewards(req, res) {
  const [tasks, vouchers, settings] = await Promise.all([
    prisma.task.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.voucher.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.rewardSetting.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default', spinCost: 50 } }),
  ]);
  res.json({ tasks, vouchers, settings });
}

export async function createTask(req, res) {
  try {
    const data = taskSchema.parse(req.body);
    const task = await prisma.task.create({ data: { ...data, isActive: data.isActive ?? true } });
    res.status(201).json({ message: 'Tạo nhiệm vụ thành công', task });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể tạo nhiệm vụ' });
  }
}

export async function updateTask(req, res) {
  try {
    const data = taskSchema.partial().parse(req.body);
    const task = await prisma.task.update({ where: { id: req.params.id }, data });
    res.json({ message: 'Cập nhật nhiệm vụ thành công', task });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể cập nhật nhiệm vụ' });
  }
}

export async function createVoucher(req, res) {
  try {
    const data = normalizeVoucherData(voucherSchema.parse(req.body));
    const voucher = await prisma.voucher.create({
      data: { ...data, isActive: data.isActive ?? true, isSpinEnabled: data.isSpinEnabled ?? false },
    });
    res.status(201).json({ message: 'Tạo voucher thành công', voucher });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể tạo voucher' });
  }
}

export async function updateVoucher(req, res) {
  try {
    const data = normalizeVoucherData(voucherSchema.partial().parse(req.body));
    const voucher = await prisma.voucher.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ message: 'Cập nhật voucher thành công', voucher });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể cập nhật voucher' });
  }
}

export async function updateSettings(req, res) {
  try {
    const schema = z.object({ spinCost: z.number().int().min(0) });
    const data = schema.parse(req.body);
    const settings = await prisma.rewardSetting.upsert({ where: { id: 'default' }, update: data, create: { id: 'default', ...data } });
    res.json({ message: 'Cập nhật cấu hình thành công', settings });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể cập nhật cấu hình' });
  }
}
