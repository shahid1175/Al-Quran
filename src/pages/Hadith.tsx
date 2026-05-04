import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, BookOpen, Star, RefreshCw, ChevronRight, Bookmark, ChevronUp, ChevronDown } from 'lucide-react';
import { hadithService, EDITIONS } from '../services/hadithService';
import { Hadith } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function HadithPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [selectedBook, setSelectedBook] = useState(EDITIONS[0].slug);
  const [hadithNumber, setHadithNumber] = useState('1');
  const [isSaving, setIsSaving] = useState(false);

  const fetchHadith = async (num?: string) => {
    setLoading(true);
    const targetNum = num || hadithNumber;
    const result = await hadithService.getHadith(selectedBook, parseInt(targetNum));
    if (result) {
      setHadith(result);
    }
    setLoading(false);
  };

  const fetchRandom = async () => {
    setLoading(true);
    const result = await hadithService.getRandomHadith();
    setHadith(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchHadith();
  }, []);

  const handleSave = async () => {
    if (!user || !hadith) return;
    setIsSaving(true);
    try {
      await hadithService.saveToFavorites(user.uid, hadith);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 px-4">
      {/* Header */}
      <header className="space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
           <BookOpen size={14} />
           <span>Hadith Library</span>
        </div>
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Prophetic Wisdom</h1>
           <p className="text-slate-500 font-medium text-lg leading-relaxed">Browse and search authenticated sayings of Prophet Muhammad (ﷺ).</p>
        </div>
      </header>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Select Collection</label>
          <div className="space-y-2">
            {EDITIONS.map((e) => (
              <button
                key={e.slug}
                onClick={() => setSelectedBook(e.slug)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all border group",
                  selectedBook === e.slug 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                    : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    selectedBook === e.slug ? "bg-emerald-500 animate-pulse" : "bg-slate-300 group-hover:bg-indigo-400"
                  )} />
                  <span>{e.name}</span>
                </div>
                {selectedBook === e.slug && <ChevronRight size={16} className="text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <div className="bg-white p-2 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-2">
             <div className="flex-1 bg-slate-50 rounded-[28px] p-4 flex items-center gap-4">
                <div className="flex-1">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-1">Hadith Number</label>
                   <input 
                     type="number" 
                     value={hadithNumber}
                     onChange={(e) => setHadithNumber(e.target.value)}
                     className="w-full bg-transparent text-2xl font-black text-slate-900 focus:outline-none placeholder:text-slate-200"
                     placeholder="123"
                   />
                </div>
                <div className="flex flex-col gap-1">
                   <button 
                     onClick={() => {
                       const next = (parseInt(hadithNumber) + 1).toString();
                       setHadithNumber(next);
                       fetchHadith(next);
                     }}
                     className="p-2 bg-white text-emerald-600 rounded-lg shadow-sm border border-slate-100 hover:bg-emerald-50 transition-colors"
                   >
                     <ChevronUp size={16} />
                   </button>
                   <button 
                     onClick={() => {
                       const prev = Math.max(1, parseInt(hadithNumber) - 1).toString();
                       setHadithNumber(prev);
                       fetchHadith(prev);
                     }}
                     className="p-2 bg-white text-rose-600 rounded-lg shadow-sm border border-slate-100 hover:bg-rose-50 transition-colors"
                   >
                     <ChevronDown size={16} />
                   </button>
                </div>
             </div>
             <div className="flex gap-2 pr-2">
                <button 
                  onClick={() => fetchHadith()}
                  className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200 hover:scale-105 transition-all flex-shrink-0"
                >
                   <Search size={22} />
                </button>
                <button 
                  onClick={fetchRandom}
                  className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 hover:scale-105 transition-all flex-shrink-0"
                >
                   <RefreshCw size={22} className={loading ? "animate-spin" : ""} />
                </button>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-sm relative min-h-[400px]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                 <RefreshCw size={32} className="text-emerald-500 animate-spin" />
              </div>
            ) : hadith ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {selectedBook === 'eng-muslim' && parseInt(hadithNumber) <= 92 && (
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-[10px] font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen size={14} />
                    <span>Prophetic Introduction (Hadiths 1-92 are introductory in this collection)</span>
                  </div>
                )}

                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{hadith.book}</span>
                      <h3 className="text-lg font-black text-slate-900">Hadith No. {hadith.hadithNumber}</h3>
                   </div>
                   <button 
                     onClick={handleSave}
                     className={cn(
                       "p-3 rounded-2xl border transition-all",
                       isSaving 
                         ? "bg-emerald-50 border-emerald-200 text-emerald-600 animate-pulse" 
                         : "bg-slate-50 border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                     )}
                   >
                     <Star size={20} fill={isSaving ? "currentColor" : "none"} />
                   </button>
                </div>

                {(!hadith.text && !hadith.textBn && !hadith.textAr) ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                       <RefreshCw size={32} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-500 font-bold">Hadith Content Not Available</p>
                      <p className="text-slate-400 text-sm max-w-xs mx-auto">This hadith might be part of an introduction or not translated in this data source.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                     {hadith.textAr && (
                       <p className="text-4xl font-bold text-slate-900 leading-[1.8] text-right font-arabic" dir="rtl">
                         {hadith.textAr}
                       </p>
                     )}

                     <div className="space-y-8">
                        {hadith.textBn && (
                          <div className="p-10 bg-emerald-50/50 rounded-[40px] border border-emerald-100">
                            <div className="flex items-center justify-between mb-6">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">বাংলা অনুবাদ</h4>
                              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase font-bengali">ইসলামিক ফাউন্ডেশন</span>
                            </div>
                            <p className="text-xl font-bold text-slate-800 leading-relaxed font-bengali">
                              {hadith.textBn}
                            </p>
                          </div>
                        )}

                       {hadith.text && (
                         <div className="pt-6">
                            <h4 className="text-[10px] font-black text-slate-300 mb-4 uppercase tracking-widest">English Translation</h4>
                            <p className="text-2xl font-bold text-slate-700 leading-relaxed italic">
                              "{hadith.text}"
                            </p>
                         </div>
                       )}
                     </div>
                     
                     <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{hadith.reference}</p>
                        <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Hadith No. {hadith.hadithNumber}</span>
                     </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center p-12">
                 <div className="space-y-4">
                    <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                       <Search size={32} />
                    </div>
                    <p className="text-slate-400 font-bold">Search for a hadith number to get started</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
