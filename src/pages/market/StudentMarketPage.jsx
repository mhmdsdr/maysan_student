import React, { useState } from 'react';
import Header from '../../components/common/Header';
import BottomNav from '../../components/common/BottomNav';
import { useAppData } from '../../context/AppDataContext';
import { 
  Repeat, 
  PlusCircle, 
  MapPin, 
  Phone, 
  Sparkles, 
  Gift, 
  Search,
  CheckCircle2,
  X
} from 'lucide-react';

export default function StudentMarketPage() {
  const { usedMarket, addMarketItem } = useAppData();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [isFreeDonation, setIsFreeDonation] = useState(false);

  const filteredItems = usedMarket.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase()) || 
    i.studentName?.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreateItem(e) {
    e.preventDefault();
    if (!newTitle) return;

    const newItem = {
      id: 'UM-' + Date.now(),
      title: newTitle,
      studentName: 'حيدر عمار (هندسة نفط)',
      price: isFreeDonation ? 'مجاني لوجه الله 🎁' : `${Number(newPrice || 10000).toLocaleString()} د.ع`,
      priceLabel: isFreeDonation ? 'مجاني لوجه الله (وقف خيري) 🎁' : `${Number(newPrice || 10000).toLocaleString()} د.ع`,
      condition: newCondition || 'مستعمل بحالة جيدة',
      location: 'موقع 110 - العمارة',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      contactPhone: '07801234567'
    };

    addMarketItem(newItem);
    setShowAddModal(false);
    setNewTitle('');
    setNewPrice('');
    setNewCondition('');
  }

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-24 fade-in" dir="rtl">
      <Header title="سوق المستعمل والتبادل الطلابي" showBack={true} />

      <div className="px-4 pt-3 space-y-3.5">
        
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white shadow-md">
          <div className="flex items-center gap-1.5 mb-1 text-orange-200 text-xs font-bold">
            <Gift size={16} />
            <span>تبادل الملازم والأدوات بين دفعات ميسان</span>
          </div>
          <h2 className="text-base font-extrabold leading-snug">
            تبرع بملازمك القديمة أو اشترِ أدواتك بنصف السعر
          </h2>
          <p className="text-xs text-orange-100 mt-1">
            لا ترمِ مراجعك.. دع زملاء الدفعات الجديدة يستفيدون منها مجاناً أو بسعر رمزي.
          </p>
        </div>

        {/* Search & Add action */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن كتاب، ملزمة، أو أداة..." 
              className="w-full text-xs bg-white border border-slate-200 rounded-xl py-2.5 pr-8 pl-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 shadow-sm"
            />
            <Search size={14} className="absolute top-3.5 right-2.5 text-slate-400" />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-orange-500/20 active:scale-95 transition-all whitespace-nowrap"
          >
            <PlusCircle size={15} />
            <span>أضف إعلانك</span>
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm space-y-2.5"
            >
              <div className="flex gap-3">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-20 h-20 rounded-xl object-cover shadow-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md inline-block mb-1 ${
                    item.price === 0 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-orange-50 text-orange-700'
                  }`}>
                    {item.priceLabel}
                  </span>
                  
                  <h3 className="font-extrabold text-xs text-slate-900 leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span>الطالب: <b>{item.studentName}</b></span>
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>الحالة: {item.condition}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin size={10} /> {item.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">تواصل مباشر بدون عمولة</span>
                <button
                  onClick={() => alert(`الاتصال بالطالب: ${item.contactPhone}`)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                >
                  <Phone size={12} />
                  <span>تواصل مع صاحب الإعلان</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm space-y-3.5 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-sm text-slate-900">إضافة إعلان مستلزمات أو كتب</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم الكتاب أو الغرض:</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="مثال: مراجع علم الأدوية كاملة"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">الحالة والنظافة:</label>
                <input 
                  type="text" 
                  value={newCondition}
                  onChange={e => setNewCondition(e.target.value)}
                  placeholder="مثال: نظيفة جداً كورس واحد"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl text-emerald-800 font-bold">
                <input 
                  type="checkbox"
                  id="freeGift"
                  checked={isFreeDonation}
                  onChange={e => setIsFreeDonation(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <label htmlFor="freeGift" className="cursor-pointer">
                  أود التبرع به مجاناً (وقف خيري لزملائي) 🎁
                </label>
              </div>

              {!isFreeDonation && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">السعر المطلوب (د.ع):</label>
                  <input 
                    type="number" 
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    placeholder="مثال: 15000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 rounded-xl shadow-md transition-all mt-2"
              >
                نشر الإعلان فوراً 📢
              </button>
            </form>
          </div>
        </div>
      )}

      <BottomNav activeTab="home" />
    </div>
  );
}
