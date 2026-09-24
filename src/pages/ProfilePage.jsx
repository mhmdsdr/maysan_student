import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
import { useApp } from '../context/AppContext';
import { 
  User, 
  GraduationCap, 
  Bus, 
  Printer, 
  Building2, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Award,
  ChevronLeft,
  Phone,
  LogOut,
  Sparkles,
  LogIn
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { student, activeBookings, isLoggedIn, logoutStudent, registerStudent } = useApp();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState({
    name: student?.name || '',
    college: student?.college || '',
    department: student?.department || '',
    stage: student?.stage || '',
    fromDistrict: student?.fromDistrict || ''
  });

  const handleSaveProfile = async () => {
    if (!editData.name.trim()) return;
    await registerStudent({ ...student, ...editData });
    setIsEditing(false);
  };

  React.useEffect(() => {
    if (!isLoggedIn || !student || student?.isGuest) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, student, navigate]);

  if (!student || !isLoggedIn) {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header title="حساب الطالب وبطاقتي" showBack={false} />

      <div className="px-4 pt-3 space-y-4">
        
        {/* 💳 Digital University ID Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-5 shadow-2xl space-y-4 overflow-hidden border border-white/10">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <GraduationCap size={18} />
              </div>
              <div>
                <h3 className="font-black text-xs tracking-wider">جامعة ميسان</h3>
                <span className="text-[10px] text-blue-200">جمهورية العراق • وزارة التعليم العالي</span>
              </div>
            </div>

            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
              بطاقة رسمية موثقة ✓
            </span>
          </div>

          <div className="flex gap-3.5 items-center">
            <img 
              src={student.avatar} 
              alt={student.name} 
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-400 shadow-md"
            />
            <div className="space-y-0.5">
              <h2 className="font-black text-base text-white">{student.name}</h2>
              <p className="text-xs text-blue-200">{student.college} • {student.department}</p>
              <p className="text-[11px] text-blue-300">{student.stage} • السكن: {student.fromDistrict}</p>
            </div>
          </div>

          {/* Barcode & ID row */}
          <div className="p-3 bg-white/10 rounded-2xl flex items-center justify-between backdrop-blur-md">
            <div>
              <span className="text-[10px] text-blue-300 block">الرقم الجامعي (ID):</span>
              <span className="font-mono font-bold text-xs text-white">{student.studentId}</span>
            </div>
            <div>
              <span className="text-[10px] text-blue-300 block">المعدل التراكمي:</span>
              <span className="font-bold text-xs text-amber-300">{student.gpa}</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center text-slate-900 shadow">
              <QrCode size={24} />
            </div>
          </div>

          {/* Subtle watermark */}
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
        </div>

        {/* 📦 Active Bookings & Orders */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-slate-800">طلباتي والاشتراكات النشطة ({activeBookings.length}):</h3>
          </div>

          {activeBookings.map(bk => (
            <div 
              key={bk.id}
              className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white bg-emerald-600">
                    <Printer size={16} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{bk.title}</h4>
                    <span className="text-[10px] text-slate-400 block">{bk.period}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                  {bk.status}
                </span>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1">
                {bk.address && <p>• عنوان التوصيل: {bk.address}</p>}
                {bk.specs && <p>• تفاصيل الملازم: {bk.specs}</p>}
                {bk.totalPrice && <p>• التكلفة الإجمالية: {bk.totalPrice.toLocaleString()} د.ع</p>}
                {bk.driver && <p>• المندوب / السائق: {bk.driver}</p>}
                {bk.pickup && <p>• نقطة الاستلام: {bk.pickup}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Account Menu */}
        <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-sm overflow-hidden text-xs">
          <button
            onClick={() => setIsEditing(true)}
            className="w-full p-3.5 flex items-center justify-between text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2 font-bold">
              <span>🎓</span>
              <span>تعديل البيانات الأكاديمية والكلية</span>
            </div>
            <ChevronLeft size={16} className="text-slate-400" />
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="w-full p-3.5 flex items-center justify-between text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2 font-bold">
              <span>📚</span>
              <span>سجل الملازم والطلبات السابقة</span>
            </div>
            <ChevronLeft size={16} className="text-slate-400" />
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="w-full p-3.5 flex items-center justify-between text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2 font-bold">
              <span>🔔</span>
              <span>تتبع الطلبات الجارية</span>
            </div>
            <ChevronLeft size={16} className="text-slate-400" />
          </button>

          {/* Switch Account or Login/Logout Button */}
          {student.isGuest ? (
            <button
              onClick={() => navigate('/login')}
              className="w-full p-3.5 flex items-center justify-between text-blue-700 hover:bg-blue-50 transition-colors bg-blue-50/50"
            >
              <div className="flex items-center gap-2 font-extrabold">
                <LogIn size={16} className="text-blue-600" />
                <span>تسجيل الدخول أو إنشاء حساب طالب جديد</span>
              </div>
              <ChevronLeft size={16} className="text-blue-500" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (window.confirm('هل تريد تسجيل الخروج أو تبديل الحساب؟')) {
                  logoutStudent();
                  navigate('/login');
                }
              }}
              className="w-full p-3.5 flex items-center justify-between text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <div className="flex items-center gap-2 font-extrabold">
                <LogOut size={16} className="text-rose-500" />
                <span>تسجيل الخروج / تبديل الحساب</span>
              </div>
              <ChevronLeft size={16} className="text-rose-400" />
            </button>
          )}
        </div>

      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h2 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-2">تعديل البيانات الأكاديمية</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">الاسم الثلاثي</label>
                <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0D9488] focus:outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">الكلية</label>
                <input type="text" value={editData.college} onChange={e => setEditData({...editData, college: e.target.value})} className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0D9488] focus:outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">القسم</label>
                <input type="text" value={editData.department} onChange={e => setEditData({...editData, department: e.target.value})} className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0D9488] focus:outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">المرحلة</label>
                <input type="text" value={editData.stage} onChange={e => setEditData({...editData, stage: e.target.value})} className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0D9488] focus:outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">منطقة السكن</label>
                <input type="text" value={editData.fromDistrict} onChange={e => setEditData({...editData, fromDistrict: e.target.value})} className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0D9488] focus:outline-none" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={handleSaveProfile} className="flex-1 bg-[#0D9488] text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-teal-600/20">
                حفظ التعديلات
              </button>
              <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-xs">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activeTab="profile" />
    </div>
  );
}
