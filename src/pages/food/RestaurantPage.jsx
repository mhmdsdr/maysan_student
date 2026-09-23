import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import StarRating from '../../components/common/StarRating'
import { useCart } from '../../context/CartContext'
import restaurants from '../../data/restaurants'
import { Clock, MapPin, Plus, Minus, ShoppingCart } from 'lucide-react'

const RestaurantPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const restaurant = restaurants.find(r => r.id === restaurantId);

  if (!restaurant) {
    return (
      <div className="bg-[#F0FDF9] min-h-screen page-container fade-in flex items-center justify-center">
        <div className='p-8 text-center text-gray-500'>مطعم غير موجود</div>
      </div>
    );
  }

  const [activeCategory, setActiveCategory] = useState(restaurant.menu[0]?.category || '');
  const { cart, addItem, updateQuantity, getTotal, getItemCount } = useCart();

  const getItemQty = (itemId) => {
    return cart.find(i => i.id === itemId)?.quantity || 0;
  };

  const categories = [...new Set(restaurant.menu.map(item => item.category))];
  const activeMenu = restaurant.menu.filter(item => item.category === activeCategory);

  return (
    <div className="bg-[#F0FDF9] min-h-screen page-container fade-in pb-24 relative">
      <Header title="" showBack={true} showCart={true} />
      
      <img src={restaurant.image} alt={restaurant.name} className="h-56 w-full object-cover" />
      
      <div className="relative -mt-6 mx-4 bg-white rounded-2xl shadow-lg p-4 z-10">
        <h1 className="text-xl font-black text-gray-900">{restaurant.name}</h1>
        <div className="flex gap-1 mt-2 flex-wrap">
          {(restaurant.tags || []).map(tag => (
             <span key={tag} className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="mt-2">
          <StarRating rating={restaurant.rating || 0} reviewCount={restaurant.reviewCount} size="md" />
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{restaurant.deliveryTime} دقيقة</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>التوصيل: {(restaurant.deliveryFee || 0).toLocaleString()} د.ع</span>
          </div>
          <div>
            <span>الحد الأدنى: {(restaurant.minOrder || 0).toLocaleString()} د.ع</span>
          </div>
        </div>
        {!restaurant.open && (
          <div className="mt-3 inline-block bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-bold">
            مغلق حالياً
          </div>
        )}
      </div>

      <div className="sticky top-0 mt-4 bg-white border-b z-20">
        <div className="flex overflow-x-auto hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${activeCategory === cat ? 'text-[#0D9488] border-b-2 border-[#0D9488]' : 'text-gray-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-2">
        {activeMenu.map(item => {
          const qty = getItemQty(item.id);
          return (
            <div key={item.id} className="bg-white rounded-2xl p-3 mb-3 flex gap-3 items-center shadow-sm">
              <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-800">{item.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{item.description}</p>
                <div className="text-[#0D9488] font-bold mt-1">{(item.price || 0).toLocaleString()} د.ع</div>
                <div className="mt-2">
                  {qty === 0 ? (
                    <button 
                      onClick={() => addItem(item, restaurant.id)}
                      className="w-8 h-8 rounded-full bg-[#0D9488] text-white flex items-center justify-center transition-transform active:scale-95"
                    >
                      <Plus size={16} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-gray-50 rounded-full w-fit p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, qty - 1)}
                        className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-semibold text-sm w-4 text-center">{qty}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, qty + 1)}
                        className="w-7 h-7 rounded-full bg-[#0D9488] text-white shadow-sm flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            </div>
          );
        })}
      </div>

      {getItemCount() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[430px] px-4 pb-4 z-50">
          <button 
            onClick={() => navigate('/cart')} 
            className="w-full bg-[#0D9488] text-white rounded-2xl py-3.5 flex items-center justify-between px-4 shadow-lg active:scale-[0.98] transition-transform"
          >
            <span className="font-semibold">عرض السلة ({getItemCount()} عنصر)</span>
            <span className="font-bold">{getTotal().toLocaleString()} د.ع</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantPage;
