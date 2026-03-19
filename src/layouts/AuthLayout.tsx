import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      <div className="hidden lg:block w-1/2 bg-muted relative overflow-hidden">
        <img
          src="/auth-fashion.jpg"
          alt="ShopClothes Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />

        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-3xl font-bold mb-2">
            Shop<span className="text-primary">Clothes</span>
          </h2>
          <p className="text-white/80 text-sm">
            Thời trang thanh lịch cho phụ nữ hiện đại
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;