import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import StarRating from '../../components/common/StarRating'
import providers from '../../data/providers'
import { serviceCategories } from '../../data/services'
import { MapPin, Clock, Shield, Phone, MessageCircle, Heart, ChevronLeft } from 'lucide-react'

const ProviderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const provider = providers.find(p => p.id === id);

  if (!provider) {
    return <div className="p-8 text-center text-gray-500">مزود خدمة غير موجود</div>;
  }

  const catInfo = serviceCategories.find(c => c.id === provider.category);
  const priceFrom = provider.services && provider.services.length > 0 
    ? Math.min(...provider.services.map(s => s.price)) 
    : 0;

  return (
    <div className="bg-[#F0FDF9] min-h-screen page-container fade-in pb-24 relative">
      <Header title="" showBack={true} showNotification={true} />

      <div className="relative">
        <img src={provider.image} alt={provider.name} className="h-52 object-cover w-full" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="relative -mt-16 mx-4 bg-white rounded-2xl shadow-lg p-4 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg font-black text-gray-900">{provider.name}</h1>
            {catInfo && (
              <div 
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold mt-1"
                style={{ backgroundColor: catInfo.color + '25', color: catInfo.color }}
              >
                <span>{catInfo.icon}</span>
                <span>{catInfo.name}</span>
              </div>
            )}
          </div>
          <img 
            src={provider.image} 
            alt={provider.name} 
            className="w-20 h-20 -mt-14 border-4 border-white rounded-full object-cover shadow-md bg-white"
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <StarRating rating={provider.rating || 0} reviewCount={provider.reviewCount} size="md" />
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${provider.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {provider.available ? 'متاح الآن' : 'غير متاح حالياً'}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 text-xs font-semibold text-gray-600">
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-lg">
            <Clock size={14} className="text-[#0D9488]" />
            <span>خبرة {provider.experience || '5+ سنة'}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-lg">
            <MapPin size={14} className="text-[#0D9488]" />
            <span>{provider.location}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-lg">
            <Shield size={14} className="text-[#0D9488]" />
            <span>موثوق ومضمون</span>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3">الخدمات التي يقدمها</h3>
        <div className="flex flex-col">
          {(provider.services || []).map((service, index) => (
            <div key={index} className="flex justify-between items-center py-2.5 border-b last:border-0 border-gray-100">
              <span className="text-sm font-semibold text-gray-800">{service.name}</span>
              <span className="text-[#0D9488] font-bold text-sm">{(service.price || 0).toLocaleString()} د.ع</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-2">عن مقدم الخدمة</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {provider.about || 'مقدم خدمة محترف يقدم أفضل الخدمات بأعلى جودة. يتميز بالدقة في المواعيد والالتزام التام بإرضاء العملاء.'}
        </p>
      </div>

      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm mb-6">
        <h3 className="font-bold text-gray-900 mb-2">ساعات العمل</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>من الأحد إلى الجمعة: 8 صباحاً - 10 مساءً</li>
          <li>السبت: 9 صباحاً - 8 مساءً</li>
        </ul>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t px-4 py-3 flex items-center justify-between z-50">
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs">سعر الخدمة</span>
          <span className="text-gray-900 font-bold text-sm">يبدأ من {priceFrom.toLocaleString()} د.ع</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => alert('خاصية المراسلة ستكون متاحة في التطبيق الكامل')}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
          >
            <MessageCircle size={20} />
          </button>
          <button 
            onClick={() => alert('للتواصل: 0780XXXXXXX')}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
          >
            <Phone size={20} />
          </button>
          <button 
            onClick={() => navigate('/book-service/' + provider.id)}
            className="bg-[#0D9488] text-white px-6 py-2.5 rounded-xl font-bold text-sm"
          >
            طلب الخدمة ←
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailPage;
