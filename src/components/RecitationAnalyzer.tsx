import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Play, RefreshCcw, Loader2, CheckCircle2, AlertCircle, Volume2, Award, Sparkles } from 'lucide-react';
import { aiService } from '../services/aiService';
import { parseTajweed } from '../lib/tajweed';

interface RecitationAnalyzerProps {
  initialVerse?: string;
  onComplete?: (score: number) => void;
}

export default function RecitationAnalyzer({ initialVerse = "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", onComplete }: RecitationAnalyzerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      setAnalysis(null);
      
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('মাইক্রোফোন অ্যাক্সেস করা সম্ভব হয়নি। দয়া করে অনুমতি দিন।');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const analyzeAudio = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const buffer = await audioBlob.arrayBuffer();
      // Clean the verse text (remove transliterations in brackets)
      const cleanedVerse = initialVerse.split('(')[0].trim();
      const result = await aiService.analyzeRecitation(buffer, cleanedVerse);
      setAnalysis(result);
      if (onComplete) onComplete(result.score);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('দুঃখিত, বিশ্লেষণের সময় একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setAnalysis(null);
    setError(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-200 p-8 md:p-10 shadow-2xl shadow-slate-200/40 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
          <Sparkles size={14} />
          <span>AI Tajweed Advisor</span>
        </div>
        <h3 className="text-3xl font-black text-slate-900">তিলাওয়াত পরীক্ষা করুন</h3>
        <p className="text-slate-500 font-medium max-w-lg mx-auto">
          নিচের আয়াতটি তিলাওয়াত করুন এবং এআই-এর মাধ্যমে আপনার উচ্চারণ ও তাজবীদ যাচাই করুন।
        </p>
      </div>

      <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Volume2 size={80} />
        </div>
        <p 
          className="text-4xl md:text-5xl font-serif text-center text-slate-900 leading-relaxed mb-4" 
          style={{ direction: 'rtl' }}
          dangerouslySetInnerHTML={{ __html: initialVerse.includes('[') ? parseTajweed(initialVerse) : initialVerse }}
        />
        <p className="text-center text-sm font-bold text-slate-400 italic">
          "{initialVerse}"
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          {!audioUrl && !isRecording && (
            <motion.button
              key="start"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={startRecording}
              className="w-24 h-24 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-95"
            >
              <Mic size={36} />
            </motion.button>
          )}

          {isRecording && (
            <motion.div
              key="recording"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-red-500/20 rounded-full" 
                />
                <button
                  onClick={stopRecording}
                  className="relative w-24 h-24 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-600/30 active:scale-95 z-10"
                >
                  <Square size={36} fill="white" />
                </button>
              </div>
              <span className="text-xl font-mono font-bold text-red-600">{formatTime(recordingTime)}</span>
              <p className="text-sm font-bold text-slate-400 animate-pulse">রেকর্ডিং হচ্ছে...</p>
            </motion.div>
          )}

          {audioUrl && !isAnalyzing && !analysis && (
            <motion.div
              key="preview"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={reset}
                className="w-14 h-14 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all active:scale-95"
                title="আবার রেকর্ড করুন"
              >
                <RefreshCcw size={20} />
              </button>
              <button
                onClick={analyzeAudio}
                className="px-10 py-5 bg-slate-900 text-white rounded-full font-black text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-3"
              >
                বিষয়টি পরীক্ষা করুন
                <Sparkles size={20} />
              </button>
              <audio src={audioUrl} id="audio-playback" hidden />
              <button
                onClick={() => (document.getElementById('audio-playback') as HTMLAudioElement).play()}
                className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-all active:scale-95"
                title="শুনুন"
              >
                <Play size={20} fill="currentColor" />
              </button>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 size={48} className="text-emerald-600 animate-spin" />
              <p className="text-lg font-bold text-slate-900">AI বিশ্লেষণ করছে...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-4 py-2 rounded-xl border border-red-100"
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}
      </div>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 border-t border-slate-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl flex flex-col items-center justify-center shadow-lg shadow-emerald-600/20">
                  <span className="text-2xl font-black">{analysis.score}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Score</span>
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">বিশ্লেষণ ফলাফল</h4>
                  <p className="text-slate-500 font-medium">আপনার তিলাওয়াতের মান ও পরামর্শ নিচে দেওয়া হলো।</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <p className="text-slate-700 leading-relaxed font-medium text-lg italic">
                  "{analysis.feedback}"
                </p>
              </div>

              {analysis.mistakes && analysis.mistakes.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">ভুল সংশোধন (Corrections)</h5>
                  <div className="space-y-2">
                    {analysis.mistakes.map((mistake: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black">"{mistake.word}"</p>
                          <p className="text-sm font-medium opacity-80">{mistake.suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
               <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">তাজবীদ রিপোর্ট (Tajweed Report)</h5>
               <div className="grid gap-4">
                  {analysis.tajweedCheck && Object.entries(analysis.tajweedCheck).map(([rule, status]: [string, any], i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                          <CheckCircle2 size={20} className={status === 'Good' || status === 'Excellent' || status.toString().includes('সঠিক') ? 'text-emerald-500' : 'text-slate-300'} />
                        </div>
                        <span className="font-bold text-slate-700">{rule}</span>
                      </div>
                      <span className={cn(
                        "text-xs font-black px-3 py-1 rounded-full",
                        status === 'Good' || status === 'Excellent' || status.toString().includes('সঠিক') 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-orange-100 text-orange-700"
                      )}>
                        {status}
                      </span>
                    </div>
                  ))}
                  
                  <div className="p-6 bg-slate-900 text-white rounded-[32px] space-y-4">
                     <div className="flex items-center gap-2">
                        <Award className="text-orange-400" />
                        <span className="font-black uppercase tracking-widest text-[10px]">Next Milestone</span>
                     </div>
                     <p className="text-lg font-bold">পরবর্তী ধাপে যেতে আরও চর্চা করুন!</p>
                     <button 
                       onClick={reset}
                       className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-bold flex items-center justify-center gap-2"
                     >
                       <RefreshCcw size={16} />
                       আবার চেষ্টা করুন
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
