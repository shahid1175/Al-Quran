import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Settings, LogOut, Award, Clock, Bell, Languages, Shield, ChevronRight, Download, Trash2, Target, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { storageService } from '../services/storageService';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { profile, logOut } = useAuth();
  const [downloadedCount, setDownloadedCount] = useState(0);

  useEffect(() => {
    storageService.getAllDownloadedIds().then(ids => setDownloadedCount(ids.length));
  }, []);

  const sections = [
    { label: 'Appearance', icon: Languages, desc: 'Font & translation settings' },
    { label: 'Notifications', icon: Bell, desc: 'Study reminders & prayer alerts' },
    { label: 'Privacy', icon: Shield, desc: 'Data & account protection' },
    { label: 'Downloads', icon: Download, desc: `${downloadedCount} Surahs available offline` },
  ];

  const goals = [
    { label: 'প্রতিদিনের পড়া', target: '৫টি আয়াত', progress: 60, color: 'bg-blue-500' },
    { label: 'মুখস্ত লক্ষ্য', target: '২টি পৃষ্ঠা', progress: 30, color: 'bg-green-500' },
    { label: 'তাজবীদ সেশন', target: '২০ মিনিট', progress: 85, color: 'bg-orange-500' },
  ];

  const badges = [
    { id: '1', name: 'Makharij Master', icon: '🏆', color: 'bg-yellow-100 text-yellow-700' },
    { id: '2', name: 'Early Bird', icon: '☀️', color: 'bg-orange-100 text-orange-700' },
    { id: '3', name: 'Consistent', icon: '🔥', color: 'bg-red-100 text-red-700' },
    { id: '4', name: 'Tajweed Pro', icon: '💎', color: 'bg-blue-100 text-blue-700' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <header className="flex flex-col items-center gap-6 pt-8 text-center h-20 bg-white -mx-4 lg:-mx-10 px-8 border-b border-slate-200 mb-20 mt-[-16px] lg:mt-[-32px]">
        <div className="relative mt-24">
          <img 
            src={profile?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky'} 
            className="h-32 w-32 rounded-[40px] border-4 border-white shadow-2xl object-cover ring-8 ring-slate-50" 
            alt="Profile"
          />
          <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white border-4 border-white shadow-lg">
             <Award size={20} />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{profile?.displayName}</h2>
          <p className="text-slate-400 font-medium">{profile?.email}</p>
        </div>
        <div className="flex gap-4">
          <div className="rounded-[32px] bg-primary-50 px-10 py-5 text-primary-900 border border-primary-100/50">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Makharij Level</p>
            <p className="text-3xl font-extrabold">{profile?.level}</p>
          </div>
          <div className="rounded-[32px] bg-orange-50 px-10 py-5 text-orange-700 border border-orange-100/50">
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Devotion Points</p>
            <p className="text-3xl font-extrabold">{profile?.points}</p>
          </div>
        </div>
      </header>

      <div className="grid gap-12 mt-24">
         {/* Personalized Goals */}
         <section className="rounded-[48px] bg-slate-900 p-10 text-white relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-[120px] opacity-20 -mb-32 -mr-32" />
            <div className="relative z-10 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <h3 className="text-2xl font-black flex items-center gap-3">
                        <Target className="text-primary-400" />
                        ব্যক্তিগত লক্ষ্যসমূহ (Goals)
                     </h3>
                     <p className="text-slate-400 font-medium text-sm">আপনার লক্ষ্য সেট করুন এবং অগ্রগতি ট্র্যাক করুন</p>
                  </div>
                  <button className="px-6 py-2 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">
                     লক্ষ্য পরিবর্তন করুন
                  </button>
               </div>

               <div className="grid gap-6 md:grid-cols-3">
                  {goals.map((goal) => (
                    <div key={goal.label} className="bg-white/5 backdrop-blur-md rounded-[32px] p-6 border border-white/10 space-y-4">
                       <div className="flex items-start justify-between">
                          <div>
                             <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">{goal.label}</p>
                             <p className="text-xl font-bold">{goal.target}</p>
                          </div>
                          <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center text-white", goal.color)}>
                             <TrendingUp size={16} />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                             <span>অগ্রগতি</span>
                             <span>{goal.progress}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${goal.progress}%` }}
                               className={cn("h-full", goal.color)} 
                             />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </section>

          <div className="grid gap-8 lg:grid-cols-2">
          {/* Badges Container */}
          <section className="rounded-[48px] bg-white border border-slate-200 p-10 shadow-sm space-y-8">
             <h3 className="text-xl font-bold tracking-tight">অর্জিত ব্যাজসমূহ (Badges)</h3>
             <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className={cn("flex flex-col items-center justify-center p-6 rounded-3xl border border-transparent transition-all hover:scale-105", badge.color)}>
                     <span className="text-4xl mb-3">{badge.icon}</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-center">{badge.name}</span>
                  </div>
                ))}
             </div>
          </section>

         {/* Settings Menu */}
         <div className="space-y-3">
           {sections.map((sec) => (
             <button 
               key={sec.label}
               className="w-full flex items-center justify-between p-7 rounded-[32px] bg-white border border-slate-200 hover:border-primary-300 transition-all group"
             >
                <div className="flex items-center gap-5">
                   <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      <sec.icon size={28} />
                   </div>
                   <div className="text-left">
                     <p className="font-bold text-slate-900 text-lg">{sec.label}</p>
                     <p className="text-xs text-slate-400 font-medium">{sec.desc}</p>
                   </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-primary-600 transition-all group-hover:translate-x-1" />
             </button>
           ))}

           <button 
             onClick={logOut}
             className="w-full flex items-center justify-center gap-3 p-7 rounded-[32px] bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all border border-red-100"
           >
              <LogOut size={22} />
              Sign out of Al Quran
           </button>
         </div>
      </div>
    </div>
  </div>
);
}
