import type { Product, Category, User, Order, Voucher, Notification, Review, Address } from '@/types';

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Áo', slug: 'ao', description: 'Các loại áo thời trang', image_url: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop' },
  { id: 'cat-2', name: 'Váy & Đầm', slug: 'vay-dam', description: 'Váy và đầm nữ', image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop' },
  { id: 'cat-3', name: 'Quần', slug: 'quan', description: 'Quần thời trang', image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop' },
  { id: 'cat-4', name: 'Phụ kiện', slug: 'phu-kien', description: 'Phụ kiện thời trang', image_url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=500&fit=crop' },
  { id: 'cat-5', name: 'Áo khoác', slug: 'ao-khoac', description: 'Áo khoác các loại', image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop' },
];

const sampleReviews: Review[] = [
  { id: 'rev-1', product_id: 'p-1', user_id: 'u-2', user_name: 'Nguyễn Thị Mai', rating: 5, comment: 'Chất vải rất đẹp, form áo chuẩn. Mình rất thích!', created_at: '2025-12-01' },
  { id: 'rev-2', product_id: 'p-1', user_id: 'u-3', user_name: 'Trần Hương', rating: 4, comment: 'Áo đẹp, giao hàng nhanh. Sẽ mua lại.', created_at: '2025-11-28' },
  { id: 'rev-3', product_id: 'p-2', user_id: 'u-2', user_name: 'Nguyễn Thị Mai', rating: 5, comment: 'Đầm rất sang trọng, phù hợp đi tiệc.', created_at: '2025-12-05' },
];

export const mockProducts: Product[] = [
  {
    id: 'p-1', name: 'Áo Sơ Mi Lụa Cao Cấp', slug: 'ao-so-mi-lua-cao-cap',
    description: 'Áo sơ mi lụa cao cấp, thiết kế thanh lịch phù hợp đi làm và dự tiệc. Chất liệu lụa mềm mại, thoáng mát.',
    price: 890000, sale_price: 690000, category_id: 'cat-1', stock_quantity: 45,
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
    ],
    colors: ['Trắng', 'Hồng', 'Đen'], color_hexes: ['#FFFFFF', '#F4A6C0', '#000000'],
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'v-1', product_id: 'p-1', color: 'Trắng', color_hex: '#FFFFFF', size: 'S', stock: 10, sku: 'SMLLC-W-S' },
      { id: 'v-2', product_id: 'p-1', color: 'Trắng', color_hex: '#FFFFFF', size: 'M', stock: 15, sku: 'SMLLC-W-M' },
      { id: 'v-3', product_id: 'p-1', color: 'Hồng', color_hex: '#F4A6C0', size: 'M', stock: 8, sku: 'SMLLC-P-M' },
    ],
    detail_fields: { 'Chất liệu': 'Lụa 100%', 'Xuất xứ': 'Việt Nam', 'Kiểu dáng': 'Regular fit', 'Bảo quản': 'Giặt tay, không vắt' },
    reviews: sampleReviews.filter(r => r.product_id === 'p-1'), rating: 4.5, review_count: 2, sold_count: 128, is_active: true, created_at: '2025-09-01',
  },
  {
    id: 'p-2', name: 'Đầm Dự Tiệc Sang Trọng', slug: 'dam-du-tiec-sang-trong',
    description: 'Đầm dạ hội thiết kế sang trọng, phù hợp cho các buổi tiệc tối và sự kiện đặc biệt.',
    price: 1890000, category_id: 'cat-2', stock_quantity: 20,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop',
    ],
    colors: ['Đỏ', 'Đen'], color_hexes: ['#C41E3A', '#000000'],
    sizes: ['S', 'M', 'L'],
    variants: [
      { id: 'v-4', product_id: 'p-2', color: 'Đỏ', color_hex: '#C41E3A', size: 'S', stock: 5, sku: 'DDTST-R-S' },
      { id: 'v-5', product_id: 'p-2', color: 'Đen', color_hex: '#000000', size: 'M', stock: 7, sku: 'DDTST-B-M' },
    ],
    detail_fields: { 'Chất liệu': 'Voan cao cấp', 'Xuất xứ': 'Việt Nam', 'Kiểu dáng': 'A-line', 'Dịp mặc': 'Tiệc tối, sự kiện' },
    reviews: sampleReviews.filter(r => r.product_id === 'p-2'), rating: 5, review_count: 1, sold_count: 67, is_active: true, created_at: '2025-10-15',
  },
  {
    id: 'p-3', name: 'Quần Âu Ống Suông', slug: 'quan-au-ong-suong',
    description: 'Quần âu ống suông thanh lịch, phù hợp đi làm văn phòng. Chất vải co giãn thoải mái.',
    price: 650000, sale_price: 520000, category_id: 'cat-3', stock_quantity: 60,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop',
    ],
    colors: ['Đen', 'Be'], color_hexes: ['#000000', '#D2B48C'],
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'v-6', product_id: 'p-3', color: 'Đen', color_hex: '#000000', size: 'M', stock: 20, sku: 'QAOS-B-M' },
      { id: 'v-7', product_id: 'p-3', color: 'Be', color_hex: '#D2B48C', size: 'L', stock: 15, sku: 'QAOS-BE-L' },
    ],
    detail_fields: { 'Chất liệu': 'Polyester pha spandex', 'Xuất xứ': 'Việt Nam', 'Kiểu dáng': 'Ống suông' },
    reviews: [], rating: 4.2, review_count: 15, sold_count: 234, is_active: true, created_at: '2025-08-20',
  },
  {
    id: 'p-4', name: 'Áo Blazer Nữ Oversize', slug: 'ao-blazer-nu-oversize',
    description: 'Áo blazer oversize phong cách Hàn Quốc, chất liệu dày dặn phù hợp thời tiết se lạnh.',
    price: 1250000, category_id: 'cat-5', stock_quantity: 30,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
    ],
    colors: ['Đen', 'Xám', 'Kem'], color_hexes: ['#000000', '#808080', '#FFF8DC'],
    sizes: ['S', 'M', 'L'],
    variants: [
      { id: 'v-8', product_id: 'p-4', color: 'Đen', color_hex: '#000000', size: 'M', stock: 12, sku: 'ABNO-B-M' },
    ],
    detail_fields: { 'Chất liệu': 'Dạ pha', 'Xuất xứ': 'Việt Nam', 'Kiểu dáng': 'Oversize' },
    reviews: [], rating: 4.8, review_count: 32, sold_count: 89, is_active: true, created_at: '2025-11-01',
  },
  {
    id: 'p-5', name: 'Váy Midi Hoa Nhí', slug: 'vay-midi-hoa-nhi',
    description: 'Váy midi họa tiết hoa nhí nhẹ nhàng, nữ tính. Phù hợp đi chơi, dạo phố.',
    price: 750000, category_id: 'cat-2', stock_quantity: 40,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop',
    ],
    colors: ['Hồng', 'Xanh'], color_hexes: ['#FFB6C1', '#87CEEB'],
    sizes: ['S', 'M', 'L'],
    variants: [
      { id: 'v-9', product_id: 'p-5', color: 'Hồng', color_hex: '#FFB6C1', size: 'S', stock: 10, sku: 'VMHN-P-S' },
      { id: 'v-10', product_id: 'p-5', color: 'Xanh', color_hex: '#87CEEB', size: 'M', stock: 12, sku: 'VMHN-B-M' },
    ],
    detail_fields: { 'Chất liệu': 'Vải hoa', 'Xuất xứ': 'Việt Nam', 'Kiểu dáng': 'A-line midi' },
    reviews: [], rating: 4.6, review_count: 22, sold_count: 156, is_active: true, created_at: '2025-10-20',
  },
  {
    id: 'p-6', name: 'Túi Xách Da Thời Trang', slug: 'tui-xach-da-thoi-trang',
    description: 'Túi xách da PU cao cấp, thiết kế tinh tế. Phù hợp đi làm và đi chơi.',
    price: 450000, sale_price: 350000, category_id: 'cat-4', stock_quantity: 25,
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop',
    ],
    colors: ['Đen', 'Nâu'], color_hexes: ['#000000', '#8B4513'],
    sizes: ['One Size'],
    variants: [
      { id: 'v-11', product_id: 'p-6', color: 'Đen', color_hex: '#000000', size: 'One Size', stock: 15, sku: 'TXDTT-B-OS' },
    ],
    detail_fields: { 'Chất liệu': 'Da PU cao cấp', 'Xuất xứ': 'Việt Nam', 'Kích thước': '30x25x12cm' },
    reviews: [], rating: 4.3, review_count: 8, sold_count: 45, is_active: true, created_at: '2025-11-10',
  },
  {
    id: 'p-7', name: 'Áo Thun Basic Cotton', slug: 'ao-thun-basic-cotton',
    description: 'Áo thun basic 100% cotton, form dáng thoải mái. Món đồ must-have cho mọi tủ đồ.',
    price: 290000, category_id: 'cat-1', stock_quantity: 100,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop',
    ],
    colors: ['Trắng', 'Đen', 'Xám'], color_hexes: ['#FFFFFF', '#000000', '#808080'],
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'v-12', product_id: 'p-7', color: 'Trắng', color_hex: '#FFFFFF', size: 'M', stock: 30, sku: 'ATBC-W-M' },
    ],
    detail_fields: { 'Chất liệu': 'Cotton 100%', 'Xuất xứ': 'Việt Nam', 'Kiểu dáng': 'Regular' },
    reviews: [], rating: 4.7, review_count: 56, sold_count: 420, is_active: true, created_at: '2025-07-01',
  },
  {
    id: 'p-8', name: 'Đầm Maxi Đi Biển', slug: 'dam-maxi-di-bien',
    description: 'Đầm maxi bay bổng, in họa tiết tropical. Hoàn hảo cho kỳ nghỉ biển.',
    price: 680000, category_id: 'cat-2', stock_quantity: 35,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop',
    ],
    colors: ['Xanh biển', 'Cam'], color_hexes: ['#0077B6', '#FF8C00'],
    sizes: ['S', 'M', 'L'],
    variants: [
      { id: 'v-13', product_id: 'p-8', color: 'Xanh biển', color_hex: '#0077B6', size: 'M', stock: 12, sku: 'DMDB-BL-M' },
    ],
    detail_fields: { 'Chất liệu': 'Voan lụa', 'Xuất xứ': 'Việt Nam', 'Dịp mặc': 'Đi biển, du lịch' },
    reviews: [], rating: 4.4, review_count: 18, sold_count: 98, is_active: true, created_at: '2025-09-15',
  },

  {
    id: 'p-9', name: 'Chân Váy Xếp Ly Thanh Lịch', slug: 'chan-vay-xep-ly-thanh-lich',
    description: 'Chân váy xếp ly dáng dài, dễ phối áo sơ mi và blazer cho phong cách công sở.',
    price: 560000, sale_price: 460000, category_id: 'cat-2', stock_quantity: 55,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop',
    ],
    colors: ['Kem', 'Đen'], color_hexes: ['#FFF8DC', '#000000'],
    sizes: ['S', 'M', 'L'],
    variants: [
      { id: 'v-14', product_id: 'p-9', color: 'Kem', color_hex: '#FFF8DC', size: 'M', stock: 20, sku: 'CVXL-K-M' },
      { id: 'v-15', product_id: 'p-9', color: 'Đen', color_hex: '#000000', size: 'L', stock: 14, sku: 'CVXL-B-L' },
    ],
    detail_fields: { 'Chất liệu': 'Tuytsi mềm', 'Xuất xứ': 'Việt Nam', 'Kiểu dáng': 'Xếp ly dài' },
    reviews: [], rating: 4.6, review_count: 19, sold_count: 142, is_active: true, created_at: '2025-11-15',
  },
  {
    id: 'p-10', name: 'Áo Cardigan Len Mỏng', slug: 'ao-cardigan-len-mong',
    description: 'Cardigan len mỏng nhẹ, khoác ngoài đẹp cho văn phòng và tiết trời se lạnh.',
    price: 590000, category_id: 'cat-5', stock_quantity: 48,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop',
    ],
    colors: ['Be', 'Xám', 'Hồng'], color_hexes: ['#D2B48C', '#808080', '#F4A6C0'],
    sizes: ['S', 'M', 'L'],
    variants: [
      { id: 'v-16', product_id: 'p-10', color: 'Be', color_hex: '#D2B48C', size: 'M', stock: 15, sku: 'ACLM-BE-M' },
    ],
    detail_fields: { 'Chất liệu': 'Len cotton', 'Xuất xứ': 'Việt Nam', 'Kiểu dáng': 'Cardigan basic' },
    reviews: [], rating: 4.5, review_count: 17, sold_count: 96, is_active: true, created_at: '2025-12-01',
  },
  {
    id: 'p-11', name: 'Quần Jeans Ống Đứng Basic', slug: 'quan-jeans-ong-dung-basic',
    description: 'Quần jeans ống đứng tôn dáng, dễ phối với áo thun, sơ mi và blazer.',
    price: 720000, sale_price: 620000, category_id: 'cat-3', stock_quantity: 68,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    ],
    colors: ['Xanh', 'Đen'], color_hexes: ['#4169E1', '#000000'],
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      { id: 'v-17', product_id: 'p-11', color: 'Xanh', color_hex: '#4169E1', size: 'M', stock: 22, sku: 'QJOD-X-M' },
    ],
    detail_fields: { 'Chất liệu': 'Denim co giãn', 'Xuất xứ': 'Việt Nam', 'Kiểu dáng': 'Ống đứng' },
    reviews: [], rating: 4.7, review_count: 31, sold_count: 210, is_active: true, created_at: '2025-11-22',
  },
  {
    id: 'p-12', name: 'Set Áo Gile Và Quần Short', slug: 'set-ao-gile-va-quan-short',
    description: 'Set đồ trẻ trung, hiện đại, phù hợp đi chơi cuối tuần hoặc cà phê cùng bạn bè.',
    price: 890000, category_id: 'cat-1', stock_quantity: 24,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop',
    ],
    colors: ['Kem', 'Nâu'], color_hexes: ['#FFF8DC', '#8B4513'],
    sizes: ['S', 'M', 'L'],
    variants: [
      { id: 'v-18', product_id: 'p-12', color: 'Kem', color_hex: '#FFF8DC', size: 'S', stock: 8, sku: 'SAGQS-K-S' },
    ],
    detail_fields: { 'Chất liệu': 'Tuytsi', 'Xuất xứ': 'Việt Nam', 'Kiểu dáng': 'Set smart casual' },
    reviews: [], rating: 4.4, review_count: 12, sold_count: 77, is_active: true, created_at: '2025-12-08',
  },
  {
    id: 'p-13', name: 'Túi Đeo Vai Mini Sang Chảnh', slug: 'tui-deo-vai-mini-sang-chanh',
    description: 'Túi mini nhỏ gọn, điểm nhấn hoàn hảo cho outfit đi chơi hoặc dự tiệc.',
    price: 390000, category_id: 'cat-4', stock_quantity: 50,
    images: [
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop',
    ],
    colors: ['Đen', 'Hồng'], color_hexes: ['#000000', '#F4A6C0'],
    sizes: ['One Size'],
    variants: [
      { id: 'v-19', product_id: 'p-13', color: 'Đen', color_hex: '#000000', size: 'One Size', stock: 20, sku: 'TDVM-OS-B' },
    ],
    detail_fields: { 'Chất liệu': 'Da PU', 'Xuất xứ': 'Việt Nam', 'Kích thước': '22x14x7cm' },
    reviews: [], rating: 4.3, review_count: 14, sold_count: 89, is_active: true, created_at: '2025-11-28',
  },
  {
    id: 'p-14', name: 'Áo Khoác Denim Cropped', slug: 'ao-khoac-denim-cropped',
    description: 'Áo khoác denim dáng ngắn, cá tính, phối đẹp với váy liền hoặc quần jeans.',
    price: 980000, sale_price: 790000, category_id: 'cat-5', stock_quantity: 32,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop',
    ],
    colors: ['Xanh', 'Đen'], color_hexes: ['#4169E1', '#000000'],
    sizes: ['S', 'M', 'L'],
    variants: [
      { id: 'v-20', product_id: 'p-14', color: 'Xanh', color_hex: '#4169E1', size: 'M', stock: 10, sku: 'AKDC-X-M' },
    ],
    detail_fields: { 'Chất liệu': 'Denim', 'Xuất xứ': 'Việt Nam', 'Kiểu dáng': 'Cropped jacket' },
    reviews: [], rating: 4.6, review_count: 24, sold_count: 133, is_active: true, created_at: '2025-12-12',
  },
  {
    id: 'p-15', name: 'Đầm Ôm Body Tay Dài', slug: 'dam-om-body-tay-dai',
    description: 'Đầm ôm body tôn dáng, chất vải mềm, hợp đi tiệc tối hoặc hẹn hò.',
    price: 1180000, sale_price: 990000, category_id: 'cat-2', stock_quantity: 18,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
    ],
    colors: ['Đen', 'Đỏ'], color_hexes: ['#000000', '#C41E3A'],
    sizes: ['S', 'M', 'L'],
    variants: [
      { id: 'v-21', product_id: 'p-15', color: 'Đen', color_hex: '#000000', size: 'M', stock: 6, sku: 'DOBTD-B-M' },
    ],
    detail_fields: { 'Chất liệu': 'Thun gân cao cấp', 'Xuất xứ': 'Việt Nam', 'Dịp mặc': 'Tiệc tối, hẹn hò' },
    reviews: [], rating: 4.8, review_count: 28, sold_count: 121, is_active: true, created_at: '2025-12-14',
  },
  {
    id: 'p-16', name: 'Áo Polo Dệt Gân Tối Giản', slug: 'ao-polo-det-gan-toi-gian',
    description: 'Áo polo nữ dệt gân, ôm nhẹ cơ thể, phù hợp phong cách tối giản và thanh lịch.',
    price: 430000, category_id: 'cat-1', stock_quantity: 72,
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop',
    ],
    colors: ['Trắng', 'Đen', 'Be'], color_hexes: ['#FFFFFF', '#000000', '#D2B48C'],
    sizes: ['S', 'M', 'L'],
    variants: [
      { id: 'v-22', product_id: 'p-16', color: 'Trắng', color_hex: '#FFFFFF', size: 'M', stock: 18, sku: 'APDG-W-M' },
    ],
    detail_fields: { 'Chất liệu': 'Cotton dệt gân', 'Xuất xứ': 'Việt Nam', 'Kiểu dáng': 'Slim fit' },
    reviews: [], rating: 4.5, review_count: 20, sold_count: 174, is_active: true, created_at: '2025-12-03',
  },
];

export const mockUser: User = {
  id: 'u-1', email: 'admin@shopclothes.vn', full_name: 'Nguyễn Văn Admin',
  phone: '0901234567', role: 'admin', loyalty_points: 2500, created_at: '2025-01-01',
};

export const mockAddresses: Address[] = [
  {
    id: 'addr-1', user_id: 'u-1', full_name: 'Nguyễn Văn Admin', phone: '0901234567',
    street: '123 Nguyễn Huệ', ward: 'Phường Bến Nghé', district: 'Quận 1', city: 'TP. Hồ Chí Minh', is_default: true,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ord-1', user_id: 'u-1', status: 'delivered', total_amount: 1380000,
    payment_method: 'COD', shipping_address: mockAddresses[0], loyalty_points_used: 0,
    items: [
      { id: 'oi-1', order_id: 'ord-1', product: mockProducts[0], variant: mockProducts[0].variants[0], quantity: 2, price: 690000 },
    ],
    created_at: '2025-11-20', updated_at: '2025-11-25',
  },
  {
    id: 'ord-2', user_id: 'u-1', status: 'shipping', total_amount: 1890000,
    payment_method: 'VNPAY', shipping_address: mockAddresses[0], loyalty_points_used: 100,
    items: [
      { id: 'oi-2', order_id: 'ord-2', product: mockProducts[1], variant: mockProducts[1].variants[0], quantity: 1, price: 1890000 },
    ],
    created_at: '2025-12-01', updated_at: '2025-12-02',
  },
  {
    id: 'ord-3', user_id: 'u-1', status: 'pending', total_amount: 520000,
    payment_method: 'COD', shipping_address: mockAddresses[0], loyalty_points_used: 0,
    items: [
      { id: 'oi-3', order_id: 'ord-3', product: mockProducts[2], variant: mockProducts[2].variants[0], quantity: 1, price: 520000 },
    ],
    created_at: '2025-12-10', updated_at: '2025-12-10',
  },
];

export const mockVouchers: Voucher[] = [
  {
    id: 'vc-1', code: 'WELCOME10', description: 'Giảm 10% cho đơn hàng đầu tiên',
    discount_type: 'percent', discount_value: 10, min_order_amount: 500000, max_discount: 100000,
    usage_limit: 1000, used_count: 234, start_date: '2025-01-01', end_date: '2026-12-31', is_active: true,
  },
  {
    id: 'vc-2', code: 'SALE50K', description: 'Giảm 50.000₫ cho đơn từ 300.000₫',
    discount_type: 'fixed', discount_value: 50000, min_order_amount: 300000,
    usage_limit: 500, used_count: 120, start_date: '2025-11-01', end_date: '2026-03-31', is_active: true,
  },
];

export const mockNotifications: Notification[] = [
  { id: 'n-1', user_id: 'u-1', title: 'Đơn hàng đã giao', message: 'Đơn hàng #ord-1 của bạn đã được giao thành công.', type: 'order', is_read: true, created_at: '2025-11-25' },
  { id: 'n-2', user_id: 'u-1', title: 'Khuyến mãi mới', message: 'Giảm giá 20% toàn bộ áo khoác. Áp dụng đến hết tháng 12.', type: 'promotion', is_read: false, created_at: '2025-12-01' },
  { id: 'n-3', user_id: 'u-1', title: 'Đang giao hàng', message: 'Đơn hàng #ord-2 đang được vận chuyển đến bạn.', type: 'order', is_read: false, created_at: '2025-12-02' },
];

export const mockUsers: User[] = [
  mockUser,
  { id: 'u-2', email: 'mai@gmail.com', full_name: 'Nguyễn Thị Mai', phone: '0912345678', role: 'user', loyalty_points: 800, created_at: '2025-03-15' },
  { id: 'u-3', email: 'huong@gmail.com', full_name: 'Trần Hương', phone: '0923456789', role: 'user', loyalty_points: 1200, created_at: '2025-05-20' },
  { id: 'u-4', email: 'staff@shopclothes.vn', full_name: 'Lê Văn Staff', phone: '0934567890', role: 'staff', loyalty_points: 0, created_at: '2025-02-01' },
];
