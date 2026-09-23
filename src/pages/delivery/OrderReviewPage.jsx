import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/common/Header';
import { MapPin, Clock, Package, ChevronLeft } from 'lucide-react';

export default function OrderReviewPage() {
  const navigate = useNavigate();
  const { deliveryForm, setCurrentOrder } = useApp();

  if (!deliveryForm) {
    return <div className="p-4 text-center">لا توجد بيانات للطلب</div>;
  }

  // Cost calculation
  const distance = 3.8;
  let baseFee = 3000;
  let kmFee = Math.round(distance * 600);
  let total = baseFee + kmFee;

  if (deliveryForm.type === 'naql') {
    baseFee = 15000;
    kmFee = 10000;
    total = baseFee + kmFee;
  } else if (deliveryForm.type === 'kai') {
    baseFee = 5000;
    kmFee = 0;
    total = 5000;
  }

  const handleConfirm = () => {
    const orderId = 'D-' + Date.now();
    setCurrentOrder({ ...deliveryForm, orderId, status: 'sent', total });
    navigate('/tracking/' + orderId);
  };

  return (
    <div className="bg-[#F0FDF9] min-h-screen page-container fade-in pb-10" dir="rtl">
      <Header title="مراجعة الطلب" showBack={true} />

      {/* Order Summary */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Package size={18} className="text-teal-600" /> تفاصيل طلبك
        </h3>
        <div className="space-y-1">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">نوع الطلب:</span>
            <span className="text-sm font-semibold text-gray-800">{deliveryForm.typeLabel}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">من:</span>
            <span className="text-sm font-semibold text-gray-800">{deliveryForm.pickupLocation}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">إلى:</span>
            <span className="text-sm font-semibold text-gray-800">{deliveryForm.dropoffLocation}</span>
          </div>
          {deliveryForm.loadType && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">نوع الحمولة:</span>
              <span className="text-sm font-semibold text-gray-800">{deliveryForm.loadType}</span>
            </div>
          )}
          {deliveryForm.loadSize && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">الحجم:</span>
              <span className="text-sm font-semibold text-gray-800">{deliveryForm.loadSize}</span>
            </div>
          )}
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">الملاحظات:</span>
            <span className="text-sm font-semibold text-gray-800">{deliveryForm.notes || 'لا يوجد'}</span>
          </div>
        </div>
      </div>

      {/* Estimates */}
      <div className="mx-4 mt-3 flex gap-3">
        <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm flex flex-col items-center">
          <MapPin size={20} className="text-teal-600 mb-1" />
          <span className="font-bold text-gray-800">3.8 كم</span>
          <span className="text-xs text-gray-500">المسافة</span>
        </div>
        <div className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm flex flex-col items-center">
          <Clock size={20} className="text-teal-600 mb-1" />
          <span className="font-bold text-gray-800">15-25 دقيقة</span>
          <span className="text-xs text-gray-500">الوقت</span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">تفاصيل التكلفة</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">أجرة البداية:</span>
            <span className="font-medium text-gray-800">{baseFee.toLocaleString()} د.ع</span>
          </div>
          {kmFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">سعر الكيلومتر:</span>
              <span className="font-medium text-gray-800">{kmFee.toLocaleString()} د.ع</span>
            </div>
          )}
          <div className="border-t border-dashed border-gray-200 my-2 pt-2 flex justify-between items-center">
            <span className="font-bold text-gray-800">المجموع التقريبي:</span>
            <span className="text-[#0D9488] text-xl font-black">{total.toLocaleString()} د.ع</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-3 text-center">* السعر النهائي يحدد حسب المسافة الفعلية</p>
      </div>

      {/* Actions */}
      <div className="px-4 mt-6">
        <button 
          onClick={handleConfirm}
          className="w-full bg-[#0D9488] text-white py-3.5 rounded-2xl font-bold text-base"
        >
          تأكيد الطلب ✈
        </button>
        <div 
          onClick={() => navigate(-1)}
          className="text-center text-red-500 text-sm font-medium cursor-pointer mt-4"
        >
          إلغاء
        </div>
      </div>
    </div>
  );
}
