import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, 
  Search, 
  Library, 
  Sparkles, 
  Info, 
  AlertCircle,
  ArrowRight,
  BookOpen,
  Filter
} from 'lucide-react';
import { aiService, IslamicBook } from '../services/aiService';
import { cn } from '../lib/utils';

export default function IslamicBooks() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<IslamicBook[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const results = await aiService.searchIslamicBooks(query);
      setBooks(results);
      if (results.length === 0) {
        setError("No Islamic books found for this search. Please try a different query or focus on Islamic topics.");
      }
    } catch (err) {
      setError("Something went wrong while searching. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Tafsir", "Hadith", "Seerah", "Fiqh", "History", "Spirituality"];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest"
        >
          <Library size={14} />
          Digital Maktabah
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight"
        >
          Islamic Books <span className="text-emerald-600">Assistant</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed"
        >
          Discover authentic Islamic literature from classical texts to modern scholarship, powered by AI to ensure relevance and authenticity.
        </motion.p>
      </section>

      {/* Search Section */}
      <section className="max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books on Quran, Fiqh, Seerah, or any Islamic topic..."
            className="w-full pl-14 pr-32 py-5 bg-white border-2 border-slate-100 rounded-[24px] text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 shadow-sm transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={18} />
                <span>Search</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => { setQuery(cat); handleSearch({ preventDefault: () => {} } as any); }}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-1.5 border border-slate-100 rounded-full hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Results Section */}
      <section className="space-y-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-4"
            >
              <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Scanning the digital library...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto p-8 bg-amber-50 rounded-[32px] border border-amber-100 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <p className="text-amber-900 font-bold leading-relaxed">{error}</p>
            </motion.div>
          ) : books.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {books.map((book, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white p-8 rounded-[40px] border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-500/5 relative overflow-hidden"
                >
                  {/* Category Badge */}
                  <div className="absolute top-0 right-0 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-bl-[20px] text-[10px] font-black uppercase tracking-widest border-l border-b border-emerald-100">
                    {book.category}
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <BookOpen size={24} />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">By {book.author}</p>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {book.description}
                    </p>

                    <div className="pt-6 mt-6 border-t border-slate-50 space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                        <div className="mt-1 shrink-0 text-emerald-600">
                          <Info size={14} />
                        </div>
                        <p className="text-[11px] font-medium text-emerald-800 leading-relaxed italic">
                          "{book.relevance}"
                        </p>
                      </div>
                      
                      <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 group/btn hover:bg-slate-800 transition-all">
                        View Details
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : searched ? (
            <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-[10px]">No books to display</div>
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10"
            >
              {[
                { title: "Seek Knowledge", icon: <Library />, text: "Search for classical or contemporary works across all Islamic disciplines." },
                { title: "AI Filtering", icon: <Sparkles />, text: "Our AI ensures that only authentic Islamic literature is recommended to you." },
                { title: "Organized Content", icon: <Filter />, text: "Books are categorized automatically to help you build your digital library." }
              ].map((feature, i) => (
                <div key={i} className="bg-slate-50 p-8 rounded-[40px] space-y-4 border border-slate-100">
                  <div className="w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
