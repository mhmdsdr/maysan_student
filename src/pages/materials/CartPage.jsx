import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabaseClient';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  Phone,
  User,
  Loader2
} from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeItem, updateQuantity, clearCart, getTotal } = useCart();
  const { student, addBooking } = useApp();

  const [studentName, setStudentName] = useState(student?.name || '');
  const [studentPhone, setStudentPhone] = useState(student?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(student?.fromDistrict || '');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  const deliveryFee = 2000;
  const grandTotal = getTotal() + deliveryFee;

  async function handleCompleteOrder() {
    if (!studentPhone.trim() || !deliveryAddress.trim()) {
      alert('يرجى إدخال رقم الهاتف وعنوان التسليم');
      return;
    }

    const printWithoutFile = cart.filter(item => item.id?.startsWith('PRINT-') && !item.fileUrl);
    if (printWithoutFile.length > 0) {
      alert('أحد طلبات الطباعة بدون ملف مرفوع. ارجع لصفحة اطبع ملفك وارفع PDF أو Word.');
      return;
    }

    setIsSubmitting(true);
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    try {
      const { error } = await supabase.from('orders').insert([
        {
          id: orderId,
          student_name: studentName,
          phone: studentPhone,
          college: student?.college || 'جامعة ميسان',
          stage: student?.stage || 'المرحلة الثالثة',
          delivery_type: 'direct_delivery',
          delivery_address: deliveryAddress,
          notes: deliveryNote,
          items: cart,
          subtotal: getTotal(),
          delivery_fee: deliveryFee,
          total_price: grandTotal,
          status: 'قيد الطباعة والتجهيز 🖨️'
        }
      ]);

      if (error) {
        const uuidRetry = crypto.randomUUID ? crypto.randomUUID() : orderId + '-retry';
        const retry = await supabase.from('orders').insert([
          {
            id: uuidRetry,
            student_name: studentName,
            phone: studentPhone,
            college: student?.college || 'جامعة ميسان',
            stage: student?.stage || 'المرحلة الثالثة',
            delivery_type: 'direct_delivery',
            delivery_address: deliveryAddress,
            notes: `${orderId} ${deliveryNote}`.trim(),
            items: cart,
            subtotal: getTotal(),
            delivery_fee: deliveryFee,
            total_price: grandTotal,
            status: 'قيد الطباعة والتجهيز 🖨️'
          }
        ]);
        if (retry.error) {
          console.error('Supabase insert error:', error, retry.error);
          alert('ما انحفظ الطلب بالسحابة: ' + (retry.error.message || error.message || 'حاول مرة ثانية'));
          setIsSubmitting(false);
          return;
        }
      }

      addBooking({
        id: orderId,
        type: 'materials',
        title: `طلب استنساخ وملازم (${cart.length} أصناف)`,
        status: 'قيد الطباعة والتجهيز 🖨️',
        address: deliveryAddress,
        specs: `${cart.length} أصناف • إجمالي ${grandTotal.toLocaleString()} د.ع`,
        totalPrice: grandTotal,
        period: 'اليوم (توصيل مباشر خلال ساعتين)'
      });

      setConfirmedOrderId(orderId);
      clearCart();
      setOrderCompleted(true);
    } catch (err) {
      console.error('Error saving order to Supabase:', err);
      alert('تعذر إرسال الطلب. تحقق من الإنترنت ثم أعد المحاولة.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header title="سلة الملازم والمشتريات" showBack={true} showCart={false} />

      <div className="px-4 pt-3 space-y-4">
        
        {orderCompleted ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-100 shadow-sm space-y-4 my-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-black">
              ✓
            </div>
            <h2 className="text-lg font-black text-slate-900">تم إرسال طلبك للطباعة بنجاح! 🎉</h2>
            <div className="bg-slate-100 border border-slate-200 py-1 px-3 rounded-xl inline-block text-xs font-mono font-bold text-slate-700">
              رقم الطلب في السحابة: {confirmedOrderId}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              جاري تجهيز وتغليف طلبك. سيصلك إشعار بالواتساب عند وصول الملازم إلى: <b className="text-slate-800">{deliveryAddress}</b>.
            </p>
            
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
              >
                متابعة حالة الطلب في حسابي
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-xl text-xs font-bold"
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm space-y-3 my-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800">سلتك فارغة حالياً</h3>
            <p className="text-xs text-slate-400">لم تضف أي ملازم أو طلبات طباعة أو أدوات قرطاسية بعد.</p>
            <button
              onClick={() => navigate('/materials')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm mt-2"
            >
              تصفح الملازم والاستنساخ
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-700">الأصناف المطلوبة ({cart.length}):</h3>
              {cart.map(item => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 p-3 shadow-sm flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0 pr-1">
                    <h4 className="font-extrabold text-xs text-slate-900 leading-snug line-clamp-1">
                      {item.name}
                    </h4>
                    {item.details && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.details}</p>
                    )}
                    {item.fileName && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-0.5">الملف: {item.fileName}</p>
                    )}
                    <span className="text-xs font-black text-emerald-700 block mt-1">
                      {(item.price * item.quantity).toLocaleString()} د.ع
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 text-slate-400 hover:text-rose-600 flex items-center justify-center"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Delivery Address & Contact Section */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 border-b border-slate-100 pb-2">
                <MapPin size={16} className="text-emerald-600" />
                <span>بيانات الطالب ومكان تسليم الملازم (توصيل مباشر):</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 font-bold block mb-1">
                    اسم الطالب الثلاثي:
                  </label>
                  <input 
                    type="text" 
                    value={studentName} 
                    onChange={e => setStudentName(e.target.value)} 
                    placeholder="الاسم الثلاثي"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-emerald-600 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 font-bold block mb-1">
                    رقم الهاتف / الواتساب:
                  </label>
                  <input 
                    type="tel" 
                    value={studentPhone} 
                    onChange={e => setStudentPhone(e.target.value)} 
                    placeholder="077XXXXXXXX"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-emerald-600 font-semibold dir-ltr text-right"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[11px] text-slate-500 font-bold block mb-1">
                  حدد مكان التسليم في ميسان (باب كليتك أو عنوانك):
                </label>
                <input 
                  type="text" 
                  value={deliveryAddress} 
                  onChange={e => setDeliveryAddress(e.target.value)} 
                  placeholder="مثال: باب كلية الهندسة - موقع 110، أو حي المعلمين"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-emerald-600 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">ملاحظات الطباعة والتسليم:</label>
                <input 
                  type="text" 
                  value={deliveryNote} 
                  onChange={e => setDeliveryNote(e.target.value)} 
                  placeholder="مثال: يرجى التغليف بسلك أسود والاتصال عند الوصول"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 font-medium">
                • يتم حفظ الطلب مباشرة في قاعدة البيانات وتجهيز الملازم وتوصيلها خلال ساعتين.
              </div>
            </div>

            {/* Total summary */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>مجموع الملازم والقرطاسية:</span>
                <span className="font-bold">{getTotal().toLocaleString()} د.ع</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>أجرة التوصيل المباشر (لباب الكلية / العنوان):</span>
                <span className="font-bold">{deliveryFee.toLocaleString()} د.ع</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="font-black text-slate-900">المجموع النهائي:</span>
                <span className="font-black text-emerald-700 text-base">{grandTotal.toLocaleString()} د.ع</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleCompleteOrder}
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-2xl text-xs font-black shadow-lg transition-all ${
                isSubmitting 
                  ? 'bg-slate-400 text-white cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  جاري تسجيل الطلب بقاعدة البيانات...
                </span>
              ) : (
                'تأكيد وإرسال الطلب للطباعة ✈'
              )}
            </button>
          </>
        )}

      </div>
    </div>
  );
}
