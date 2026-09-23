import React, { useState } from 'react';
import Header from '../../components/common/Header';
import BottomNav from '../../components/common/BottomNav';
import { useAppData } from '../../context/AppDataContext';
import { colleges } from '../../data/colleges';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  BookOpen, 
  Star 
} from 'lucide-react';

export default function PastExamsPage() {
  const { exams, loadingOrders, syncStatus, fetchCloudOrders } = useAppData();
  const [selectedCollege, setSelectedCollege] = useState('الكل');
  const [search, setSearch] = useState('');

  const filteredExams = exams.filter(exam => {
    const matchCol = selectedCollege === 'الكل' || (exam.college || '').includes(selectedCollege);
    const matchQuery = (exam.title || '').toLowerCase().includes(search.toLowerCase());
    return matchCol && matchQuery;
  });

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header title="بنك الأسئلة والامتحانات السابقة" showBack={true} />

      <div className="px-4 pt-3 space-y-3.5">
        
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-800 to-indigo-900 p-4 text-white shadow-md">
          <div className="flex items-center gap-1.5 mb-1 text-purple-300 text-xs font-bold">
            <Sparkles size={16} />
            <span>أرشيف امتحانات جامعة ميسان والوزاري</span>
          </div>
          <h2 className="text-base font-extrabold leading-snug">
            أسئلة الفاينل والشهري والامتحان التقويمي مع الحلول
          </h2>
          <p className="text-xs text-purple-200 mt-1">
            وفّر وقت البحث.. جميع النماذج مصنفة حسب الكلية والمرحلة والدور.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن مادة أو امتحان..."
            className="w-full text-xs bg-white border border-slate-200 rounded-xl py-2.5 pr-8 pl-3 text-slate-800 focus:outline-none focus:border-purple-600 shadow-sm"
          />
          <Search size={14} className="absolute top-3.5 right-2.5 text-slate-400" />
        </div>

        {/* College Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setSelectedCollege('الكل')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCollege === 'الكل' 
                ? 'bg-purple-700 text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            جميع الكليات
          </button>
          {colleges.slice(0, 5).map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCollege(c.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCollege === c.name 
                  ? 'bg-purple-700 text-white shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {syncStatus?.type === 'error' && (
          <p className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
            {syncStatus.message}
          </p>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>عدد الأسئلة: {filteredExams.length}</span>
          <button
            type="button"
            onClick={() => fetchCloudOrders()}
            className="font-bold text-purple-700"
          >
            تحديث القائمة
          </button>
        </div>

        {/* Exams List */}
        <div className="space-y-2.5">
          {loadingOrders && filteredExams.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center text-xs text-slate-500">
              جاري تحميل الأسئلة من السحابة...
            </div>
          )}
          {!loadingOrders && filteredExams.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center text-xs text-slate-500">
              لا توجد أسئلة منشورة حالياً. اختر «جميع الكليات» أو حدّث القائمة بعد النشر.
            </div>
          )}
          {filteredExams.map(ex => (
            <div 
              key={ex.id}
              className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md inline-block mb-1">
                    {ex.college} • {ex.stage}
                  </span>
                  <h3 className="font-extrabold text-xs text-slate-900 leading-snug">
                    {ex.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>{ex.year}</span>
                    {(ex.fileUrl || ex.solutionsAttached) && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          <CheckCircle2 size={11} /> ملف PDF متوفر
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-1 rounded-lg">
                  {ex.downloadsCount} تحميل
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  <Star size={12} className="fill-amber-400" />
                  <span className="font-bold text-slate-700">{ex.rating}</span>
                </div>

                {ex.fileUrl ? (
                  <a
                    href={ex.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-4 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Download size={13} />
                    <span>تحميل ملف الامتحان (PDF)</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 font-bold">لا يوجد ملف مرفق بعد</span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      <BottomNav activeTab="home" />
    </div>
  );
}
