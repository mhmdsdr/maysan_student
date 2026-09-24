import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
import { Package, Clock, ChevronLeft, Star, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { student } = useApp();
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'done'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student?.phone) return;

    async function fetchMyOrders() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('phone', student.phone)
          .neq('delivery_type', 'student_profile')
          .neq('status', 'student_profile')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyOrders();
  }, [student?.phone]);

  const statusStyles = {
    'قيد الطباعة والتجهيز 🖨️': 'bg-yellow-100 text-yellow-700',
    'تم الإنجاز': 'bg-green-100 text-green-700',
    'قيد المعالجة': 'bg-blue-100 text-blue-700',
  };

  const isDone = (status) => status?.includes('تم') || status?.includes('مكتمل') || status?.includes('انجاز');

  const activeOrders = orders.filter(o => !isDone(o.status));
  const pastOrders = orders.filter(o => isDone(o.status));

  const displayOrders = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <div className="bg-[#F0FDF9] min-h-screen page-container fade-in pb-20" dir="rtl">
      <Header title="طلباتي" showNotification={true} />

      {/* Tabs */}
      <div className="sticky top-[60px] bg-white border-b border-gray-100 z-10 flex text-center">
        <div 
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-3.5 text-sm cursor-pointer transition-colors ${activeTab === 'active' ? 'border-b-2 border-[#0D9488] text-[#0D9488] font-bold' : 'text-gray-400 font-medium'}`}
        >
          الجارية
        </div>
        <div 
          onClick={() => setActiveTab('done')}
          className={`flex-1 py-3.5 text-sm cursor-pointer transition-colors ${activeTab === 'done' ? 'border-b-2 border-[#0D9488] text-[#0D9488] font-bold' : 'text-gray-400 font-medium'}`}
        >
          المكتملة
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 size={36} className="text-[#0D9488] animate-spin mb-4" />
            <p className="text-sm font-bold text-gray-500">جاري تحميل الطلبات...</p>
          </div>
        ) : displayOrders.length > 0 ? (
          displayOrders.map(order => {
            const isOrderDone = isDone(order.status);
            return (
            <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <div className="flex justify-between items-center mb-3">
                <div className="flex gap-2">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-bold uppercase tracking-wider">{String(order.id).slice(-6)}</span>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>{order.status || 'قيد المعالجة'}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                  <Clock size={12} /> 
                  <span dir="ltr">{new Date(order.created_at).toLocaleDateString('en-GB')} {new Date(order.created_at).toLocaleTimeString('ar-IQ', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-teal-600 shrink-0">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {order.delivery_type === 'direct_delivery' ? 'طلب طباعة وملازم' : 
                     order.delivery_type === 'mandoob' ? 'طلب مندوب' :
                     order.delivery_type === 'kai' ? 'طلب غسيل وكي' :
                     order.delivery_type === 'stota' ? 'ستوتة نقل' :
                     order.delivery_type === 'naql' ? 'نقل عفش' : 'طلب'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    التوصيل إلى: {order.delivery_address || order.college || 'غير محدد'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">المجموع</span>
                  <span className="text-[#0D9488] font-black">{(order.total_price || 0).toLocaleString()} د.ع</span>
                </div>
                {!isOrderDone ? (
                  <button 
                    onClick={() => navigate('/tracking/' + order.id)}
                    className="text-sm font-bold border border-[#0D9488] text-[#0D9488] px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-teal-50 transition-colors"
                  >
                    تتبع الطلب <ChevronLeft size={16} />
                  </button>
                ) : (
                  <button className="text-sm font-bold border border-gray-300 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                    إعادة الطلب
                  </button>
                )}
              </div>

              {isOrderDone && (
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">قيّم الخدمة</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={16} className="text-gray-300 cursor-pointer hover:text-yellow-400 transition-colors" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )})
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-4 opacity-50">📦</div>
            <h3 className="text-gray-500 font-bold mb-1">لا توجد طلبات</h3>
            <p className="text-sm text-gray-400">قائمة الطلبات {activeTab === 'active' ? 'الجارية' : 'المكتملة'} فارغة حالياً</p>
          </div>
        )}
      </div>

      <BottomNav activeTab="orders" />
    </div>
  );
}
