import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, ArrowRight, Calendar, User } from 'lucide-react';

const ARTICLES = [
  { id: 1, title: 'Understanding the Benefits of Tahajjud', excerpt: 'The night prayer is one of the most virtuous acts of worship in Islam...', author: 'Dr. Zaid', date: 'Oct 20, 2023', category: 'Spirituality' },
  { id: 2, title: 'The Importance of Patience (Sabr)', excerpt: 'In times of trial, patience is the believers greatest weapon...', author: 'Sister Maryam', date: 'Oct 18, 2023', category: 'Etiquette' },
  { id: 3, title: 'A Guide to Feeding the Needy', excerpt: 'Charity does not decrease wealth, rather it purifies it...', author: 'Umar Khan', date: 'Oct 15, 2023', category: 'Charity' },
];

export default function Blog() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4 pt-8">
      <div className="space-y-4">
         <h1 className="text-4xl font-black text-slate-900 tracking-tight">Islamic Blog</h1>
         <p className="text-slate-500 font-medium text-lg">In-depth articles on faith, history, and practice.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ARTICLES.map((article, i) => (
          <motion.article 
            key={article.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group flex flex-col p-8 rounded-[40px] bg-white border border-slate-200 hover:border-primary-400 shadow-sm transition-all"
          >
             <div className="mb-6 space-y-4 flex-1">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{article.category}</span>
                <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">{article.title}</h3>
                <p className="text-slate-500 text-sm font-medium line-clamp-3">{article.excerpt}</p>
             </div>
             
             <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   <span className="flex items-center gap-1"><User size={12} /> {article.author}</span>
                   <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                </div>
                <button className="w-full py-4 rounded-2xl bg-primary-50 text-primary-600 font-bold group-hover:bg-primary-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
                   <span>Read More</span>
                   <ArrowRight size={16} />
                </button>
             </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
