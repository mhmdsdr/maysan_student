import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import StarRating from '../../components/common/StarRating'
import { serviceCategories } from '../../data/services'
import providers from '../../data/providers'
import { Search, MapPin, Phone, ChevronLeft } from 'lucide-react'

const HomeServicesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F0FDF9] min-h-screen page-container fade-in pb-20">
      <Header title="الخدمات المنزلية" showBack={true} showNotification={true} />

      <div className="mx-4 mt-3 bg-gradient-to-br from-[#0D9488] to-[#0F766E] rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">خدماتك... بيدك</h2>
          <p className="text-sm opacity-90 mb-4">فنيون محترفون .. سرعة في التنفيذ</p>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-semibold">🛡️ مضمون</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-semibold">⚡ سريع</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-semibold">👥 موثوق</span>
          </div>
        </div>
        <div className="absolute top-4 left-4 bg-white/20 px-2 py-1 rounded-full text-[10px] font-semibold">
          في جميع مناطق ميسان
        </div>
      </div>

      <div className="mx-4 mt-6">
        <h3 className="font-bold text-gray-800 mb-3">اختر نوع الخدمة</h3>
        <div className="grid grid-cols-5 gap-2">
          {serviceCategories.map((category) => (
            <div 
              key={category.id} 
              onClick={() => navigate('/services-list/' + category.id)}
              className="flex flex-col items-center gap-1 p-1 cursor-pointer active:scale-95 transition-transform"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm"
                style={{ backgroundColor: category.color + '25' }}
              >
                {category.icon}
              </div>
              <span className="text-[10px] text-gray-700 text-center leading-tight mt-0.5 font-semibold">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">مقدمو الخدمات المميزون ⭐</h3>
          <span 
            onClick={() => navigate('/services')} 
            className="text-[#0D9488] text-sm font-semibold cursor-pointer"
          >
            عرض الكل
          </span>
        </div>
        
        <div className="flex flex-col gap-3">
          {providers.slice(0, 4).map((provider) => (
            <div 
              key={provider.id}
              onClick={() => navigate('/provider/' + provider.id)}
              className="bg-white rounded-2xl p-3 shadow-sm flex gap-3 items-center cursor-pointer"
            >
              <div className="flex flex-col items-center flex-shrink-0">
                <img 
                  src={provider.image} 
                  alt={provider.name} 
                  className="w-16 h-16 rounded-2xl object-cover mb-1"
                />
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${provider.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {provider.available ? 'متاح الآن' : 'غير متاح'}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-900 truncate">{provider.name}</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(provider.specialties || []).map((spec, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full inline-block">
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={provider.rating || 0} size="sm" />
                  <span className="text-xs text-gray-500 truncate flex items-center">
                    <MapPin size={10} className="ml-0.5" />
                    {provider.location}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/book-service/' + provider.id);
                }}
                className="text-xs border border-[#0D9488] text-[#0D9488] px-3 py-1.5 rounded-xl font-semibold hover:bg-teal-50 active:bg-teal-100 transition-colors"
              >
                طلب خدمة
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeServicesPage;
