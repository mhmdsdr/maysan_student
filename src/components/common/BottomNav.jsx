import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Printer, GraduationCap, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function BottomNav({ activeTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const tabs = [
    { id: 'home',       label: 'الرئيسية',   icon: Home,          path: '/' },
    { id: 'materials',  label: 'الطباعة',     icon: Printer,       path: '/materials' },
    { id: 'graduation', label: 'التخرج',      icon: GraduationCap, path: '/graduation' },
    { id: 'cart',       label: 'السلة',       icon: ShoppingBag,   path: '/cart', badge: itemCount },
    { id: 'profile',    label: 'حسابي',       icon: User,          path: '/profile' },
  ];

  const currentTab = activeTab || (() => {
    const p = location.pathname;
    if (p.startsWith('/materials')) return 'materials';
    if (p.startsWith('/graduation')) return 'graduation';
    if (p.startsWith('/cart')) return 'cart';
    if (p.startsWith('/profile')) return 'profile';
    return 'home';
  })();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-white/95 backdrop-blur-md z-50 border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      dir="rtl"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center flex-1 py-1 transition-all group"
            >
              <div
                className={`relative w-10 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105' 
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-bold mt-1 tracking-tight transition-colors ${
                  isActive ? 'text-blue-700 font-extrabold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
