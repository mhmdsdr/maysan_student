import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import BottomNav from '../../components/common/BottomNav';
import { studentHousings, roommateRequests } from '../../data/housing';
import { 
  Building2, 
  MapPin, 
  Users, 
  Star, 
  ShieldCheck, 
  Zap, 
  Wifi, 
  UserPlus, 
  Sparkles,
  ChevronLeft
} from 'lucide-react';

export default function HousingListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'female', 'male', 'roommates'

  const filteredHousings = studentHousings.filter(h => {
    if (activeTab === 'female') return h.targetGender.includes('طالبات');
    if (activeTab === 'male') return h.targetGender.includes('شباب');
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header title="سكن الطلاب والداخليات" showBack={true} />

      <div className="px-4 pt-3 space-y-3.5">
        
        {/* Safe Housing Header Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-800 to-blue-900 p-4 text-white shadow-md">
          <div className="flex items-center gap-1.5 mb-1 text-orange-400 text-xs font-bold">
            <ShieldCheck size={16} />
            <span>سكن موثق ومعتمد لطلبة جامعة ميسان</span>
          </div>
          <h2 className="text-base font-extrabold leading-snug">
            شقق مفروشة، أقسام داخلية أهلية، ورفيق سكن
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            قريبة من مجمع 110 والكليات الطبية مع كهرباء مولدة 24 ساعة وإنترنت.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1 text-xs font-bold">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'female', label: 'سكن طالبات 🌸' },
            { id: 'male', label: 'سكن شباب 🏢' },
            { id: 'roommates', label: 'رفيق سكن 🤝' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl transition-all text-center ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Roommates Tab View */}
        {activeTab === 'roommates' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-800">طلبات مشاركة السكن الحالية:</h3>
              <button 
                onClick={() => alert('ميزة نشر طلبك ستكون متاحة بحسابك الجامعي')}
                className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg border border-indigo-200 flex items-center gap-1"
              >
                <UserPlus size={13} />
                <span>أضف طلبك</span>
              </button>
            </div>

            {roommateRequests.map(req => (
              <div key={req.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{req.studentName}</h4>
                    <p className="text-xs text-blue-600 font-medium">{req.college}</p>
                    <span className="text-[11px] text-slate-400">من أهالي: {req.fromDistrict}</span>
                  </div>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg">
                    الميزانية: {req.budgetMonthly}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  💬 "{req.lookingFor}"
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {req.habits.map((habit, idx) => (
                    <span key={idx} className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">
                      ✓ {habit}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => alert(`الاتصال بالطالب: ${req.phone}`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
                >
                  تواصل مع {req.studentName.split(' ')[0]} لمشاركة السكن
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Housings List */
          <div className="space-y-3.5">
            {filteredHousings.map(housing => (
              <div 
                key={housing.id}
                onClick={() => navigate('/housing/' + housing.id)}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:border-indigo-200 transition-all cursor-pointer group"
              >
                {/* Image & Badges */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img 
                    src={housing.images[0]} 
                    alt={housing.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur-md text-white shadow-sm ${
                      housing.targetGender.includes('طالبات') ? 'bg-rose-500/90' : 'bg-blue-600/90'
                    }`}>
                      {housing.targetGender}
                    </span>
                    {housing.verified && (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                        <ShieldCheck size={12} /> موثق
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Overlay text */}
                  <div className="absolute bottom-2.5 right-3 left-3 text-white">
                    <span className="text-[11px] text-orange-300 font-bold block">
                      📍 {housing.distanceToCampus}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {housing.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        <span>{housing.location}</span>
                      </p>
                    </div>

                    <div className="text-left">
                      <span className="text-sm font-black text-indigo-700">
                        {housing.priceMonthly.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">د.ع / شهرياً</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                      <Zap size={10} className="text-amber-600" /> مولدة 24 ساعة
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200/60 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                      <Wifi size={10} className="text-blue-600" /> فايبر ضوئي
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                      <Users size={10} className="text-emerald-600" /> باقي {housing.availableSpots} مقاعد
                    </span>
                  </div>

                  {/* Footer button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">المالك: {housing.ownerName}</span>
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      <span>عرض التفاصيل والصور</span>
                      <ChevronLeft size={14} />
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      <BottomNav activeTab="housing" />
    </div>
  );
}
