import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

const OrderConfirmPage = () => {
  const navigate = useNavigate();
  const [orderNumber] = useState(() => Math.floor(Math.random() * 9000) + 1000);
  const [orderId] = useState(() => 'F-' + Date.now());

  return (
    <div className="bg-white min-h-screen page-container flex flex-col items-center pt-16">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-teal-100 rounded-full scale-150 animate-pulse"></div>
        <CheckCircle size={80} className="text-[#0D9488] relative z-10" />
      </div>

      <h2 className="text-2xl font-black text-center text-gray-800 mt-6 px-4">
        تم إرسال طلبك بنجاح! 🎉
      </h2>
      
      <p className="text-gray-500 text-center mt-2 px-4">
        رقم الطلب: #{orderNumber}
      </p>

      <p className="text-center text-gray-500 mt-2 px-4">
        سيتم التواصل معك قريباً لتأكيد الطلب
      </p>

      <div className="mx-6 mt-6 bg-gray-50 rounded-2xl p-4 w-[calc(100%-3rem)] max-w-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-xs">✓</div>
            <span className="text-sm font-semibold text-gray-800">تم إرسال الطلب</span>
          </div>
          <div className="w-0.5 h-4 bg-gray-300 mr-2.5 -mt-3 mb-1"></div>
          
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-yellow-400 text-white flex items-center justify-center text-xs">⏳</div>
            <span className="text-sm font-semibold text-gray-800">بانتظار القبول</span>
          </div>
          <div className="w-0.5 h-4 bg-gray-300 mr-2.5 -mt-3 mb-1"></div>
          
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white"></div>
            <span className="text-sm text-gray-500">تم القبول</span>
          </div>
          <div className="w-0.5 h-4 bg-gray-300 mr-2.5 -mt-3 mb-1"></div>
          
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white"></div>
            <span className="text-sm text-gray-500">في الطريق</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm font-semibold text-gray-700">
        ⏰ الوقت المتوقع: 30-45 دقيقة
      </div>

      <div className="mx-6 mt-6 space-y-3 w-[calc(100%-3rem)] max-w-sm mb-10">
        <button 
          onClick={() => navigate('/tracking/' + orderId)}
          className="w-full bg-[#0D9488] text-white py-3 rounded-xl font-bold transition-colors"
        >
          تتبع طلبك
        </button>
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold transition-colors"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmPage;
