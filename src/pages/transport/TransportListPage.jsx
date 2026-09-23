import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import BottomNav from '../../components/common/BottomNav';
import { transportLines } from '../../data/transportLines';
import { maysanDistricts } from '../../data/colleges';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Phone, 
  CheckCircle2, 
  ChevronLeft, 
  Filter,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function TransportListPage() {
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState('الكل');
  const [onlyFemale, setOnlyFemale] = useState(false);

  const filteredLines = transportLines.filter(line => {
    const matchDistrict = selectedDistrict === 'الكل' || line.from.includes(selectedDistrict);
    const matchGender = !onlyFemale || line.gender.includes('طالبات');
    return matchDistrict && matchGender;
  });

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header title="خطوط النقل الجامعي" showBack={true} />

      <div className="px-4 pt-3 space-y-3.5">
        
        {/* Banner with guarantee */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 p-4 text-white shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={18} className="text-orange-400" />
            <span className="text-xs font-bold text-blue-200">خطوط معتمدة وموثقة 100%</span>
          </div>
          <h2 className="text-base font-extrabold leading-snug">
            احجز مقعدك الشهري وتتبّع باصك لحظة بلحظة
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            تغطية يومية من كافة أقضية ونواحي ميسان إلى مجمعات الكليات.
          </p>
        </div>

        {/* District Filter Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">تصفية حسب قضائك:</span>
            <button 
              onClick={() => setOnlyFemale(!onlyFemale)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all font-semibold flex items-center gap-1 ${
                onlyFemale 
                  ? 'bg-rose-50 text-rose-700 border-rose-200' 
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              <span>خطوط طالبات فقط</span>
              {onlyFemale && <CheckCircle2 size={12} />}
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
            <button
              onClick={() => setSelectedDistrict('الكل')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDistrict === 'الكل'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              الكل ({transportLines.length})
            </button>
            {maysanDistricts.map(dist => (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedDistrict === dist
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {dist}
              </button>
            ))}
          </div>
        </div>

        {/* Lines List */}
        <div className="space-y-3">
          {filteredLines.map(line => (
            <div
              key={line.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:border-blue-200 transition-all space-y-3"
            >
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{line.name}</h3>
                    {line.isLive && (
                      <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-ping" /> مباشر
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Bus size={13} className="text-blue-600" />
                    <span>{line.vehicleType}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400 font-mono text-[11px]">{line.vehicleNumber}</span>
                  </p>
                </div>

                <div className="text-left">
                  <span className="text-sm font-black text-blue-700">
                    {line.monthlyPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">د.ع / شهرياً</span>
                </div>
              </div>

              {/* Route Path Indicator */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                  <span className="text-slate-500">من:</span>
                  <span className="font-bold">{line.from}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-200" />
                  <span className="text-slate-500">إلى:</span>
                  <span className="font-bold">{line.to}</span>
                </div>
              </div>

              {/* Info chips */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-600">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-orange-500" />
                    <span>الانطلاق {line.departureTime}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={13} className="text-blue-500" />
                    <b className="text-orange-600 font-bold">{line.availableSeats}</b> مقاعد شاغرة
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-500">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-700">{line.driverRating}</span>
                  <span className="text-[10px]">({line.tripsCount})</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => navigate('/transport/' + line.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  حجز مقعد شهري
                </button>

                {line.isLive && (
                  <button
                    onClick={() => navigate('/transport/track/' + line.id)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <span>وصف ومسار الخط</span>
                    <ChevronLeft size={14} />
                  </button>
                )}
              </div>

            </div>
          ))}

          {filteredLines.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-100">
              <AlertCircle size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">لا توجد خطوط تطابق الفلتر حالياً</p>
              <p className="text-xs text-slate-400 mt-1">جرّب تغيير خيارات البحث أو تواصل مع الدعم لفتح خط جديد</p>
            </div>
          )}
        </div>

      </div>

      <BottomNav activeTab="transport" />
    </div>
  );
}
