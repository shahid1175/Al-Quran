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
  const [selectedBook, setSelectedBook] = useState<IslamicBook | null>(null);
  const [bookDetails, setBookDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = (customQuery || query).trim();
    if (!finalQuery) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const results = await aiService.searchIslamicBooks(finalQuery);
      setBooks(results);
      if (results.length === 0) {
        setError("দুঃখিত, এই বিষয়ে কোনো ইসলামিক বই পাওয়া যায়নি। অনুগ্রহ করে অন্য কিছু খুঁজুন। (No Islamic books found for this search.)");
      }
    } catch (err) {
      setError("অনুসন্ধান করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন। (Something went wrong while searching.)");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (book: IslamicBook) => {
    setSelectedBook(book);
    setLoadingDetails(true);
    setBookDetails(null);
    try {
      // Use both title and author for a more specific details fetch
      const details = await aiService.getBookDetails(book.title, book.author);
      setBookDetails(details);
    } catch (err) {
      console.error('Failed to load book details:', err);
      setError("বইটির বিস্তারিত তথ্য লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
      setSelectedBook(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleTopicClick = (topic: string) => {
    setSelectedBook(null);
    setQuery(topic);
    handleSearch(undefined, topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { bn: "তফসীর", en: "Tafsir" },
    { bn: "হাদিস", en: "Hadith" },
    { bn: "সীরাত", en: "Seerah" },
    { bn: "ফিকহ", en: "Fiqh" },
    { bn: "ইতিহাস", en: "History" },
    { bn: "আধ্যাত্মিকতা", en: "Spirituality" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4 sm:px-6">
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
          আবিষ্কার করুন অথেনটিক ইসলামিক বই, যা ক্লাসিক্যাল থেকে আধুনিক পণ্ডিত্যপূর্ণ বইয়ের বিশাল ভাণ্ডার।
        </motion.p>
      </section>

      {/* Search Section */}
      <section className="max-w-3xl mx-auto">
        <form onSubmit={(e) => handleSearch(e)} className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="কুরআন, ফিকহ, সীরাত বা যেকোনো ইসলামিক বই খুঁজুন..."
            className="w-full pl-14 pr-32 py-5 bg-white border-2 border-slate-100 rounded-[24px] text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 shadow-sm transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={18} />
                <span>খুঁজুন</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {categories.map((cat, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { 
                const combinedQuery = `${cat.bn} ${cat.en}`;
                setQuery(combinedQuery); 
                handleSearch(undefined, combinedQuery); 
              }}
              className="group flex items-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 rounded-[24px] hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <div className="flex flex-col items-center leading-none text-center">
                <span className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{cat.bn}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-500 transition-colors mt-1">({cat.en})</span>
              </div>
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
              <button 
                onClick={() => setSearched(false)}
                className="text-xs font-bold text-amber-600 underline uppercase tracking-widest"
              >
                Clear Results
              </button>
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
                  className="group bg-white p-8 rounded-[40px] border border-slate-200 hover:border-emerald-300 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden flex flex-col h-full"
                >
                  {/* Category Badge */}
                  <div className="absolute top-0 right-0 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-bl-[20px] text-[10px] font-black uppercase tracking-widest border-l border-b border-emerald-100">
                    {book.category}
                  </div>

                  <div className="space-y-4 pt-4 flex-grow">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <BookOpen size={24} />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">By {book.author}</p>
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
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(book);
                      }}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group/btn hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10 active:scale-95 z-10"
                    >
                      বিস্তারিত দেখুন (View Details)
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.author + ' Islamic book read online')}`}
                      target="_top"
                      className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border border-slate-200 text-xs active:scale-95 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      অনলাইনে পড়ুন (Read Online)
                      <ArrowRight size={12} className="opacity-50" />
                    </a>
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

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-[48px] shadow-2xl overflow-y-auto no-scrollbar"
            >
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-6 right-6 p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
              >
                <ArrowRight className="rotate-180" size={24} />
              </button>

              <div className="p-8 sm:p-12 space-y-10">
                <div className="space-y-4">
                  <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {selectedBook.category}
                  </span>
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                      {selectedBook.title}
                    </h2>
                    <p className="text-lg font-bold text-emerald-600">By {selectedBook.author}</p>
                  </div>
                </div>

                {loadingDetails ? (
                  <div className="space-y-8 animate-pulse">
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-100 rounded-full w-full" />
                      <div className="h-4 bg-slate-100 rounded-full w-5/6" />
                      <div className="h-4 bg-slate-100 rounded-full w-4/6" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-slate-100 rounded-3xl" />
                      <div className="h-24 bg-slate-100 rounded-3xl" />
                    </div>
                  </div>
                ) : bookDetails ? (
                  <div className="space-y-10">
                    <div className="prose prose-slate max-w-none">
                      <p className="text-lg text-slate-600 leading-[1.8] font-medium whitespace-pre-line">
                        {bookDetails.fullDescription}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">মূল বিষয়সমূহ (Key Topics)</h4>
                        <ul className="space-y-2">
                          {bookDetails.keyTopics.map((topic: string, i: number) => (
                            <li key={i}>
                              <button 
                                onClick={() => handleTopicClick(topic)}
                                className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-emerald-600 transition-colors text-left"
                              >
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                                {topic}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">উদ্দিষ্ট পাঠক (Target Audience)</h4>
                        <div className="flex flex-wrap gap-2">
                          {bookDetails.targetAudience.map((target: string, i: number) => (
                            <button 
                              key={i} 
                              onClick={() => handleTopicClick(target)}
                              className="px-3 py-1.5 bg-white text-emerald-700 text-xs font-black rounded-lg border border-emerald-100 shadow-sm hover:bg-emerald-600 hover:text-white transition-all"
                            >
                              {target}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-400">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] shrink-0">ঐতিহাসিক প্রভাব (Influence)</span>
                        <div className="flex flex-wrap gap-2">
                          {bookDetails.regionsCovered.map((reg: string, i: number) => (
                            <button 
                              key={i} 
                              onClick={() => handleTopicClick(reg)}
                              className="text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors"
                            >
                              {reg}{i < bookDetails.regionsCovered.length - 1 ? ',' : ''}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-amber-50 rounded-3xl text-center">
                    <p className="text-amber-700 font-bold">বিস্তারিত তথ্য লোড করা সম্ভব হয়নি। দয়া করে আবার চেষ্টা করুন।</p>
                  </div>
                )}

                <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(selectedBook.title + ' ' + selectedBook.author + ' Islamic book read online PDF')}`}
                    target="_top"
                    className="flex-1 py-5 bg-slate-900 text-white rounded-[24px] font-black text-base shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Book size={20} />
                    <span>অনলাইনে পড়ুন</span>
                  </a>
                  <button 
                    onClick={() => setSelectedBook(null)}
                    className="flex-1 py-5 bg-emerald-600 text-white rounded-[24px] font-black text-base shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    বন্ধ করুন (Close)
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
