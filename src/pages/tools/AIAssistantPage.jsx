import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import BottomNav from '../../components/common/BottomNav';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Trash2, 
  Printer, 
  BookOpen, 
  FileText, 
  HelpCircle,
  Languages,
  PenTool,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AIAssistantPage() {
  const navigate = useNavigate();
  const { student } = useApp();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `أهلاً بك يا ${student?.name ? student.name.split(' ')[0] : 'زميلي الطالب'} في المساعد الأكاديمي الذكي لطلاب جامعات ميسان! 🎓\n\nأنا هنا لمساعدتك في:\n• تلخيص المحاضرات والفقرات الصعبة.\n• ترجمة المصطلحات الطبية والهندسية بدقة.\n• صياغة أفكار التقارير وبحوث التخرج.\n• شرح وتوضيح الأسئلة الامتحانية.\n\nكيف أستطيع مساعدتك اليوم؟`,
      time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const quickPrompts = [
    { label: '📝 تلخيص نص أو ملزمة', prompt: 'لخص لي هذا النص بأسلوب نقاط واضحة ومبسطة للحفظ: ' },
    { label: '🌐 ترجمة مصطلحات أكاديمية', prompt: 'ترجم واشرح لي هذه المصطلحات الأكاديمية بدقة: ' },
    { label: '💡 اقتراح مواضيع بحوث', prompt: `اقترح لي 5 أفكار لبحوث أو تقارير جامعية في تخصص ${student?.college || 'الجامعة'}: ` },
    { label: '✍️ إعادة صياغة أكاديمية', prompt: 'أعد صياغة هذه الفقرة بأسلوب لغوي رصين وأكاديمي: ' },
    { label: '❓ شرح مسألة أو تعريف', prompt: 'اشرح لي هذا المفهوم وكيف يأتي عليه سؤال امتحاني: ' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend(textToSend) {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const systemInstruction = `أنت المساعد الأكاديمي الذكي لمنصة "طلاب ميسان". 
اسم الطالب: ${student?.name || 'طالب ميسان'}.
كليته: ${student?.college || 'جامعات ميسان'} (${student?.department || ''}).
مهمتك: مساعدة الطلاب بأسلوب أكاديمي دقيق ومبسط، وتنسيق الإجابة بنقاط وجداول وعناوين واضحة تناسب الدراسة والامتحانات والتقارير الجامعية. استخدم اللغة العربية بأسلوب راقٍ.`;

      const history = messages.slice(-4).map(m => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text
      }));

      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemInstruction },
            ...history,
            { role: 'user', content: query }
          ],
          model: 'openai'
        })
      });

      if (!res.ok) throw new Error('فشل استجابة المساعد');
      const aiReply = await res.text();

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'عذراً، حدث انقطاع في الاتصال بالسيرفر. يرجى إعادة المحاولة أو التحقق من الإنترنت.',
          time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text, id) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleClearChat() {
    if (window.confirm('هل تريد مسح المحادثة والبدء من جديد؟')) {
      setMessages([
        {
          id: Date.now(),
          sender: 'ai',
          text: 'تم بدء محادثة جديدة! اكتب سؤالك أو الصق ملزمتك وسأساعدك فوراً 🎓',
          time: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen page-container pb-28 flex flex-col justify-between fade-in" dir="rtl">
      {/* Top Header */}
      <div>
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)} 
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              ←
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles size={18} />
              </div>
              <div>
                <h1 className="text-xs font-black text-slate-900 leading-tight">المساعد الأكاديمي الذكي (AI)</h1>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> متصل ومستعد للمساعدة
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleClearChat}
            className="text-slate-400 hover:text-rose-500 p-2 rounded-lg transition-colors"
            title="مسح المحادثة"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 pt-3 overflow-x-auto hide-scrollbar flex gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(p.prompt);
              }}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-purple-500 hover:bg-purple-50 text-[11px] font-bold shadow-2xs transition-all active:scale-95"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="p-4 space-y-4">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div 
                key={m.id} 
                className={`flex gap-2.5 ${isAi ? 'items-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed ${
                  isAi 
                    ? 'bg-white border border-slate-100 text-slate-800' 
                    : 'bg-blue-600 text-white rounded-br-none'
                }`}>
                  <div className="whitespace-pre-wrap font-medium">{m.text}</div>
                  
                  <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                    isAi ? 'border-slate-100 text-slate-400' : 'border-blue-500/50 text-blue-100'
                  }`}>
                    <span>{m.time}</span>
                    {isAi && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(m.text, m.id)}
                          className="hover:text-purple-600 flex items-center gap-0.5 font-bold transition-colors"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check size={12} className="text-emerald-600" />
                              <span className="text-emerald-600">تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>نسخ</span>
                            </>
                          )}
                        </button>

                        <button 
                          onClick={() => navigate('/materials')}
                          className="hover:text-emerald-600 flex items-center gap-0.5 font-bold transition-colors"
                          title="طباعة كملزمة"
                        >
                          <Printer size={12} />
                          <span>طباعة</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-1">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm text-xs text-purple-700 font-bold flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-purple-600" />
                <span>المساعد الجامعي يفكر ويصيغ الإجابة...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[440px] px-3 z-40 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent pt-3 pb-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="bg-white rounded-2xl border border-slate-200 shadow-lg p-1.5 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل، الصق فقرة، أو اطلب تلخيصاً..."
            className="flex-1 text-xs p-2.5 bg-transparent focus:outline-none text-slate-800 font-medium placeholder:text-slate-400"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/25 disabled:opacity-40 transition-transform active:scale-95 shrink-0"
          >
            <Send size={16} className="rotate-180" />
          </button>
        </form>
      </div>

      <BottomNav activeTab="home" />
    </div>
  );
}
