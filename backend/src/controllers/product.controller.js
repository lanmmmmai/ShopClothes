import pkg from '@prisma/client';
const { Role } = pkg;
import { z } from 'zod';
import { prisma } from '../config/prisma.js';

const imageSchema = z.string().refine((value) => /^https?:\/\//i.test(value) || value.startsWith('/uploads/'), {
  message: 'Ảnh sản phẩm phải là URL hợp lệ hoặc đường dẫn ảnh đã upload lên server',
});

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number().positive(),
  salePrice: z.union([z.coerce.number().nonnegative(), z.null()]).optional(),
  imageUrl: imageSchema.optional().nullable(),
  stock: z.coerce.number().int().nonnegative(),
  categoryId: z.string().min(1),
});

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mapProduct(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    salePrice: product.salePrice,
    imageUrl: product.imageUrl,
    stock: product.stock,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    soldCount: product.orderItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    categoryId: product.categoryId,
    category: product.category,
  };
}

export async function listProducts(_req, res) {
  const products = await prisma.product.findMany({
    include: { category: true, orderItems: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(products.map(mapProduct));
}

export async function listCategories(_req, res) {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json(categories);
}

export async function getProduct(req, res) {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { category: true, orderItems: true },
  });
  if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  res.json(mapProduct(product));
}

export async function createProduct(req, res) {
  try {
    if (!req.user || req.user.role !== Role.ADMIN) {
      return res.status(403).json({ message: 'Bạn không có quyền thêm sản phẩm' });
    }

    const data = productSchema.parse(req.body);
    let slug = slugify(data.name);
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${slugify(data.name)}-${counter++}`;
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        salePrice: data.salePrice || null,
        imageUrl: data.imageUrl || null,
        slug,
      },
      include: { category: true, orderItems: true },
    });

    res.status(201).json(mapProduct(product));
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể thêm sản phẩm' });
  }
}

export async function updateProduct(req, res) {
  try {
    if (!req.user || req.user.role !== Role.ADMIN) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa sản phẩm' });
    }

    const data = productSchema.parse(req.body);
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    let slug = existing.slug;
    if (existing.name !== data.name) {
      const base = slugify(data.name);
      slug = base;
      let counter = 1;
      while (true) {
        const found = await prisma.product.findUnique({ where: { slug } });
        if (!found || found.id === existing.id) break;
        slug = `${base}-${counter++}`;
      }
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...data,
        salePrice: data.salePrice || null,
        imageUrl: data.imageUrl || null,
        slug,
      },
      include: { category: true, orderItems: true },
    });

    res.json(mapProduct(product));
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể cập nhật sản phẩm' });
  }
}

export async function deleteProduct(req, res) {
  try {
    if (!req.user || req.user.role !== Role.ADMIN) {
      return res.status(403).json({ message: 'Bạn không có quyền xoá sản phẩm' });
    }

    const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { orderItems: true } });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    if (product.orderItems.length > 0) {
      return res.status(400).json({ message: 'Sản phẩm đã có trong đơn hàng, không thể xoá' });
    }

    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Đã xoá sản phẩm' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Không thể xoá sản phẩm' });
  }
}
