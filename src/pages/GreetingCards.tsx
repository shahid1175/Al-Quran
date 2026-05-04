import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Send, Heart, Star, Sparkles, Gift, Moon, Sun } from 'lucide-react';

const CARDS = [
  { id: 1, title: 'Eid Mubarak', color: 'bg-emerald-500', icon: Star },
  { id: 2, title: 'Jummah Mubarak', color: 'bg-indigo-500', icon: Sparkles },
  { id: 3, title: 'Ramadan Kareem', color: 'bg-amber-500', icon: Moon },
  { id: 5, title: 'Eid ul Fitr', color: 'bg-teal-600', icon: Gift },
  { id: 6, title: 'Eid ul Adha', color: 'bg-rose-600', icon: Heart },
  { id: 4, title: 'Hajj Mubarak', color: 'bg-slate-900', icon: Sun },
];

export default function GreetingCards() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4 pt-8">
      <div className="space-y-4">
         <h1 className="text-4xl font-black text-slate-900 tracking-tight">Greeting Cards</h1>
         <p className="text-slate-500 font-medium text-lg">Send beautiful digital blessings to your friends and family.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {CARDS.map((card, i) => (
          <motion.div 
            key={card.id}
            whileHover={{ y: -8 }}
            className={`group relative h-80 rounded-[48px] ${card.color} overflow-hidden shadow-2xl shadow-slate-200 cursor-pointer p-10 flex flex-col justify-end text-white`}
          >
             <div className="absolute top-0 right-0 p-12 opacity-20 group-hover:scale-125 transition-transform duration-500">
                <card.icon size={120} />
             </div>
             
             <div className="relative z-10 space-y-4">
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{card.title}</h3>
                <p className="text-white/70 font-medium">Click to personalize and share</p>
                <div className="flex gap-2 pt-4">
                   <button className="flex-1 py-4 bg-white/20 backdrop-blur-md rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition-all">
                      <Send size={18} />
                      Send
                   </button>
                   <button className="aspect-square py-4 px-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all">
                      <Heart size={18} />
                   </button>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
