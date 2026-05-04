import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Search, Compass, Navigation } from 'lucide-react';

const MOSQUES = [
  { name: 'Central Masjid', address: '123 Islamic Way, City Center', distance: '1.2 km', jamat: '1:30 PM' },
  { name: 'Al-Noor Islamic Center', address: '45 Peace St, North District', distance: '2.5 km', jamat: '1:15 PM' },
  { name: 'Madina Community Hall', address: '88 Faith Blvd, South Hills', distance: '4.8 km', jamat: '1:45 PM' },
];

export default function MosqueFinder() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4 pt-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mosque Finder</h1>
            <p className="text-slate-500 font-medium">Find places of worship and Jamat times near you.</p>
         </div>
         <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by city or zip..."
              className="pl-14 pr-8 py-5 rounded-[24px] bg-white border border-slate-200 focus:ring-2 focus:ring-primary-500/20 w-80 font-bold shadow-sm"
            />
         </div>
      </div>

      <div className="bg-slate-900 rounded-[48px] p-8 aspect-[21/9] flex items-center justify-center text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center animate-pulse">
               <MapPin size={32} />
            </div>
            <p className="font-bold text-slate-300">Interactive map loading...</p>
         </div>
      </div>

      <div className="grid gap-6">
        {MOSQUES.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6 p-8 rounded-[40px] bg-white border border-slate-200 shadow-sm hover:border-primary-200 transition-all"
          >
             <div className="h-16 w-16 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-600 flex-shrink-0">
                <Compass size={32} />
             </div>
             <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{m.name}</h3>
                <p className="text-slate-500 font-medium text-sm">{m.address}</p>
             </div>
             <div className="text-right space-y-1">
                <div className="text-primary-600 font-black text-lg">{m.jamat}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1">
                   <Navigation size={10} /> {m.distance}
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
