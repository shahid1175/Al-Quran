import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronLeft, Star, StarOff, Info, Play, Award, Sparkles, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TAJWEED_RULES, TajweedRule } from '../lib/tajweed';
import { cn } from '../lib/utils';
import RecitationAnalyzer from '../components/RecitationAnalyzer';
import TajweedRuleModal from '../components/TajweedRuleModal';

export default function TajweedLessons() {
  const [practiceVerse, setPracticeVerse] = useState<string | null>(null);
  const [activeRule, setActiveRule] = useState<TajweedRule | null>(null);

  const startPractice = (verse: string) => {
    setPracticeVerse(verse);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md py-4 -mx-4 lg:-mx-10 px-8 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Link to="/learn" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">তাজবীদ শিক্ষা</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tajweed Rules Guide</p>
          </div>
        </div>
      </header>

      {/* Hero Welcome */}
      {!practiceVerse && (
        <section className="rounded-[48px] bg-gradient-to-br from-orange-400 to-orange-600 p-10 text-white shadow-2xl shadow-orange-500/20 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold border border-white/20">
                <Award size={16} />
                <span>Free for everyone</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">সহজ বাংলা ভাষায় তাজবীদ শিখন</h2>
            <p className="text-xl text-orange-50/80 max-w-xl font-medium">
              কুরআন সঠিকভাবে তিলাওয়াত করার জন্য তাজবীদ জানা অত্যন্ত গুরুত্বপূর্ণ। এখানে আমরা প্রধান নিয়মগুলো ব্যাখ্যা করেছি।
            </p>
            <button 
              onClick={() => startPractice("اَهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ")}
              className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-orange-50 transition-all active:scale-95"
            >
              <Mic size={20} />
              AI দিয়ে তিলাওয়াত যাচাই করুন
            </button>
          </div>
        </section>
      )}

      {/* AI Practice Lab - Shows when requested */}
      <AnimatePresence>
        {practiceVerse && (
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Sparkles size={20} className="text-emerald-600" />
                AI প্র্যাকটিস ল্যাব
              </h3>
              <button 
                onClick={() => setPracticeVerse(null)}
                className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                বন্ধ করুন (Close)
              </button>
            </div>
            <RecitationAnalyzer initialVerse={practiceVerse} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Rules Grid */}
      <div className="grid gap-8">
        {TAJWEED_RULES.map((rule, idx) => (
          <motion.section 
            key={rule.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            id={rule.label.toLowerCase()}
            className="group"
          >
            <div className="bg-white rounded-[40px] border border-slate-200 p-8 md:p-10 shadow-xl shadow-slate-200/40 hover:border-primary-200 transition-all">
              <div className="flex flex-col md:flex-row gap-8">
                 <div className="md:w-1/3 space-y-4">
                    <div className={cn("h-16 w-16 rounded-3xl flex items-center justify-center text-white shadow-lg", rule.color)}>
                       <BookOpen size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-slate-900 mb-1">{rule.label}</h3>
                       <p className="text-lg text-primary-600 font-bold">{rule.description}</p>
                    </div>
                 </div>
                 
                 <div className="md:w-2/3 space-y-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">বিস্তারিত ব্যাখ্যা (Explanation)</h4>
                       <p className="text-slate-700 leading-relaxed text-lg font-medium">
                         {rule.explanation}
                       </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">উদাহরণ (Example)</h4>
                          <p className="text-3xl font-serif text-right text-slate-900" style={{ direction: 'rtl' }}>{rule.example}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => setActiveRule(rule)}
                            className="flex items-center justify-center gap-3 bg-slate-100 text-slate-900 rounded-3xl p-4 font-bold hover:bg-slate-200 transition-colors"
                          >
                             <Play size={18} fill="currentColor" />
                             <span className="text-sm">শুনুন</span>
                          </button>
                          <button 
                            onClick={() => startPractice(rule.example)}
                            className="flex items-center justify-center gap-3 bg-emerald-600 text-white rounded-3xl p-4 font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                          >
                             <Mic size={18} />
                             <span className="text-sm">পরীক্ষা করুন</span>
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* Gamification Teaser */}
      <section className="bg-primary-900 rounded-[48px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4">
           <h3 className="text-3xl font-black">শিখুন এবং পয়েন্ট অর্জন করুন!</h3>
           <p className="text-lg opacity-70">তাজবীদ কুইজ সম্পন্ন করে ব্যাজ সংগ্রহ করুন। সবার জন্য উন্মুক্ত!</p>
        </div>
        <button className="whitespace-nowrap px-8 py-4 bg-primary-500 rounded-2xl font-bold hover:bg-primary-400 transition-all shadow-xl shadow-primary-500/20">
          কুইজ শুরু করুন
        </button>
      </section>

      <AnimatePresence>
        {activeRule && (
          <TajweedRuleModal 
            rule={activeRule} 
            onClose={() => setActiveRule(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
