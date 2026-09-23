import React, { useState } from 'react';
import Header from '../../components/common/Header';
import BottomNav from '../../components/common/BottomNav';
import { researchServices } from '../../data/graduationData';
import { useAppData } from '../../context/AppDataContext';
import { 
  GraduationCap, 
  FileCheck2, 
  BookMarked, 
  Download, 
  UploadCloud, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Clock, 
  CheckCircle2, 
  ChevronLeft,
  Camera,
  Layers
} from 'lucide-react';

export default function GraduationHubPage() {
  const { pastProjects } = useAppData();
  const [activeTab, setActiveTab] = useState('services'); // 'services', 'turnitin', 'binding', 'archive'
  
  // Turnitin simulator state
  const [turnitinFileUploaded, setTurnitinFileUploaded] = useState(false);
  const [turnitinTested, setTurnitinTested] = useState(false);

  // Binding order state
  const [bindingColor, setBindingColor] = useState('كحلي ملكي (جامعة ميسان)');
  const [bindingCopies, setBindingCopies] = useState(3);
  const [bindingOrdered, setBindingOrdered] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header title="بوابة بحوث ومشاريع التخرج" showBack={true} />

      <div className="px-4 pt-3 space-y-3.5">
        
        {/* Academic Royal Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-4 text-white shadow-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
            <GraduationCap size={18} />
            <span>محطة التخرج والبحث العلمي لطلبة ميسان</span>
          </div>
          <h2 className="text-base font-extrabold leading-snug">
            كل ما تحتاجه لإنجاز بحثك ومشروع تخرجك بامتياز 🎓
          </h2>
          <p className="text-xs text-blue-200">
            فحص استلال Turnitin فوري، قوالب جامعية معتمدة، وتجليد أطاريح فاخر مع التوصيل.
          </p>

          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1 text-xs font-bold">
          {[
            { id: 'services', label: 'الخدمات 🛠️' },
            { id: 'turnitin', label: 'فحص الاستلال 🔍' },
            { id: 'binding', label: 'تجليد الأطروحة 📕' },
            { id: 'archive', label: 'أرشيف البحوث 📚' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl transition-all text-center ${
                activeTab === tab.id
                  ? 'bg-white text-blue-900 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Main Services Grid */}
        {activeTab === 'services' && (
          <div className="space-y-3">
            {researchServices.map(srv => (
              <div 
                key={srv.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl flex-shrink-0">
                      {srv.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md inline-block mb-1 border border-amber-200/50">
                        {srv.badge}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-blue-700 whitespace-nowrap bg-blue-50 px-2 py-1 rounded-lg">
                    {srv.priceLabel}
                  </span>
                </div>

                {/* Features list */}
                <div className="grid grid-cols-1 gap-1.5 pt-1 border-t border-slate-100">
                  {srv.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                <button
                  onClick={() => {
                    if (srv.id === 'turnitin') setActiveTab('turnitin');
                    else if (srv.id === 'binding') setActiveTab('binding');
                    else if (srv.id === 'templates') alert('تم بدء تنزيل حزمة قوالب بحوث جامعة ميسان (Word + PPT) مجاناً!');
                    else alert('سيتم التواصل معك لحجز روب التخرج ودرع التخرج التذكاري المخصص.');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <span>{srv.id === 'templates' ? 'تحميل القوالب المجانية ⬇️' : 'طلب وتفاصيل الخدمة'}</span>
                  <ChevronLeft size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Turnitin Checker Portal */}
        {activeTab === 'turnitin' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                <ShieldCheck size={16} />
                <span className="text-xs font-bold">نظام Turnitin الرسمي المعتمد</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">فحص نسبة الاستلال الأكاديمي للبحوث</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                ارفع بحثك بصيغة Word أو PDF للحصول على تقرير استلال رسمي معتمد بدون حفظ الملف في المستودع (No Repository)، لحماية أمان بحثك قبل التسليم النهائي للجنة المناقشة.
              </p>
            </div>

            {/* Upload Zone */}
            {!turnitinFileUploaded ? (
              <div 
                onClick={() => setTurnitinFileUploaded(true)}
                className="border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
              >
                <UploadCloud size={36} className="mx-auto text-blue-600" />
                <p className="text-xs font-bold text-slate-800">اضغط لرفع ملف البحث الأكاديمي (DOCX أو PDF)</p>
                <p className="text-[11px] text-slate-400">حجم الملف الأقصى: 50 ميغابايت</p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-900 font-bold">
                  <FileCheck2 size={20} className="text-emerald-600" />
                  <div>
                    <p>بحث_التخرج_النهائي_جامعة_ميسان.docx</p>
                    <span className="text-[10px] text-emerald-600 font-normal">الحجم: 2.4 MB • جاهز للفحص</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setTurnitinFileUploaded(false); setTurnitinTested(false); }}
                  className="text-xs text-slate-400 hover:text-rose-600 font-bold"
                >
                  إلغاء
                </button>
              </div>
            )}

            {/* Test Simulation Action */}
            {turnitinFileUploaded && !turnitinTested && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 flex justify-between items-center">
                  <span>رسوم التقرير الرسمي:</span>
                  <span className="font-black text-blue-700 text-sm">5,000 د.ع (رصيد / زين كاش)</span>
                </div>

                <button
                  onClick={() => setTurnitinTested(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl shadow-md active:scale-95 transition-all"
                >
                  بدء فحص الاستلال الفوري ⚡
                </button>
              </div>
            )}

            {/* Turnitin Result Mock */}
            {turnitinTested && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-emerald-900">نتيجة فحص البحث الرسمية:</h4>
                  <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-full">
                    مقبول ومطابق للشروط ✓
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                    <span className="text-[11px] text-slate-500 block">نسبة الاستلال الإجمالية:</span>
                    <span className="text-2xl font-black text-emerald-700">11%</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">(الحد المسموح حتى 20%)</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                    <span className="text-[11px] text-slate-500 block">عدد الكلمات المفحوصة:</span>
                    <span className="text-2xl font-black text-slate-800">14,280</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">كلمة باللغة الإنجليزية</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('تم تنزيل تقرير Turnitin الكامل بصيغة PDF!')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Download size={14} />
                  <span>تحميل تقرير الاستلال الملون (PDF)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Hardcover Binding Portal */}
        {activeTab === 'binding' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">تجليد أطاريح وبحوث التخرج الفاخر</h3>
              <p className="text-xs text-slate-500 mt-1">
                تجليد هاردكفر حراري بجلد ملكي فاخر وحروف ذهبية بارزة مع التوصيل لباب كليتك بميسان.
              </p>
            </div>

            {/* Binding Options */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">اختر لون الجلد المعتمد لكليتك:</label>
                <div className="grid grid-cols-3 gap-2 font-bold text-center">
                  {[
                    { id: 'كحلي ملكي (جامعة ميسان)', color: 'bg-blue-900 text-white' },
                    { id: 'ماروني فاخر', color: 'bg-rose-950 text-white' },
                    { id: 'أسود ملكي كلاسيك', color: 'bg-slate-900 text-white' },
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setBindingColor(c.id)}
                      className={`p-2.5 rounded-xl border text-[11px] transition-all ${
                        bindingColor === c.id 
                          ? 'border-blue-600 ring-2 ring-blue-300 font-extrabold' 
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full inline-block ml-1 ${c.color}`} />
                      <span>{c.id.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center font-bold text-slate-700 mb-1.5">
                  <span>عدد النسخ المجلدة المطلوبة:</span>
                  <span className="text-blue-700 font-black">{bindingCopies} نسخ</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setBindingCopies(n)}
                      className={`flex-1 py-2 rounded-xl border font-bold ${
                        bindingCopies === n 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl space-y-1 text-[11px] text-blue-800">
                <p>• كتابة عنوان البحث واسم الطالب والمشرف بالشريط الذهبي الحراري البارز.</p>
                <p>• طباعة وجهين على ورق دبل A أبيض ناصع 80 غم.</p>
                <p>• جاهز للتسليم خلال 24 إلى 48 ساعة عند بوابة كليتك.</p>
              </div>

              <div className="pt-2 border-t flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">إجمالي تكلفة التجليد:</span>
                  <span className="text-base font-black text-blue-800">
                    {(bindingCopies * 15000).toLocaleString()} د.ع
                  </span>
                </div>

                {!bindingOrdered ? (
                  <button
                    onClick={() => setBindingOrdered(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-5 py-3 rounded-xl shadow-md active:scale-95 transition-all"
                  >
                    تأكيد حجز التجليد 📕
                  </button>
                ) : (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                    تم الحجز بنجاح! سيتواصل معك الخطاط
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Past Outstanding Projects Archive */}
        {activeTab === 'archive' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm">
              <h3 className="font-extrabold text-xs text-slate-800 mb-1">نماذج بحوث تخرج متميزة للأعوام السابقة:</h3>
              <p className="text-[11px] text-slate-400">للاسترشاد بطريقة كتابة الهيكل، تنسيق الجداول، والمراجع الأكاديمية.</p>
            </div>

            {pastProjects.map(proj => (
              <div 
                key={proj.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2.5"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                      {proj.college}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                      {proj.year}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                    {proj.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 mt-1">
                    إعداد الطلبة: <b>{proj.students}</b> • إشراف: {proj.supervisor}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{proj.pagesCount} صفحة • {proj.downloads} تحميل</span>
                  
                  <button
                    onClick={() => alert(`بدء تحميل نموذج البحث: ${proj.title}`)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                  >
                    <Download size={13} />
                    <span>تحميل النموذج</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <BottomNav activeTab="graduation" />
    </div>
  );
}
