import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Play, Pause, Bookmark, Info, Settings, Languages, Type, MessageSquare, GraduationCap, Download, CheckCircle, Trash2, RefreshCw, BookOpen, EyeOff, Eye, X, Search, Mic, Square, Share2, Sliders, Volume2, Save, Sparkles, Hash, Columns } from 'lucide-react';
import { quranService } from '../services/quranService';
import { aiService } from '../services/aiService';
import { bookmarkService } from '../services/bookmarkService';
import { Ayah } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/storageService';
import { parseTajweed, TAJWEED_RULES, TajweedRule } from '../lib/tajweed';

import TajweedRuleModal from '../components/TajweedRuleModal';
import TajweedColorSheet from '../components/TajweedColorSheet';

export default function SurahDetail() {
  const { id } = useParams();
  const { user, profile, updatePoints } = useAuth();
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [translations, setTranslations] = useState<any[]>([]);
  const [translationsEn, setTranslationsEn] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  
  const [showTranslation, setShowTranslation] = useState(true);
  const [wordByWordMode, setWordByWordMode] = useState(false);
  const [tajweedMode, setTajweedMode] = useState(false);
  const [memorizeMode, setMemorizeMode] = useState(false);
  const [verseSearch, setVerseSearch] = useState("");
  const [revealedVerses, setRevealedVerses] = useState<number[]>([]);
  const [activeRule, setActiveRule] = useState<TajweedRule | null>(null);
  const [recordingAyahId, setRecordingAyahId] = useState<number | null>(null);
  const [analyzingAyahId, setAnalyzingAyahId] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [jumpVerse, setJumpVerse] = useState("");
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkingAyah, setBookmarkingAyah] = useState<Ayah | null>(null);
  const [bookmarkNote, setBookmarkNote] = useState("");
  const [tafsirSearch, setTafsirSearch] = useState("");
  const [tafsirLanguage, setTafsirLanguage] = useState<'bn' | 'en'>('bn');
  const [searchHighlightedId, setSearchHighlightedId] = useState<number | null>(null);
  const [reciter, setReciter] = useState('ar.alafasy');
  const [playSpeed, setPlaySpeed] = useState(1);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [activeWord, setActiveWord] = useState<{ word: any; ayahId: number } | null>(null);

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
  const [font, setFont] = useState<'madani' | 'asia-noorani'>('madani');
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [tafsir, setTafsir] = useState<string | null>(null);
  const [isAiExplaining, setIsAiExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        quranService.getSurah(parseInt(id), reciter, font),
        quranService.getTranslation(parseInt(id), 'bn'),
        quranService.getTranslation(parseInt(id), 'en'),
        quranService.isDownloaded(parseInt(id)),
        quranService.getWords(parseInt(id), font)
      ]).then(([a, tBn, tEn, d, w]) => {
        const ayahsWithWords = a.map(ayah => {
          const words = w[ayah.numberInSurah] || [];
          // Split tajweed text by spaces to align with words
          const tajweedWords = (ayah.tajweed || "").split(/\s+/);
          
          return {
            ...ayah,
            words: words.map((word, wIdx) => ({
              ...word,
              tajweed: tajweedWords[wIdx] || word.text
            }))
          };
        });
        setAyahs(ayahsWithWords);
        setTranslations(tBn);
        setTranslationsEn(tEn);
        setIsDownloaded(d);
        setLoading(false);
      });
    }
  }, [id, reciter, font]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playSpeed;
    }
  }, [playSpeed]);

  useEffect(() => {
    const verseNum = parseInt(verseSearch);
    if (!isNaN(verseNum) && verseNum > 0 && verseNum <= ayahs.length) {
      const element = verseRefs.current[verseNum];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setSearchHighlightedId(verseNum);
        
        // Clear highlight after 5 seconds
        const timer = setTimeout(() => {
          setSearchHighlightedId(null);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    } else {
      setSearchHighlightedId(null);
    }
  }, [verseSearch, ayahs.length]);

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
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
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
        audioRef.current.playbackRate = playSpeed;
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

  const handleBookmark = (ayah: Ayah) => {
    setBookmarkingAyah(ayah);
    setBookmarkNote("");
    setShowBookmarkModal(true);
  };

  const handleJump = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseInt(jumpVerse);
    if (!isNaN(num) && num > 0 && num <= ayahs.length) {
      const element = verseRefs.current[num];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setSearchHighlightedId(num);
        setShowJumpModal(false);
        setJumpVerse("");
        
        const timer = setTimeout(() => {
          setSearchHighlightedId(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  };

  const confirmBookmark = async () => {
    if (!user || !bookmarkingAyah) return;
    try {
      await bookmarkService.saveBookmark(
        user.uid, 
        parseInt(id!), 
        bookmarkingAyah.numberInSurah, 
        bookmarkNote
      );
      setShowBookmarkModal(false);
      setBookmarkingAyah(null);
      updatePoints(20);
    } catch (err) {
      console.error(err);
    }
  };

  const showTafsir = async (ayah: Ayah) => {
    setSelectedAyah(ayah);
    setTafsir(null);
    setAiExplanation(null);
    setIsAiExplaining(false);
    const t = await quranService.getTafsir(parseInt(id!), ayah.numberInSurah, tafsirLanguage);
    setTafsir(t);
  };

  const getAiExplanation = async () => {
    if (!selectedAyah) return;
    setIsAiExplaining(true);
    try {
      const explanation = await aiService.explainVerseSimple(selectedAyah.text, tafsirLanguage === 'bn' ? 'Bangla' : 'English');
      setAiExplanation(explanation);
    } catch (error) {
      console.error(error);
      setAiExplanation("AI explanation failed to load.");
    } finally {
      setIsAiExplaining(false);
    }
  };

  useEffect(() => {
    if (selectedAyah) {
      showTafsir(selectedAyah);
    }
  }, [tafsirLanguage]);

  const filteredAyahs = ayahs.filter(ayah => {
    if (!verseSearch) return true;
    const num = parseInt(verseSearch);
    // If it's a valid number, we don't filter the actual list in view, 
    // we let the scroll effect handle focus, or we can choose to highlight.
    // The requirement says "If not a valid number, treat as text search".
    // So if it IS a valid number, we show ALL but let the scroll handle it.
    if (!isNaN(num)) return true; 
    
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
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                 Surah {id}
              </h2>
              {isDownloaded && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-lg border border-green-200 shadow-sm">
                  <CheckCircle size={10} className="fill-green-700 text-white" />
                  <span className="text-[8px] font-black uppercase tracking-wider">ডাউনলোড করা (Offline)</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowJumpModal(true)}
              className="text-[10px] text-primary-600 font-black uppercase tracking-widest hover:text-primary-700 transition-colors flex items-center gap-1"
            >
              <Hash size={10} />
              Jump to Ayah
            </button>
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
                "p-2.5 rounded-xl transition-all flex items-center gap-2 border", 
                tajweedMode 
                  ? "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-200" 
                  : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"
              )}
              title="Toggle Tajweed Highlights"
            >
              <Sparkles size={18} className={cn(tajweedMode ? "animate-pulse" : "")} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
                Tajweed {tajweedMode ? 'ON' : 'OFF'}
              </span>
            </button>
            <button 
              onClick={() => setWordByWordMode(!wordByWordMode)}
              className={cn(
                "p-2.5 rounded-xl transition-all flex items-center gap-2", 
                wordByWordMode ? "bg-emerald-50 text-emerald-600 shadow-sm" : "text-slate-400 hover:bg-slate-200"
              )}
              title="Toggle Word by Word translation"
            >
              <Columns size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Word</span>
            </button>
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className={cn(
                "p-2.5 rounded-xl transition-all flex items-center justify-center relative group overflow-hidden border",
                isDownloaded 
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-200 hover:bg-red-500 hover:border-red-600 hover:shadow-red-200" 
                  : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-primary-600 hover:border-primary-200"
              )}
              title={isDownloaded ? "অফলাইন থেকে মুছুন (Remove from offline)" : "অফলাইনের জন্য ডাউনলোড করুন (Download for offline)"}
            >
              <AnimatePresence mode="wait">
                {downloading ? (
                  <motion.div
                    key="downloading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <RefreshCw size={20} className="animate-spin" />
                  </motion.div>
                ) : downloadSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-white"
                  >
                    <Sparkles size={18} className="animate-bounce" />
                    <span className="text-[10px] font-black uppercase tracking-widest">ডাউনলোড সফল!</span>
                  </motion.div>
                ) : isDownloaded ? (
                  <motion.div
                    key="downloaded"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle size={20} className="group-hover:hidden" />
                    <Trash2 size={20} className="hidden group-hover:block" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">অফলাইন</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="not-downloaded"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Download size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">ডাউনলোড</span>
                  </motion.div>
                )}
              </AnimatePresence>
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
              onClick={() => setFont(font === 'madani' ? 'asia-noorani' : 'madani')}
              className="p-2.5 rounded-xl hover:bg-slate-200 text-slate-500 transition-all flex items-center gap-2"
            >
              <Type size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{font === 'madani' ? 'Madani' : 'Noorani Quran'}</span>
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
          {isDownloaded && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-100 p-6 rounded-[40px] flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-inner border border-emerald-50">
                  <div className="relative">
                    <BookOpen size={28} />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">অফলাইন সংস্করণ প্রস্তুত</h3>
                  <p className="text-[10px] text-emerald-600 uppercase font-black tracking-[0.1em] mt-1">Ready for Offline Reading</p>
                  <p className="text-[9px] text-slate-400 mt-1 font-medium italic">ইন্টারনেট সংযোগ ছাড়াই এই সূরাটি পড়া যাবে</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="px-4 py-2 bg-white rounded-2xl border border-emerald-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">সংরক্ষিত ডাটা</p>
                  <p className="text-sm font-black text-emerald-700">{getSurahSize()}</p>
                </div>
              </div>
            </motion.div>
          )}

          {tajweedMode && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-[80px] z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-8 transition-all"
            >
              <div className="flex items-center justify-between gap-4 mb-3 px-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-orange-50 rounded-xl">
                    <Sparkles size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 font-bangla leading-tight">তাজইদ রঙ নির্দেশিকা</h3>
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Live Tajweed Guide</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {TAJWEED_RULES.map((rule) => (
                  <button
                    key={rule.label}
                    onClick={() => setActiveRule(rule)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                  >
                    <div className={cn(
                      "w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform ring-4 ring-transparent group-hover:ring-slate-50", 
                      rule.color
                    )} />
                    <div className="flex flex-col items-start">
                      <span className={cn("text-[10px] font-black font-bangla leading-tight", rule.textColor)}>{rule.description}</span>
                      <span className="text-[7px] text-slate-400 font-bold uppercase tracking-tighter">{rule.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {filteredAyahs.map((ayah) => {
            const idx = ayahs.indexOf(ayah);
            const isRevealed = revealedVerses.includes(ayah.numberInSurah);
            return (
              <motion.div 
                 key={ayah.number}
                 ref={(el) => (verseRefs.current[ayah.numberInSurah] = el)}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className={cn(
                   "group p-8 lg:p-12 rounded-[48px] transition-all shadow-sm relative overflow-hidden",
                   searchHighlightedId === ayah.numberInSurah 
                     ? "border-primary-500 ring-2 ring-primary-500/20 bg-primary-50/30" 
                     : "bg-white border-slate-200 hover:border-primary-200"
                 )}
              >
                <div className="flex items-center justify-between mb-10">
                  <span className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-2xl border text-[10px] font-bold transition-all duration-300",
                    searchHighlightedId === ayah.numberInSurah 
                      ? "bg-primary-600 text-white border-transparent scale-110" 
                      : "bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-primary-600 group-hover:text-white group-hover:border-transparent"
                  )}>
                    {ayah.numberInSurah}
                  </span>
                  <div className="flex items-center gap-1">
                     <button 
                      onClick={() => toggleAudio(ayah)}
                      className="p-3.5 hover:bg-primary-50 text-primary-600 rounded-2xl transition-all active:scale-90"
                     >
                       {playingId === ayah.number ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                     </button>
                     <button 
                       onClick={() => handleBookmark(ayah)}
                       className="p-3.5 hover:bg-orange-50 text-orange-400 rounded-2xl transition-all"
                     >
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
                  <div 
                    className={cn(
                      "flex flex-wrap gap-x-4 gap-y-8 justify-end transition-all",
                      memorizeMode && !isRevealed && "blur-2xl hover:blur-none transition-[filter] duration-700 cursor-help select-none"
                    )}
                    style={{ direction: 'rtl' }}
                  >
                    {wordByWordMode && ayah.words ? (
                      ayah.words.map((word) => {
                        // Extract rule name from tajweed string if it contains spans
                        const wordTajweed = tajweedMode && word.tajweed ? parseTajweed(word.tajweed) : word.text;
                        const hasTajweed = tajweedMode && word.tajweed && wordTajweed.includes('data-rule');

                        return (
                          <div 
                            key={word.id} 
                            className={cn(
                              "flex flex-col items-center gap-2 group/word p-3 rounded-2xl transition-all cursor-pointer",
                              activeWord?.word.id === word.id ? "bg-emerald-50 ring-1 ring-emerald-200 shadow-sm" : "hover:bg-slate-50"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveWord({ word, ayahId: ayah.number });
                            }}
                          >
                            <div className="relative">
                              <span 
                                className={cn(
                                  "transition-all text-slate-900 group-hover/word:text-emerald-600",
                                  font === 'madani' ? "font-madani text-4xl" : "font-noorani text-5xl"
                                )}
                                dangerouslySetInnerHTML={{ __html: wordTajweed }}
                              />
                              {hasTajweed && (
                                <div 
                                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
                                  style={{ 
                                    backgroundColor: 
                                      wordTajweed.includes('tajweed-madd-compulsory') ? '#0D47A1' :
                                      wordTajweed.includes('tajweed-madd-allowable') ? '#EF6C00' :
                                      wordTajweed.includes('tajweed-madd') ? '#1565C0' :
                                      wordTajweed.includes('tajweed-qalqala') ? '#C62828' :
                                      wordTajweed.includes('tajweed-ghunna') || wordTajweed.includes('tajweed-ikhfa') || wordTajweed.includes('tajweed-iqlab') ? '#2E7D32' :
                                      wordTajweed.includes('tajweed-leen') ? '#B8860B' :
                                      wordTajweed.includes('tajweed-tafkhim') ? '#283593' :
                                      wordTajweed.includes('tajweed-idgham') ? '#757575' : '#fb923c'
                                  }}
                                />
                              )}
                            </div>
                            <div className="flex flex-col items-center gap-1" style={{ direction: 'ltr' }}>
                              <span className="text-sm font-bangla text-emerald-700 font-bold leading-tight group-hover/word:text-emerald-500 transition-colors">
                                {word.translationBn}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium group-hover/word:text-slate-500 transition-colors">
                                {word.translationEn}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className={cn(
                        "leading-[4.5rem] transition-all",
                        font === 'madani' ? "font-madani text-4xl" : "font-noorani text-5xl",
                        searchHighlightedId === ayah.numberInSurah ? "text-primary-900" : "text-slate-900"
                      )} 
                      style={{ fontSize: font === 'madani' ? '36px' : '48px' }}
                      dangerouslySetInnerHTML={{ 
                        __html: (tajweedMode && ayah.tajweed) 
                          ? parseTajweed(ayah.tajweed) 
                          : ayah.text 
                      }}
                      />
                    )}
                  </div>
                  
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
                  
                  {showTranslation && (
                    <div className="space-y-3 border-t border-slate-50 pt-8">
                       <p className="text-xl text-slate-900 leading-relaxed font-bangla font-medium">
                         {translations[idx]?.text || translationsEn[idx]?.text || "অনুবাদ পাওয়া যায়নি (Translation not found)"}
                       </p>
                       {translationsEn[idx]?.text && translations[idx]?.text && (
                         <p className="text-sm text-slate-400 italic">
                            "{translationsEn[idx].text}"
                         </p>
                       )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Word Details Modal */}
      <AnimatePresence>
        {activeWord && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[40px] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setActiveWord(null)}
                className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-8">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="bg-emerald-50 w-24 h-24 rounded-3xl flex items-center justify-center border border-emerald-100 shadow-sm shadow-emerald-500/10">
                    <span 
                      className={cn(
                        "text-5xl text-slate-900",
                        font === 'madani' ? "font-madani" : "font-noorani"
                      )} 
                      style={{ direction: 'rtl' }}
                      dangerouslySetInnerHTML={{ __html: parseTajweed(activeWord.word.tajweed || activeWord.word.text) }}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">শব্দ বিশ্লেষণ (Word Analysis)</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Surah {id} • Ayah {activeWord.ayahId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2 block">Bangla Translation</span>
                    <p className="text-lg font-bold text-slate-900">{activeWord.word.translationBn}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">English Meaning</span>
                    <p className="text-lg font-bold text-slate-900">{activeWord.word.translationEn}</p>
                  </div>
                </div>

                {activeWord.word.tajweed && activeWord.word.tajweed.includes('[') && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Sparkles size={14} className="text-orange-400" />
                       তাজউইদ নিয়ম কাজ করছে (Tajweed Applied)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {TAJWEED_RULES.filter(rule => {
                        // Very basic check to see if this rule tag exists in the tajweed string
                        // This is a naive way, but works for the current tag system
                        const tags = {
                          'Ghunna': ['[g]', '[h]'],
                          'Qalqala': ['[p]', '[q]'],
                          'Madd': ['[m]'],
                          'Ikhfa': ['[i]'],
                          'Idgham': ['[d]', '[n]'],
                          'Ikhfa Shafawi': ['[s]'],
                          'Idgham Shafawi': ['[y]'],
                          'Iqlab': ['[k]'],
                          'Madde Leen': ['[l]']
                        };
                        const ruleTags = tags[rule.label as keyof typeof tags] || [];
                        return ruleTags.some(tag => activeWord.word.tajweed?.includes(tag));
                      }).map(rule => (
                        <button
                          key={rule.label}
                          onClick={() => {
                            setActiveRule(rule);
                            setActiveWord(null);
                          }}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:scale-105 active:scale-95",
                            rule.color
                          )}
                        >
                          <BookOpen size={14} />
                          {rule.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setActiveWord(null)}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors"
                  >
                    বন্ধ করুন (Close)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                     <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tafsir & Insight</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Surah {id} • Ayah {selectedAyah.numberInSurah}</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                        <button 
                          onClick={() => setTafsirLanguage('bn')}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-black transition-all",
                            tafsirLanguage === 'bn' ? "bg-white text-primary-600 shadow-sm" : "text-slate-400"
                          )}
                        >
                          BN
                        </button>
                        <button 
                          onClick={() => setTafsirLanguage('en')}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-black transition-all",
                            tafsirLanguage === 'en' ? "bg-white text-primary-600 shadow-sm" : "text-slate-400"
                          )}
                        >
                          EN
                        </button>
                      </div>
                      <button onClick={() => setSelectedAyah(null)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400">
                        <X size={20} />
                      </button>
                   </div>
                </div>
                
                <div className="space-y-8 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                   {/* Classical Tafsir */}
                   <div className="p-8 rounded-[32px] bg-primary-50 border border-primary-100/50 space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-700 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <MessageSquare size={12} /> 
                          {tafsirLanguage === 'bn' ? 'Tafhim-ul-Quran (Bangla)' : 'Tafsir Ibn Kathir (English)'}
                        </span>
                        {tafsirSearch && <span className="text-[8px] bg-primary-500 text-white px-2 py-0.5 rounded-full">Filtering</span>}
                      </p>
                      
                      {!tafsir ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                           <RefreshCw size={32} className="text-primary-400 animate-spin" />
                           <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">Fetching scholarly text...</p>
                        </div>
                      ) : (
                        <div 
                          className="text-primary-950 leading-relaxed text-lg font-medium font-bangla whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ 
                            __html: (tafsir || "").replace(
                              new RegExp(tafsirSearch, "gi"), 
                              match => match ? `<mark class="bg-yellow-200 text-slate-900">${match}</mark>` : ""
                            )
                          }}
                        />
                      )}
                   </div>

                   {/* AI Insight Section */}
                   <div className="p-8 rounded-[32px] bg-slate-900 text-white border border-white/10 relative overflow-hidden group">
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                                <Sparkles size={20} />
                             </div>
                             <div>
                                <h3 className="text-lg font-bold">AI Insight</h3>
                                <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">Simplified Explanation</p>
                             </div>
                          </div>
                          {!aiExplanation && !isAiExplaining && (
                            <button 
                              onClick={getAiExplanation}
                              className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all flex items-center gap-2"
                            >
                               Generate
                            </button>
                          )}
                        </div>

                        {isAiExplaining ? (
                          <div className="flex flex-col items-center justify-center py-8 gap-4">
                             <div className="flex gap-1">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                             </div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consulting AI...</p>
                          </div>
                        ) : aiExplanation ? (
                          <div className="text-slate-200 text-base leading-relaxed font-medium bg-white/5 p-6 rounded-2xl border border-white/5">
                             {aiExplanation}
                          </div>
                        ) : (
                          <p className="text-slate-500 text-xs font-medium italic">
                            Want a simpler version? Ask our AI to explain this verse for you.
                          </p>
                        )}
                      </div>
                      
                      {/* Decorative bg */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-600/20 transition-all" />
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
                             className={cn(
                               "text-right leading-loose text-3xl text-slate-900",
                               font === 'madani' ? "font-madani" : "font-noorani"
                             )} 
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

      {/* Jump to Verse Modal */}
      <AnimatePresence>
        {showJumpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-xs bg-white rounded-[40px] p-8 shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Hash size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900">Go to Verse</h3>
                <p className="text-xs text-slate-400 font-medium">Enter verse number (1-{ayahs.length})</p>
              </div>

              <form onSubmit={handleJump} className="space-y-4">
                <input 
                  autoFocus
                  type="number" 
                  min="1" 
                  max={ayahs.length}
                  placeholder="e.g. 5"
                  value={jumpVerse}
                  onChange={(e) => setJumpVerse(e.target.value)}
                  className="w-full text-center text-2xl font-black p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 placeholder:text-slate-200"
                />
                
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowJumpModal(false)}
                    className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-black text-sm shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95"
                  >
                    Go
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bookmark Note Modal */}
      <AnimatePresence>
        {showBookmarkModal && bookmarkingAyah && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-md bg-white rounded-[48px] p-10 shadow-2xl space-y-8"
            >
              <div className="space-y-2">
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight">Add a Note</h3>
                 <p className="text-slate-500 font-medium">Save a personal reflection with this Ayah</p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 italic text-slate-600 text-sm">
                "{bookmarkingAyah.text.substring(0, 100)}..."
              </div>

              <textarea 
                placeholder="Write your note here..."
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                className="w-full h-32 p-6 rounded-[32px] bg-slate-50 border-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 placeholder:text-slate-400 resize-none"
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowBookmarkModal(false)}
                  className="flex-1 py-5 rounded-[24px] bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmBookmark}
                  className="flex-1 py-5 rounded-[24px] bg-primary-600 text-white font-extrabold shadow-xl shadow-primary-600/20 hover:bg-primary-500 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Save
                </button>
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
                 <h3 className="text-2xl font-black text-slate-900">Surah Settings</h3>
                 <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                   <X size={20} />
                 </button>
              </div>

              <div className="space-y-6">
                 {/* Tafsir Language Toggle */}
                 <div className="flex items-center justify-between p-6 rounded-[32px] bg-slate-50 border border-slate-200">
                    <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tafsir Language</p>
                       <p className="text-sm font-bold text-slate-900">{tafsirLanguage === 'bn' ? 'Bangla (তাফসীর)' : 'English (Tafsir)'}</p>
                       <p className="text-[8px] text-slate-400 font-medium mt-1">Change the explanation language</p>
                    </div>
                    <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                       <button 
                          onClick={() => setTafsirLanguage('bn')}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                            tafsirLanguage === 'bn' ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" : "text-slate-400 hover:text-slate-600"
                          )}
                       >
                          BN
                       </button>
                       <button 
                          onClick={() => setTafsirLanguage('en')}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                            tafsirLanguage === 'en' ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" : "text-slate-400 hover:text-slate-600"
                          )}
                       >
                          EN
                       </button>
                    </div>
                 </div>

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
