import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, ShoppingBag, GraduationCap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';

export default function Header({
  title,
  showBack = false,
  showNotification = true,
  showCart = true,
  onBack,
  rightCustom
}) {
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const { student } = useApp();
  const cartCount = getItemCount();

  // Secret tap counter: 5 quick taps on logo → admin page (hidden from users)
  const [tapCount, setTapCount] = useState(0);
  const [tapTimer, setTapTimer] = useState(null);

  const handleLogoTap = useCallback(() => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (tapTimer) clearTimeout(tapTimer);

    if (newCount >= 5) {
      setTapCount(0);
      navigate('/admin');
      return;
    }

    const t = setTimeout(() => setTapCount(0), 1500);
    setTapTimer(t);
  }, [tapCount, tapTimer, navigate]);

  function handleBack() {
    if (onBack) onBack();
    else navigate(-1);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 max-w-[440px] mx-auto">
        {/* Right side (RTL Start) */}
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              onClick={handleBack}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              title="رجوع"
            >
              <ArrowRight size={20} />
            </button>
          ) : (
            <div 
              onClick={handleLogoTap}
              className="flex items-center gap-2 cursor-pointer group select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap size={20} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-base leading-none">طلاب ميسان</span>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">جامعي</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{student?.college || 'جامعات ميسان'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Center Title (if provided and back is shown) */}
        {title && (
          <h1 className="text-sm font-bold text-slate-800 line-clamp-1 max-w-[170px] text-center">
            {title}
          </h1>
        )}

        {/* Left Side (RTL End) */}
        <div className="flex items-center gap-1.5">
          {rightCustom}
          
          {showCart && (
            <button
              onClick={() => navigate('/cart')}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
              title="سلة المشتريات"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[11px] rounded-full flex items-center justify-center font-bold shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {showNotification && (
            <button 
              onClick={() => alert('لا توجد إشعارات جديدة حالياً')}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
              title="التنبيهات"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
