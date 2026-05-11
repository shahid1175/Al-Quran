import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Settings, LogOut, Award, Clock, Bell, Languages, Shield, ChevronRight, Download, Trash2, Target, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { storageService } from '../services/storageService';
import { bookmarkService } from '../services/bookmarkService';
import { hadithService } from '../services/hadithService';
import { Bookmark as BookmarkType, FavoriteHadith } from '../types';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, profile, logOut } = useAuth();
  const [downloadedCount, setDownloadedCount] = useState(0);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [favoriteHadiths, setFavoriteHadiths] = useState<FavoriteHadith[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [loadingHadiths, setLoadingHadiths] = useState(true);

  useEffect(() => {
    storageService.getAllDownloadedIds().then(ids => setDownloadedCount(ids.length));
    if (user) {
      bookmarkService.getBookmarks(user.uid).then(data => {
        setBookmarks(data);
        setLoadingBookmarks(false);
      });
      hadithService.getFavorites(user.uid).then(data => {
        setFavoriteHadiths(data);
        setLoadingHadiths(false);
      });
    }
  }, [user]);

  const removeBookmark = async (id: string) => {
    if (!user) return;
    await bookmarkService.deleteBookmark(user.uid, id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const removeFavoriteHadith = async (id: string) => {
    if (!user) return;
    await hadithService.removeFavorite(user.uid, id);
    setFavoriteHadiths(prev => prev.filter(h => h.id !== id));
  };

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
            {/* Bookmarks Section */}
            <section className="rounded-[48px] bg-white border border-slate-200 p-10 shadow-sm space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight">Saved Ayahs & Notes</h3>
                  <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase">{bookmarks.length}</span>
               </div>
               
               <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {loadingBookmarks ? (
                    <div className="text-center py-10 text-slate-400 animate-pulse">Loading bookmarks...</div>
                  ) : bookmarks.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                       <p className="text-slate-400 font-medium">No bookmarks yet</p>
                    </div>
                  ) : (
                    bookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="group p-6 rounded-[32px] bg-slate-50 border border-slate-100 hover:border-primary-200 transition-all space-y-4">
                         <div className="flex items-start justify-between">
                            <Link to={`/quran/${bookmark.surahId}`} className="space-y-1">
                               <p className="font-bold text-slate-900">Surah {bookmark.surahId}:{bookmark.ayahId}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                 {bookmark.createdAt ? 'Saved' : 'Just now'}
                               </p>
                            </Link>
                            <button 
                              onClick={() => bookmark.id && removeBookmark(bookmark.id)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                               <Trash2 size={16} />
                            </button>
                         </div>
                         
                         {bookmark.note && (
                           <div className="p-4 rounded-2xl bg-white border border-slate-100/50 shadow-sm">
                              <p className="text-[10px] font-black uppercase text-primary-600 tracking-tighter mb-1">My Note</p>
                              <p className="text-sm text-slate-700 font-medium leading-relaxed">{bookmark.note}</p>
                           </div>
                         )}
                      </div>
                    ))
                  )}
               </div>
            </section>
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

          {/* Favorite Hadiths */}
          <section className="rounded-[48px] bg-white border border-slate-200 p-10 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight">Favorite Hadiths</h3>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">{favoriteHadiths.length}</span>
             </div>
             
             <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {loadingHadiths ? (
                  <div className="text-center py-10 text-slate-400 animate-pulse">Loading favorites...</div>
                ) : favoriteHadiths.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                     <p className="text-slate-400 font-medium">No saved hadiths yet</p>
                  </div>
                ) : (
                  favoriteHadiths.map((h) => (
                    <div key={h.id} className="group p-8 rounded-[40px] bg-emerald-50/30 border border-emerald-100 hover:border-emerald-300 transition-all space-y-6">
                       <div className="flex items-start justify-between">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{h.book}</p>
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400">No. {h.hadithNumber}</span>
                             </div>
                          </div>
                          <button 
                            onClick={() => h.id && removeFavoriteHadith(h.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>

                       <div className="space-y-6">
                          {h.textAr && (
                             <p className="text-2xl font-bold text-slate-900 leading-relaxed text-right font-madani" dir="rtl">
                                {h.textAr}
                             </p>
                          )}
                          
                          {h.textBn && (
                             <div className="p-5 bg-white/50 rounded-2xl border border-emerald-100/50">
                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">বাংলা অনুবাদ</h4>
                                <p className="text-slate-800 font-bold leading-relaxed font-bengali">
                                  {h.textBn}
                                </p>
                             </div>
                          )}

                          <div className="pt-2">
                            <h4 className="text-[9px] font-black text-slate-300 uppercase mb-1">English</h4>
                            <p className="text-slate-600 font-medium leading-relaxed italic">"{h.text}"</p>
                          </div>
                       </div>
                       
                       <p className="text-[10px] font-medium text-slate-300 pt-4 border-t border-emerald-100/30 italic">
                         {h.reference}
                       </p>
                    </div>
                  ))
                )}
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
