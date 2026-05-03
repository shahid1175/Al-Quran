import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation } from './Navigation';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading, signIn } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fdfdfd]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0D5C46] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-10 rounded-[40px] bg-white p-12 shadow-2xl shadow-slate-200 border border-slate-100"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-primary-500 text-white shadow-xl shadow-primary-200 font-bold text-4xl">
             NQ
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary-900">Al Quran</h1>
            <p className="text-slate-500 text-lg leading-relaxed">Illuminate your heart with the light of the Quran. AI-powered learning for everyone.</p>
          </div>
          <button 
            onClick={signIn}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 py-4 text-lg font-bold text-white transition-all hover:bg-primary-700 shadow-lg shadow-primary-200 active:scale-95"
          >
            <LogIn size={22} className="transition-transform group-hover:translate-x-1" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:pl-64">
      <Navigation />
      <main className="pb-24 pt-4 lg:pb-8 lg:pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="px-4 lg:px-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
