import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import BottomNav from '../../components/common/BottomNav'
import StarRating from '../../components/common/StarRating'
import { useCart } from '../../context/CartContext'
import restaurants from '../../data/restaurants'
import { Search, Clock, ChevronLeft } from 'lucide-react'

const FoodPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['الكل', 'مشاوي', 'حلويات', 'برغر', 'أسماك', 'بيتزا', 'مشروبات'];

  const filteredRestaurants = restaurants.filter(r => {
    const matchesTab = activeTab === 'الكل' || (r.categories && r.categories.includes(activeTab)) || r.category === activeTab || (r.tags && r.tags.includes(activeTab));
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="bg-[#F0FDF9] min-h-screen page-container fade-in pb-20">
      <Header title="الطعام والمطاعم" showBack={true} showCart={true} />
      
      <div className="px-4 mt-4 relative">
        <input 
          type="text" 
          placeholder="ابحث عن مطعم أو طبق..." 
          className="w-full bg-white rounded-xl py-3 pr-10 pl-4 border-none shadow-sm focus:ring-2 focus:ring-[#0D9488] outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute right-3 top-3.5 text-gray-400" size={20} />
      </div>

      <div className="mt-4 px-4 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 min-w-max pb-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-[#0D9488] text-white rounded-full' : 'bg-white text-gray-600 border border-gray-200 rounded-full'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        {filteredRestaurants.map(restaurant => (
          <div 
            key={restaurant.id} 
            onClick={() => navigate('/restaurant/' + restaurant.id)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm mb-3 cursor-pointer"
          >
            <div className="relative h-44 w-full">
              <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
              {!restaurant.open && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">مغلق</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-base font-bold">{restaurant.name}</h3>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {(restaurant.tags || restaurant.categories || []).map(tag => (
                  <span key={tag} className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <StarRating rating={restaurant.rating || 0} size="sm" />
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{restaurant.deliveryTime} دقيقة</span>
                </div>
                <div>
                  <span>توصيل: {(restaurant.deliveryFee || 0).toLocaleString()} د.ع</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredRestaurants.length === 0 && (
          <div className="text-center text-gray-500 mt-10">لا توجد مطاعم مطابقة للبحث</div>
        )}
      </div>

      <BottomNav activeTab="search" />
    </div>
  );
};

export default FoodPage;
