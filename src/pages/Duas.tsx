import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Home, Shield, Heart } from 'lucide-react';

const DUAS = [
  { title: 'Morning Supplication', arabic: 'اللهم بك أصبحنا وبك أمسينا', translation: 'O Allah, by You we enter the morning and by You we enter the evening.', category: 'Daily' },
  { title: 'Before Sleeping', arabic: 'باسمك اللهم أموت وأحيا', translation: 'In Your name, O Allah, I die and I live.', category: 'Night' },
  { title: 'For Forgiveness', arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ', translation: 'Our Lord, forgive me and my parents.', category: 'Family' },
];

export default function Duas() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-24 px-4 pt-8">
      <div className="space-y-2">
         <h1 className="text-4xl font-black text-slate-900 tracking-tight">Daily Duas</h1>
         <p className="text-slate-500 font-medium">Authentic supplications from Quran and Sunnah.</p>
      </div>

      <div className="grid gap-6">
        {DUAS.map((dua, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[40px] bg-white border border-slate-200 shadow-sm space-y-6"
          >
             <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest">{dua.category}</span>
             </div>
             <h3 className="text-2xl font-bold text-slate-900">{dua.title}</h3>
             <p className="text-3xl font-madani text-right leading-loose text-primary-900">{dua.arabic}</p>
             <p className="text-slate-600 italic font-medium leading-relaxed">{dua.translation}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
