import React from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Tag, Star, Clock } from 'lucide-react';

const PLACES = [
  { name: 'Gourmet Balan', type: 'Restaurant', address: '42 Halal Ave, East Side', rating: 4.8, status: 'Open' },
  { name: 'Spice Route', type: 'Thai & Indian', address: '15 Curri St, Downtown', rating: 4.5, status: 'Closing Soon' },
  { name: 'Kebab King', type: 'Fast Food', address: '99 Grill Rd, West End', rating: 4.2, status: 'Open' },
];

export default function HalalFood() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4 pt-8">
      <div className="space-y-6">
         <h1 className="text-4xl font-black text-slate-900 tracking-tight">Halal Food Finder</h1>
         <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Finding great halal food near you..."
              className="w-full pl-14 pr-8 py-6 rounded-[32px] bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-orange-500/20 font-bold"
            />
         </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
         {['All', 'Restaurant', 'Cafe', 'Fast Food', 'Butchery'].map((cat) => (
           <button key={cat} className="px-6 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest whitespace-nowrap hover:border-orange-400 transition-all">
              {cat}
           </button>
         ))}
      </div>

      <div className="grid gap-6">
        {PLACES.map((place, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6 p-8 rounded-[48px] bg-white border border-slate-200 hover:border-orange-200 shadow-sm transition-all group"
          >
             <div className="h-20 w-20 rounded-[32px] bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                <Tag size={32} />
             </div>
             <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                   <h3 className="text-xl font-bold text-slate-900">{place.name}</h3>
                   <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase">{place.status}</span>
                </div>
                <p className="text-slate-500 font-medium text-sm flex items-center gap-1">
                   <MapPin size={14} /> {place.address}
                </p>
                <div className="flex items-center gap-4 pt-2">
                   <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-black">{place.rating}</span>
                   </div>
                   <div className="flex items-center gap-1 text-slate-300 text-xs font-bold">
                      <Clock size={14} />
                      10:00 AM - 10:00 PM
                   </div>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
