import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/common/Header';
import { MapPin, Camera, ChevronLeft } from 'lucide-react';

export default function DeliveryFormPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { setDeliveryForm } = useApp();

  const typeLabels = { mandoob: 'مندوب', kai: 'كي', stota: 'ستوتة', naql: 'نقل عفش' };
  const typeLabel = typeLabels[type] || 'طلب';

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [requestType, setRequestType] = useState('');
  const [loadType, setLoadType] = useState('');
  const [loadSize, setLoadSize] = useState('متوسط');
  const [notes, setNotes] = useState('');

  const mandoobOptions = ['توصيل وإيصال علاج', 'شراء مشتريات', 'توصيل وإيصال أغراض', 'استلام طلب', 'أخرى'];
  const kaiOptions = ['ملابس رسمية', 'ملابس يومية', 'مفروشات', 'أبايات'];
  const stotaLoadTypes = ['أغراض عامة', 'أثاث منزلي', 'أجهزة كهربائية', 'مشتريات', 'مواد بناء', 'أخرى'];
  const naqlLoadTypes = ['عفش منزلي', 'أحمال كبيرة', 'نقل مكاتب', 'مواد بناء', 'أخرى'];
  const sizes = ['صغير', 'متوسط', 'كبير'];

  const handleNext = () => {
    setDeliveryForm({ type, typeLabel, pickupLocation, dropoffLocation, requestType, loadType, loadSize, notes });
    navigate('/delivery-review');
  };

  const isFormValid = pickupLocation.trim() !== '' && dropoffLocation.trim() !== '';

  return (
    <div className="bg-[#F0FDF9] min-h-screen page-container fade-in pb-10" dir="rtl">
      <Header title={'طلب ' + typeLabel} showBack={true} />
      
      <div className="px-4 mt-4 space-y-4">
        {/* Pickup Location */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
            <span className="text-red-500">📍</span> موقع الاستلام (من)
          </label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="حي المعلمين - العمارة"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-teal-500"
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button className="text-xs text-gray-500 mt-2 hover:text-teal-600 font-medium">تحديد على الخريطة</button>
        </div>

        {/* Dropoff Location */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
            <span className="text-blue-500">📍</span> موقع التسليم (إلى)
          </label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="وجهتك - العمارة"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-teal-500"
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button className="text-xs text-gray-500 mt-2 hover:text-teal-600 font-medium">تحديد على الخريطة</button>
        </div>

        {/* Conditional Content */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {type === 'mandoob' && (
            <>
              <label className="text-sm font-bold text-gray-800 mb-3 block">نوع الطلب</label>
              <div className="space-y-2">
                {mandoobOptions.map((opt) => (
                  <div 
                    key={opt}
                    onClick={() => setRequestType(opt)}
                    className={`border rounded-xl p-3 cursor-pointer text-sm font-medium transition-colors ${requestType === opt ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-gray-200 text-gray-600'}`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </>
          )}

          {type === 'kai' && (
            <>
              <label className="text-sm font-bold text-gray-800 mb-3 block">نوع الملابس</label>
              <div className="grid grid-cols-2 gap-3">
                {kaiOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      onChange={(e) => {
                        const newTypes = e.target.checked 
                          ? (requestType ? requestType + ', ' + opt : opt)
                          : requestType.split(', ').filter(t => t !== opt).join(', ');
                        setRequestType(newTypes);
                      }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </>
          )}

          {(type === 'stota' || type === 'naql') && (
            <>
              <label className="text-sm font-bold text-gray-800 mb-3 block">نوع الحمولة</label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {(type === 'stota' ? stotaLoadTypes : naqlLoadTypes).map((opt) => (
                  <div 
                    key={opt}
                    onClick={() => setLoadType(opt)}
                    className={`text-center border rounded-xl p-2 text-xs font-medium cursor-pointer transition-colors ${loadType === opt ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-gray-200 text-gray-600'}`}
                  >
                    {opt}
                  </div>
                ))}
              </div>

              <label className="text-sm font-bold text-gray-800 mb-3 block">حجم الحمولة</label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <div 
                    key={size}
                    onClick={() => setLoadSize(size)}
                    className={`flex-1 text-center border rounded-xl p-2 text-sm font-medium cursor-pointer transition-colors ${loadSize === size ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-gray-200 text-gray-600'}`}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="text-sm font-bold text-gray-800 mb-2 block">ملاحظات إضافية</label>
          <textarea 
            rows="3" 
            placeholder="ملاحظات إضافية (اختياري)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-teal-500 resize-none"
          ></textarea>
        </div>

        {/* Photo Attachment */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-dashed border-gray-300 flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-gray-50">
          <Camera className="text-gray-400 mb-2" size={24} />
          <span className="text-sm text-gray-500 font-medium">إضافة صورة (اختياري)</span>
        </div>

        {/* Cost Preview */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 mt-2">
          <p className="text-xs text-teal-800 font-medium text-center leading-relaxed">
            {type === 'mandoob' && 'المسافة التقديرية: 2-5 كم | الوقت: 15-25 دقيقة | الأجرة: 3,000-5,000 د.ع'}
            {type === 'kai' && 'السعر الثابت: 1,000 د.ع للقطعة + توصيل'}
            {type === 'stota' && 'المسافة: 1-3 كم | الوقت: 10-20 دقيقة | الأجرة: 2,000-4,000 د.ع'}
            {type === 'naql' && 'المسافة: متغيرة | الوقت: 1-3 ساعات | الأجرة: 15,000-50,000 د.ع'}
          </p>
        </div>

        <button 
          onClick={handleNext}
          disabled={!isFormValid}
          className={`w-full mt-4 mb-6 py-3.5 rounded-2xl font-bold text-base transition-colors ${isFormValid ? 'bg-[#0D9488] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          التالي &larr;
        </button>
      </div>
    </div>
  );
}
