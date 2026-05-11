
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MAKHAREJ_DATA, MakharijPoint } from '../lib/makharij';
import { cn } from '../lib/utils';
import { Info, Play, Volume2 } from 'lucide-react';

export default function MakharijDiagram() {
  const [selectedPoint, setSelectedPoint] = useState<MakharijPoint | null>(MAKHAREJ_DATA[0]);
  const [hoveredPoint, setHoveredPoint] = useState<MakharijPoint | null>(null);

  const activePoint = selectedPoint || hoveredPoint;

  return (
    <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/40">
      <div className="flex flex-col lg:flex-row">
        {/* Diagram Area */}
        <div className="lg:w-1/2 p-10 bg-slate-50 relative min-h-[400px] flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200">
          <div className="relative w-full max-w-[300px] aspect-square">
            {/* Stylized Human Profile SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-200 fill-current">
              {/* Head structure */}
              <path d="M20,20 Q20,5 50,5 Q80,5 80,40 Q80,60 70,75 L70,95 L30,95 L30,75 Q20,60 20,40 Z" />
              {/* Nose */}
              <path d="M80,40 Q90,45 80,50" />
              {/* Internal anatomy representation (Simplified) */}
              <path d="M45,40 Q55,40 55,60 L55,90 L45,90 Z" className="text-slate-300" /> {/* Throat */}
              <path d="M55,55 Q75,55 75,45" className="text-slate-300" stroke="currentColor" strokeWidth="2" fill="none" /> {/* Tongue area */}
            </svg>

            {/* Interaction Markers */}
            {MAKHAREJ_DATA.map((point) => (
              <motion.button
                key={point.id}
                initial={false}
                animate={{
                  scale: activePoint?.id === point.id ? 1.5 : 1,
                  backgroundColor: activePoint?.id === point.id ? '#f97316' : '#94a3b8'
                }}
                className={cn(
                  "absolute w-4 h-4 rounded-full border-2 border-white shadow-md z-10 transition-colors",
                  activePoint?.id === point.id ? "z-20" : "z-10"
                )}
                style={{ 
                  left: `${point.illustrationPos.x}%`, 
                  top: `${point.illustrationPos.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedPoint(point)}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                 <span className="sr-only">{point.name}</span>
              </motion.button>
            ))}

            {/* Area Labels (Optional indicators) */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <span className="absolute top-[20%] left-[65%] text-[10px] font-bold uppercase text-slate-400">Nose</span>
                <span className="absolute top-[55%] left-[85%] text-[10px] font-bold uppercase text-slate-400">Lips</span>
                <span className="absolute top-[85%] left-[45%] text-[10px] font-bold uppercase text-slate-400">Throat</span>
                <span className="absolute top-[55%] left-[55%] text-[10px] font-bold uppercase text-slate-400">Tongue</span>
            </div>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
            <Info size={12} className="text-orange-500" />
            মাখরাজ পয়েন্টে ক্লিক করে বর্ণনা দেখুন
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-1/2 p-8 md:p-12 space-y-8 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activePoint ? (
              <motion.div
                key={activePoint.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-lg">
                      {activePoint.id}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">{activePoint.name}</h3>
                  </div>
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    {activePoint.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">সংশ্লিষ্ট হরফসমূহ (Associated Letters)</h4>
                  <div className="flex flex-wrap gap-4">
                    {activePoint.letters.map((letter, idx) => (
                      <div 
                        key={idx}
                        className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-4xl shadow-sm group hover:border-orange-200 transition-all"
                      >
                         <span className="font-madani group-hover:scale-110 transition-transform">{letter}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">আরবি নাম</p>
                    <p className="text-2xl font-madani text-slate-900">{activePoint.nameAr}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-4 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-2">
                       <Volume2 size={20} />
                       <span className="text-sm font-bold">উচ্চারণ</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                 <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                    <Info size={32} className="text-slate-300" />
                 </div>
                 <p className="font-bold text-slate-400 uppercase tracking-widest">Select a point to see details</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Access List */}
      <div className="bg-slate-50 border-t border-slate-200 p-6 flex items-center gap-4 overflow-x-auto no-scrollbar">
          <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Quick Select:</span>
          {MAKHAREJ_DATA.map((point) => (
            <button
              key={point.id}
              onClick={() => setSelectedPoint(point)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all",
                selectedPoint?.id === point.id 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                  : "bg-white text-slate-600 border border-slate-200 hover:border-orange-200"
              )}
            >
              মাখরাজ {point.id}
            </button>
          ))}
      </div>
    </div>
  );
}
