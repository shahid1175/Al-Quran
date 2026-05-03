import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, ChevronRight, Star, Sparkles, CheckCircle2, Lock, Zap, Book, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface Lesson {
  id: string;
  title: string;
  desc: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  duration: string;
  content: string;
  isLocked?: boolean;
}

const GRAMMAR_LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'The Three Parts of Speech',
    desc: 'Learn about Ism (Noun), Fi\'l (Verb), and Harf (Particle).',
    level: 'Basic',
    duration: '10 min',
    content: 'In Arabic, every word falls into one of three categories: \n\n1. **Ism (Noun):** Covers names, pronouns, adjectives, and adverbs. \n2. **Fi\'l (Verb):** Words that indicate an action in a specific time. \n3. **Harf (Particle):** Words that only make sense when connected to others (like "in", "on", "from").'
  },
  {
    id: '2',
    title: 'Sun and Moon Letters',
    desc: 'Understanding the definite article (Al) and its pronunciation.',
    level: 'Basic',
    duration: '15 min',
    content: 'Arabic letters are divided into 14 Sun letters and 14 Moon letters. This affects how the "L" in "AL" is pronounced.'
  },
  {
    id: '3',
    title: 'The Nominal Sentence (Jumlah Ismiyah)',
    desc: 'How to build sentences starting with a noun (Mubtada and Khabar).',
    level: 'Intermediate',
    duration: '20 min',
    content: 'A Nominal sentence usually consists of a Subject (Mubtada) and a Predicate (Khabar).'
  },
  {
    id: '4',
    title: 'Verb Conjugation: Past Tense',
    desc: 'Mastering the root patterns for past actions.',
    level: 'Intermediate',
    duration: '25 min',
    content: 'Arabic verbs are mostly derived from a 3-letter root (e.g., K-T-B for writing).',
    isLocked: true
  },
  {
    id: '5',
    title: 'Advanced Morphology (Sarf)',
    desc: 'Deep dive into the 10 forms of the Arabic verb.',
    level: 'Advanced',
    duration: '45 min',
    content: 'Complexity patterns of shifting verb forms to give nuanced meanings.',
    isLocked: true
  }
];

export default function Grammar() {
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Basic' | 'Intermediate' | 'Advanced'>('All');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const filteredLessons = GRAMMAR_LESSONS.filter(l => selectedLevel === 'All' || l.level === selectedLevel);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <header className="space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
           <GraduationCap size={14} />
           <span>Academic Track</span>
        </div>
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Learn Arabic Grammar</h1>
           <p className="text-slate-500 font-medium text-lg leading-relaxed">Master the language of the Quran from basic concepts to advanced linguistic structures.</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
           {['All', 'Basic', 'Intermediate', 'Advanced'].map((lvl) => (
             <button
               key={lvl}
               onClick={() => setSelectedLevel(lvl as any)}
               className={cn(
                 "px-6 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap",
                 selectedLevel === lvl 
                   ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                   : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-200"
               )}
             >
               {lvl}
             </button>
           ))}
        </div>
      </header>

      <div className="grid gap-6">
        {filteredLessons.map((lesson, idx) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => !lesson.isLocked && setActiveLesson(lesson)}
            className={cn(
              "group relative p-8 rounded-[40px] border transition-all cursor-pointer overflow-hidden bg-white shadow-sm",
              lesson.isLocked 
                ? "border-slate-100 opacity-60 grayscale cursor-not-allowed" 
                : "border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5"
            )}
          >
            <div className="flex items-start justify-between relative z-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className={cn(
                       "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                       lesson.level === 'Basic' ? "bg-emerald-50 text-emerald-600" :
                       lesson.level === 'Intermediate' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                     )}>
                       {lesson.level}
                     </span>
                     <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1 uppercase tracking-widest">
                        <Zap size={10} /> {lesson.duration}
                     </span>
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lesson.title}</h3>
                     <p className="text-slate-500 font-medium mt-1">{lesson.desc}</p>
                  </div>
               </div>
               
               <div className="flex items-center justify-center h-14 w-14 rounded-3xl bg-slate-50 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                  {lesson.isLocked ? <Lock size={20} /> : <ChevronRight size={24} />}
               </div>
            </div>

            {/* Progress indicator or decoration */}
            {!lesson.isLocked && (
              <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 rounded-full transition-all duration-500 w-0 group-hover:w-full opacity-30" />
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeLesson && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[48px] p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
              
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                          <Book size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{activeLesson.level} Lesson</p>
                          <h4 className="text-2xl font-black text-slate-900">{activeLesson.title}</h4>
                       </div>
                    </div>
                    <button onClick={() => setActiveLesson(null)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                       <ChevronRight size={24} className="rotate-90" />
                    </button>
                 </div>

                 <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 min-h-[300px]">
                    <div className="prose prose-indigo max-w-none">
                       <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
                          {activeLesson.content}
                       </p>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <button className="flex-1 py-5 rounded-[24px] bg-indigo-600 text-white font-extrabold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
                       <CheckCircle2 size={24} />
                       <span>Complete Lesson</span>
                    </button>
                    <button className="p-5 rounded-[24px] bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200">
                       <MessageSquare size={24} />
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
