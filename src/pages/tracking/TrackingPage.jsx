import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/common/Header';
import { CheckCircle, Circle, Phone, MessageCircle, MapPin, Package, ChevronLeft, Clock } from 'lucide-react';

export default function TrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentOrder } = useApp();

  const [activeStepId, setActiveStepId] = useState('pending');

  const steps = [
    { id: 'sent', label: 'تم إرسال الطلب', sublabel: 'تم إرسال طلبك بنجاح', time: '10:25 ص', done: true },
    { id: 'pending', label: 'بانتظار قبول مندوب', sublabel: 'جاري البحث عن مندوب قريب منك', time: '', done: activeStepId !== 'pending', active: activeStepId === 'pending' },
    { id: 'accepted', label: 'تم القبول', sublabel: 'قَبِل المندوب طلبك', time: '', done: false, active: activeStepId === 'accepted' },
    { id: 'onway', label: 'في الطريق إليك', sublabel: 'المندوب في طريقه لموقع الاستلام', time: '', done: false, active: activeStepId === 'onway' },
    { id: 'done', label: 'تم الإنجاز', sublabel: 'تم توصيل طلبك بنجاح', time: '', done: false, active: activeStepId === 'done' },
  ];

  useEffect(() => {
    // Simulate progression for demo purposes
    const timer = setTimeout(() => {
      setActiveStepId('accepted');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#F0FDF9] min-h-screen page-container fade-in pb-10" dir="rtl">
      <Header title="تفاصيل الطلب" showBack={true} />

      <div className="mx-4 mt-3 bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
        <span className="text-sm font-bold text-gray-800">رقم الطلب: #{orderId.slice(-6)}</span>
        <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">بانتظار القبول</span>
      </div>

      <div className="mx-4 mt-3 h-44 rounded-2xl bg-teal-50 flex flex-col items-center justify-center gap-2 relative border border-teal-100 overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0D9488 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="w-4 h-4 bg-[#0D9488] rounded-full absolute top-6 right-8 animate-ping"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full absolute bottom-8 left-10"></div>
        <div className="bg-white rounded-xl shadow px-3 py-1.5 text-sm font-bold text-gray-800 z-10">
          10 دقائق للوصول
        </div>
        <p className="text-xs text-gray-500 absolute bottom-2 z-10 bg-white/80 px-2 py-0.5 rounded-full">خريطة التتبع الحي ستكون متاحة في التطبيق</p>
      </div>

      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" alt="Driver" className="w-14 h-14 rounded-full object-cover shadow-sm" />
          <div>
            <h4 className="font-bold text-gray-800">أحمد الكعبي</h4>
            <p className="text-xs text-gray-500">مندوب دليل ميسان <span className="text-yellow-500 font-bold ml-1">⭐4.8</span></p>
            <span className="inline-block mt-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">س - ع - 5678</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 justify-end">
            <button onClick={() => alert('جاري الاتصال...')} className="w-8 h-8 rounded-full border border-teal-200 text-teal-600 flex items-center justify-center bg-teal-50"><Phone size={14} /></button>
            <button onClick={() => alert('فتح الرسائل...')} className="w-8 h-8 rounded-full border border-teal-200 text-teal-600 flex items-center justify-center bg-teal-50"><MessageCircle size={14} /></button>
          </div>
          <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-bold text-center">في الطريق إليك 🏍️</span>
        </div>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-row relative">
              <div className="flex flex-col items-center ml-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center z-10 bg-white">
                  {step.done ? (
                    <CheckCircle className="text-[#0D9488]" size={20} />
                  ) : step.active ? (
                    <div className="w-4 h-4 bg-[#0D9488] rounded-full animate-pulse"></div>
                  ) : (
                    <Circle className="text-gray-300" size={20} />
                  )}
                </div>
                {idx !== steps.length - 1 && (
                  <div className={`w-0.5 h-10 ${step.done ? 'bg-[#0D9488]' : 'bg-gray-200'}`}></div>
                )}
              </div>
              <div className="pb-6 pt-0.5 flex-1 flex justify-between">
                <div>
                  <h5 className={`text-sm font-bold ${step.done || step.active ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</h5>
                  <p className="text-xs text-gray-500 mt-0.5">{step.sublabel}</p>
                </div>
                {step.time && <span className="text-xs font-medium text-gray-400">{step.time}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm mb-6">
        <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">تفاصيل الطلب</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">نوع الخدمة:</span>
            <span className="font-medium text-gray-800">{currentOrder?.typeLabel || 'مندوب'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">موقع الاستلام:</span>
            <span className="font-medium text-gray-800">{currentOrder?.pickupLocation || 'حي المعلمين'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">موقع التسليم:</span>
            <span className="font-medium text-gray-800">{currentOrder?.dropoffLocation || 'حي القاهرة'}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-dashed">
            <span className="text-gray-500 font-bold">المجموع:</span>
            <span className="font-bold text-[#0D9488]">{currentOrder?.total?.toLocaleString() || '4,500'} د.ع</span>
          </div>
        </div>
      </div>
    </div>
  );
}
