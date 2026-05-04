import React from 'react';
import { motion } from 'motion/react';
import { Quote, Share2, Sparkles } from 'lucide-react';

const QUOTES = [
  { text: "So verily, with every difficulty, there is relief.", source: "Quran 94:5", category: "Hope" },
  { text: "The best among you are those who have the best manners and character.", source: "Prophet Muhammad (ﷺ)", category: "Character" },
  { text: "Allah does not burden a soul beyond that it can bear.", source: "Quran 2:286", category: "Strength" },
  { text: "The strongest among you is the one who controls his anger.", source: "Prophet Muhammad (ﷺ)", category: "Wisdom" },
  { text: "Kindness is a mark of faith, and whoever is not kind has no faith.", source: "Prophet Muhammad (ﷺ)", category: "Kindness" },
];

export default function Quotes() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4 pt-8">
      <div className="space-y-2">
         <h1 className="text-4xl font-black text-slate-900 tracking-tight">Inspirational Quotes</h1>
         <p className="text-slate-500 font-medium">Wisdom and reflections to nourish the soul.</p>
      </div>

      <div className="grid gap-8">
        {QUOTES.map((q, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative p-10 rounded-[48px] bg-white border border-slate-200 shadow-sm hover:border-primary-400 transition-all overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Quote size={80} className="text-primary-900" />
             </div>
             
             <div className="relative z-10 space-y-6">
                <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest">{q.category}</span>
                <p className="text-2xl font-bold text-slate-800 leading-relaxed">"{q.text}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                   <span className="text-sm font-black text-primary-600 uppercase tracking-tighter">— {q.source}</span>
                   <button className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                      <Share2 size={18} />
                   </button>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
