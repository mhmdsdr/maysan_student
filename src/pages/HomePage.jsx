import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
import { useApp } from '../context/AppContext';
import { useAppData } from '../context/AppDataContext';
import { 
  GraduationCap, 
  Printer, 
  FileText, 
  Calculator, 
  Briefcase, 
  Percent, 
  MapPin, 
  ChevronLeft, 
  Sparkles,
  CheckCircle2,
  FileEdit,
  Truck,
  Shield
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { student } = useApp();
  const { announcements } = useAppData();

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header />

      <div className="px-4 pt-3 space-y-4">
        
        {/* 🎓 Student Identity Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-4 shadow-lg shadow-blue-950/20">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={student.avatar} 
                  alt={student.name} 
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-400/40 shadow-inner"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-extrabold text-base leading-tight">{student.name}</h2>
                    {student.isGuest ? (
                      <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                        وضع الزائر
                      </span>
                    ) : (
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-0.5">
                        <CheckCircle2 size={10} /> طالب موثق
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-blue-200 mt-0.5">{student.college} • {student.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => navigate('/admin')} 
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] px-2.5 py-1.5 rounded-lg border border-emerald-500/30 transition-colors font-bold flex items-center gap-1"
                  title="لوحة تحكم الإدارة"
                >
                  <Shield size={12} />
                  <span>الإدارة ⚙️</span>
                </button>
                
                {student.isGuest ? (
                  <button 
                    onClick={() => navigate('/login')} 
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs px-2.5 py-1.5 rounded-lg transition-colors font-black flex items-center gap-1 shadow-sm"
                  >
                    <span>سجّل الآن 🎓</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/profile')} 
                    className="bg-white/10 hover:bg-white/20 text-xs px-2.5 py-1.5 rounded-lg border border-white/15 transition-colors font-medium"
                  >
                    بطاقتي 💳
                  </button>
                )}
              </div>
            </div>

            {/* Quick Micro Bar: University & Stage */}
            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
              <span className="font-medium text-blue-200">
                جامعة ميسان • {student.stage}
              </span>
              <span className="text-[11px] bg-blue-500/30 px-2.5 py-0.5 rounded-full text-blue-200 font-bold">
                السكن: {student.fromDistrict}
              </span>
            </div>
          </div>

          {/* Decorative background watermarks */}
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-blue-600/10 blur-xl pointer-events-none" />
          <div className="absolute left-4 top-2 text-7xl opacity-5 font-black select-none pointer-events-none">🎓</div>
        </div>

        {/* 🖨️ Hero Printing & Delivery Quick Banner */}
        <div 
          onClick={() => navigate('/materials')}
          className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white rounded-2xl p-3.5 shadow-md shadow-emerald-700/20 cursor-pointer active:scale-[0.99] transition-transform flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm shadow-inner flex-shrink-0">
              <Printer size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm leading-tight">مركز الاستنساخ والطباعة السريعة</span>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  توصيل منزلي 🚚
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 mt-0.5 flex items-center gap-1">
                <Truck size={11} className="text-amber-300" />
                <span>اطبع ملازمك أو اطلب إعداد تقريرك الجامعي ونوصله لبابك</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold bg-white/15 px-2.5 py-1.5 rounded-xl border border-white/20 flex-shrink-0">
            <span>اطلب الآن</span>
            <ChevronLeft size={14} />
          </div>
        </div>

        {/* 🏛️ The 4 Major Portals Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <span>بوابات الخدمات الجامعية</span>
              <Sparkles size={14} className="text-orange-500" />
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">كل ما يحتاجه يومك</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. استنساخ الملازم (مكان خطوط النقل) */}
            <div 
              onClick={() => navigate('/materials')}
              className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-all cursor-pointer active:scale-95 group relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
                <Printer size={22} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">استنساخ الملازم</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">ارفع PDF ملازمك واستلمها مطبوعة</p>
              <span className="inline-block mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                طباعة ليزرية فاخرة 🖨️
              </span>
            </div>

            {/* 2. إنشاء وكتابة التقارير */}
            <div 
              onClick={() => navigate('/materials')}
              className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm hover:border-teal-200 transition-all cursor-pointer active:scale-95 group relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
                <FileEdit size={22} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">إنشاء تقارير جامعية</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">إعداد تقرير أكاديمي حسب شروط كليتك</p>
              <span className="inline-block mt-2 text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                إعداد وتوصيل منزلي 📝
              </span>
            </div>

            {/* 3. بحوث ومشاريع التخرج */}
            <div 
              onClick={() => navigate('/graduation')}
              className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all cursor-pointer active:scale-95 group relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
                <GraduationCap size={22} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">بحوث ومشاريع التخرج</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">فحص Turnitin، تجليد فاخر، وقوالب</p>
              <span className="inline-block mt-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                فحص استلال معتمد 🔍
              </span>
            </div>

            {/* 4. بنك الأسئلة والامتحانات */}
            <div 
              onClick={() => navigate('/exams')}
              className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm hover:border-purple-200 transition-all cursor-pointer active:scale-95 group relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl mb-2.5 group-hover:scale-110 transition-transform">
                <FileText size={22} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">بنك الأسئلة</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">امتحانات سابقة لكل الكليات</p>
              <span className="inline-block mt-2 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                حلول ونماذج 📚
              </span>
            </div>
          </div>
        </div>

        {/* 🛠️ Smart Student Utilities */}
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm mb-2.5">أدوات الطالب الذكية</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'exams', title: 'بنك الأسئلة', icon: FileText, color: 'text-purple-600 bg-purple-50', path: '/exams' },
              { id: 'gpa', title: 'حاسبة المعدل', icon: Calculator, color: 'text-blue-600 bg-blue-50', path: '/gpa' },
              { id: 'jobs', title: 'عمل جزئي', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50', path: '/jobs' },
              { id: 'discounts', title: 'خصومات مطاعم', icon: Percent, color: 'text-rose-600 bg-rose-50', path: '/discounts' },
            ].map(tool => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => navigate(tool.path)}
                  className="bg-white p-2.5 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow active:scale-95 transition-all"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${tool.color}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-tight">{tool.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 📢 University Noticeboard */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              <h3 className="font-extrabold text-slate-800 text-sm">لوحة إعلانات جامعة ميسان</h3>
            </div>
            <span className="text-[11px] text-blue-600 font-bold">رسمي 🏛️</span>
          </div>

          <div className="space-y-2.5">
            {announcements.map((notice) => (
              <div key={notice.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-semibold text-blue-700">{notice.department}</span>
                  <div className="flex items-center gap-1.5">
                    <span>{notice.time}</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1 rounded">
                      {notice.badge}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-relaxed">
                  {notice.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 🎁 Promo */}
        <div 
          onClick={() => navigate('/discounts')}
          className="rounded-2xl bg-gradient-to-l from-indigo-700 to-blue-700 p-4 text-white flex items-center justify-between shadow-md shadow-indigo-900/10 cursor-pointer"
        >
          <div>
            <span className="bg-orange-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">خصم الهوية الجامعية</span>
            <h4 className="font-extrabold text-sm mt-1">خصم 20% في كافيهات ومطاعم العمارة</h4>
            <p className="text-xs text-blue-200 mt-0.5">أظهر هويتك الرقمية بالتطبيق واستمتع بالتوفير</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
            🍔
          </div>
        </div>

      </div>

      <BottomNav activeTab="home" />
    </div>
  );
}
