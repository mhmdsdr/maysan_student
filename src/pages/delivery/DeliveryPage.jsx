import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import BottomNav from '../../components/common/BottomNav';
import { ChevronLeft } from 'lucide-react';

const deliveryTypes = [
  { id: 'mandoob', title: 'مندوب', desc: 'توصيل أغراض، مستندات، مشتريات، علاجات', icon: '🛵', gradient: 'from-teal-500 to-teal-700', chips: ['📦 مشتريات', '📄 مستندات', '💊 علاجات'] },
  { id: 'kai', title: 'كي', desc: 'استلام وتوصيل الملابس من وإلى المغسلة', icon: '👔', gradient: 'from-violet-500 to-violet-700', chips: ['👔 ملابس رسمية', '👕 ملابس يومية', '🥻 مفروشات'] },
  { id: 'naql', title: 'نقل', desc: 'نقل العفش والأحمال الكبيرة بسيارات مناسبة', icon: '🚛', gradient: 'from-green-500 to-green-700', chips: ['🛋️ عفش منزلي', '📦 أحمال كبيرة', '🏢 نقل مكاتب'] },
  { id: 'stota', title: 'ستوتة', desc: 'لنقل الأغراض والحاجات داخل العمارة', icon: '🛺', gradient: 'from-amber-400 to-amber-600', chips: ['🛒 مشتريات', '📦 أغراض صغيرة', '📮 طرود صغيرة'] },
];

export default function DeliveryPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F0FDF9] min-h-screen page-container fade-in pb-20">
      <Header title="طلب مندوب ونقل" showBack={true} showNotification={true} />
      
      <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#064e3b] p-5 text-white">
        <h1 className="text-2xl font-bold mb-1">طلب مندوب ونقل</h1>
        <p className="text-white/80 text-sm mb-3">من أي مكان... إلى أي مكان</p>
        <div className="flex gap-2">
          <span className="bg-white/20 text-xs px-2 py-1 rounded-full">⚡ سريع</span>
          <span className="bg-white/20 text-xs px-2 py-1 rounded-full">✅ آمن</span>
          <span className="bg-white/20 text-xs px-2 py-1 rounded-full">💰 أسعار مناسبة</span>
        </div>
      </div>

      <h2 className="mx-4 mt-4 text-base font-bold text-gray-800">اختر نوع الخدمة</h2>
      
      <div className="mt-3">
        {deliveryTypes.map((type) => (
          <div 
            key={type.id}
            onClick={() => navigate('/delivery-form/' + type.id)}
            className="mx-4 mb-3 bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex flex-row"
            dir="rtl"
          >
            <div className={`w-32 bg-gradient-to-br ${type.gradient} flex items-center justify-center text-5xl min-h-[100px]`}>
              {type.icon}
            </div>
            <div className="flex-1 p-4 relative">
              <h3 className="text-lg font-black text-gray-800">{type.title}</h3>
              <p className="text-xs text-gray-500 mt-1 pr-1">{type.desc}</p>
              <div className="flex gap-1.5 flex-wrap mt-2 pr-1">
                {type.chips.map((chip, idx) => (
                  <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {chip}
                  </span>
                ))}
              </div>
              <ChevronLeft className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-3 mb-6 bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between" dir="rtl">
        <div>
          <h3 className="text-sm font-bold text-gray-800">تحتاج خدمة مخصصة؟</h3>
          <p className="text-xs text-gray-600 mt-1">تواصل معنا الآن وسنساعدك</p>
        </div>
        <button 
          onClick={() => alert('للتواصل مع فريق الدعم: 07811234567')}
          className="bg-[#0D9488] text-white px-4 py-2 rounded-xl text-sm font-bold"
        >
          تواصل معنا
        </button>
      </div>

      <BottomNav activeTab="home" />
    </div>
  );
}
