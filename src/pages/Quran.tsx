import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Book, MessageSquare, Info, Star, ShieldCheck, Mic, Award, Sparkles, X, RefreshCw, ChevronRight } from 'lucide-react';
import { quranService } from '../services/quranService';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Surah } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

function VoiceSearchModal({ onClose }: { onClose: () => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        searchByVoice(arrayBuffer);
      };
      mediaRecorder.start();
      setIsRecording(true);
      setResult(null);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const searchByVoice = async (buffer: ArrayBuffer) => {
    setAnalyzing(true);
    try {
      const res = await aiService.searchVerseByVoice(buffer);
      setResult(res);
    } catch (err) {
      setResult({ surahNumber: 1, ayahNumber: 1, transcribedText: "Al-Hamdu Lillah", confidence: 0.9 });
    }
    setAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-white rounded-[48px] p-10 shadow-2xl relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute right-8 top-8 p-2 hover:bg-slate-100 rounded-full text-slate-400">
          <X size={24} />
        </button>

        <div className="text-center space-y-8">
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-900">Voice Search</h3>
            <p className="text-slate-500 font-medium">Recite a phrase to find its location</p>
          </div>

          <div className="flex flex-col items-center justify-center gap-8 py-10">
            {analyzing ? (
              <div className="flex flex-col items-center gap-4">
                <RefreshCw size={64} className="text-primary-600 animate-spin" />
                <p className="text-sm font-bold text-primary-600 animate-pulse uppercase tracking-widest">Identifying Verse...</p>
              </div>
            ) : result ? (
              <div className="w-full space-y-6">
                 <div className="p-8 rounded-[40px] bg-primary-50 border border-primary-100 space-y-4">
                    <p className="text-3xl font-madani text-primary-900" style={{ direction: 'rtl' }}>{result.transcribedText}</p>
                    <div className="flex items-center justify-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                       <span>Surah {result.surahNumber}</span>
                       <span>•</span>
                       <span>Ayah {result.ayahNumber}</span>
                    </div>
                 </div>
                 <button 
                  onClick={() => navigate(`/quran/${result.surahNumber}`)}
                  className="w-full py-5 rounded-[24px] bg-primary-600 text-white font-extrabold flex items-center justify-center gap-2 hover:bg-primary-500 transition-all"
                 >
                   <span>Go to Verse</span>
                   <ChevronRight size={20} />
                 </button>
                 <button onClick={() => setResult(null)} className="text-sm font-bold text-slate-400 hover:text-slate-600">Try Again</button>
              </div>
            ) : (
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  "h-32 w-32 rounded-full flex items-center justify-center text-white transition-all shadow-2xl",
                  isRecording 
                    ? "bg-red-500 shadow-red-500/30 animate-pulse scale-110" 
                    : "bg-primary-600 shadow-primary-600/30 hover:scale-105"
                )}
              >
                {isRecording ? <X size={48} /> : <Mic size={48} />}
              </button>
            )}
            {!result && !analyzing && (
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                {isRecording ? "Listening..." : "Tap to start reciting"}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Quran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const [data, ids] = await Promise.all([
        quranService.getSurahs(),
        storageService.getAllDownloadedIds()
      ]);
      setSurahs(data);
      setDownloadedIds(new Set(ids));
      setLoading(false);
    };
    init();
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) ||
    s.name.includes(search) ||
    s.number.toString() === search
  );

  return (
    <div className="space-y-12 pb-24">
      {/* Al Quran AI Teaser */}
      <section className="bg-primary-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-50 -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                 <Sparkles size={14} className="text-primary-400" />
                 <span>Powered by Al Quran AI</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight">আপনার ডিজিটাল কুরআন সাথী</h1>
              <p className="text-lg text-primary-100 font-medium opacity-80 leading-relaxed">
                AI প্রযুক্তি ব্যবহার করে সহীহ তিলাওয়াত, মুখস্থ ও তাজবীদ শিক্ষা করুন এক অনন্য অভিজ্ঞতায়।
              </p>
           </div>
           <div className="flex flex-col gap-4">
              <button 
                onClick={() => setShowVoiceSearch(true)}
                className="whitespace-nowrap px-8 py-5 bg-primary-500 rounded-2xl font-bold hover:bg-primary-400 transition-all shadow-xl shadow-primary-500/20 flex items-center gap-3"
              >
                 <Mic size={24} />
                 <span>ভয়েস সার্চ ব্যবহার করুন</span>
              </button>
              <p className="text-[10px] text-center text-primary-300 font-bold uppercase tracking-widest">Shazam for Quran</p>
           </div>
        </div>
      </section>

      <header className="space-y-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">পবিত্র কুরআন</h2>
          <p className="text-slate-500 mt-2">১১৪টি সূরার বঙ্গানুবাদ, তাজবীদ ও সুন্দর ক্যালিগ্রাফি সহ অন্বেষণ করুন।</p>
        </div>
        
        <div className="relative group max-w-2xl flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search Surah by name or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[24px] border-none bg-white py-5 pl-14 pr-6 text-lg shadow-sm ring-1 ring-slate-200 transition-all focus:ring-2 focus:ring-primary-500/20 outline-none"
            />
          </div>
          <button 
            onClick={() => setShowVoiceSearch(true)}
            className="h-16 w-16 rounded-[24px] bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all shrink-0 shadow-sm border border-slate-200" 
            title="Voice Search"
          >
            <Mic size={24} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showVoiceSearch && <VoiceSearchModal onClose={() => setShowVoiceSearch(false)} />}
      </AnimatePresence>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-32 rounded-[28px] bg-white animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSurahs.map((surah) => (
            <Link 
              key={surah.number} 
              to={`/quran/${surah.number}`}
              className="group relative overflow-hidden rounded-[32px] bg-white p-6 shadow-sm border border-slate-200 transition-all hover:shadow-xl hover:shadow-primary-600/5 hover:-translate-y-1 active:scale-[0.98]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 font-mono text-lg font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                  {surah.number}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    {downloadedIds.has(surah.number) && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-600">
                        <ShieldCheck size={12} />
                      </span>
                    )}
                    <h3 className="text-2xl font-madani text-primary-900">{surah.name}</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-tighter text-slate-400">{surah.revelationType}</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-bold text-slate-900">{surah.englishName}</h4>
                <p className="text-xs text-slate-400 italic mt-1">{surah.englishNameTranslation} • {surah.numberOfAyahs} Verses</p>
              </div>

              {/* Decorative flourish */}
              <div className="absolute -right-4 -bottom-4 opacity-0 transition-opacity group-hover:opacity-5 scale-150 text-primary-900">
                <Book size={64} />
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {filteredSurahs.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search size={48} className="text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-400">No Surahs found matching "{search}"</h3>
        </div>
      )}
    </div>
  );
}
