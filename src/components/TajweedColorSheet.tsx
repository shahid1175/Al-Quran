import React from 'react';
import { TAJWEED_RULES } from '../lib/tajweed';
import { cn } from '../lib/utils';
import { Info } from 'lucide-react';

interface TajweedColorSheetProps {
  onRuleClick: (rule: any) => void;
}

const TajweedColorSheet: React.FC<TajweedColorSheetProps> = ({ onRuleClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-4 sm:px-6 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2 flex-shrink-0 pr-6 border-r border-slate-200">
             <div className="p-2 bg-primary-50 rounded-xl">
                <Info size={16} className="text-primary-600" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-black font-bangla uppercase tracking-widest text-slate-400 whitespace-nowrap">
                  তাজইদ রঙ নির্দেশিকা
               </span>
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Color Legend</span>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            {TAJWEED_RULES.map((rule) => {
              const bgColor = rule.color.replace('bg-[', '').replace(']', '');
              
              return (
                <button
                  key={rule.label}
                  onClick={() => onRuleClick(rule)}
                  className="flex items-center gap-3 group whitespace-nowrap interactive"
                >
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm group-hover:scale-125 transition-all duration-300 ring-2 ring-transparent group-hover:ring-slate-100" 
                    style={{ backgroundColor: bgColor }}
                  />
                  <div className="flex flex-col items-start">
                    <span className={cn("text-[11px] font-black font-bangla transition-colors", rule.textColor)}>
                      {rule.description}
                    </span>
                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wide group-hover:text-slate-400 transition-colors">
                      {rule.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TajweedColorSheet;
