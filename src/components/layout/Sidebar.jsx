import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const menuItems = [
  {
    section: 'DISCOVER',
    items: [
      { path: '/', label: 'Trang Chủ', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/em1aj1nn_expires_30_days.png' },
    ],
  },
  {
    section: 'HÀNG TỒN KHO',
    items: [
      { path: '/products', label: 'Các Sản Phẩm', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/wjs1jmut_expires_30_days.png' },
      { path: '/report', label: 'Báo Cáo', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/i9o6c032_expires_30_days.png' },
      { path: '/schedule', label: 'Lịch Trình', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/0nqxvng8_expires_30_days.png' },
      { path: '/customers', label: 'Khách Hàng', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/ixhimylz_expires_30_days.png' },
      { path: '/settings', label: 'Cài Đặt', icon: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/bro57q2n_expires_30_days.png' },
    ],
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col shrink-0 w-72 items-start bg-black p-5 gap-5">
      <div className="flex items-center px-[26px] gap-2.5">
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/iqcqsl25_expires_30_days.png"
          className="w-8 h-8 object-fill"
          alt="Logo"
        />
        <span className="text-white text-xl font-bold">Clothes</span>
      </div>

      <div className="flex flex-col items-start gap-5">
        {menuItems.map((section, idx) => (
          <div key={idx} className="flex flex-col items-start">
            <div className="flex flex-col items-start py-[17px] px-1.5 w-full">
              <span className="text-white text-xs">{section.section}</span>
            </div>

            <div className="flex flex-col items-start">
              {section.items.map((item, itemIdx) => {
                const active = isActive(item.path);
                return (
                  <div
                    key={itemIdx}
                    className={`flex items-start py-2 px-1.5 mb-2.5 rounded-[10px] cursor-pointer transition-colors ${
                      active ? 'bg-gray-900' : 'hover:bg-gray-900'
                    }`}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(item.path)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        navigate(item.path);
                      }
                    }}
                  >
                    <img src={item.icon} className="w-6 h-6 rounded-[10px] object-fill" alt="" />
                    <span className="text-white text-base ml-2.5">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center pt-[260px]">
        <div className="flex shrink-0 items-center gap-2.5">
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/onz2rg6z_expires_30_days.png"
            className="w-10 h-10 object-fill"
            alt="User"
          />
          <div className="flex flex-col shrink-0 items-start gap-0.5">
            <span className="text-white text-[11px] font-bold">{user?.username || 'User'}</span>
            <span className="text-[#757575] text-xs">{user?.role || 'user'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
