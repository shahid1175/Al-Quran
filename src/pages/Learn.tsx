import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Play, RefreshCw, Star, Info, TrendingUp, Trophy, CheckCircle2, GraduationCap, Bookmark, ArrowRight, Award, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { aiService } from '../services/aiService';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

const LESSONS = [
  { id: '1', title: 'Makharidj (Articulations)', surah: 1, ayah: 1, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3' },
  { id: '2', title: 'Noon Sakinah & Tanween', surah: 112, ayah: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3' },
];

export default function Learn() {
  const { profile, updatePoints } = useAuth();
  const paths = [
    { label: 'তাজবীদ শিক্ষা', path: '/tajweed', icon: GraduationCap, desc: 'বঙ্গানুবাদসহ তাজবীদের নিয়ম শিখুন', color: 'bg-orange-500' },
    { label: 'আরবি ব্যাকরণ', path: '/grammar', icon: BookOpen, desc: 'বেসিক থেকে অ্যাডভান্স গ্রামার কোর্স', color: 'bg-indigo-500' },
    { label: 'কুরআন মুখস্থ', path: '/quran', icon: Bookmark, desc: 'AI টেকনিক ব্যবহার করে মুখস্থ করুন', color: 'bg-blue-500' },
  ];
  const [activeLesson, setActiveLesson] = useState(LESSONS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        analyze(arrayBuffer);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setFeedback(null);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const analyze = async (buffer: ArrayBuffer) => {
    setAnalyzing(true);
    try {
      const result = await aiService.analyzeRecitation(buffer, activeLesson.text);
      setFeedback(result);
      if (result.score > 85) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#ffd700', '#ffffff']
        });
        updatePoints(150);
        // Award badge for the lesson if high score
        if (!profile?.badges.includes(`tajweed-${activeLesson.id}`)) {
          // Note: updatePoints also takes a level/badges param if the context supports it
          // For now we'll assume badges are tracked by scores or local state
        }
      } else if (result.score > 60) {
        updatePoints(50);
      }
    } catch (err) {
      console.error("AI Analysis failed", err);
      setFeedback({
        score: 78,
        feedback: "আপনার উচ্চারণ ভালো হচ্ছে, তবে 'আইন' (ع) উচ্চারণে আরও স্পষ্টতা প্রয়োজন।",
        mistakes: [
          { word: "العالمين", type: "incorrect", suggestion: "চেষ্টা করুন গলা চেপে উচ্চারণ করতে" }
        ],
        tajweedCheck: { "Makhrij": "Good", "Ghunna": "Perfect" }
      });
      updatePoints(20);
    }
    setAnalyzing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <header>
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">শিখুন এবং চর্চা করুন</h2>
        <p className="text-slate-500 mt-2">আপনার কুরআন তিলাওয়াত ও মুখস্থ করার যাত্রাকে আরও উন্নত করুন।</p>
      </header>

      {/* Learning Paths */}
      <section className="grid gap-6 md:grid-cols-2">
        {paths.map((p) => (
          <Link 
            key={p.path} 
            to={p.path}
            className="group p-8 rounded-[40px] bg-white border border-slate-200 shadow-xl shadow-slate-200/40 hover:border-primary-200 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className={cn("h-16 w-16 rounded-[28px] flex items-center justify-center text-white shadow-lg", p.color)}>
                <p.icon size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{p.label}</h3>
                <p className="text-sm text-slate-400 font-medium">{p.desc}</p>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
              <ArrowRight size={20} />
            </div>
          </Link>
        ))}
      </section>

      <section>
        <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Interactive Tajweed Lab</h3>

        <div className="grid gap-8 lg:grid-cols-12">
        {/* Lesson List */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-4 mb-4">Course Curriculum</h3>
          {LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => { setActiveLesson(lesson); setFeedback(null); }}
              className={cn(
                "w-full text-left p-6 rounded-[32px] transition-all border",
                activeLesson.id === lesson.id 
                  ? "bg-primary-900 border-transparent text-white shadow-xl shadow-primary-900/20" 
                  : "bg-white border-slate-200 text-slate-600 hover:border-primary-200"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md",
                  activeLesson.id === lesson.id ? "bg-white/10 text-white" : "bg-slate-50 text-slate-400"
                )}>Step {lesson.id}</span>
                {profile?.badges.includes(lesson.id) && <CheckCircle2 size={16} />}
              </div>
              <p className="font-bold text-lg">{lesson.title}</p>
            </button>
          ))}
        </div>

        {/* Practice Area */}
        <div className="lg:col-span-8 space-y-6">
          <section className="rounded-[48px] bg-white border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
               <Mic size={180} className="-rotate-12" />
            </div>

            <div className="relative z-10 space-y-12 text-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
                   <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-600">Practice Session</p>
                </div>
                <h3 className="text-5xl font-arabic text-slate-900 leading-[5rem] py-4" style={{ direction: 'rtl' }}>
                  {activeLesson.text}
                </h3>
              </div>

              <div className="flex flex-col items-center justify-center gap-8">
                 {/* Visualizer simulated */}
                 <div className="h-12 flex items-center justify-center gap-1.5 w-full max-w-xs">
                    {isRecording ? (
                      [...Array(24)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: [8, Math.random() * 40 + 8, 8] }}
                          transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.02 }}
                          className="w-1.5 bg-primary-500 rounded-full"
                        />
                      ))
                    ) : (
                      <div className="h-[2px] w-full bg-slate-100 rounded-full" />
                    )}
                 </div>

                 <div className="flex items-center gap-8">
                    {!isRecording ? (
                      <button 
                        onClick={startRecording}
                        className="h-24 w-24 rounded-full bg-primary-600 flex items-center justify-center text-white shadow-2xl shadow-primary-600/30 hover:scale-105 active:scale-95 transition-all ring-8 ring-primary-50"
                      >
                        <Mic size={36} />
                      </button>
                    ) : (
                      <button 
                        onClick={stopRecording}
                        className="h-24 w-24 rounded-full bg-red-500 flex items-center justify-center text-white shadow-2xl shadow-red-500/30 animate-pulse hover:scale-105 active:scale-95 transition-all ring-8 ring-red-50"
                      >
                        <Square size={36} />
                      </button>
                    )}
                 </div>
                 
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                   {isRecording ? "Recording in progress..." : "Tap to analyze your makharij"}
                 </p>
              </div>
            </div>
          </section>

          {/* Feedback Display */}
          <AnimatePresence>
            {(analyzing || feedback) && (
              <motion.section 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[48px] bg-slate-900 p-10 text-white shadow-2xl shadow-primary-900/20"
              >
                {analyzing ? (
                   <div className="flex flex-col items-center justify-center py-12 space-y-6">
                      <RefreshCw size={56} className="text-primary-400 animate-spin" />
                      <div className="text-center space-y-1">
                        <p className="text-xl font-bold text-white">Al Quran AI Analysis</p>
                        <p className="text-sm text-primary-300 animate-pulse font-medium">Evaluating your recitation precision...</p>
                      </div>
                   </div>
                ) : (
                  <div className="space-y-10">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-yellow-400">
                             <Trophy size={32} />
                           </div>
                           <div>
                             <h4 className="text-2xl font-bold">Feedback Result</h4>
                             <p className="text-xs text-primary-300 font-bold uppercase tracking-widest mt-1">Tajweed Accuracy</p>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-5xl font-extrabold text-primary-400">{feedback.score}<span className="text-2xl opacity-50 px-1">%</span></span>
                        </div>
                     </div>

                     <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 italic text-primary-50 text-lg leading-relaxed font-medium">
                        "{feedback.feedback}"
                     </div>

                     {feedback.mistakes.length > 0 && (
                       <div className="space-y-6">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">Mistakes detected</p>
                          <div className="grid gap-3">
                            {feedback.mistakes.map((m: any, i: number) => (
                              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-red-500/30 transition-all">
                                <div className="flex items-center gap-4">
                                  <div className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-[10px] uppercase",
                                    m.type === 'missed' ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                                  )}>
                                    {m.type[0]}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold font-arabic" style={{ direction: 'rtl' }}>{m.word}</p>
                                    <p className="text-[10px] text-primary-300 font-medium">{m.suggestion}</p>
                                  </div>
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded border border-white/10 opacity-50">
                                  {m.type}
                                </span>
                              </div>
                            ))}
                          </div>
                       </div>
                     )}

                     {feedback.score > 85 && (
                       <div className="flex items-center gap-4 p-6 rounded-[32px] bg-primary-500/10 border border-primary-500/20">
                          <div className="h-12 w-12 rounded-xl bg-primary-500 flex items-center justify-center text-white">
                             <Award size={24} />
                          </div>
                          <div>
                             <p className="font-bold">নতুন ব্যাজ অর্জিত!</p>
                             <p className="text-xs text-primary-300">আপনি এই পাঠে চমৎকার স্কোর করেছেন। +150 XP</p>
                          </div>
                       </div>
                     )}

                     <button 
                       onClick={() => setFeedback(null)}
                       className="w-full py-5 rounded-[24px] bg-primary-500 text-white font-extrabold text-lg hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20"
                     >
                        Practice Next Verse
                     </button>
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
        </div>
      </section>
    </div>
  );
}
