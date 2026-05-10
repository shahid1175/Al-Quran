import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Volume2, BookOpen, Sparkles, Info } from 'lucide-react';
import { TajweedRule } from '../lib/tajweed';
import { cn } from '../lib/utils';

interface TajweedRuleModalProps {
  rule: TajweedRule;
  onClose: () => void;
}

export default function TajweedRuleModal({ rule, onClose }: TajweedRuleModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playExample = () => {
    // For now, we simulate playing. 
    // In a real app, you'd have audio files for these specific examples or use a TTS service.
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(rule.example);
    utterance.lang = 'ar-SA';
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    
    // Fallback timer if speech synthesis is not supported/failing
    setTimeout(() => setIsPlaying(false), 2000);
  };

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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 mb-2">
                <Sparkles size={12} />
                <span>Tajweed Rule</span>
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{rule.label}</h3>
              <p className="text-xl text-emerald-600 font-bold">{rule.description}</p>
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
                  <p className="text-6xl font-serif text-white text-center" style={{ direction: 'rtl' }}>
                    {rule.example.split(' ')[0]}
                  </p>
                  
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
