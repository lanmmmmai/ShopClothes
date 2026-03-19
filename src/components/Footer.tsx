import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-background mb-4">
              Shop<span className="text-primary">Clothes</span>
            </h3>
            <p className="text-sm leading-relaxed text-background/60">
              Thời trang nữ cao cấp, mang đến phong cách thanh lịch và hiện đại cho phụ nữ Việt.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Mua sắm</h4>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="text-sm hover:text-background transition-colors">Tất cả sản phẩm</Link>
              <Link to="/category/ao" className="text-sm hover:text-background transition-colors">Áo</Link>
              <Link to="/category/vay-dam" className="text-sm hover:text-background transition-colors">Váy & Đầm</Link>
              <Link to="/category/quan" className="text-sm hover:text-background transition-colors">Quần</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Hỗ trợ</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm hover:text-background transition-colors">Giới thiệu</Link>
              <span className="text-sm">Chính sách đổi trả</span>
              <span className="text-sm">Hướng dẫn chọn size</span>
              <span className="text-sm">Liên hệ</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Liên hệ</h4>
            <div className="flex flex-col gap-2 text-sm">
              <span>📍 123 Nguyễn Huệ, Quận 1, TP.HCM</span>
              <span>📞 0901 234 567</span>
              <span>✉️ hello@shopclothes.vn</span>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center text-sm text-background/40">
          © 2025 ShopClothes. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
