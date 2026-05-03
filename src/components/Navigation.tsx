import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, GraduationCap, Trophy, User, Calendar, Compass } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/quran', label: 'Quran', icon: BookOpen },
  { path: '/learn', label: 'Learn', icon: GraduationCap },
  { path: '/grammar', label: 'Grammar', icon: Compass },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/profile', label: 'Profile', icon: User },
];

export function Navigation() {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col bg-primary-900 text-primary-50 py-8 lg:flex">
        <div className="px-6 mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">Q</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Al Quran</h1>
          </div>
          <p className="text-[10px] text-primary-300 font-mono uppercase tracking-[0.2em]">Light of Guidance</p>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                location.pathname === item.path 
                  ? "bg-primary-800/50 text-white shadow-sm" 
                  : "text-primary-100/70 hover:bg-primary-800/30 hover:text-white"
              )}
            >
              <item.icon size={20} className="opacity-70" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Prayer Widget in Sidebar like design */}
        <div className="mt-auto p-5 bg-primary-950/40 m-4 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-400">Next Activity</span>
          </div>
          <div className="text-lg font-bold mb-1 text-white">Prayer & Study</div>
          <div className="text-[9px] text-primary-300">Keep up the consistency!</div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200 bg-white/90 backdrop-blur-xl px-2 py-3 lg:hidden shadow-lg">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-200",
              location.pathname === item.path ? "text-primary-600" : "text-slate-400"
            )}
          >
            <item.icon size={22} className={cn(location.pathname === item.path && "scale-110")} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
