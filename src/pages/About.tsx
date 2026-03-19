const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Về ShopClothes</h1>
      <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
        <p className="text-base leading-relaxed">
          ShopClothes là thương hiệu thời trang nữ cao cấp, được thành lập với sứ mệnh mang đến phong cách thanh lịch và tự tin cho phụ nữ Việt Nam hiện đại.
        </p>
        <p className="text-base leading-relaxed">
          Với cam kết về chất lượng sản phẩm và trải nghiệm khách hàng, chúng tôi không ngừng cải tiến từ khâu thiết kế đến sản xuất, đảm bảo mỗi sản phẩm đều mang dấu ấn riêng.
        </p>
        <div className="grid grid-cols-3 gap-6 py-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">5000+</p>
            <p className="text-sm">Khách hàng</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">200+</p>
            <p className="text-sm">Mẫu thiết kế</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">98%</p>
            <p className="text-sm">Hài lòng</p>
          </div>
        </div>
        <p className="text-base leading-relaxed">
          Đội ngũ thiết kế của chúng tôi luôn cập nhật xu hướng thời trang quốc tế, kết hợp hài hòa với nét đẹp truyền thống Việt Nam để tạo nên những bộ sưu tập độc đáo.
        </p>
      </div>
    </div>
  );
};

export default About;
