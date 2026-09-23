import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { transportLines } from '../../data/transportLines';
import { useApp } from '../../context/AppContext';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';

export default function TransportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBooking, student } = useApp();

  const line = transportLines.find(l => l.id === id) || transportLines[0];
  const [selectedPickup, setSelectedPickup] = useState('مجمع كليات موقع 110 (الهندسة، العلوم، القانون)');
  const [booked, setBooked] = useState(false);

  function handleConfirmBooking() {
    addBooking({
      id: 'BK-' + Date.now(),
      type: 'transport',
      title: line.name,
      lineId: line.id,
      status: 'تم تأكيد الحجز بنجاح ✅',
      driver: `${line.driverName} (${line.driverPhone})`,
      seatNumber: Math.floor(Math.random() * 10) + 1,
      pickup: selectedPickup,
      monthlyFee: line.monthlyPrice,
      period: 'اشتراك شهري (تشرين الأول 2026)',
    });
    setBooked(true);
  }

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header title="تفاصيل خط النقل" showBack={true} />

      <div className="px-4 pt-3 space-y-4">
        
        {/* Top Info Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md inline-block mb-1">
                {line.gender}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 leading-snug">{line.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{line.vehicleType} • {line.vehicleNumber}</p>
            </div>

            <div className="text-left bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
              <span className="text-base font-black text-blue-800">
                {line.monthlyPrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-500 block font-medium">د.ع / شهرياً</span>
            </div>
          </div>

          {/* Quick Schedule Row */}
          <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">الانطلاق صباحاً</span>
              <span className="font-extrabold text-slate-800">{line.departureTime}</span>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[10px] text-slate-400 block">العودة عصراً</span>
              <span className="font-extrabold text-slate-800">{line.returnTime}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">المقاعد المتبقية</span>
              <span className="font-extrabold text-orange-600">{line.availableSeats} مقاعد</span>
            </div>
          </div>
        </div>

        {/* Driver Card with Verified badge */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 mb-2.5">معلومات السائق المعتمد</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg">
                🚌
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-slate-900">{line.driverName}</h4>
                  <ShieldCheck size={14} className="text-blue-600" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star size={12} className="fill-amber-400" />
                    <span className="font-bold">{line.driverRating}</span>
                  </div>
                  <span>•</span>
                  <span>{line.tripsCount} رحلة جامعية منجزة</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => alert(`الاتصال بالسائق: ${line.driverPhone}`)}
              className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 transition-colors"
              title="اتصال بالسائق"
            >
              <Phone size={16} />
            </button>
          </div>
        </div>

        {/* Direct Destination Campuses Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 border-b border-slate-100 pb-2">
            <MapPin size={16} className="text-blue-600" />
            <span>الوجهات الجامعية (توصيل مباشر لباب الكلية):</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            ينقل الخط الطلبة مباشرة من {line.from} إلى مجمعي الكليات في العمارة دون أي توقفات جانبية:
          </p>
          <div className="space-y-2 pt-1">
            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-2.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0" />
              <span className="font-extrabold text-slate-800">مجمع كليات موقع 110 (الهندسة، العلوم، القانون)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0" />
              <span className="font-extrabold text-slate-800">مجمع الكليات الطبية (الطب العام، طب الأسنان، الصيدلة، التمريض)</span>
            </div>
          </div>
        </div>

        {/* Line Features */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 mb-2.5">مميزات وضمانات الخط</h3>
          <div className="grid grid-cols-2 gap-2">
            {line.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-xl">
                <CheckCircle2 size={13} className="text-blue-600 flex-shrink-0" />
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form Card */}
        {!booked ? (
          <div className="bg-white rounded-2xl border-2 border-blue-500 p-4 shadow-md space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">تأكيد حجز مقعدك الشهري</h3>
            
            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1">الكلية المطلوب التوصيل لبابها:</label>
              <select
                value={selectedPickup}
                onChange={e => setSelectedPickup(e.target.value)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="مجمع كليات موقع 110 (الهندسة، العلوم، القانون)">مجمع كليات موقع 110 (الهندسة، العلوم، القانون)</option>
                <option value="مجمع الكليات الطبية (الطب العام، طب الأسنان، الصيدلة، التمريض)">مجمع الكليات الطبية (الطب العام، طب الأسنان، الصيدلة، التمريض)</option>
              </select>
            </div>

            <div className="p-2.5 bg-blue-50 rounded-xl text-[11px] text-blue-700 space-y-1">
              <p>• حجزك يضمن لك مقعداً ثابتاً طيلة أيام الشهر الدراسي.</p>
              <p>• الدفع يتم مع السائق عند بدء أول أسبوع دراسي أو عبر زين كاش.</p>
            </div>

            <button
              onClick={handleConfirmBooking}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-extrabold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all"
            >
              تأكيد حجز المقعد الآن ({line.monthlyPrice.toLocaleString()} د.ع)
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h4 className="font-extrabold text-sm text-emerald-900">تم حجز مقعدك بنجاح! 🎉</h4>
            <p className="text-xs text-emerald-700">
              تم إشعار السائق {line.driverName}. يمكنك الآن تتبع مسار الخط أو الاطلاع على اشتراكاتك في حسابك.
            </p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => navigate('/transport/track/' + line.id)}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold"
              >
                تتبع الباص الآن
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="bg-white border border-emerald-300 text-emerald-800 px-3 py-2 rounded-xl text-xs font-bold"
              >
                عرض في بطاقتي
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
