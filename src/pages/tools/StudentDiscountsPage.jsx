import React from 'react';
import Header from '../../components/common/Header';
import BottomNav from '../../components/common/BottomNav';
import { useApp } from '../../context/AppContext';
import { useAppData } from '../../context/AppDataContext';
import { Percent, Utensils, Coffee, BookOpen, QrCode, Sparkles } from 'lucide-react';

export default function StudentDiscountsPage() {
  const { student } = useApp();
  const { discounts } = useAppData();

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header title="عروض وخصومات الهوية الجامعية" showBack={true} />

      <div className="px-4 pt-3 space-y-3.5">
        
        {/* Digital Student ID Badge preview */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 p-4 text-white shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-orange-500 font-extrabold px-2 py-0.5 rounded-full">
              بطاقة الخصم الرقمية
            </span>
            <span className="text-xs font-mono text-blue-200">{student.studentId}</span>
          </div>

          <div className="flex items-center gap-3">
            <img 
              src={student.avatar} 
              alt={student.name} 
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-400"
            />
            <div>
              <h3 className="font-black text-sm">{student.name}</h3>
              <p className="text-xs text-blue-200">{student.college} • جامعة ميسان</p>
            </div>
          </div>

          <div className="p-2.5 bg-white/10 rounded-xl flex items-center justify-between text-xs backdrop-blur-sm">
            <span>أظهر هذا الكود للكاشير لتفعيل الخصم 📲</span>
            <span className="font-mono font-bold bg-white text-blue-900 px-2 py-0.5 rounded-md text-[11px]">
              #MYSN-PASS
            </span>
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-3">
          {discounts.map(d => (
            <div 
              key={d.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md inline-block mb-1">
                    {d.category}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900">{d.place}</h4>
                  <p className="text-xs text-orange-600 font-extrabold mt-0.5">{d.discount}</p>
                  <span className="text-[11px] text-slate-400 mt-1 block">📍 {d.location}</span>
                </div>

                <button
                  onClick={() => alert(`كوبون الخصم: ${d.code} - تم نسخه للحافظة!`)}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-2 rounded-xl border border-indigo-200 transition-all flex items-center gap-1"
                >
                  <QrCode size={14} />
                  <span>تفعيل</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      <BottomNav activeTab="home" />
    </div>
  );
}
