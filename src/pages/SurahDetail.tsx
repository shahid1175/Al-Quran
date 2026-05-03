import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Play, Pause, Bookmark, Info, Settings, Languages, Type, MessageSquare, GraduationCap, Download, CheckCircle, Trash2, RefreshCw, BookOpen, EyeOff, Eye, X, Search, Mic, Square, Share2, Sliders, Volume2 } from 'lucide-react';
import { quranService } from '../services/quranService';
import { aiService } from '../services/aiService';
import { Ayah } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/storageService';
import { parseTajweed, TAJWEED_RULES, TajweedRule } from '../lib/tajweed';

function TajweedRuleModal({ rule, onClose }: { rule: TajweedRule, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
      >
        <div className={cn("absolute top-0 right-0 h-32 w-32 blur-3xl opacity-20 rounded-full -mr-16 -mt-16", rule.color)} />
        <button onClick={onClose} className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 z-10 transition-colors">
          <X size={24} />
        </button>
        
        <div className="relative z-10 space-y-6">
          <div className={cn("h-16 w-16 rounded-[24px] flex items-center justify-center text-white shadow-lg", rule.color)}>
            <BookOpen size={32} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">{rule.label}</h3>
            <p className="text-lg text-primary-600 font-bold">{rule.description}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">ব্যাখ্যা (Explanation)</h4>
            <p className="text-slate-700 leading-relaxed font-medium">{rule.explanation}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-3xl border border-white/10 group">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">উদাহরণ (Example)</h4>
            <p className="text-4xl font-serif text-right text-white" style={{ direction: 'rtl' }}>{rule.example}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SurahDetail() {
  const { id } = useParams();
  const { profile, updatePoints } = useAuth();
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [translations, setTranslations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [showTranslation, setShowTranslation] = useState(true);
  const [tajweedMode, setTajweedMode] = useState(false);
  const [memorizeMode, setMemorizeMode] = useState(false);
  const [verseSearch, setVerseSearch] = useState("");
  const [revealedVerses, setRevealedVerses] = useState<number[]>([]);
  const [activeRule, setActiveRule] = useState<TajweedRule | null>(null);
  const [recordingAyahId, setRecordingAyahId] = useState<number | null>(null);
  const [analyzingAyahId, setAnalyzingAyahId] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [tafsirSearch, setTafsirSearch] = useState("");
  const [reciter, setReciter] = useState('ar.alafasy');
  const [playSpeed, setPlaySpeed] = useState(1);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startPractice = async (ayah: Ayah) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        analyzePractice(arrayBuffer, ayah);
      };
      mediaRecorder.start();
      setRecordingAyahId(ayah.number);
    } catch (err) {
      console.error(err);
    }
  };

  const stopPractice = () => {
    mediaRecorderRef.current?.stop();
    setRecordingAyahId(null);
  };

  const analyzePractice = async (buffer: ArrayBuffer, ayah: Ayah) => {
    setAnalyzingAyahId(ayah.number);
    try {
      const res = await aiService.analyzeRecitation(buffer, ayah.text);
      if (res.score > 75) {
        setRevealedVerses(prev => [...prev, ayah.numberInSurah]);
        updatePoints(50);
      }
    } catch (err) {
      // Mock for demo
      setRevealedVerses(prev => [...prev, ayah.numberInSurah]);
      updatePoints(30);
    }
    setAnalyzingAyahId(null);
  };
  const [font, setFont] = useState<'madani' | 'indopak'>('madani');
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [tafsir, setTafsir] = useState<string | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        quranService.getSurah(parseInt(id)),
        quranService.getTranslation(1, parseInt(id)),
        quranService.isDownloaded(parseInt(id))
      ]).then(([a, t, d]) => {
        setAyahs(a);
        setTranslations(t);
        setIsDownloaded(d);
        setLoading(false);
      });
    }
  }, [id]);

  const handleDownload = async () => {
    if (!id || downloading) return;
    setDownloading(true);
    try {
      if (isDownloaded) {
        await storageService.deleteSurah(parseInt(id));
        setIsDownloaded(false);
      } else {
        await quranService.downloadSurah(parseInt(id));
        setIsDownloaded(true);
      }
    } catch (error) {
      console.error('Download action failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  const toggleAudio = (ayah: Ayah) => {
    if (playingId === ayah.number) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = ayah.audio;
        audioRef.current.play();
        setPlayingId(ayah.number);
      }
    }
  };

  const handleAudioEnded = () => {
    setPlayingId(null);
    updatePoints(10); // Reward for listening to a verse
  };

  const handleShare = async (ayah: Ayah) => {
    const text = `${ayah.text}\n\nSearch result for Surah ${id}, Ayah ${ayah.numberInSurah}\n\nShared via Al Quran AI`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Al Quran - Surah ${id}:${ayah.numberInSurah}`,
          text: text,
          url: window.location.href
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Text copied to clipboard!');
    }
  };

  const showTafsir = async (ayah: Ayah) => {
    setSelectedAyah(ayah);
    const t = await quranService.getTafsir(parseInt(id!), ayah.numberInSurah);
    setTafsir(t);
  };

  const filteredAyahs = ayahs.filter(ayah => {
    if (!verseSearch) return true;
    const num = parseInt(verseSearch);
    if (!isNaN(num)) return ayah.numberInSurah === num;
    const searchLower = verseSearch.toLowerCase();
    const ayahIdx = ayahs.indexOf(ayah);
    return ayah.text.includes(verseSearch) || translations[ayahIdx]?.text.toLowerCase().includes(searchLower);
  });

  const getSurahSize = () => {
    if (!ayahs.length) return "0 MB";
    // Mock size based on average audio/text size per Ayah
    const size = (ayahs.length * 0.15).toFixed(1);
    return `${size} MB`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded} 
        onError={() => {
          setPlayingId(null);
          console.error("Audio playback error");
        }}
        hidden 
      />

      <header className="flex items-center justify-between sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md py-4 -mx-4 lg:-mx-10 px-8 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Link to="/quran" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
               Surah {id}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bismillahir Rahmanir Rahim</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center bg-slate-100 rounded-xl px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
               <Search size={16} className="text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search verse..." 
                 value={verseSearch}
                 onChange={(e) => setVerseSearch(e.target.value)}
                 className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-32 placeholder:text-slate-400"
               />
            </div>
            <button 
              onClick={() => setMemorizeMode(!memorizeMode)}
              className={cn(
                "p-2.5 rounded-xl transition-all flex items-center gap-2", 
                memorizeMode ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-400 hover:bg-slate-200"
              )}
              title="Toggle Memorization Mode"
            >
              {memorizeMode ? <Eye size={20} /> : <EyeOff size={20} />}
              <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Hifz</span>
            </button>
            <button 
              onClick={() => setTajweedMode(!tajweedMode)}
              className={cn(
                "p-2.5 rounded-xl transition-all flex items-center gap-2", 
                tajweedMode ? "bg-orange-50 text-orange-600 shadow-sm" : "text-slate-400 hover:bg-slate-200"
              )}
              title="Toggle Tajweed Highlights"
            >
              <div className="flex -space-x-1">
                 <div className="w-2 h-2 rounded-full bg-orange-400" />
                 <div className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Tajweed</span>
            </button>
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className={cn(
                "p-2.5 rounded-xl transition-all flex items-center justify-center",
                isDownloaded 
                  ? "bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-600" 
                  : "text-slate-400 hover:bg-slate-200"
              )}
              title={isDownloaded ? "Remove from offline" : "Download for offline"}
            >
              {downloading ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : isDownloaded ? (
                <CheckCircle size={20} className="group-hover:hidden" />
              ) : (
                <Download size={20} />
              )}
            </button>
            <button 
              onClick={() => setShowTranslation(!showTranslation)}
              className={cn("p-2.5 rounded-xl transition-all", showTranslation ? "bg-primary-50 text-primary-700 shadow-sm" : "text-slate-400 hover:bg-slate-200")}
            >
              <Languages size={20} />
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-xl hover:bg-slate-200 text-slate-500 transition-all"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={() => setFont(font === 'madani' ? 'indopak' : 'madani')}
              className="p-2.5 rounded-xl hover:bg-slate-200 text-slate-500 transition-all flex items-center gap-2"
            >
              <Type size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{font === 'madani' ? 'Madani' : 'IndoPak'}</span>
            </button>
        </div>
      </header>

      {loading ? (
        <div className="space-y-8 py-12">
          {[...Array(5)].map((_, i) => (
             <div key={i} className="space-y-4">
                <div className="h-4 w-1/4 bg-slate-100 rounded animate-pulse" />
                <div className="h-20 w-full bg-white rounded-[32px] animate-pulse border border-slate-200" />
             </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {filteredAyahs.map((ayah) => {
            const idx = ayahs.indexOf(ayah);
            const isRevealed = revealedVerses.includes(ayah.numberInSurah);
            return (
              <motion.div 
                 key={ayah.number}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="group p-8 lg:p-12 rounded-[48px] bg-white border border-slate-200 transition-all hover:border-primary-200 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-10">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 group-hover:bg-primary-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                    {ayah.numberInSurah}
                  </span>
                  <div className="flex items-center gap-1">
                     <button 
                      onClick={() => toggleAudio(ayah)}
                      className="p-3.5 hover:bg-primary-50 text-primary-600 rounded-2xl transition-all active:scale-90"
                     >
                       {playingId === ayah.number ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                     </button>
                     <button className="p-3.5 hover:bg-orange-50 text-orange-400 rounded-2xl transition-all">
                       <Bookmark size={20} />
                     </button>
                     <button 
                      onClick={() => showTafsir(ayah)}
                      className="p-3.5 hover:bg-blue-50 text-blue-500 rounded-2xl transition-all"
                     >
                       <Info size={20} />
                     </button>
                     <button 
                      onClick={() => handleShare(ayah)}
                      className="p-3.5 hover:bg-slate-50 text-slate-400 rounded-2xl transition-all"
                     >
                       <Share2 size={20} />
                     </button>
                  </div>
                </div>

                <div 
                  className="space-y-10"
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.dataset.rule) {
                      const ruleName = target.dataset.rule;
                      const rule = TAJWEED_RULES.find(r => r.label === ruleName || ruleName.startsWith(r.label));
                      if (rule) setActiveRule(rule);
                    } else if (memorizeMode && !isRevealed) {
                      setRevealedVerses(prev => [...prev, ayah.numberInSurah]);
                    }
                  }}
                >
                  <p className={cn(
                    "text-right leading-[4.5rem] text-slate-900 font-serif transition-all",
                    font === 'madani' ? "text-4xl" : "text-3xl",
                    memorizeMode && !isRevealed && "blur-2xl hover:blur-none transition-[filter] duration-700 cursor-help select-none"
                  )} 
                  style={{ direction: 'rtl', fontSize: `32px` }}
                  dangerouslySetInnerHTML={{ __html: tajweedMode && ayah.tajweed ? parseTajweed(ayah.tajweed) : ayah.text }}
                  />
                  
                  {memorizeMode && !isRevealed && (
                    <div className="flex justify-center pt-4">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           recordingAyahId === ayah.number ? stopPractice() : startPractice(ayah);
                         }}
                         className={cn(
                           "flex items-center gap-3 px-8 py-4 rounded-3xl font-bold transition-all shadow-lg",
                           recordingAyahId === ayah.number 
                             ? "bg-red-500 text-white shadow-red-500/20 animate-pulse" 
                             : "bg-primary-900 text-white shadow-primary-900/10 hover:bg-primary-800"
                         )}
                       >
                         {analyzingAyahId === ayah.number ? (
                           <RefreshCw size={20} className="animate-spin" />
                         ) : recordingAyahId === ayah.number ? (
                           <Square size={20} fill="currentColor" />
                         ) : (
                           <Mic size={20} />
                         )}
                         <span>{analyzingAyahId === ayah.number ? 'অনুসন্ধান করা হচ্ছে...' : recordingAyahId === ayah.number ? 'থামুন (Stop)' : 'পড়ে শোনান (Recite to Reveal)'}</span>
                       </button>
                    </div>
                  )}
                  
                  {memorizeMode && isRevealed && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setRevealedVerses(prev => prev.filter(n => n !== ayah.numberInSurah));
                      }}
                      className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors"
                    >
                      Hide again
                    </button>
                  )}
                  
                  {showTranslation && translations[idx] && (
                    <div className="space-y-3 border-t border-slate-50 pt-8">
                       <p className="text-xl text-slate-900 leading-relaxed font-bangla font-medium">
                         {translations[idx].text}
                       </p>
                       <p className="text-sm text-slate-400 italic">
                          "English meaning: Indeed, we belong to Allah, and indeed we will return."
                       </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Tafsir Modal */}
      <AnimatePresence>
        {selectedAyah && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary-950/20 backdrop-blur-sm sm:items-center sm:p-4">
             <motion.div 
               initial={{ y: "100%", opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: "100%", opacity: 0 }}
               className="w-full max-w-2xl rounded-t-[48px] bg-white p-10 sm:rounded-[48px] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]"
             >
                <div className="flex items-center justify-between mb-8">
                   <div className="flex-1">
                     <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explanation</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Surah {id} • Ayah {selectedAyah.numberInSurah}</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="relative group/search">
                         <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input 
                           placeholder="Search Tafsir..." 
                           value={tafsirSearch}
                           onChange={(e) => setTafsirSearch(e.target.value)}
                           className="pl-8 pr-4 py-2 bg-slate-100 rounded-full text-xs border-none focus:ring-1 focus:ring-primary-500 w-32 sm:w-48"
                         />
                      </div>
                      <button onClick={() => setSelectedAyah(null)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400">
                        <X size={20} />
                      </button>
                   </div>
                </div>
                
                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                   <div className="p-8 rounded-[32px] bg-primary-50 border border-primary-100/50">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-700 mb-6 flex items-center justify-between">
                        <span className="flex items-center gap-2"><MessageSquare size={12} /> Tafhim-ul-Quran (Bangla)</span>
                        {tafsirSearch && <span className="text-[8px] bg-primary-500 text-white px-2 py-0.5 rounded-full">Filtering results</span>}
                      </p>
                      <div 
                        className="text-primary-950 leading-relaxed text-lg font-medium font-bangla whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ 
                          __html: (tafsir || "").replace(
                            new RegExp(tafsirSearch, "gi"), 
                            match => match ? `<mark class="bg-yellow-200 text-slate-900">${match}</mark>` : ""
                          ) || "Loading explanation..." 
                        }}
                      />
                   </div>

                   {/* Tajweed Rules Section */}
                   <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                          <BookOpen size={12} /> Tajweed Guide
                        </p>
                        <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">Learning Aid</span>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                           {TAJWEED_RULES.map(rule => (
                             <div key={rule.label} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100">
                                <div className={cn("w-3 h-3 rounded-full shrink-0", rule.color)} />
                                <div>
                                   <p className="text-[10px] font-bold text-slate-900">{rule.label}</p>
                                   <p className="text-[8px] text-slate-400 truncate w-24">{rule.description}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                        <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                           <p 
                             className="text-right leading-loose text-3xl font-serif text-slate-900" 
                             style={{ direction: 'rtl' }}
                             dangerouslySetInnerHTML={{ __html: parseTajweed(selectedAyah.tajweed || selectedAyah.text) }}
                           />
                           <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                                Tap on highlighted words for deep rule explanation
                              </p>
                           </div>
                        </div>
                      </div>
                   </div>

                   <Link 
                     to="/learn" 
                     className="flex items-center justify-between p-8 rounded-[32px] bg-primary-900 text-white group shadow-xl shadow-primary-900/20 hover:scale-[1.02] transition-transform"
                   >
                     <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary-200">
                          <GraduationCap size={24} />
                       </div>
                       <div>
                         <p className="font-bold text-lg">Practice with AI Feedback</p>
                         <p className="text-xs text-primary-300 font-medium">Master the makharij of this verse</p>
                       </div>
                     </div>
                     <ChevronLeft className="rotate-180 group-hover:translate-x-1 transition-transform text-white/50" />
                   </Link>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl space-y-8"
            >
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-slate-900">Audio Settings</h3>
                 <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                   <X size={20} />
                 </button>
              </div>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Recitation Speed</p>
                    <div className="flex items-center gap-4">
                       <Sliders size={20} className="text-primary-600" />
                       <input 
                         type="range" min="0.5" max="2" step="0.25" 
                         value={playSpeed} 
                         onChange={(e) => {
                           const s = parseFloat(e.target.value);
                           setPlaySpeed(s);
                           if (audioRef.current) audioRef.current.playbackRate = s;
                         }}
                         className="flex-1 accent-primary-600"
                       />
                       <span className="text-sm font-black w-8">{playSpeed}x</span>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Reciter</p>
                    <div className="grid gap-2">
                       {[
                         { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
                         { id: 'ar.abdulsamad', name: 'Abdul Basit Murattal' },
                         { id: 'ar.minshawi', name: 'Mohamed Siddiq al-Minshawi' }
                       ].map(r => (
                         <button 
                           key={r.id}
                           onClick={() => setReciter(r.id)}
                           className={cn(
                             "w-full p-4 rounded-2xl flex items-center justify-between border transition-all",
                             reciter === r.id ? "bg-primary-50 border-primary-200 text-primary-900 shadow-sm" : "border-slate-100 hover:bg-slate-50 text-slate-500"
                           )}
                         >
                            <span className="font-bold text-sm">{r.name}</span>
                            {reciter === r.id && <Volume2 size={16} />}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Storage Details</p>
                       <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase", isDownloaded ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-500")}>
                         {isDownloaded ? "Offline" : "Online Only"}
                       </span>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Download size={18} className="text-slate-400" />
                          <span className="text-xl font-bold">{getSurahSize()}</span>
                       </div>
                       {isDownloaded && (
                         <button 
                           onClick={handleDownload}
                           className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
                         >
                            <Trash2 size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Clear Data</span>
                         </button>
                       )}
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full py-5 rounded-[24px] bg-primary-900 text-white font-extrabold text-lg shadow-xl shadow-primary-900/20"
              >
                Apply Changes
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tajweed Explanation Modal */}
      <AnimatePresence>
        {activeRule && (
          <TajweedRuleModal rule={activeRule} onClose={() => setActiveRule(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Footer or end of file
