import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { studentHousings } from '../../data/housing';
import { 
  Building2, 
  MapPin, 
  Users, 
  Star, 
  ShieldCheck, 
  Zap, 
  Wifi, 
  Phone, 
  MessageSquare,
  CheckCircle2, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function HousingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const housing = studentHousings.find(h => h.id === id) || studentHousings[0];
  const [activeImg, setActiveImg] = useState(0);
  const [inspectionBooked, setInspectionBooked] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header title="تفاصيل السكن" showBack={true} />

      <div className="px-4 pt-3 space-y-4">
        
        {/* Photo Gallery */}
        <div className="space-y-2">
          <div className="relative h-56 rounded-2xl overflow-hidden shadow-md">
            <img 
              src={housing.images[activeImg] || housing.images[0]} 
              alt={housing.title} 
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
              {housing.targetGender}
            </span>
          </div>

          {housing.images.length > 1 && (
            <div className="flex gap-2">
              {housing.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? 'border-indigo-600 scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title & Price Header */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-md">
                  {housing.type}
                </span>
                {housing.verified && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                    <ShieldCheck size={11} /> موثق ومعتمد
                  </span>
                )}
              </div>
              <h2 className="text-base font-black text-slate-900 leading-snug">{housing.title}</h2>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin size={13} className="text-orange-500" />
                <span>{housing.location}</span>
              </p>
            </div>

            <div className="text-left bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
              <span className="text-base font-black text-indigo-800">
                {housing.priceMonthly.toLocaleString()}
              </span>
              <span className="text-[10px] text-indigo-500 block font-bold">د.ع / شهرياً</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span>🚶 {housing.distanceToCampus}</span>
            <span className="font-bold text-orange-600">باقي {housing.availableSpots} أماكن شاغرة</span>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2.5">
          <h3 className="text-xs font-bold text-slate-800">الخدمات والمرافق المتوفرة:</h3>
          <div className="space-y-2">
            {housing.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 bg-slate-50 p-2 rounded-xl">
                <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Owner / Supervisor Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xl font-bold">
              🏡
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">{housing.ownerName}</h4>
              <p className="text-xs text-slate-400 mt-0.5">مسؤول السكن المباشر</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`الاتصال بمسؤول السكن: ${housing.ownerPhone}`)}
              className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              title="اتصال"
            >
              <Phone size={18} />
            </button>
            <button
              onClick={() => alert(`مراسلة عبر واتساب: ${housing.ownerPhone}`)}
              className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center active:scale-95 transition-all"
              title="واتساب"
            >
              <MessageSquare size={18} />
            </button>
          </div>
        </div>

        {/* Inspection Booking Action */}
        {!inspectionBooked ? (
          <div className="bg-gradient-to-r from-indigo-700 to-blue-700 rounded-2xl p-4 text-white shadow-md space-y-2.5">
            <h4 className="font-extrabold text-sm">هل تود معاينة السكن ميدانياً؟</h4>
            <p className="text-xs text-indigo-100">
              يمكنك حجز موعد زيارة لمعاينة الغرف ومقابلة زملاء السكن بدون أي التزام مالي مسبق.
            </p>
            <button
              onClick={() => setInspectionBooked(true)}
              className="w-full bg-white text-indigo-900 hover:bg-slate-100 py-3 rounded-xl font-black text-xs shadow-md active:scale-95 transition-all"
            >
              حجز موعد معاينة مجاني 📅
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
            <h4 className="font-bold text-sm text-emerald-900">تم تسجيل موعد المعاينة! ✓</h4>
            <p className="text-xs text-emerald-700">
              سيتواصل معك {housing.ownerName} لتأكيد الوقت المناسب لزيارة السكن.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
