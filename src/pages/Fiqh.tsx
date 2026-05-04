import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, Search, Send, Sparkles, ChevronRight, Info, BookCheck } from 'lucide-react';
import { aiService } from '../services/aiService';
import { cn } from '../lib/utils';

const CATEGORIES = [
  { id: 'tahara', title: 'Tahara', desc: 'Purification, Wudu, Ghusl', icon: '💧' },
  { id: 'salah', title: 'Salah', desc: 'Prayer times, methods, rulings', icon: '🕌' },
  { id: 'sawm', title: 'Sawm', desc: 'Fasting in Ramadan and beyond', icon: '🌙' },
  { id: 'zakat', title: 'Zakat', desc: 'Obligatory charity and calculation', icon: '💰' },
  { id: 'hajj', title: 'Hajj', desc: 'Pilgrimage rites and requirements', icon: '🕋' },
  { id: 'nikah', title: 'Nikah', desc: 'Marriage and family life', icon: '💍' },
];

export default function FiqhPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse('');
    try {
      const prompt = `You are an expert Islamic Fiqh consultant. Provide clear, authenticated rulings based on major schools of jurisprudence (Hanafi, Shafi'i, Maliki, Hanbali). If there is a difference of opinion, mention it. Always include a disclaimer that complex personal matters should be referred to a local qualified scholar. Question: ${query}`;
      const res = await aiService.askAI(prompt);
      setResponse(res);
    } catch (error) {
      console.error(error);
      setResponse("Sorry, I couldn't process your inquiry at this moment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4">
      {/* Header */}
      <header className="space-y-6 pt-8 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
           <Scale size={14} />
           <span>Fiqh & Jurisprudence</span>
        </div>
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Understanding Deen</h1>
           <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">Practical guidance on Islamic law and daily practices from authentic traditional sources.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Categories Sidebar */}
        <div className="md:col-span-4 space-y-6">
           <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <BookCheck size={16} className="text-indigo-600" />
                Categories
              </h3>
              <div className="space-y-2">
                 {CATEGORIES.map((cat) => (
                   <button
                     key={cat.id}
                     onClick={() => setSelectedCategory(cat.id)}
                     className={cn(
                       "w-full flex items-center gap-4 p-4 rounded-2xl transition-all border text-left",
                       selectedCategory === cat.id
                        ? "bg-indigo-50 border-indigo-200 shadow-sm"
                        : "bg-slate-50 border-transparent hover:bg-slate-100"
                     )}
                   >
                     <span className="text-2xl">{cat.icon}</span>
                     <div>
                        <h4 className="font-bold text-slate-900 text-sm">{cat.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold leading-tight">{cat.desc}</p>
                     </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-amber-50 rounded-3xl p-5 border border-amber-100 space-y-3">
              <div className="flex items-center gap-2 text-amber-700">
                 <Info size={16} />
                 <span className="text-xs font-bold uppercase">Scholarly Advice</span>
              </div>
              <p className="text-xs text-amber-800 font-bold leading-relaxed mb-1 font-bengali">
                এআই সাধারণ তথ্য প্রদান করলেও, জীবন-পরিবর্তনকারী সিদ্ধান্ত বা ফতোয়ার জন্য আপনার স্থানীয় ইমাম বা যোগ্য আলেমদের সাথে সরাসরি যোগাযোগ করা উচিত।
              </p>
              <p className="text-[10px] text-amber-700/70 font-medium leading-relaxed italic">
                While AI provides general info, specific life-altering rulings (Fatwas) must be sought from personal interaction with your local Imam or qualified scholars.
              </p>
           </div>
        </div>

        {/* AI QA Section */}
        <div className="md:col-span-8 space-y-6">
           <section className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                       <Sparkles size={20} />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold">Ask AI Mufti</h3>
                       <p className="text-slate-400 text-xs font-medium">Get immediate answers based on classic Fiqh texts</p>
                    </div>
                 </div>

                 <form onSubmit={handleAsk} className="relative">
                    <input 
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. What is the ruling on fasting while traveling?"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all pr-14"
                    />
                    <button 
                      type="submit"
                      disabled={loading}
                      className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-all shadow-lg"
                    >
                       <Send size={18} />
                    </button>
                 </form>

                 {loading || response ? (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-slate-800/40 rounded-3xl p-8 border border-white/5 space-y-6"
                   >
                     {loading ? (
                       <div className="flex flex-col items-center justify-center py-12 gap-4">
                          <div className="flex gap-1">
                             <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                             <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                             <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consulting Texts...</p>
                       </div>
                     ) : (
                       <div className="space-y-4 prose prose-invert max-w-none">
                          <div className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
                             <Scale size={12} />
                             AI Verdict
                          </div>
                          <div className="text-slate-200 font-medium leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                             {response}
                          </div>
                       </div>
                     )}
                   </motion.div>
                 ) : (
                   <div className="p-12 text-center space-y-4">
                      <div className="h-16 w-16 bg-slate-800/50 text-slate-600 rounded-full flex items-center justify-center mx-auto">
                         <Scale size={32} />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">Type your question above to receive a research-backed response.</p>
                   </div>
                 )}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-32 -mb-32" />
           </section>

           {selectedCategory && (
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white border border-indigo-100 rounded-[40px] p-10 shadow-xl shadow-indigo-500/5"
             >
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-2xl font-black text-slate-900">
                     {CATEGORIES.find(c => c.id === selectedCategory)?.title}
                   </h3>
                   <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                      <ChevronRight className="rotate-90" size={20} />
                   </button>
                </div>
                <div className="space-y-6">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-slate-600 font-medium leading-relaxed italic">
                        Detailed guide for {CATEGORIES.find(c => c.id === selectedCategory)?.title} is coming soon. Use the AI Mufti for specific questions in the meantime.
                      </p>
                   </div>
                </div>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
