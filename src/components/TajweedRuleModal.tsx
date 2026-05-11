import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Volume2, BookOpen, Sparkles, Info } from 'lucide-react';
import { TajweedRule, parseTajweed } from '../lib/tajweed';
import { cn } from '../lib/utils';

interface TajweedRuleModalProps {
  rule: TajweedRule;
  onClose: () => void;
}

export default function TajweedRuleModal({ rule, onClose }: TajweedRuleModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const playExample = () => {
    if (isPlaying) return;

    if (rule.audioUrl) {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      const audio = new Audio(rule.audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
      
      audio.onerror = (e) => {
        console.error('Audio file playback failed, falling back to TTS', e);
        setIsPlaying(false);
        audioRef.current = null;
        playWithTTS();
      };
      
      audio.play().catch(err => {
        console.error('Audio play error:', err);
        setIsPlaying(false);
        audioRef.current = null;
        playWithTTS();
      });
      return;
    }

    playWithTTS();
  };

  const playWithTTS = () => {
    if (!rule.example) return;

    // Clean example text: Extract only Arabic characters
    const arabicOnly = rule.example
      .replace(/\s*\([^)]*\)\s*/g, '') // Remove everything in parentheses
      .replace(/[^\u0600-\u06FF\s\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '') // Remove non-Arabic chars
      .trim();

    if (!arabicOnly) {
      const firstWord = rule.example.split(' ')[0];
      if (firstWord) {
        speak(firstWord);
      }
      return;
    }

    speak(arabicOnly);
  };

  const speak = (text: string) => {
    setIsPlaying(true);
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.6; // Even slower for learning
    
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.includes('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    
    // Safety fallback
    setTimeout(() => {
      if (!window.speechSynthesis.speaking) {
        setIsPlaying(false);
      }
    }, 5000);
  };

  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const arabicExample = parseTajweed(rule.example);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-white rounded-[48px] p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Colorful background glow */}
        <div className={cn("absolute top-0 right-0 h-64 w-64 blur-3xl opacity-10 rounded-full -mr-32 -mt-32 transition-colors", rule.color)} />
        
        <button 
          onClick={onClose} 
          className="absolute right-8 top-8 p-3 hover:bg-slate-100 rounded-full text-slate-400 z-10 transition-all hover:rotate-90"
        >
          <X size={24} />
        </button>
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-start gap-6">
            <div className={cn("h-20 w-20 rounded-[32px] flex items-center justify-center text-white shadow-xl flex-shrink-0 animate-in fade-in zoom-in duration-500", rule.color)}>
              <BookOpen size={40} />
            </div>
            <div className="space-y-1">
              <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-2", rule.textColor)} style={{ borderColor: 'currentColor' }}>
                <Sparkles size={12} />
                <span>Tajweed Rule</span>
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{rule.label}</h3>
              <p className={cn("text-xl font-bold", rule.textColor)}>{rule.description}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Info size={16} />
              <h4 className="text-[10px] font-bold uppercase tracking-widest">বিস্তারিত ব্যাখ্যা (Explanation)</h4>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium text-lg">
              {rule.explanation}
            </p>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">উদাহরণ (Example)</h4>
                <div className="h-px bg-slate-100 flex-1 mx-4" />
             </div>
             
             <div className="bg-slate-900 p-10 rounded-[40px] shadow-xl group relative overflow-hidden">
                {/* Visualizer effect */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                  <div className="w-full flex items-center justify-center gap-1">
                    {[...Array(20)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={isPlaying ? { height: [4, 16, 8, 20, 4] } : { height: 4 }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.05 }}
                        className="w-1 bg-white rounded-full"
                      />
                    ))}
                  </div>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-8">
                  <p 
                    className="text-6xl font-serif text-white text-center" 
                    style={{ direction: 'rtl' }}
                    dangerouslySetInnerHTML={{ __html: arabicExample }}
                  />
                  
                  <button 
                    onClick={playExample}
                    disabled={isPlaying}
                    className={cn(
                      "flex items-center gap-3 px-10 py-5 rounded-[24px] font-black transition-all active:scale-95 shadow-2xl",
                      isPlaying 
                        ? "bg-white/10 text-white/50 cursor-not-allowed" 
                        : "bg-white text-slate-900 hover:bg-emerald-50 hover:text-emerald-700 shadow-white/10"
                    )}
                  >
                    {isPlaying ? <Volume2 className="animate-pulse" size={24} /> : <Play fill="currentColor" size={24} />}
                    <span>{isPlaying ? 'শুনছেন...' : 'শুনুন (Listen)'}</span>
                  </button>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
