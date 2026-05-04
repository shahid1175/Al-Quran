import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Calculator, 
  MapPin, 
  CreditCard, 
  Soup, 
  HandHeart, 
  Star, 
  Video, 
  Newspaper, 
  Compass, 
  Mountain,
  Milestone,
  BookOpen,
  Scale,
  Calendar,
  Book
} from 'lucide-react';

const TOOLS = [
  { id: 'calendar', label: 'Islamic Calendar', icon: Calendar, desc: 'Hijri dates and important events', color: 'bg-emerald-600', path: '/calendar' },
  { id: 'books', label: 'Islamic Books', icon: Book, desc: 'Search authentic Islamic literature', color: 'bg-indigo-600', path: '/books' },
  { id: 'duas', label: 'Daily Duas', icon: Heart, desc: 'Supplications for every occasion', color: 'bg-rose-500', path: '/duas' },
  { id: 'quotes', label: 'Inspirational Quotes', icon: Star, desc: 'Wisdom from Quran & Hadith', color: 'bg-amber-500', path: '/quotes' },
  { id: 'zakat', label: 'Zakat Calculator', icon: Calculator, desc: 'Calculate your obligatory charity', color: 'bg-emerald-500', path: '/zakat' },
  { id: 'mosque', label: 'Mosque Finder', icon: MapPin, desc: 'Find nearby Masjids', color: 'bg-blue-500', path: '/mosque' },
  { id: 'halal', label: 'Halal Food', icon: Soup, desc: 'Locate halal restaurants', color: 'bg-orange-500', path: '/halal' },
  { id: 'names', label: '99 Names', icon: Star, desc: 'Asma-ul-Husna with benefits', color: 'bg-indigo-500', path: '/names' },
  { id: 'live', label: 'Makkah Live', icon: Video, desc: 'Watch 24/7 Haramain stream', color: 'bg-slate-900', path: '/live' },
  { id: 'guides', label: 'Hajj & Umrah', icon: Mountain, desc: 'Step-by-step pilgrimage guides', color: 'bg-teal-500', path: '/guides' },
  { id: 'blog', label: 'Blog Articles', icon: Newspaper, desc: 'Islamic insights and news', color: 'bg-sky-500', path: '/blog' },
  { id: 'cards', label: 'Greeting Cards', icon: CreditCard, desc: 'Send blessings to loved ones', color: 'bg-fuchsia-500', path: '/cards' },
  { id: 'hadith', label: 'Hadith Library', icon: BookOpen, desc: 'Browse valid prophetic sayings', color: 'bg-emerald-600', path: '/hadith' },
  { id: 'fiqh', label: 'Fiqh Guide', icon: Scale, desc: 'Islamic rulings and AI Q&A', color: 'bg-indigo-600', path: '/fiqh' },
  { id: 'prayers', label: 'Prayer Requests', icon: HandHeart, desc: 'Community dua wall', color: 'bg-violet-500', path: '/prayers' },
];

export default function Explore() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4">
      <header className="space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary-100">
           <Compass size={14} />
           <span>Explore Hub</span>
        </div>
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Islamic Utilities</h1>
           <p className="text-slate-500 font-medium text-lg leading-relaxed">Dedicated tools to assist your spiritual journey and daily life.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TOOLS.map((tool, idx) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link 
              to={tool.path}
              className="group flex items-center gap-6 p-6 rounded-[32px] bg-white border border-slate-200 hover:border-primary-400 hover:shadow-xl hover:shadow-primary-500/5 transition-all"
            >
              <div className={`${tool.color} h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
                 <tool.icon size={28} />
              </div>
              <div className="flex-1">
                 <h3 className="font-bold text-slate-900 text-lg">{tool.label}</h3>
                 <p className="text-sm text-slate-500 font-medium">{tool.desc}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                 <Milestone className="text-primary-500" size={20} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
