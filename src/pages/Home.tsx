import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { Clock, BookOpen, Star, TrendingUp, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { quranService } from '../services/quranService';
import { hadithService } from '../services/hadithService';
import { getHijriDate, getNextEvent } from '../services/calendarService';
import { Ayah, Hadith } from '../types';

export default function Home() {
  const { profile } = useAuth();
  const { times, location } = usePrayerTimes();
  const [hijri, setHijri] = useState(getHijriDate());
  const [dailyAyah, setDailyAyah] = useState<{ ayah: Ayah; translation: string; surahName: string } | null>(null);
  const [dailyHadith, setDailyHadith] = useState<Hadith | null>(null);
  const [isSavingHadith, setIsSavingHadith] = useState(false);
  const nextEvent = getNextEvent(hijri);

  useEffect(() => {
    quranService.getDailyAyah().then(data => setDailyAyah(data));
    hadithService.getDailyHadith().then(hadith => setDailyHadith(hadith));
    
    const timer = setInterval(() => setHijri(getHijriDate()), 1000 * 60 * 60);
    return () => clearInterval(timer);
  }, []);

  const handleSaveHadith = async () => {
    if (!profile?.uid || !dailyHadith) return;
    setIsSavingHadith(true);
    try {
      await hadithService.saveToFavorites(profile.uid, dailyHadith);
      // Optional: Show success toast
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingHadith(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between h-20 bg-white -mx-4 lg:-mx-10 px-8 border-b border-slate-200 mb-8 mt-[-16px] lg:mt-[-32px]">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">As-salamu Alaykum, {profile?.displayName?.split(' ')[0]}!</h2>
          <p className="text-xs text-slate-400 font-medium">{formatDate(new Date())} • {location}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Streak: 12 Days 🔥</span>
            <div className="h-1.5 w-32 rounded-full bg-slate-100 mt-1 overflow-hidden">
              <div 
                className="h-full rounded-full bg-primary-500 transition-all" 
                style={{ width: `${(profile?.points || 0) % 1000 / 10}%` }} 
              />
            </div>
          </div>
          <div className="h-10 w-10 rounded-full border-2 border-primary-500 flex items-center justify-center text-primary-600 font-bold bg-primary-50 text-sm">
            {profile?.points}
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Prayer Times Carrier */}
        <section className="lg:col-span-8 rounded-[32px] bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                <Clock size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Prayer Times</h3>
            </div>
            <Link to="/qibla" className="text-xs font-bold text-primary-600 hover:underline uppercase tracking-widest flex items-center gap-1">
              <MapPin size={14} /> Qibla Direction
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 lg:grid-cols-6 text-center">
            {times && Object.entries(times).map(([name, time]) => (
              <div key={name} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-primary-200 transition-all group">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary-600 transition-colors">{name}</span>
                <span className="text-sm font-bold text-slate-900">{time as string}</span>
              </div>
            ))}
            {!times && <div className="col-span-full py-4 text-center text-slate-400 animate-pulse">Detecting times...</div>}
          </div>
        </section>

        {/* Hijri Calendar */}
        <Link to="/calendar" className="lg:col-span-4 rounded-[32px] bg-primary-900 p-8 text-white shadow-xl shadow-primary-900/20 flex flex-col justify-between hover:scale-[1.02] transition-transform group">
          <div className="flex items-center gap-3 mb-6">
             <CalendarIcon size={24} className="text-primary-400" />
             <h3 className="text-xl font-bold">Islamic Calendar</h3>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-extrabold">{hijri.day} {hijri.monthName}</p>
            <p className="text-lg opacity-70 font-medium">{hijri.year} Hijri</p>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-primary-400">Up next</p>
            <p className="font-semibold text-lg">{nextEvent.name}</p>
            <p className="text-xs opacity-60 truncate">{nextEvent.description}</p>
          </div>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Daily Ayah */}
        <section className="lg:col-span-7 rounded-[40px] bg-white p-10 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <span className="inline-block px-3 py-1 rounded-lg bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-widest">Verse of the Day</span>
              <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                <Star size={20} />
              </button>
            </div>
            {dailyAyah ? (
               <div className="space-y-8">
                  <p className="text-4xl font-arabic text-right leading-[3.5rem] text-slate-900 font-serif" style={{ direction: 'rtl' }}>
                    {dailyAyah.ayah.text}
                  </p>
                  <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100">
                    <h4 className="text-xs font-bold text-primary-800 mb-2 uppercase tracking-wide">Translation</h4>
                    <p className="text-primary-950 font-medium leading-relaxed italic">"{dailyAyah.translation}"</p>
                    <p className="text-[10px] font-bold text-primary-600 mt-4 uppercase tracking-widest">Surah {dailyAyah.surahName} • Verse {dailyAyah.ayah.numberInSurah}</p>
                  </div>
               </div>
            ) : (
              <div className="h-48 w-full animate-pulse bg-slate-100 rounded-3xl" />
            )}
          </div>
        </section>

        {/* Quick Progress */}
        <section className="lg:col-span-4 rounded-[40px] bg-white border border-slate-200 p-10 shadow-sm">
           <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm shadow-orange-100">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Learning</h3>
            </div>
            <Link to="/profile" className="text-xs font-bold text-primary-600 hover:underline">Analysis</Link>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16">
                   <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="stroke-slate-100" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="stroke-primary-500" strokeDasharray="65, 100" strokeWidth="4" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-slate-800">65%</div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Advanced Tajweed</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">12 of 18 lessons</p>
                </div>
              </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1 border border-slate-100">
                 <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Daily Goal</span>
                 <span className="text-lg font-bold text-primary-700">5 Ayahs</span>
              </div>
            </div>
          </div>
        </section>

        {/* Hadith of the Day */}
        <section className="lg:col-span-8 rounded-[40px] bg-white border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-8">
            <span className="inline-block px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest">Hadith of the Day</span>
            <button 
              onClick={handleSaveHadith}
              disabled={isSavingHadith}
              className={cn(
                "p-2 rounded-full transition-all",
                isSavingHadith ? "animate-pulse text-emerald-400" : "hover:bg-emerald-50 text-slate-400 hover:text-emerald-500"
              )}
            >
              <Star size={20} fill={isSavingHadith ? "currentColor" : "none"} />
            </button>
          </div>
          {dailyHadith ? (
            <div className="space-y-8">
              <div className="space-y-6">
                {dailyHadith.textAr && (
                  <p className="text-4xl font-arabic text-right leading-[3.5rem] text-slate-900 font-serif" style={{ direction: 'rtl' }}>
                    {dailyHadith.textAr}
                  </p>
                )}
                
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wide">English Translation</h4>
                  <p className="text-emerald-950 font-medium leading-relaxed italic">
                    "{dailyHadith.text}"
                  </p>
                </div>

                {dailyHadith.textBn && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                       <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">বাংলা অনুবাদ</h4>
                       <span className="text-[8px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase font-bengali">ইসলামিক ফাউন্ডেশন</span>
                    </div>
                    <p className="text-slate-800 font-bold leading-relaxed font-bengali">
                      {dailyHadith.textBn}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                       <BookOpen size={16} />
                    </div>
                    <span className="text-sm font-black text-emerald-600 uppercase tracking-tighter">
                      — {dailyHadith.book}
                    </span>
                 </div>
                 <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                   No. {dailyHadith.hadithNumber}
                 </span>
              </div>
            </div>
          ) : (
            <div className="h-40 w-full animate-pulse bg-slate-100 rounded-3xl" />
          )}
        </section>
      </div>
    </div>
  );
}
