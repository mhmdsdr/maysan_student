import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
import { Package, Clock, ChevronLeft, Star } from 'lucide-react';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'done'

  const mockOrders = [
    { id: 'D-001', type: 'مندوب', from: 'حي المعلمين', to: 'حي القاهرة', status: 'pending', statusLabel: 'بانتظار القبول', time: 'منذ 5 دقائق', total: 5400, category: 'delivery' },
    { id: 'S-002', type: 'صيانة تكييف', provider: 'فني تكييف محمد علي', status: 'accepted', statusLabel: 'تم القبول', time: 'منذ 20 دقيقة', total: 10000, category: 'service' },
    { id: 'F-003', type: 'طلب طعام', provider: 'مطعم السلطان', status: 'done', statusLabel: 'تم الإنجاز', time: 'أمس', total: 18000, category: 'food' },
    { id: 'D-004', type: 'نقل عفش', from: 'حي الأطباء', to: 'حي الجمعيات', status: 'done', statusLabel: 'تم الإنجاز', time: 'منذ يومين', total: 25000, category: 'delivery' },
  ];

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-teal-100 text-teal-700',
    onway: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
  };

  const activeOrders = mockOrders.filter(o => o.status !== 'done');
  const pastOrders = mockOrders.filter(o => o.status === 'done');

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
        {displayOrders.length > 0 ? (
          displayOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <div className="flex justify-between items-center mb-3">
                <div className="flex gap-2">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-bold uppercase tracking-wider">{order.id}</span>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${statusStyles[order.status]}`}>{order.statusLabel}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                  <Clock size={12} /> {order.time}
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-teal-600">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{order.type}</h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {order.provider ? order.provider : `من ${order.from} إلى ${order.to}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 block mb-0.5">المجموع</span>
                  <span className="text-[#0D9488] font-black">{order.total.toLocaleString()} د.ع</span>
                </div>
                {order.status !== 'done' ? (
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

              {order.status === 'done' && (
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
          ))
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
