import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  User, 
  Phone, 
  Lock, 
  MapPin, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const COLLEGES = [
  'كلية الهندسة',
  'كلية الطب',
  'كلية الصيدلة',
  'كلية طب الأسنان',
  'كلية العلوم',
  'كلية التمريض',
  'كلية القانون',
  'كلية الإدارة والاقتصاد',
  'كلية التربية',
  'كلية التربية الأساسية',
  'كلية الزراعة',
  'كلية العلوم السياسية',
  'كلية التربية البدنية وعلوم الرياضة',
  'كلية الفنون الجميلة'
];

const STAGES = [
  'المرحلة الأولى',
  'المرحلة الثانية',
  'المرحلة الثالثة',
  'المرحلة الرابعة',
  'المرحلة الخامسة',
  'المرحلة السادسة'
];

const DISTRICTS = [
  'العمارة - حي المعلمين',
  'العمارة - حي الحسين',
  'العمارة - الكفاءات',
  'العمارة - عواشة',
  'العمارة - الماجدية',
  'العمارة - الدبيسات',
  'قضاء المجر الكبير',
  'قضاء قلعة صالح',
  'قضاء الكحلاء',
  'قضاء الميمونة',
  'قضاء علي الغربي',
  'ناحية المشرح',
  'ناحية السلام',
  'أخرى داخل ميسان'
];

const AVATAR_OPTIONS = [
  { id: 'm1', label: 'طالب جامعي', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
  { id: 'f1', label: 'طالبة جامعية', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
  { id: 'm2', label: 'طالب طب/علوم', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300' },
  { id: 'f2', label: 'طالبة صيدلة/طب', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300' },
  { id: 'm3', label: 'طالب هندسة', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
  { id: 'f3', label: 'طالبة تقنيات', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { registerStudent, loginStudent, loginDemoStudent } = useApp();

  // Active tab: 'login' or 'register'
  const [activeTab, setActiveTab] = useState('register');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [college, setCollege] = useState('كلية الهندسة');
  const [department, setDepartment] = useState('');
  const [stage, setStage] = useState('المرحلة الأولى');
  const [district, setDistrict] = useState('العمارة - حي المعلمين');
  const [pin, setPin] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].url);
  const [customAvatar, setCustomAvatar] = useState('');
  const [regError, setRegError] = useState('');
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [createdStudentName, setCreatedStudentName] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginPhone.trim()) {
      setLoginError('يرجى كتابة رقم هاتفك للمتابعة');
      return;
    }

    if (loginPhone.length < 10) {
      setLoginError('يرجى إدخال رقم هاتف عراقي صالح (مثال: 07701234567)');
      return;
    }

    const res = loginStudent(loginPhone.trim(), loginPin.trim());
    if (res && res.success) {
      navigate('/');
    } else {
      setLoginError('تعذر تسجيل الدخول، يرجى المحاولة مرة أخرى.');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!name.trim()) {
      setRegError('يرجى إدخال الاسم الثلاثي للطالب');
      return;
    }

    if (!regPhone.trim() || regPhone.length < 10) {
      setRegError('يرجى إدخال رقم هاتف عراقي صالح (10 أو 11 رقم)');
      return;
    }

    const newStudentData = {
      name: name.trim(),
      phone: regPhone.trim(),
      college: college,
      department: department.trim() || 'القسم العام',
      stage: stage,
      fromDistrict: district,
      pin: pin.trim() || '1234',
      avatar: customAvatar || selectedAvatar,
      gpa: 'طالب مستمر',
    };

    const created = registerStudent(newStudentData);
    setCreatedStudentName(created.name);
    setIsSuccessModal(true);

    setTimeout(() => {
      navigate('/');
    }, 1800);
  };

  // Handle Image Upload for Custom Avatar
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-[440px] mx-auto relative shadow-2xl" dir="rtl">
      
      {/* 🏛️ Top Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white pt-8 pb-12 px-6 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10 mb-4">
          <button 
            onClick={() => navigate('/')} 
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="تخطي والعودة للرئيسية"
          >
            <ArrowRight size={18} />
          </button>
          
          <span className="text-[11px] font-bold bg-white/15 px-3 py-1 rounded-full text-blue-200 border border-white/10">
            بوابة جامعة ميسان الرسمية
          </span>
        </div>

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 border border-white/20">
            <GraduationCap size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              طالب ميسان
              <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-md">
                2024
              </span>
            </h1>
            <p className="text-xs text-blue-200 mt-0.5 font-medium">
              حسابك الجامعي الموحد • بطاقة الطالب • الخدمات
            </p>
          </div>
        </div>
      </div>

      {/* 📱 Main Card Form */}
      <div className="flex-1 bg-white -mt-6 rounded-t-3xl shadow-[0_-10px_35px_rgba(0,0,0,0.06)] px-5 pt-5 pb-8 relative z-20 flex flex-col justify-between">
        <div>
          {/* 🔘 Navigation Tabs Switcher */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setRegError(''); }}
              className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register' 
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles size={14} className={activeTab === 'register' ? 'text-amber-400' : ''} />
              <span>إنشاء حساب طالب جديد</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('login'); setLoginError(''); }}
              className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login' 
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck size={14} />
              <span>تسجيل الدخول</span>
            </button>
          </div>

          {/* ==================== 1. TAB: REGISTER (إنشاء حساب) ==================== */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 fade-in">
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 text-xs text-blue-900 flex items-center gap-2">
                <span className="text-base">🎓</span>
                <span className="font-semibold">التسجيل فوري وبسيط! يتم إصدار بطاقتك الجامعية مباشرة بنقرة واحدة.</span>
              </div>

              {regError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* الاسم الثلاثي */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الاسم الثلاثي للطالب <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: علي جاسم محمد الساعدي"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-3 px-3.5 pr-10 text-xs font-bold text-slate-800 outline-none transition-all"
                  />
                  <User size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
                </div>
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم الهاتف (للتواصل وتأكيد الطلبات) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="07XXXXXXXXX"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-3 px-3.5 pr-10 text-xs font-bold text-slate-800 text-left outline-none transition-all"
                  />
                  <Phone size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
                </div>
              </div>

              {/* الكلية والقسم */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الكلية <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-3 px-3 text-[11px] font-bold text-slate-800 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {COLLEGES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    القسم الدراسي
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: هندسة النفط"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-3 px-3 text-[11px] font-bold text-slate-800 outline-none transition-all"
                  />
                </div>
              </div>

              {/* المرحلة الدراسية والسكن */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    المرحلة الدراسية <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-3 px-3 text-[11px] font-bold text-slate-800 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {STAGES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    السكن في ميسان <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-3 px-3 text-[11px] font-bold text-slate-800 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* رمز سري اختياري */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>رمز سري للدخول السريع (PIN)</span>
                  <span className="text-[10px] text-slate-400 font-normal">4 أرقام أو اتركه فارغاً</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="مثال: 1234"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-3 px-3.5 pr-10 text-xs font-bold text-slate-800 outline-none transition-all"
                  />
                  <Lock size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
                </div>
              </div>

              {/* اختيار الصورة الرمزية */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  اختر صورتك الجامعية (أو ارفع صورتك)
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {AVATAR_OPTIONS.map((av) => {
                    const isSelected = !customAvatar && selectedAvatar === av.url;
                    return (
                      <div
                        key={av.id}
                        onClick={() => { setSelectedAvatar(av.url); setCustomAvatar(''); }}
                        className={`cursor-pointer rounded-2xl p-1 transition-all flex-shrink-0 flex flex-col items-center gap-1 ${
                          isSelected ? 'ring-2 ring-blue-600 bg-blue-50 scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={av.url} 
                          alt={av.label} 
                          className="w-12 h-12 rounded-xl object-cover" 
                        />
                        <span className="text-[9px] font-bold text-slate-600">{av.label}</span>
                      </div>
                    );
                  })}

                  {/* رفع صورة خاصة */}
                  <label className={`cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 w-14 h-16 flex-shrink-0 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-all ${customAvatar ? 'ring-2 ring-emerald-500 border-solid' : ''}`}>
                    {customAvatar ? (
                      <img src={customAvatar} alt="صورة الطالب" className="w-12 h-12 rounded-xl object-cover" />
                    ) : (
                      <>
                        <span className="text-base">📸</span>
                        <span className="text-[8px] font-bold mt-0.5">رفع صورة</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-blue-900/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm mt-3"
              >
                <Sparkles size={18} className="text-amber-400" />
                <span>إصدار بطاقتي والدخول للمنصة فوراً 🎓</span>
              </button>
            </form>
          )}

          {/* ==================== 2. TAB: LOGIN (تسجيل الدخول) ==================== */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 fade-in">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600">
                أدخل رقم هاتفك المسجل للدخول المباشر واسترجاع بطاقتك وطلباتك الجامعية.
              </div>

              {loginError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* رقم الهاتف */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم الهاتف المسجل <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="07XXXXXXXXX"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-3.5 px-3.5 pr-10 text-xs font-bold text-slate-800 text-left outline-none transition-all"
                  />
                  <Phone size={16} className="absolute right-3.5 top-4 text-slate-400" />
                </div>
              </div>

              {/* الرمز السري */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الرمز السري (PIN / كلمة المرور)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="الرمز السري الخاص بك"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-3.5 px-3.5 pr-10 pl-10 text-xs font-bold text-slate-800 outline-none transition-all"
                  />
                  <Lock size={16} className="absolute right-3.5 top-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Quick Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-blue-900/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm mt-3"
              >
                <UserCheck size={18} />
                <span>تسجيل الدخول إلى حسابي 🚀</span>
              </button>

              {/* Demo Account 1-Click Button */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold">أو الدخول السريع</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    loginDemoStudent();
                    navigate('/');
                  }}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <span>🎓 الدخول بالحساب النموذجي (حيدر عمار - كلية الهندسة)</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 🚀 Footer Links */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center space-y-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-blue-900 font-extrabold flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <span>تصفح المنصة كزائر بدون تسجيل الآن 🚀</span>
          </button>

          <p className="text-[10px] text-slate-400">
            تطبيق طالب ميسان • منصة الخدمات الجامعية الذكية • 2024
          </p>
        </div>
      </div>

      {/* 🎉 Success Modal */}
      {isSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl scale-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">مبارك تسجيلك! 🎓</h3>
              <p className="text-xs text-slate-600 mt-1">
                أهلاً بك يا <span className="font-bold text-blue-900">{createdStudentName}</span> في طالب ميسان.
              </p>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">
                تم إصدار بطاقتك الجامعية وتفعيل حسابك بنجاح!
              </p>
            </div>
            <div className="w-6 h-6 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      )}

    </div>
  );
}
