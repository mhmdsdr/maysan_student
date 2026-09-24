import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext';
import { supabase } from '../../lib/supabaseClient';
import { 
  ShieldCheck, 
  Package, 
  Printer, 
  GraduationCap, 
  FileText, 
  Briefcase, 
  Percent, 
  Bell, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  DollarSign,
  Lock,
  Unlock,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  Compass,
  FileDown,
  Loader2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const {
    stationery,
    pastProjects,
    exams,
    jobs,
    discounts,
    announcements,
    cloudOrders,
    loadingOrders,
    fetchCloudOrders,
    updateOrderStatus,
    addStationery,
    deleteStationery,
    addProject,
    deleteProject,
    addExam,
    deleteExam,
    addJob,
    deleteJob,
    addDiscount,
    deleteDiscount,
    addAnnouncement,
    deleteAnnouncement,
    syncStatus,
  } = useAppData();

  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('taleb_maysan_admin') === '1');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'materials', 'market', 'graduation', 'exams', 'jobs', 'discounts', 'notices'
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Forms States - all fields empty, no dummy data
  // Stationery
  const [statForm, setStatForm] = useState({
    name: '',
    collegeType: 'كافة الكليات',
    price: '',
    oldPrice: '',
    image: '',
    description: '',
    badge: 'متوفر'
  });

  // Helper to convert uploaded PNG/JPG to Base64
  function handleImageUpload(e, callback) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleExamPdfUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    const okType = file.type === 'application/pdf' || ext === '.pdf';
    if (!okType) {
      setExamFileError('ارفع ملف PDF فقط.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setExamFileError('حجم الملف أكبر من 25 ميغابايت.');
      return;
    }

    setExamFileError('');
    setIsUploadingExam(true);
    try {
      const id = Math.random().toString(36).slice(2, 8);
      const path = `exams/${Date.now()}-${id}.pdf`;
      const { error } = await supabase.storage.from('print-files').upload(path, file, {
        contentType: 'application/pdf',
        upsert: false,
      });
      if (error) {
        setExamFileError(
          error.message?.includes('Bucket not found')
            ? 'مجلد الملفات غير جاهز. شغّل supabase/setup.sql'
            : 'فشل رفع الملف: ' + error.message
        );
        return;
      }
      const { data } = supabase.storage.from('print-files').getPublicUrl(path);
      setExamForm(prev => ({
        ...prev,
        fileUrl: data.publicUrl,
        fileName: file.name,
        solutionsAttached: true,
      }));
    } catch (err) {
      console.error(err);
      setExamFileError('تعذر رفع ملف الامتحان. حاول مرة ثانية.');
    } finally {
      setIsUploadingExam(false);
    }
  }

  // 3. Project
  const [projectForm, setProjectForm] = useState({
    title: '',
    college: 'كلية الهندسة',
    year: new Date().getFullYear().toString(),
    students: '',
    supervisor: '',
    pagesCount: '',
    fileType: 'ملف بحث PDF كامل'
  });

  // 4. Exam
  const [examForm, setExamForm] = useState({
    title: '',
    college: 'كلية الهندسة',
    stage: 'المرحلة الأولى',
    year: 'الدور الأول ' + new Date().getFullYear(),
    solutionsAttached: false,
    fileUrl: '',
    fileName: '',
  });
  const [examFileError, setExamFileError] = useState('');
  const [isUploadingExam, setIsUploadingExam] = useState(false);

  // 5. Job
  const [jobForm, setJobForm] = useState({
    title: '',
    employer: '',
    salary: '',
    location: '',
    hours: '',
    phone: '',
    badge: ''
  });

  // 6. Discount
  const [discountForm, setDiscountForm] = useState({
    place: '',
    discount: '',
    location: '',
    category: 'مطاعم 🍔',
    code: ''
  });

  // 7. Announcement
  const [noticeForm, setNoticeForm] = useState({
    department: 'شؤون الطلبة والتسجيل',
    title: '',
    badge: 'رسمي 🏛️'
  });

  async function handleAddSubmit(e) {
    e.preventDefault();
    setIsPublishing(true);
    let ok = false;
    try {
      if (activeTab === 'stationery') {
        ok = await addStationery(statForm);
        if (ok) setStatForm({ ...statForm, name: '', description: '' });
      } else if (activeTab === 'graduation') {
        ok = await addProject(projectForm);
        if (ok) setProjectForm({ ...projectForm, title: '', students: '', supervisor: '' });
      } else if (activeTab === 'exams') {
        ok = await addExam({
          ...examForm,
          solutionsAttached: examForm.solutionsAttached || !!examForm.fileUrl,
        });
        if (ok) {
          setExamForm({
            title: '',
            college: examForm.college,
            stage: examForm.stage,
            year: 'الدور الأول ' + new Date().getFullYear(),
            solutionsAttached: false,
            fileUrl: '',
            fileName: '',
          });
          setExamFileError('');
        }
      } else if (activeTab === 'jobs') {
        ok = await addJob(jobForm);
        if (ok) setJobForm({ ...jobForm, title: '', employer: '' });
      } else if (activeTab === 'discounts') {
        ok = await addDiscount(discountForm);
        if (ok) setDiscountForm({ ...discountForm, place: '' });
      } else if (activeTab === 'notices') {
        ok = await addAnnouncement(noticeForm);
        if (ok) setNoticeForm({ ...noticeForm, title: '' });
      }
      if (ok) setShowAddModal(false);
    } finally {
      setIsPublishing(false);
    }
  }

  const tabs = [
    { id: 'orders', label: 'الطلبات الواردة (السحابة)', icon: Package, count: cloudOrders.length, color: 'text-emerald-700 bg-emerald-50' },
    { id: 'stationery', label: 'المستلزمات والقرطاسية', icon: Compass, count: stationery.length, color: 'text-amber-700 bg-amber-50' },
    { id: 'graduation', label: 'بوابة بحوث ومشاريع التخرج', icon: GraduationCap, count: pastProjects.length, color: 'text-indigo-700 bg-indigo-50' },
    { id: 'exams', label: 'بنك الأسئلة والامتحانات', icon: FileText, count: exams.length, color: 'text-purple-700 bg-purple-50' },
    { id: 'jobs', label: 'بنك الوظائف الطلابية والعمل الجزئي', icon: Briefcase, count: jobs.length, color: 'text-teal-700 bg-teal-50' },
    { id: 'discounts', label: 'عروض وخصومات الهوية الجامعية', icon: Percent, count: discounts.length, color: 'text-rose-700 bg-rose-50' },
    { id: 'notices', label: 'لوحة إعلانات جامعة ميسان', icon: Bell, count: announcements.length, color: 'text-amber-700 bg-amber-50' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4" dir="rtl">
        <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 w-full max-w-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto text-2xl">
            <Lock size={28} />
          </div>
          <h2 className="text-lg font-black">لوحة تحكم إدارة طالب ميسان</h2>
          <p className="text-xs text-slate-400">أدخل الرمز السري للمتابعة</p>
          
          <input 
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (pin === 'ms@7733' || pin === 'admin') {
                  sessionStorage.setItem('taleb_maysan_admin', '1');
                  setIsAuthenticated(true);
                } else {
                  alert('الرمز السري غير صحيح');
                  setPin('');
                }
              }
            }}
            placeholder="••••••••"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-center text-sm tracking-widest text-white focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={() => {
              if (pin === 'ms@7733' || pin === 'admin') {
                sessionStorage.setItem('taleb_maysan_admin', '1');
                setIsAuthenticated(true);
              } else {
                alert('الرمز السري غير صحيح');
                setPin('');
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition-colors"
          >
            دخول 🔓
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen pb-16 font-sans text-slate-900" dir="rtl">
      
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs"
              title="العودة للتطبيق"
            >
              <ArrowRight size={16} />
              <span className="hidden sm:inline">معاينة التطبيق</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-sm">
                ط
              </span>
              <div>
                <h1 className="text-sm font-black leading-tight flex items-center gap-1.5">
                  <span>لوحة تحكم إدارة منصة طالب ميسان</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    أدمن ميسان
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400">إدارة الملازم، الطلبات، المحتوى، وسوق المستعمل</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchCloudOrders()}
              disabled={loadingOrders}
              className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={13} className={loadingOrders ? 'animate-spin text-blue-400' : ''} />
              <span className="hidden sm:inline">تحديث الطلبات</span>
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('taleb_maysan_admin');
                setIsAuthenticated(false);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
              title="قفل اللوحة"
            >
              <Lock size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-4 space-y-4">
        {syncStatus?.message && (
          <div
            className={`rounded-2xl px-4 py-2.5 text-xs font-bold border ${
              syncStatus.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : syncStatus.type === 'saving'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {syncStatus.type === 'saving' && <Loader2 size={12} className="inline animate-spin ml-1" />}
            {syncStatus.message}
          </div>
        )}

        {/* Quick Summary Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-bold block">الطلبات الواردة</span>
              <span className="text-xl font-black text-emerald-700">{cloudOrders.length} طلب</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>


          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-bold block">الوظائف النشطة</span>
              <span className="text-xl font-black text-teal-700">{jobs.length} وظيفة</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Briefcase size={20} />
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm overflow-x-auto hide-scrollbar flex gap-1.5 text-xs font-bold">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Header for Current Section */}
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-sm font-black text-slate-800">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              يمكنك إضافة محتوى جديد أو تعديل وحذف العناصر الحالية فورياً
            </p>
          </div>

          {activeTab !== 'orders' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-600/20 active:scale-95 transition-all"
            >
              <Plus size={16} />
              <span>إضافة جديد</span>
            </button>
          )}
        </div>

        {/* ================= TAB CONTENT ================= */}

        {/* 1. ORDERS TAB (From Supabase Cloud) */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {cloudOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400 space-y-2">
                <Package size={36} className="mx-auto text-slate-300" />
                <p className="text-xs font-bold">لا توجد طلبات واردة في السحابة حالياً.</p>
                <p className="text-[11px]">أي طلب استنساخ أو تقرير يرسله الطالب سيظهر هنا مباشرة وبشكل حي.</p>
              </div>
            ) : (
              cloudOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{order.student_name}</span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                          #{order.id}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 font-bold mt-0.5 flex items-center gap-2">
                        <span>{order.college || 'جامعة ميسان'}</span>
                        <span>•</span>
                        <span>{order.stage || 'المرحلة الثالثة'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        {Number(order.total_price).toLocaleString()} د.ع
                      </span>
                    </div>
                  </div>

                  {/* Order Details & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Phone size={14} className="text-emerald-600" />
                      <span className="font-bold">رقم الهاتف:</span>
                      <a href={`tel:${order.phone}`} className="font-mono text-blue-600 underline font-bold">
                        {order.phone}
                      </a>
                      <a 
                        href={`https://wa.me/${order.phone?.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-md font-bold mr-1"
                      >
                        واتساب 💬
                      </a>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin size={14} className="text-rose-500" />
                      <span className="font-bold">مكان التسليم:</span>
                      <span className="text-slate-800 font-semibold">{order.delivery_address || 'موقع 110'}</span>
                    </div>

                    {order.notes && (
                      <div className="sm:col-span-2 text-slate-600 text-[11px] pt-1 border-t border-slate-200/60">
                        <span className="font-bold">ملاحظات الطالب:</span> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Items in Order */}
                  {order.items && Array.isArray(order.items) && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 block">الأصناف المطلوبة للطباعة:</span>
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="p-2 text-xs flex justify-between gap-2 bg-white">
                            <div className="min-w-0">
                              <span className="font-bold text-slate-800">{it.name}</span>
                              {it.details && <span className="text-[10px] text-slate-400 block">{it.details}</span>}
                              {it.fileName && (
                                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">الملف: {it.fileName}</span>
                              )}
                              {it.fileUrl && (
                                <a
                                  href={it.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 mt-1 text-[10px] font-black text-white bg-emerald-600 hover:bg-emerald-700 px-2 py-1 rounded-lg"
                                >
                                  <FileDown size={12} />
                                  تحميل ملف الطالب
                                </a>
                              )}
                            </div>
                            <span className="font-mono font-bold text-emerald-700 shrink-0">{it.quantity} × {it.price?.toLocaleString()} د.ع</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-slate-400 font-bold">الحالة الحالية:</span>
                      <span className="font-black text-slate-800 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'قيد الطباعة والتجهيز 🖨️')}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        قيد الطباعة 🖨️
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'في الطريق للتوصيل لبابك 🚚')}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                      >
                        في التوصيل 🚚
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'تم التسليم بنجاح ✅')}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      >
                        تم التسليم ✅
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2.5 STATIONERY TAB */}
        {activeTab === 'stationery' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs text-slate-700">الأدوات والمستلزمات القرطاسية ({stationery.length}):</h3>
              <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                أدوات طبية وهندسية ودراسة
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stationery.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm flex gap-3 items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400'} 
                      alt={item.name} 
                      className="w-14 h-14 rounded-xl object-cover shadow-sm flex-shrink-0 border border-slate-100" 
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 leading-snug truncate">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{item.collegeType}</p>
                      <span className="text-xs font-black text-emerald-700 mt-1 block">{(item.price || 0).toLocaleString()} د.ع</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف: ${item.name}؟`)) {
                        deleteStationery(item.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex-shrink-0"
                    title="حذف المستلزم"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. GRADUATION HUB TAB */}
        {activeTab === 'graduation' && (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-4 rounded-2xl">
              <h4 className="font-black text-xs">خدمات التخرج الأساسية</h4>
              <p className="text-[11px] text-indigo-200 mt-1">
                خدمة فحص الاستلال Turnitin الرسمية معتمدة بسعر 5,000 د.ع وتجليد الأطروحات الفاخر بسعر 15,000 د.ع.
              </p>
            </div>

            <h3 className="font-black text-xs text-slate-700 pt-2">أرشيف بحوث التخرج السابقة المنشورة ({pastProjects.length}):</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pastProjects.map(proj => (
                <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">{proj.college}</span>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">{proj.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">سنة: {proj.year} • إشراف: {proj.supervisor || 'أساتذة القسم'}</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm(`حذف بحث التخرج: ${proj.title}؟`)) {
                        deleteProject(proj.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. EXAMS BANK TAB */}
        {activeTab === 'exams' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exams.map(exam => (
              <div key={exam.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">{exam.college}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{exam.stage}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{exam.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">الدور: {exam.year}</p>
                  {exam.fileName && (
                    <p className="text-[10px] text-purple-700 font-bold mt-1">الملف: {exam.fileName}</p>
                  )}
                  {exam.fileUrl && (
                    <a
                      href={exam.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-[10px] font-black text-white bg-purple-700 px-2 py-1 rounded-lg"
                    >
                      <FileDown size={12} />
                      تحميل PDF
                    </a>
                  )}
                  {(exam.solutionsAttached || exam.fileUrl) && (
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">✓ ملف الأسئلة مرفق</span>
                  )}
                </div>
                <button 
                  onClick={() => {
                    if (confirm(`حذف نموذج الامتحان: ${exam.title}؟`)) {
                      deleteExam(exam.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 6. JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm flex justify-between items-start">
                <div>
                  <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-bold">{job.badge || 'عمل جزئي'}</span>
                  <h4 className="font-bold text-xs text-slate-900 mt-1 leading-snug">{job.title}</h4>
                  <p className="text-xs font-black text-emerald-700 mt-0.5">{job.salary}</p>
                  <p className="text-[11px] text-slate-500">{job.employer} • {job.location}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{job.hours}</p>
                </div>
                <button 
                  onClick={() => {
                    if (confirm(`حذف فرصة العمل: ${job.title}؟`)) {
                      deleteJob(job.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 7. DISCOUNTS TAB */}
        {activeTab === 'discounts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {discounts.map(disc => (
              <div key={disc.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm flex justify-between items-start">
                <div>
                  <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold">{disc.category}</span>
                  <h4 className="font-bold text-xs text-slate-900 mt-1">{disc.place}</h4>
                  <p className="text-xs font-black text-emerald-700 mt-0.5">{disc.discount}</p>
                  <p className="text-[11px] text-slate-500">{disc.location}</p>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold block mt-1 w-max">
                    كود: {disc.code}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    if (confirm(`حذف عرض الخصم: ${disc.place}؟`)) {
                      deleteDiscount(disc.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 8. UNIVERSITY NOTICEBOARD TAB */}
        {activeTab === 'notices' && (
          <div className="space-y-3">
            {announcements.map(notice => (
              <div key={notice.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
                      {notice.department}
                    </span>
                    <span className="text-[10px] text-slate-400">{notice.time}</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                      {notice.badge}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">{notice.title}</p>
                </div>
                <button 
                  onClick={() => {
                    if (confirm('حذف هذا الإعلان من لوحة الجامعة؟')) {
                      deleteAnnouncement(notice.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* ================= MODAL: ADD NEW ITEM ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-3xl w-full max-w-lg p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">
                إضافة جديد إلى: {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              
              {/* Materials Form */}
              {activeTab === 'materials' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">عنوان أو اسم الملزمة:</label>
                    <input 
                      type="text" 
                      required 
                      value={matForm.title} 
                      onChange={e => setMatForm({ ...matForm, title: e.target.value })} 
                      placeholder="مثال: ملزمة الفيزياء الطبية الحديثة"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">الكلية المعنية:</label>
                      <input 
                        type="text" 
                        required 
                        value={matForm.college} 
                        onChange={e => setMatForm({ ...matForm, college: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">المرحلة الدراسية:</label>
                      <input 
                        type="text" 
                        required 
                        value={matForm.stage} 
                        onChange={e => setMatForm({ ...matForm, stage: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">اسم الأستاذ/الدكتور:</label>
                      <input 
                        type="text" 
                        value={matForm.doctor} 
                        onChange={e => setMatForm({ ...matForm, doctor: e.target.value })} 
                        placeholder="د. أحمد"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">عدد الصفحات:</label>
                      <input 
                        type="number" 
                        value={matForm.pagesCount} 
                        onChange={e => setMatForm({ ...matForm, pagesCount: Number(e.target.value) })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">سعر الطباعة (عادي):</label>
                      <input 
                        type="number" 
                        value={matForm.printPriceBW} 
                        onChange={e => setMatForm({ ...matForm, printPriceBW: Number(e.target.value) })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                  </div>

                  {/* PNG/JPG File Upload for Materials */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      صورة غلاف الملزمة (اختر صورة PNG أو JPG من جهازك):
                    </label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                        <Upload size={14} />
                        <span>رفع صورة (PNG/JPG)</span>
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, image/webp" 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, (base64) => setMatForm({ ...matForm, coverImage: base64 }))}
                        />
                      </label>
                      {matForm.coverImage && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={matForm.coverImage} 
                            alt="معاينة" 
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200" 
                          />
                          <span className="text-[11px] text-emerald-600 font-bold">✓ تم اختيار الصورة</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Stationery Form */}
              {activeTab === 'stationery' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">اسم الأداة أو المستلزم:</label>
                    <input 
                      type="text" 
                      required 
                      value={statForm.name} 
                      onChange={e => setStatForm({ ...statForm, name: e.target.value })} 
                      placeholder="مثال: طقم أدوات هندسية متكامل مع مسطرة T"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">الكلية أو التخصص:</label>
                      <input 
                        type="text" 
                        required 
                        value={statForm.collegeType} 
                        onChange={e => setStatForm({ ...statForm, collegeType: e.target.value })} 
                        placeholder="كلية الهندسة / كلية الطب / عام"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">السعر (بالدينار):</label>
                      <input 
                        type="number" 
                        required 
                        value={statForm.price} 
                        onChange={e => setStatForm({ ...statForm, price: Number(e.target.value) })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">وصف المستلزم:</label>
                    <input 
                      type="text" 
                      value={statForm.description} 
                      onChange={e => setStatForm({ ...statForm, description: e.target.value })} 
                      placeholder="مواصفات الأداة وجودتها..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  {/* PNG/JPG File Upload for Stationery */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      صورة الأداة (اختر صورة PNG أو JPG من جهازك):
                    </label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                      <label className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                        <Upload size={14} />
                        <span>رفع صورة (PNG/JPG)</span>
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, image/webp" 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, (base64) => setStatForm({ ...statForm, image: base64 }))}
                        />
                      </label>
                      {statForm.image && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={statForm.image} 
                            alt="معاينة" 
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200" 
                          />
                          <span className="text-[11px] text-emerald-600 font-bold">✓ تم اختيار الصورة</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Graduation Form */}
              {activeTab === 'graduation' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">عنوان بحث أو مشروع التخرج:</label>
                    <input 
                      type="text" 
                      required 
                      value={projectForm.title} 
                      onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} 
                      placeholder="عنوان البحث الأكاديمي"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">الكلية والقسم:</label>
                      <input 
                        type="text" 
                        required 
                        value={projectForm.college} 
                        onChange={e => setProjectForm({ ...projectForm, college: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">سنة التخرج:</label>
                      <input 
                        type="text" 
                        value={projectForm.year} 
                        onChange={e => setProjectForm({ ...projectForm, year: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الأستاذ المشرف:</label>
                    <input 
                      type="text" 
                      value={projectForm.supervisor} 
                      onChange={e => setProjectForm({ ...projectForm, supervisor: e.target.value })} 
                      placeholder="أ.د. محمد جاسم"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                </>
              )}

              {/* Exam Form */}
              {activeTab === 'exams' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">عنوان أو مادة الامتحان:</label>
                    <input 
                      type="text" 
                      required 
                      value={examForm.title} 
                      onChange={e => setExamForm({ ...examForm, title: e.target.value })} 
                      placeholder="مثال: أسئلة التقويمي - فارماكولوجي"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">الكلية:</label>
                      <input 
                        type="text" 
                        required 
                        value={examForm.college} 
                        onChange={e => setExamForm({ ...examForm, college: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">المرحلة:</label>
                      <input 
                        type="text" 
                        value={examForm.stage} 
                        onChange={e => setExamForm({ ...examForm, stage: e.target.value })} 
                        placeholder="المرحلة الأولى"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">الدور / السنة:</label>
                      <input 
                        type="text" 
                        value={examForm.year} 
                        onChange={e => setExamForm({ ...examForm, year: e.target.value })} 
                        placeholder="الدور الأول 2024"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ملف الأسئلة (PDF):</label>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleExamPdfUpload}
                      disabled={isUploadingExam}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2"
                    />
                    {isUploadingExam && (
                      <p className="text-[11px] text-blue-700 font-bold mt-1 flex items-center gap-1">
                        <Loader2 size={12} className="animate-spin" /> جاري رفع الملف...
                      </p>
                    )}
                    {examForm.fileName && !isUploadingExam && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1">تم رفع: {examForm.fileName}</p>
                    )}
                    {examFileError && (
                      <p className="text-[11px] text-rose-600 font-bold mt-1">{examFileError}</p>
                    )}
                  </div>
                </>
              )}

              {/* Job Form */}
              {activeTab === 'jobs' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المسمى الوظيفي:</label>
                    <input 
                      type="text" 
                      required 
                      value={jobForm.title} 
                      onChange={e => setJobForm({ ...jobForm, title: e.target.value })} 
                      placeholder="مثال: كاشير مسائي في سوبرماركت"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">جهة العمل:</label>
                      <input 
                        type="text" 
                        required 
                        value={jobForm.employer} 
                        onChange={e => setJobForm({ ...jobForm, employer: e.target.value })} 
                        placeholder="اسم المحل أو الشركة"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">الراتب المتوقع:</label>
                      <input 
                        type="text" 
                        value={jobForm.salary} 
                        onChange={e => setJobForm({ ...jobForm, salary: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الموقع وأوقات الدوام:</label>
                    <input 
                      type="text" 
                      value={jobForm.location} 
                      onChange={e => setJobForm({ ...jobForm, location: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                </>
              )}

              {/* Discount Form */}
              {activeTab === 'discounts' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">اسم المطعم أو الكافيه أو المحل:</label>
                    <input 
                      type="text" 
                      required 
                      value={discountForm.place} 
                      onChange={e => setDiscountForm({ ...discountForm, place: e.target.value })} 
                      placeholder="مثال: كافيه ومطعم النخيل"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">نسبة وتفاصيل الخصم:</label>
                      <input 
                        type="text" 
                        required 
                        value={discountForm.discount} 
                        onChange={e => setDiscountForm({ ...discountForm, discount: e.target.value })} 
                        placeholder="خصم 20% للطلبة"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">كود الخصم:</label>
                      <input 
                        type="text" 
                        value={discountForm.code} 
                        onChange={e => setDiscountForm({ ...discountForm, code: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الموقع في العمارة:</label>
                    <input 
                      type="text" 
                      value={discountForm.location} 
                      onChange={e => setDiscountForm({ ...discountForm, location: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>

                  {/* PNG/JPG File Upload for Discount Partner */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      شعار أو صورة المحل (اختر صورة PNG أو JPG):
                    </label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                      <label className="cursor-pointer bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                        <Upload size={14} />
                        <span>رفع شعار (PNG/JPG)</span>
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, image/webp" 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, (base64) => setDiscountForm({ ...discountForm, image: base64 }))}
                        />
                      </label>
                      {discountForm.image && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={discountForm.image} 
                            alt="معاينة" 
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200" 
                          />
                          <span className="text-[11px] text-emerald-600 font-bold">✓ تم اختيار الشعار</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Notice Form */}
              {activeTab === 'notices' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الجهة المصدرة للإعلان:</label>
                    <input 
                      type="text" 
                      required 
                      value={noticeForm.department} 
                      onChange={e => setNoticeForm({ ...noticeForm, department: e.target.value })} 
                      placeholder="عمادة كلية الطب / شؤون الطلبة"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">نص وتفاصيل الإعلان:</label>
                    <textarea 
                      rows="3"
                      required 
                      value={noticeForm.title} 
                      onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} 
                      placeholder="اكتب تفاصيل الإعلان ليظهر فوراً على شريط أخبار جامعة ميسان في الصفحة الرئيسية..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">تصنيف الشارة:</label>
                    <input 
                      type="text" 
                      value={noticeForm.badge} 
                      onChange={e => setNoticeForm({ ...noticeForm, badge: e.target.value })} 
                      placeholder="رسمي 🏛️ / عاجل ⚠️ / تنويه"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isPublishing || isUploadingExam}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-black shadow-md shadow-blue-600/25"
                >
                  {isPublishing ? 'جاري الحفظ في السحابة...' : 'نشر وإضافة الآن'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
