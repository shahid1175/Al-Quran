import React from 'react';
import { motion } from 'motion/react';
import { Mountain, Map, Info, Compass, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { title: 'Ihram', desc: 'Entering the sacred state of intention and dress.' },
  { title: 'Tawaf', desc: 'Circling the Kaaba seven times counter-clockwise.' },
  { title: 'Sa’i', desc: 'Walking between Safa and Marwa seven times.' },
  { title: 'Halaq/Taqsir', desc: 'Cutting or shaving hair to exit Ihram.' },
];

export default function Guides() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4 pt-8">
      <div className="bg-teal-900 rounded-[48px] p-12 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-teal-700 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
         <div className="relative z-10 space-y-4">
            <h1 className="text-4xl font-black">Hajj & Umrah Guide</h1>
            <p className="text-teal-100/80 font-medium">A step-by-step interactive manual for your sacred pilgrimage.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
               <Compass className="text-teal-600" />
               Umrah Steps
            </h3>
            <div className="space-y-4">
               {STEPS.map((step, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   className="flex gap-6 p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm"
                 >
                    <div className="h-10 w-10 shrink-0 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-black">
                       {i + 1}
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-bold text-slate-900">{step.title}</h4>
                       <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         <div className="space-y-6">
            <div className="p-8 rounded-[48px] bg-slate-900 text-white space-y-6">
               <div className="flex items-center gap-3">
                  <Info className="text-teal-400" />
                  <h4 className="font-bold">Checklist</h4>
               </div>
               <div className="space-y-4">
                  {['Valid Passport', 'Visa Requirements', 'Sunscreen & Umbrella', 'Prayer Mat', 'Pocket Dua Book'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-300">
                       <CheckCircle2 size={18} className="text-teal-500" />
                       <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
