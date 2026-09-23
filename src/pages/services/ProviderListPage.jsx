import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import StarRating from '../../components/common/StarRating'
import { serviceCategories } from '../../data/services'
import providers from '../../data/providers'
import { MapPin, Filter } from 'lucide-react'

const ProviderListPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const catInfo = serviceCategories.find(c => c.id === category);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = providers.filter(p => p.category === category && (!availableOnly || p.available));

  return (
    <div className="bg-[#F0FDF9] min-h-screen page-container fade-in pb-20">
      <Header title={catInfo?.name || 'مقدمو الخدمة'} showBack={true} />

      {catInfo && (
        <div className="mx-4 mt-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="text-3xl">{catInfo.icon}</div>
          <div>
            <h2 className="font-bold text-gray-800">{catInfo.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">اختر من أفضل الفنيين المتاحين</p>
          </div>
        </div>
      )}

      <div className="mx-4 mt-4 flex items-center justify-between bg-white px-4 py-2 rounded-xl shadow-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={availableOnly}
              onChange={() => setAvailableOnly(!availableOnly)}
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${availableOnly ? 'bg-[#0D9488]' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${availableOnly ? 'transform translate-x-4' : ''}`}></div>
          </div>
          <span className="text-sm font-semibold text-gray-700">متاح الآن فقط</span>
        </label>
        <span className="text-sm text-gray-500 font-semibold">{filtered.length} مزود خدمة</span>
      </div>

      <div className="mx-4 mt-4 flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((provider) => (
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
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            لا يوجد مقدمو خدمة متاحون في هذا التصنيف حالياً
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderListPage;
