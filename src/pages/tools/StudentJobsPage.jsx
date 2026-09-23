import React from 'react';
import Header from '../../components/common/Header';
import BottomNav from '../../components/common/BottomNav';
import { useAppData } from '../../context/AppDataContext';
import { Briefcase, MapPin, Clock, Phone, DollarSign, CheckCircle2 } from 'lucide-react';

export default function StudentJobsPage() {
  const { jobs } = useAppData();
  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header title="بنك الوظائف الطلابية والعمل الجزئي" showBack={true} />

      <div className="px-4 pt-3 space-y-3.5">
        
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 p-4 text-white shadow-md">
          <div className="flex items-center gap-1.5 mb-1 text-emerald-200 text-xs font-bold">
            <Briefcase size={16} />
            <span>فرص عمل مسائية تناسب دوامك الجامعي</span>
          </div>
          <h2 className="text-base font-extrabold leading-snug">
            وظائف جزئية في العمارة وخدمات طلابية مدفوعة
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            وفّر دخلاً شهرياً مع الحفاظ على تفوقك الدراسي.
          </p>
        </div>

        {/* Jobs List */}
        <div className="space-y-3">
          {jobs.map(job => (
            <div 
              key={job.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {job.title}
                  </h3>
                  <p className="text-xs text-blue-600 font-bold mt-0.5">{job.employer}</p>
                </div>

                <div className="text-left bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                  <span className="text-xs font-black text-emerald-800">{job.salaryMonthly}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-orange-500" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-blue-500" />
                  <span>{job.workingHours}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                <b>المطلوب:</b> {job.requirements}
              </p>

              <button
                onClick={() => alert(`التقديم والاتصال بجهة العمل: ${job.phone}`)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Phone size={13} />
                <span>التقديم للوظيفة عبر الاتصال</span>
              </button>
            </div>
          ))}
        </div>

      </div>

      <BottomNav activeTab="home" />
    </div>
  );
}
