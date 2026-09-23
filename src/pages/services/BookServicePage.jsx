import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import providers from '../../data/providers'
import { Camera, MapPin, ChevronLeft, Check } from 'lucide-react'

const BookServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const provider = providers.find(p => p.id === id);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceDetails, setServiceDetails] = useState({ size: '', type: '', notes: '' });
  const [location, setLocation] = useState('');

  if (!provider) return <div className="p-8 text-center">مزود خدمة غير موجود</div>;

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else navigate('/tracking/S-' + Date.now());
  };

  return (
    <div className="bg-[#F0FDF9] min-h-screen page-container fade-in pb-20">
      <Header title="طلب خدمة" showBack={true} />

      <div className="px-6 mt-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
          
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex flex-col items-center relative bg-[#F0FDF9] px-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                s < step ? 'bg-[#0D9488] text-white' : 
                s === step ? 'bg-[#0D9488] text-white ring-4 ring-teal-100' : 
                'bg-gray-200 text-gray-400'
              }`}>
                {s < step ? <Check size={16} /> : s}
              </div>
            </div>
          ))}
          <div 
            className="absolute top-1/2 right-0 h-0.5 bg-[#0D9488] -z-10 -translate-y-1/2 transition-all duration-300"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-semibold px-1">
          <span>الخدمة</span>
          <span>التفاصيل</span>
          <span>الموقع</span>
          <span>تأكيد</span>
        </div>
      </div>

      <div className="mx-4 mt-6 bg-white rounded-2xl p-3 flex gap-3 items-center shadow-sm border border-teal-50">
        <img src={provider.image} alt={provider.name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="font-bold text-sm text-gray-900">مقدم الخدمة: {provider.name}</h4>
          <span className="text-xs text-[#0D9488] font-semibold">{provider.category}</span>
        </div>
      </div>

      {step === 1 && (
        <div className="px-4 mt-6 animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-4">اختر نوع الخدمة المطلوبة</h3>
          <div className="space-y-3">
            {(provider.services || []).map((service, index) => (
              <div 
                key={index}
                onClick={() => setSelectedService(service)}
                className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between ${
                  selectedService?.name === service.name 
                    ? 'border-[#0D9488] bg-teal-50' 
                    : 'border-gray-100 bg-white'
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-gray-800">{service.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{service.description || 'خدمة احترافية'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#0D9488] font-bold text-sm">{(service.price || 0).toLocaleString()} د.ع</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedService?.name === service.name ? 'border-[#0D9488] bg-[#0D9488]' : 'border-gray-300'
                  }`}>
                    {selectedService?.name === service.name && <Check size={12} className="text-white" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleNext}
            disabled={!selectedService}
            className={`w-full py-3.5 rounded-xl font-bold mt-8 transition-colors ${
              selectedService ? 'bg-[#0D9488] text-white shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            التالي
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="px-4 mt-6 animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-4">تفاصيل الطلب</h3>
          
          <div className="mb-5">
            <label className="block text-sm font-bold text-gray-700 mb-2">حجم الوحدة</label>
            <div className="flex gap-2">
              {['صغير', 'متوسط', 'كبير'].map(size => (
                <button
                  key={size}
                  onClick={() => setServiceDetails({...serviceDetails, size})}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    serviceDetails.size === size ? 'bg-[#0D9488] text-white' : 'bg-white border border-gray-200 text-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-gray-700 mb-2">نوع العمل</label>
            <div className="flex gap-2">
              {provider.category === 'ac' ? (
                <>
                  <button onClick={() => setServiceDetails({...serviceDetails, type: 'علوي'})} className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${serviceDetails.type === 'علوي' ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]' : 'border-gray-200 bg-white text-gray-600'}`}>علوي</button>
                  <button onClick={() => setServiceDetails({...serviceDetails, type: 'أرضي'})} className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${serviceDetails.type === 'أرضي' ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]' : 'border-gray-200 bg-white text-gray-600'}`}>أرضي</button>
                </>
              ) : provider.category === 'tanks' ? (
                <>
                  <button onClick={() => setServiceDetails({...serviceDetails, type: 'خزان علوي'})} className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${serviceDetails.type === 'خزان علوي' ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]' : 'border-gray-200 bg-white text-gray-600'}`}>خزان علوي</button>
                  <button onClick={() => setServiceDetails({...serviceDetails, type: 'خزان أرضي'})} className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${serviceDetails.type === 'خزان أرضي' ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]' : 'border-gray-200 bg-white text-gray-600'}`}>خزان أرضي</button>
                </>
              ) : (
                <>
                  <button onClick={() => setServiceDetails({...serviceDetails, type: 'بسيط'})} className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${serviceDetails.type === 'بسيط' ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]' : 'border-gray-200 bg-white text-gray-600'}`}>بسيط</button>
                  <button onClick={() => setServiceDetails({...serviceDetails, type: 'معقد'})} className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${serviceDetails.type === 'معقد' ? 'border-[#0D9488] bg-teal-50 text-[#0D9488]' : 'border-gray-200 bg-white text-gray-600'}`}>معقد</button>
                </>
              )}
            </div>
          </div>

          <div className="mb-5">
            <textarea 
              placeholder="ملاحظات إضافية..." 
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0D9488] outline-none resize-none"
              value={serviceDetails.notes}
              onChange={(e) => setServiceDetails({...serviceDetails, notes: e.target.value})}
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <Camera className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-600">إضافة صورة (اختياري)</span>
          </div>

          <button 
            onClick={handleNext}
            className="w-full bg-[#0D9488] text-white py-3.5 rounded-xl font-bold mt-8 shadow-md"
          >
            التالي
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="px-4 mt-6 animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-4">الموقع</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">عنوانك</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="أدخل عنوانك بالتفصيل..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-sm focus:ring-2 focus:ring-[#0D9488] outline-none"
              />
              <MapPin className="absolute right-3 top-3.5 text-[#0D9488]" size={18} />
            </div>
          </div>

          <div className="h-48 rounded-2xl bg-gray-100 relative flex flex-col items-center justify-center border border-gray-200 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cartographer.png")'}}></div>
            <MapPin size={32} className="text-[#0D9488] relative z-10 mb-2" />
            <span className="text-xs font-semibold text-gray-600 relative z-10 bg-white/80 px-2 py-1 rounded">موقعك على الخريطة</span>
            <span className="text-[10px] text-gray-500 absolute bottom-2">سيتم تكامل الخريطة في النسخة الكاملة</span>
          </div>

          <button 
            onClick={handleNext}
            disabled={!location.trim()}
            className={`w-full py-3.5 rounded-xl font-bold mt-8 transition-colors ${
              location.trim() ? 'bg-[#0D9488] text-white shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            التالي
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="px-4 mt-6 animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-4">مراجعة تفاصيل طلبك</h3>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
            <div className="flex justify-between items-start border-b border-gray-50 pb-2">
              <span className="text-gray-500 text-sm">الخدمة:</span>
              <span className="font-semibold text-sm text-left">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between items-start border-b border-gray-50 pb-2">
              <span className="text-gray-500 text-sm">السعر:</span>
              <span className="font-semibold text-sm text-[#0D9488]">{(selectedService?.price || 0).toLocaleString()} د.ع</span>
            </div>
            {serviceDetails.size && (
              <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                <span className="text-gray-500 text-sm">الحجم:</span>
                <span className="font-semibold text-sm">{serviceDetails.size}</span>
              </div>
            )}
            {serviceDetails.type && (
              <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                <span className="text-gray-500 text-sm">النوع:</span>
                <span className="font-semibold text-sm">{serviceDetails.type}</span>
              </div>
            )}
            <div className="flex justify-between items-start border-b border-gray-50 pb-2">
              <span className="text-gray-500 text-sm">الموقع:</span>
              <span className="font-semibold text-sm text-left max-w-[200px] break-words">{location}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-500 text-sm">الملاحظات:</span>
              <span className="font-semibold text-sm text-left">{serviceDetails.notes || 'لا يوجد'}</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm font-semibold mb-1">التكلفة التقديرية:</p>
            <p className="text-2xl font-black text-[#0D9488]">{(selectedService?.price || 0).toLocaleString()} د.ع</p>
          </div>

          <button 
            onClick={handleNext}
            className="w-full bg-[#0D9488] text-white py-3.5 rounded-xl font-bold mt-6 shadow-md flex justify-center items-center gap-2"
          >
            <span>إرسال الطلب ✈</span>
          </button>
          
          <p className="text-center text-[10px] text-gray-500 mt-3 font-semibold">
            سيتم إشعارك عند قبول مقدم الخدمة لطلبك
          </p>
        </div>
      )}
    </div>
  );
};

export default BookServicePage;
