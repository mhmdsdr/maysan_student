import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { transportLines } from '../../data/transportLines';
import { 
  Bus, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  Calendar,
  Users,
  AlertCircle
} from 'lucide-react';

export default function TransportTrackPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const line = transportLines.find(l => l.id === id) || transportLines[0];

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-20 fade-in" dir="rtl">
      <Header title="وصف وتفاصيل مسار الخط" showBack={true} />

      <div className="px-4 pt-3 space-y-3.5">
        
        {/* Main Line Identity Card */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-5 text-white shadow-xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold bg-blue-500/30 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full">
              {line.gender}
            </span>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <ShieldCheck size={16} />
              <span>خط معتمد وموثق</span>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black leading-snug">{line.name}</h2>
            <p className="text-xs text-blue-200 mt-1 flex items-center gap-1.5">
              <Bus size={14} className="text-orange-400" />
              <span>{line.vehicleType}</span>
              <span>•</span>
              <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[11px] text-white">
                {line.vehicleNumber}
              </span>
            </p>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-blue-300 block">أجرة الاشتراك الشهري:</span>
              <span className="text-lg font-black text-amber-300">
                {line.monthlyPrice.toLocaleString()} د.ع
              </span>
            </div>

            <div className="text-left bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <span className="text-[10px] text-blue-200 block">المقاعد المتاحة:</span>
              <span className="text-xs font-black text-white">{line.availableSeats} مقاعد شاغرة</span>
            </div>
          </div>

          {/* Decorative watermark */}
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
        </div>

        {/* 📝 Comprehensive Route & Schedule Description Box */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <FileText size={18} className="text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-900">الوصف التفصيلي لمسار الخط والمواعيد</h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-700">
            {/* Morning Departure */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100/80 space-y-1">
              <div className="flex items-center gap-1.5 font-extrabold text-blue-900">
                <Clock size={14} className="text-blue-600" />
                <span>الانطلاق والتجمع الصباحي ({line.departureTime}):</span>
              </div>
              <p className="text-slate-600">
                ينطلق الباص يومياً عند الساعة <b>{line.departureTime}</b> صباحاً من نقطة التجمع الرئيسية في <b>{line.from}</b>. يُرجى من الطلبة المشتركين التواجد قبل موعد الانطلاق بـ 5 دقائق على الأقل لضمان وصول الجميع إلى المحاضرات الأولى في موعدها دون تأخير.
              </p>
            </div>

            {/* Direct Campuses Destination */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                <MapPin size={14} className="text-blue-600" />
                <span>الوجهة الجامعية (توصيل مباشر لباب الكلية):</span>
              </div>
              <p className="text-slate-600">
                يوصل الخط الطلبة مباشرة إلى المجمعين الجامعيين المتقاربين في العمارة دون أي توقفات جانبية:
              </p>
              <div className="pt-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>مجمع كليات موقع 110 (الهندسة، العلوم، القانون، الإدارة والاقتصاد)</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>مجمع الكليات الطبية (الطب العام، طب الأسنان، الصيدلة، التمريض)</span>
                </div>
              </div>
            </div>

            {/* Afternoon Return */}
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100/80 space-y-1">
              <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
                <Clock size={14} className="text-amber-600" />
                <span>رحلة العودة والانصراف عصراً ({line.returnTime}):</span>
              </div>
              <p className="text-slate-600">
                يبدأ تجمع الطلبة لرحلة العودة عند الساعة <b>{line.returnTime}</b> بعد الظهر أمام البوابة الرئيسية لمجمع كليات موقع 110، ثم يمر بمجمع الكليات الطبية في حي المعلمين، متجهاً مباشرة لإعادة جميع الطلاب إلى مناطق سكنهم بأمان ويسر.
              </p>
            </div>
          </div>
        </div>

        {/* 👨‍✈️ Driver Verification & Direct Contact Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 mb-2.5">معلومات السائق والتواصل المباشر:</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl font-bold">
                👨‍✈️
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-slate-900">{line.driverName}</h4>
                  <ShieldCheck size={14} className="text-blue-600" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">سائق موثق • {line.tripsCount} رحلة جامعية منجزة</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`الاتصال بالسائق: ${line.driverPhone}`)}
                className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                title="اتصال بالسائق"
              >
                <Phone size={18} />
              </button>
              <button
                onClick={() => alert(`مراسلة السائق عبر واتساب: ${line.driverPhone}`)}
                className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center justify-center active:scale-95 transition-all"
                title="واتساب"
              >
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 📋 Commute Guidelines & Vehicle Features */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2.5">
          <h3 className="text-xs font-bold text-slate-800">مواصفات وتعليمات الخط:</h3>
          <div className="space-y-2">
            {[
              'تكييف مستمر ومقاعد مريحة مخصصة لكل طالب بدون وقوف.',
              'التزام تام بالمواعيد الصباحية ومواعيد انتهاء المحاضرات.',
              'في حال غياب الطالب ليوم معين، يُرجى إشعار السائق عبر الواتساب في الليلة السابقة.',
              'يتم سداد أجور الاشتراك الشهري مع بداية كل شهر دراسي مع السائق مباشرة أو زين كاش.'
            ].map((instruction, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl">
                <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{instruction}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate('/transport/' + line.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-black text-xs shadow-lg shadow-blue-600/25 active:scale-95 transition-all"
        >
          حجز مقعد في هذا الخط ({line.monthlyPrice.toLocaleString()} د.ع)
        </button>

      </div>
    </div>
  );
}
