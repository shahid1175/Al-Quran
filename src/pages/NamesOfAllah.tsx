import React from 'react';
import { motion } from 'motion/react';

const NAMES = [
  { name: 'Ar-Rahman', meaning: 'The Most Merciful', description: 'He who wills goodness and mercy for all His creatures.' },
  { name: 'Ar-Rahim', meaning: 'The Especially Merciful', description: 'He who acts with extreme kindness.' },
  { name: 'Al-Malik', meaning: 'The King', description: 'The Sovereign Lord, The One with complete dominion.' },
  // ... more names can be added
];

export default function NamesOfAllah() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4 pt-8">
      <div className="bg-indigo-900 rounded-[48px] p-12 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-700 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
         <div className="relative z-10 space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">99 Names of Allah</h1>
            <p className="text-indigo-100/80 text-lg font-medium max-w-xl">Asma-ul-Husna (The Most Beautiful Names). Reflecting on His attributes brings peace to the soul.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {NAMES.map((n, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-8 rounded-[40px] bg-white border border-slate-200 hover:border-indigo-400 transition-all group"
          >
             <div className="space-y-4">
                <span className="text-4xl font-madani text-indigo-600 group-hover:scale-110 transition-transform block">{n.name}</span>
                <div>
                   <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{n.meaning}</h3>
                   <p className="text-slate-500 text-sm font-medium mt-2">{n.description}</p>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
