import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { useCart } from '../../context/CartContext';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabaseClient';
import { sendTelegramOrderNotification } from '../../lib/telegramNotifier';
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

  const [deliveryMode, setDeliveryMode] = useState('delivery'); // 'delivery' or 'pickup'
  const [studentName, setStudentName] = useState(student?.name || '');
  const [studentPhone, setStudentPhone] = useState(student?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(student?.fromDistrict || '');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  const subtotal = getTotal();
  const isFreeDelivery = subtotal >= 15000;
  const deliveryFee = deliveryMode === 'pickup' ? 0 : (isFreeDelivery ? 0 : 2000);
  const grandTotal = subtotal + deliveryFee;

  async function handleCompleteOrder() {
    if (!studentPhone.trim()) {
      alert('يرجى إدخال رقم الهاتف للتواصل');
      return;
    }

    if (deliveryMode === 'delivery' && !deliveryAddress.trim()) {
      alert('يرجى تحديد مكان التسليم (باب الكلية أو العنوان)');
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
          delivery_type: deliveryMode === 'pickup' ? 'store_pickup' : 'direct_delivery',
          delivery_address: deliveryMode === 'pickup' ? 'استلام مباشر من المكتبة (0 د.ع)' : deliveryAddress,
          notes: deliveryNote,
          items: cart,
          subtotal: subtotal,
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
            college: student?.college || 'جامعات ميسان',
            stage: student?.stage || '',
            delivery_type: deliveryMode === 'pickup' ? 'store_pickup' : 'direct_delivery',
            delivery_address: deliveryMode === 'pickup' ? 'استلام مباشر من المكتبة (0 د.ع)' : deliveryAddress,
            notes: `${orderId} ${deliveryNote}`.trim(),
            items: cart,
            subtotal: subtotal,
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
        address: deliveryMode === 'pickup' ? 'استلام من المكتبة' : deliveryAddress,
        specs: `${cart.length} أصناف • إجمالي ${grandTotal.toLocaleString()} د.ع`,
        totalPrice: grandTotal,
        period: deliveryMode === 'pickup' ? 'جاهز للاستلام فور انتهاء الطباعة' : 'اليوم (توصيل مباشر خلال ساعتين)'
      });

      // Send Instant Telegram Notification to Admin / Shop
      sendTelegramOrderNotification({
        id: orderId,
        student_name: studentName,
        phone: studentPhone,
        college: student?.college || 'جامعات ميسان',
        stage: student?.stage || '',
        delivery_address: deliveryMode === 'pickup' ? 'استلام مباشر من المكتبة (0 د.ع)' : deliveryAddress,
        delivery_mode: deliveryMode === 'pickup' ? 'استلام من المكتبة 🏬' : (isFreeDelivery ? 'توصيل لباب الكلية (مجاني 🎉)' : 'توصيل مباشر 🛵'),
        notes: deliveryNote,
        items: cart,
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        total_price: grandTotal,
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

            {/* Delivery Option & Free Delivery Incentive */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-700 block">طريقة استلام الملازم:</span>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('delivery')}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    deliveryMode === 'delivery'
                      ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold flex items-center gap-1.5">
                      <span>🛵</span> توصيل مباشر
                    </span>
                    {deliveryMode === 'delivery' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block">لباب كليتك أو بيتك</span>
                  <span className={`text-[11px] font-black mt-2 block ${isFreeDelivery ? 'text-emerald-700' : 'text-slate-800'}`}>
                    {isFreeDelivery ? 'مجاناً 🎉' : '2,000 د.ع'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMode('pickup')}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    deliveryMode === 'pickup'
                      ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold flex items-center gap-1.5">
                      <span>🏬</span> استلام من المكتبة
                    </span>
                    {deliveryMode === 'pickup' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block">استلمها فور جهوزيتها</span>
                  <span className="text-[11px] font-black text-emerald-700 mt-2 block">
                    0 د.ع (مجاناً ✨)
                  </span>
                </button>
              </div>

              {/* Free delivery banner */}
              {deliveryMode === 'delivery' && (
                isFreeDelivery ? (
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-bold animate-in fade-in">
                    <span className="text-base">🎉</span>
                    <span>مبروك! حصلت على توصيل مجاني لأن طلبك 15,000 د.ع أو أكثر.</span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-[11px] text-amber-900 font-bold">
                    <span>💡 أضف ملازم بقيمة {(15000 - subtotal).toLocaleString()} د.ع واحصل على توصيل مجاني!</span>
                    <button 
                      type="button" 
                      onClick={() => navigate('/materials')} 
                      className="text-amber-800 underline text-[10px] font-black hover:text-amber-950"
                    >
                      إضافة المزيد
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Direct Delivery Address & Contact Section */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 border-b border-slate-100 pb-2">
                <MapPin size={16} className="text-emerald-600" />
                <span>
                  {deliveryMode === 'pickup' ? 'بيانات الطالب لاستلام الملازم من المكتبة:' : 'بيانات الطالب ومكان تسليم الملازم (توصيل مباشر):'}
                </span>
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
              
              {deliveryMode === 'delivery' ? (
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
              ) : (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 font-medium flex items-center gap-2">
                  <span className="text-base">🏬</span>
                  <span><strong>نقطة الاستلام:</strong> مكتبة طلاب ميسان (سيتم إشعارك عبر واتساب وتليغرام فور انتهاء الطباعة لتستلم طلبك).</span>
                </div>
              )}

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">ملاحظات الطباعة والتسليم:</label>
                <input 
                  type="text" 
                  value={deliveryNote} 
                  onChange={e => setDeliveryNote(e.target.value)} 
                  placeholder="مثال: يرجى التغليف بسلك أسود أو الاتصال عند الجاهزية"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 font-medium">
                • يتم حفظ الطلب مباشرة وإشعار الإدارة والمكتبة فوراً لتجهيز الملازم.
              </div>
            </div>

            {/* Total summary */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>مجموع الملازم والقرطاسية:</span>
                <span className="font-bold">{subtotal.toLocaleString()} د.ع</span>
              </div>
              <div className="flex justify-between text-slate-600 items-center">
                <span>
                  {deliveryMode === 'pickup' ? 'طريقة الاستلام (من المكتبة):' : 'أجرة التوصيل المباشر:'}
                </span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-700 font-black' : ''}`}>
                  {deliveryFee === 0 ? (deliveryMode === 'pickup' ? 'مجاناً (0 د.ع)' : 'مجاناً 🎉 (طلبك فوق 15 ألف)') : `${deliveryFee.toLocaleString()} د.ع`}
                </span>
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
