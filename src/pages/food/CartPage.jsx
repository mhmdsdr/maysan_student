import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import { useCart } from '../../context/CartContext'
import restaurants from '../../data/restaurants'
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, cartRestaurantId, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCart();
  const restaurant = restaurants.find(r => r.id === cartRestaurantId);
  const deliveryFee = restaurant?.deliveryFee || 0;
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  if (cart.length === 0) {
    return (
      <div className="bg-[#F0FDF9] min-h-screen page-container fade-in flex flex-col">
        <Header title="سلة المشتريات" showBack={true} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <ShoppingCart size={64} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">سلتك فارغة</h3>
          <p className="text-gray-500 mb-6">لم تضف أي أصناف بعد</p>
          <button 
            onClick={() => navigate('/food')}
            className="bg-[#0D9488] text-white py-3 px-8 rounded-xl font-bold w-full max-w-[200px]"
          >
            تصفح المطاعم
          </button>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    if (!address.trim()) return;
    clearCart();
    navigate('/order-confirm');
  };

  return (
    <div className="bg-[#F0FDF9] min-h-screen page-container fade-in pb-8">
      <Header title="سلة المشتريات" showBack={true} />
      
      {restaurant && (
        <div className="bg-white rounded-2xl p-3 flex items-center gap-2 mx-4 mt-3 shadow-sm">
          <span className="text-gray-500 text-sm">طلبك من: </span>
          <span className="font-bold text-gray-900">{restaurant.name}</span>
        </div>
      )}

      <div className="mx-4 mt-3 space-y-3">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-3 flex gap-3 items-center shadow-sm">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
              <div className="text-[#0D9488] font-bold text-sm mt-1">{(item.price || 0).toLocaleString()} د.ع</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => removeItem(item.id)} className="text-red-500 p-1">
                <Trash2 size={16} />
              </button>
              <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600"
                >
                  <Minus size={12} />
                </button>
                <span className="font-semibold text-xs w-3 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 rounded-full bg-[#0D9488] text-white shadow-sm flex items-center justify-center"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <h4 className="font-bold text-sm mb-3">تفاصيل التوصيل</h4>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="العنوان التفصيلي لموقع التسليم..."
          className="w-full bg-gray-50 rounded-xl p-3 text-sm border-none focus:ring-2 focus:ring-[#0D9488] outline-none mb-3 resize-none"
          rows="2"
          required
        />
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ملاحظات إضافية (اختياري)"
          className="w-full bg-gray-50 rounded-xl p-3 text-sm border-none focus:ring-2 focus:ring-[#0D9488] outline-none"
        />
      </div>

      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <h4 className="font-bold text-sm mb-3">ملخص الطلب</h4>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>المجموع الفرعي</span>
          <span>{getTotal().toLocaleString()} د.ع</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span>رسوم التوصيل</span>
          <span>{deliveryFee.toLocaleString()} د.ع</span>
        </div>
        <div className="border-t pt-3 flex justify-between items-center">
          <span className="font-bold">المجموع الكلي</span>
          <span className="text-[#0D9488] font-black text-lg">{(getTotal() + deliveryFee).toLocaleString()} د.ع</span>
        </div>
      </div>

      <div className="mx-4 mt-4">
        <button
          onClick={handleConfirm}
          disabled={!address.trim()}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${address.trim() ? 'bg-[#0D9488] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          <span>تأكيد الطلب ✈</span>
        </button>
      </div>
    </div>
  );
};

export default CartPage;
