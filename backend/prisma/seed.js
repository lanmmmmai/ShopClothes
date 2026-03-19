import bcrypt from 'bcryptjs';
import pkg from '@prisma/client';
const { PrismaClient, Role } = pkg;

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'thoi-trang-nu' },
    update: {},
    create: {
      name: 'Thời trang nữ',
      slug: 'thoi-trang-nu',
      description: 'Danh mục mặc định',
    },
  });

  await prisma.rewardSetting.upsert({
    where: { id: 'default' },
    update: { spinCost: 50 },
    create: { id: 'default', spinCost: 50 },
  });

  const adminPassword = await bcrypt.hash('221005lan', 10);
  await prisma.user.upsert({
    where: { email: 'admin@shop.local' },
    update: { role: Role.ADMIN, isVerified: true, passwordHash: adminPassword, fullName: 'Quản trị viên' },
    create: {
      fullName: 'Quản trị viên',
      email: 'admin@shop.local',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      isVerified: true,
      coinBalance: 500,
    },
  });

  const products = [
    {
      name: 'Áo Sơ Mi Lụa Cao Cấp', slug: 'ao-so-mi-lua-cao-cap',
      description: 'Áo sơ mi lụa cao cấp, thiết kế thanh lịch phù hợp đi làm và dự tiệc. Chất liệu lụa mềm mại, thoáng mát.',
      price: 890000, salePrice: 690000, imageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800', stock: 45, categoryId: category.id,
    },
    {
      name: 'Đầm Dự Tiệc Sang Trọng', slug: 'dam-du-tiec-sang-trong',
      description: 'Đầm dạ hội thiết kế sang trọng, phù hợp cho các buổi tiệc tối và sự kiện đặc biệt.',
      price: 1890000, salePrice: null, imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', stock: 20, categoryId: category.id,
    },
    {
      name: 'Quần Âu Ống Suông', slug: 'quan-au-ong-suong',
      description: 'Quần âu ống suông thanh lịch, phù hợp đi làm văn phòng. Chất vải co giãn thoải mái.',
      price: 650000, salePrice: 520000, imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', stock: 60, categoryId: category.id,
    },
    {
      name: 'Áo Blazer Nữ Oversize', slug: 'ao-blazer-nu-oversize',
      description: 'Áo blazer oversize phong cách Hàn Quốc, chất liệu dày dặn phù hợp thời tiết se lạnh.',
      price: 1250000, salePrice: null, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', stock: 30, categoryId: category.id,
    },
    {
      name: 'Váy Midi Hoa Nhí', slug: 'vay-midi-hoa-nhi',
      description: 'Váy midi họa tiết hoa nhí nhẹ nhàng, nữ tính. Phù hợp đi chơi, dạo phố.',
      price: 750000, salePrice: null, imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', stock: 40, categoryId: category.id,
    },
    {
      name: 'Túi Xách Da Thời Trang', slug: 'tui-xach-da-thoi-trang',
      description: 'Túi xách da PU cao cấp, thiết kế tinh tế. Phù hợp đi làm và đi chơi.',
      price: 450000, salePrice: 350000, imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800', stock: 25, categoryId: category.id,
    },
    {
      name: 'Áo Thun Basic Cotton', slug: 'ao-thun-basic-cotton',
      description: 'Áo thun basic 100% cotton, form dáng thoải mái. Món đồ must-have cho mọi tủ đồ.',
      price: 290000, salePrice: null, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', stock: 100, categoryId: category.id,
    },
    {
      name: 'Đầm Maxi Đi Biển', slug: 'dam-maxi-di-bien',
      description: 'Đầm maxi bay bổng, in họa tiết tropical. Hoàn hảo cho kỳ nghỉ biển.',
      price: 680000, salePrice: null, imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800', stock: 35, categoryId: category.id,
    },
    {
      name: 'Chân Váy Xếp Ly Thanh Lịch', slug: 'chan-vay-xep-ly-thanh-lich',
      description: 'Chân váy xếp ly dáng dài, dễ phối áo sơ mi và blazer cho phong cách công sở.',
      price: 560000, salePrice: 460000, imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=800', stock: 55, categoryId: category.id,
    },
    {
      name: 'Áo Cardigan Len Mỏng', slug: 'ao-cardigan-len-mong',
      description: 'Cardigan len mỏng nhẹ, khoác ngoài đẹp cho văn phòng và tiết trời se lạnh.',
      price: 590000, salePrice: null, imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', stock: 48, categoryId: category.id,
    },
    {
      name: 'Quần Jeans Ống Đứng Basic', slug: 'quan-jeans-ong-dung-basic',
      description: 'Quần jeans ống đứng tôn dáng, dễ phối với áo thun, sơ mi và blazer.',
      price: 720000, salePrice: 620000, imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', stock: 68, categoryId: category.id,
    },
    {
      name: 'Set Áo Gile Và Quần Short', slug: 'set-ao-gile-va-quan-short',
      description: 'Set đồ trẻ trung, hiện đại, phù hợp đi chơi cuối tuần hoặc cà phê cùng bạn bè.',
      price: 890000, salePrice: null, imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', stock: 24, categoryId: category.id,
    },
    {
      name: 'Túi Đeo Vai Mini Sang Chảnh', slug: 'tui-deo-vai-mini-sang-chanh',
      description: 'Túi mini nhỏ gọn, điểm nhấn hoàn hảo cho outfit đi chơi hoặc dự tiệc.',
      price: 390000, salePrice: null, imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800', stock: 50, categoryId: category.id,
    },
    {
      name: 'Áo Khoác Denim Cropped', slug: 'ao-khoac-denim-cropped',
      description: 'Áo khoác denim dáng ngắn, cá tính, phối đẹp với váy liền hoặc quần jeans.',
      price: 980000, salePrice: 790000, imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800', stock: 32, categoryId: category.id,
    },
    {
      name: 'Đầm Ôm Body Tay Dài', slug: 'dam-om-body-tay-dai',
      description: 'Đầm ôm body tôn dáng, chất vải mềm, hợp đi tiệc tối hoặc hẹn hò.',
      price: 1180000, salePrice: 990000, imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800', stock: 18, categoryId: category.id,
    },
    {
      name: 'Áo Polo Dệt Gân Tối Giản', slug: 'ao-polo-det-gan-toi-gian',
      description: 'Áo polo nữ dệt gân, ôm nhẹ cơ thể, phù hợp phong cách tối giản và thanh lịch.',
      price: 430000, salePrice: null, imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', stock: 72, categoryId: category.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  const tasks = [
    { title: 'Đăng nhập mỗi ngày', description: 'Nhận xu khi quay lại website.', coinReward: 10 },
    { title: 'Cập nhật hồ sơ tài khoản', description: 'Hoàn thiện hồ sơ để nhận thưởng.', coinReward: 25 },
    { title: 'Mua đơn hàng đầu tiên', description: 'Hoàn tất đơn đầu tiên để nhận thưởng.', coinReward: 100 },
  ];

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: `${task.title}` },
      update: {},
      create: { id: `${task.title}`, ...task },
    }).catch(async () => {
      const existing = await prisma.task.findFirst({ where: { title: task.title } });
      if (!existing) await prisma.task.create({ data: task });
    });
  }

  const vouchers = [
    {
      code: 'WELCOME50K',
      title: 'Giảm 50K',
      description: 'Giảm trực tiếp 50.000đ cho đơn từ 499.000đ',
      discountType: 'fixed',
      discountValue: 50000,
      minOrderAmount: 499000,
      maxDiscount: null,
      coinCost: 120,
      quantity: 100,
      isSpinEnabled: true,
    },
    {
      code: 'FREESHIP',
      title: 'Miễn phí vận chuyển',
      description: 'Giảm 30.000đ phí ship',
      discountType: 'fixed',
      discountValue: 30000,
      minOrderAmount: 199000,
      maxDiscount: null,
      coinCost: 60,
      quantity: 150,
      isSpinEnabled: true,
    },
  ];

  for (const voucher of vouchers) {
    await prisma.voucher.upsert({ where: { code: voucher.code }, update: voucher, create: voucher });
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
