
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Volume2, Info, Sparkles, BookOpen } from 'lucide-react';
import { MakharijPoint } from '../lib/makharij';
import { cn } from '../lib/utils';

interface MakhrajDetailModalProps {
  point: MakharijPoint;
  onClose: () => void;
}

export default function MakhrajDetailModal({ point, onClose }: MakhrajDetailModalProps) {
  const playAudio = (url?: string) => {
    if (url) {
      const audio = new Audio(url);
      audio.play().catch(err => console.error("Audio play failed:", err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-between px-10">
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center font-black text-xl border border-white/20">
              {point.id}
            </div>
            <div>
              <h3 className="text-2xl font-black">{point.name}</h3>
              <p className="text-orange-100 font-madani text-lg">{point.nameAr}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-10">
          {/* Content Sections */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-widest">
                  <BookOpen size={14} /> বর্ণনা (Description)
                </h4>
                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                  {point.description}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-widest">
                  <Sparkles size={14} /> উচ্চারণ নির্দেশিকা (Pronunciation Guide)
                </h4>
                <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 text-emerald-800 text-sm font-medium leading-relaxed italic">
                  "{point.pronunciationGuide}"
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-widest">
                <Volume2 size={14} /> হরফ ও উচ্চারণ (Letters & Audio)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {point.letters.map((letter, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group"
                  >
                    <span className="text-4xl font-madani text-slate-900 group-hover:scale-110 transition-transform">
                      {letter.char}
                    </span>
                    {letter.audio && (
                      <button 
                        onClick={() => playAudio(letter.audio)}
                        className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:shadow-md transition-all active:scale-95"
                      >
                        <Play size={16} fill="currentColor" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-orange-500" />
              <span>মাখরাজ অবস্থান: {point.area}</span>
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-full">
              Point ID: {point.id}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
