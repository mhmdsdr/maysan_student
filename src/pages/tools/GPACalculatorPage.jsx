import React, { useState } from 'react';
import Header from '../../components/common/Header';
import BottomNav from '../../components/common/BottomNav';
import { Calculator, Plus, Trash2, Sparkles, Award } from 'lucide-react';

export default function GPACalculatorPage() {
  const [courses, setCourses] = useState([
    { id: 1, name: 'ميكانيك موائع', units: 3, grade: 85 },
    { id: 2, name: 'رياضيات هندسية', units: 3, grade: 78 },
    { id: 3, name: 'خواص صخور وموائع', units: 2, grade: 90 },
    { id: 4, name: 'جيولوجيا نفط', units: 2, grade: 82 },
  ]);

  function addCourse() {
    setCourses([
      ...courses,
      { id: Date.now(), name: `مادة دراسية ${courses.length + 1}`, units: 3, grade: 75 }
    ]);
  }

  function removeCourse(id) {
    if (courses.length <= 1) return;
    setCourses(courses.filter(c => c.id !== id));
  }

  function updateCourse(id, field, val) {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: val } : c));
  }

  // Calculate weighted average
  const totalUnits = courses.reduce((sum, c) => sum + Number(c.units || 0), 0);
  const totalScore = courses.reduce((sum, c) => sum + (Number(c.units || 0) * Number(c.grade || 0)), 0);
  const average100 = totalUnits > 0 ? (totalScore / totalUnits).toFixed(2) : 0;
  const gpa4 = totalUnits > 0 ? ((average100 / 100) * 4).toFixed(2) : 0;

  // Iraqi Grading Scale
  function getAppreciation(score) {
    if (score >= 90) return { label: 'امتياز 🏆', color: 'text-emerald-700 bg-emerald-100' };
    if (score >= 80) return { label: 'جيد جداً ⭐', color: 'text-blue-700 bg-blue-100' };
    if (score >= 70) return { label: 'جيد 👍', color: 'text-indigo-700 bg-indigo-100' };
    if (score >= 60) return { label: 'متوسط 📘', color: 'text-amber-700 bg-amber-100' };
    if (score >= 50) return { label: 'مقبول ⚠️', color: 'text-orange-700 bg-orange-100' };
    return { label: 'راسب ❌', color: 'text-rose-700 bg-rose-100' };
  }

  const rating = getAppreciation(Number(average100));

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header title="حاسبة المعدل الجامعي (GPA)" showBack={true} />

      <div className="px-4 pt-3 space-y-4">
        
        {/* Result Card */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-5 text-white shadow-xl text-center space-y-3 relative overflow-hidden">
          <div className="flex justify-center">
            <span className={`text-xs font-black px-3 py-1 rounded-full ${rating.color}`}>
              التقدير: {rating.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 py-1">
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
              <span className="text-[11px] text-blue-200 block">المعدل المئوي (%):</span>
              <span className="text-2xl font-black text-white">{average100}%</span>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
              <span className="text-[11px] text-blue-200 block">نظام النقاط (من 4.0):</span>
              <span className="text-2xl font-black text-amber-300">{gpa4}</span>
            </div>
          </div>

          <p className="text-[11px] text-blue-200">
            مجموع الساعات / الوحدات المحسوبة: <b>{totalUnits} وحدة</b>
          </p>
        </div>

        {/* Courses Table Form */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-extrabold text-xs text-slate-800">المواد الدراسية والدرجات:</h3>
            <button
              onClick={addCourse}
              className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1 active:scale-95 transition-all"
            >
              <Plus size={13} />
              <span>إضافة مادة</span>
            </button>
          </div>

          <div className="space-y-2">
            {courses.map(course => (
              <div key={course.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl text-xs">
                <input 
                  type="text" 
                  value={course.name}
                  onChange={e => updateCourse(course.id, 'name', e.target.value)}
                  placeholder="اسم المادة"
                  className="flex-1 bg-white border border-slate-200 rounded-lg p-1.5 font-bold text-slate-800"
                />

                <div className="w-16">
                  <select
                    value={course.units}
                    onChange={e => updateCourse(course.id, 'units', Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-bold text-slate-800 text-center"
                    title="عدد الوحدات"
                  >
                    {[1, 2, 3, 4, 5].map(u => (
                      <option key={u} value={u}>{u} وحدات</option>
                    ))}
                  </select>
                </div>

                <div className="w-16">
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={course.grade}
                    onChange={e => updateCourse(course.id, 'grade', Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-black text-center text-blue-700"
                    title="الدرجة من 100"
                  />
                </div>

                <button
                  onClick={() => removeCourse(course.id)}
                  className="w-7 h-7 text-slate-400 hover:text-rose-600 flex items-center justify-center flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Advice Card */}
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 space-y-1">
          <p className="font-bold">💡 نصيحة أكاديمية لتحسين المعدل:</p>
          <p className="text-[11px] text-blue-700 leading-relaxed">
            ركّز على المواد ذات الوحدات العالية (3 و 4 وحدات)، فكل درجة إضافية فيها ترفع معدلك العام بضعف تأثير المواد ذات الوحدة الواحدة.
          </p>
        </div>

      </div>

      <BottomNav activeTab="home" />
    </div>
  );
}
