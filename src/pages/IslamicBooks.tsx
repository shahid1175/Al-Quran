import React, { useState, useEffect } from 'react';
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
  Filter,
  Upload,
  Trash2,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react';
import { aiService, IslamicBook } from '../services/aiService';
import { cn } from '../lib/utils';
import { userBookService, UserBook } from '../services/userBookService';
import { useAuth } from '../contexts/AuthContext';
import { adminBookService, GlobalBook } from '../services/adminBookService';
import { storageService, OfflineBook } from '../services/storageService';

export default function IslamicBooks() {
  const { user } = useAuth();
  const isAdmin = user?.email === 'milondon75@gmail.com';

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<(IslamicBook & { isOffline?: boolean; isUserBook?: boolean; userBookId?: string; isGlobalBook?: boolean; globalBookId?: string; isSavedOffline?: boolean })[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<IslamicBook | null>(null);
  const [bookDetails, setBookDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [readingMode, setReadingMode] = useState<'offline' | 'online'>('offline');

  const [activeCategory, setActiveCategory] = useState<string | null>("Selected Books");
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [downloadingBookId, setDownloadingBookId] = useState<string | null>(null);

  const loadUserBooks = async () => {
    const books = await userBookService.getAllBooks();
    setUserBooks(books);
  };

  useEffect(() => {
    loadUserBooks();
  }, []);

  const SELECTED_BOOKS: (IslamicBook & { isOffline?: boolean })[] = [
    {
      title: "সাফল্যের শর্তাবলি (Conditions of Success)",
      author: "সাইয়েদ আবুল আ'লা মওদুদী (Sayyid Abul A'la Maududi)",
      description: "সাফল্য অর্জনের প্রকৃত মানদণ্ড এবং আখেরাতের সফলতার পথনির্দেশনা নিয়ে সাইয়্যেদ মওদুদী র.-এর এক শক্তিশালী আলোচনা।",
      category: "Spirituality",
      relevance: "সাফল্যের প্রকৃত সংজ্ঞা এবং তা অর্জনের উপায় জানার জন্য অত্যন্ত প্রয়োজনীয়।",
      isOffline: true
    },
    {
      title: "মনটাকে কাজ দিন (Busy the Mind)",
      author: "অধ্যাপক গোলাম আযম (Prof. Ghulam Azam)",
      description: "ইসলামী নৈতিকতা ও আত্মিক উন্নয়নের আলোকে মনকে কীভাবে গঠনমূলক কাজে ব্যস্ত রেখে অহেতুক চিন্তা ও অনৈতিকতা থেকে বাঁচানো যায়, তার এক অনন্য গাইড।",
      category: "Spirituality",
      relevance: "ব্যক্তি গঠন ও সময়ের সঠিক ব্যবহারের জন্য এটি একটি অত্যন্ত জনপ্রিয় বই।",
      isOffline: true
    },
    {
      title: "চরিত্র গঠনের মৌলিক উপাদান (Foundations of Character Building)",
      author: "নঈম সিদ্দিকী (Naeem Siddiqui)",
      description: "ইসলামী আদর্শের ভিত্তিতে মানুষের চরিত্র গঠনের প্রধান স্তর ও উপাদান নিয়ে নঈম সিদ্দিকীর এক কালজয়ী গ্রন্থ। এটি একজন মুমিনের জীবন গঠনের দিকনির্দেশনা প্রদান করে।",
      category: "Spirituality",
      relevance: "আদর্শ সমাজ বিনির্মাণে ব্যক্তিগত চরিত্র গঠনের গুরুত্ব ও পদ্ধতি জানার জন্য অপরিহার্য।",
      isOffline: true
    }
  ];

  const OFFLINE_BOOK_DATA: Record<string, any> = {
    "সাফল্যের শর্তাবলি (Conditions of Success)": {
      fullDescription: `ইসলামী জীবনদর্শনে সাফল্যের প্রকৃত অর্থ হলো জান্নাত লাভ এবং মহান আল্লাহর সন্তুষ্টি অর্জন। সাফল্যের এই বিশাল অর্জনে কিছু মৌলিক শর্ত রয়েছে যা কুরআন ও সুন্নাহর আলোকে প্রমাণিত:

১. ইমান (Faith): সাফল্যের প্রধানতম ভিত্তি হলো সঠিক আকিদা ও বিশুদ্ধ ইমান। শিরক ও কুফর মুক্ত ইমান ছাড়া কোনো আমল গ্রহণীয় নয়।
২. ইখলাস (Sincerity): প্রতিটি কাজ শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য করা। লোকদেখানো উদ্দেশ্য (রিয়া) ইবাদতকে নষ্ট করে দেয়।
৩. রাসূলুল্লাহ (সা.)-এর অনুসরণ (Ittibah): ইবাদত হতে হবে রাসূলুল্লাহ (সা.)-এর দেখানো সুন্নাহ মোতাবেক। উদ্ভাবিত নতুন প্রথা বা বিদআত বর্জনীয়। 
৪. নেক আমল (Good Deeds): ইমানের সাথে আমল জড়িত। নামাজ, রোজা, জাকাত এবং মানুষের সেবা—সবই সাফল্যের পাথেয়।
৫. ধৈর্য ও তাকওয়া (Patience & Piety): বিপদে ধৈর্য এবং সর্বাবস্থায় আল্লাহকে ভয় করা মুমিনের সাফল্যের গ্যারান্টি।

এই বইটি মূলত আমাদের শেখায় কীভাবে ছোট ছোট কাজের মাধ্যমে আমরা অনন্তকালের বড় সাফল্য অর্জন করতে পারি।`,
      targetAudience: ["সাধারণ পাঠক", "ছাত্র", "আধ্যাত্মিক জ্ঞান অন্বেষী"],
    },
    "মনটাকে কাজ দিন (Busy the Mind)": {
      fullDescription: `মানুষের মন অস্থির। মনকে যদি ভালো কাজে ব্যস্ত রাখা না যায়, তবে সে শয়তানের প্ররোচনায় খারাপ কাজে লিপ্ত হয়। অধ্যাপক গোলাম আযম এই বইটিতে মনকে গঠনমূলক কাজে ব্যবহারের কৌশল দেখিয়েছেন।

বইটির প্রধান আলোচনার বিষয়বস্তু:
১. মনের প্রকৃতি: মন কখনো অলস থাকতে চায় না। একে অবশ্যই একটি নির্দিষ্ট কাজে নিয়োজিত করতে হবে।
২. সময় ব্যবস্থাপনা: মুমিন হিসেবে সময়ের প্রতিটি মুহূর্তের জন্য আল্লাহর কাছে জবাবদিহি করতে হবে। অহেতুক আড্ডা ও গিবত থেকে বেঁচে থাকা।
৩. গঠনমূলক চিন্তা: নেতিবাচক চিন্তা বাদ দিয়ে কীভাবে ইতিবাচক ও পরোপকারী চিন্তা করা যায়।
৪. নিয়মিত ইবাদত ও নফল কাজ: ফরজ ইবাদতের পাশাপাশি নফল খিদমতের মাধ্যমে মনকে প্রশান্ত রাখা।
৫. সমাজ সংস্কারে অংশগ্রহণ: নিজেকে সংস্কার করার পর সমাজ সংস্কারের কাজে নিজেকে আত্মনিয়োগ করা।

এই বইটি একজন মানুষকে অলসতা থেকে কর্মঠ এবং হতাশামুক্ত হতে সাহায্য করে।`,
      targetAudience: ["সাধারণ পাঠক", "ছাত্র", "আধ্যাত্মিক জ্ঞান অন্বেষী"],
    },
    "চরিত্র গঠনের মৌলিক উপাদান (Foundations of Character Building)": {
      fullDescription: `ইসলামী আন্দোলনের কর্মীদের জন্য এবং সাধারণ মুসলিমদের জন্য চরিত্র গঠন একটি অত্যন্ত গুরুত্বপূর্ণ বিষয়। নঈম সিদ্দিকী এই বইটিতে অত্যন্ত চমৎকারভাবে চরিত্র গঠনের বিভিন্ন দিক আলোচনা করেছেন।

বইটির প্রধান শিক্ষণীয় বিষয়গুলো:
১. নিয়ত ও লক্ষ্য স্থির করা: জীবনের প্রতিটি কাজের লক্ষ্য হতে হবে আল্লাহর সন্তুষ্টি।
২. আত্ম-সমালোচনা (ইইহতিসাব): প্রতিদিন নিজের কাজের পর্যালোচনা করা এবং ভুল থেকে শিক্ষা গ্রহণ করা।
৩. নিয়মিত ইবাদত: ফরজ ইবাদতের প্রতি যত্নশীল হওয়া এবং নফল ইবাদতের মাধ্যমে আল্লাহর নৈকট্য লাভ।
৪. আখলাক বা নৈতিকতা: ধৈর্য, সত্যবাদিতা, আমানতদারি এবং নম্রতা—এগুলো চরিত্রের ভূষণ।
৫. আমানত রক্ষা: ব্যক্তিগত ও সমষ্টিগত উভয় ক্ষেত্রেই আমানত ও দায়িত্ব পালনে কঠোর হওয়া।

এই বইটি একজন মানুষকে ব্যক্তিগত জীবনে সুশৃঙ্খল এবং আদর্শবান মুমিন হিসেবে গড়ে তুলতে সাহায্য করে।`,
      targetAudience: ["সাধারণ পাঠক", "ছাত্র", "আধ্যাত্মিক জ্ঞান অন্বেষী"],
    }
  };

  const handleSearch = async (e?: React.FormEvent, customQuery?: string, isSelectedBooks = false, forceCategory?: string) => {
    if (e) e.preventDefault();
    
    const category = forceCategory || activeCategory;
    if (isSelectedBooks || category === "My Collection" || category === "Selected Books") {
      setLoading(true);
      let combinedBooks: (IslamicBook & { isOffline?: boolean; isUserBook?: boolean; userBookId?: string; isGlobalBook?: boolean; globalBookId?: string })[] = [];
      
      const finalCategory = isSelectedBooks ? "Selected Books" : (category || "Selected Books");
      setActiveCategory(finalCategory);

      if (finalCategory === "Selected Books") {
        combinedBooks = [...SELECTED_BOOKS];
        
        // Fetch Global Books from Firestore
        try {
          const gBooks = await adminBookService.getGlobalBooks();
          const mappedGBooks = gBooks.map(gb => ({
            title: gb.title,
            author: gb.author,
            description: gb.description,
            category: gb.category,
            relevance: gb.relevance,
            isOffline: true,
            isGlobalBook: true,
            globalBookId: gb.id
          }));
          combinedBooks = [...combinedBooks, ...mappedGBooks];
        } catch (err) {
          console.error("Failed to load global books:", err);
        }
      }

      // Fetch fresh user books to avoid stale state issues
      const currentUserBooks = await userBookService.getAllBooks();
      setUserBooks(currentUserBooks);

      const offlineBooks = await storageService.getAllOfflineBooks();

      // If My Collection, include explicitly saved offline books from AI searches
      if (finalCategory === "My Collection") {
        const mappedOfflineBooks = offlineBooks.map(ob => ({
          title: ob.title,
          author: ob.author,
          description: ob.description,
          category: ob.category,
          relevance: ob.relevance,
          isOffline: true,
          isSavedOffline: true
        }));
        combinedBooks = [...combinedBooks, ...mappedOfflineBooks];
      }

      const mappedUserBooks = currentUserBooks.map(ub => ({
        title: ub.title,
        author: ub.author,
        description: `Uploaded file: ${ub.fileName}. ${ub.fileType === 'application/pdf' ? 'PDF document' : 'Text document'}`,
        category: "My Uploads",
        relevance: "আপনার নিজস্ব সংগৃহীত বই (Your personal uploaded book)",
        isOffline: true,
        isUserBook: true,
        userBookId: ub.id
      }));

      const finalBooks = combinedBooks.concat(mappedUserBooks).map(b => ({
        ...b,
        isSavedOffline: offlineBooks.some(ob => ob.id === b.title) || !!(b as any).isOffline
      }));

      setBooks(finalBooks);
      setSearched(true);
      setLoading(false);
      setError(null);
      return;
    }

    // If it's a manual search (not from a category click), clear the category
    if (!customQuery || (customQuery === query && !isSelectedBooks)) {
      setActiveCategory(null);
    }

    const finalQuery = (customQuery || query).trim();
    if (!finalQuery) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const results = await aiService.searchIslamicBooks(finalQuery);
      const offlineBooks = await storageService.getAllOfflineBooks();
      
      const mappedResults = results.map(b => ({
        ...b,
        isSavedOffline: offlineBooks.some(ob => ob.id === b.title)
      }));

      setBooks(mappedResults);
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

  const handleSaveOffline = async (e: React.MouseEvent, book: any) => {
    e.stopPropagation();
    const bookId = book.title;
    if (downloadingBookId) return;

    setDownloadingBookId(bookId);
    try {
      if (book.isSavedOffline && !book.isOffline) {
        await storageService.deleteOfflineBook(bookId);
        setBooks(prev => prev.map(b => b.title === bookId ? { ...b, isSavedOffline: false } : b));
      } else if (!book.isSavedOffline) {
        // Fetch details first to save full summary
        const details = await aiService.getBookDetails(book.title, book.author);
        const offlineBook: OfflineBook = {
          id: bookId,
          title: book.title,
          author: book.author,
          description: book.description,
          category: book.category,
          relevance: book.relevance,
          details: details,
          downloadedAt: Date.now()
        };
        await storageService.saveOfflineBook(offlineBook);
        setBooks(prev => prev.map(b => b.title === bookId ? { ...b, isSavedOffline: true } : b));
      }
    } catch (error) {
      console.error('Failed to save book offline:', error);
    } finally {
      setDownloadingBookId(null);
    }
  };

  const handleViewDetails = async (book: any, initialMode: 'offline' | 'online' = 'offline') => {
    setSelectedBook(book);
    setLoadingDetails(true);
    setBookDetails(null);
    setReadingMode(initialMode);

    // Check if it's a global book
    if (book.isGlobalBook && book.globalBookId) {
      // Find the book in the current list to get content (or we could fetch by ID if content is large)
      // For now, assume it's in the fetched global books
      const gBooks = await adminBookService.getGlobalBooks();
      const gBook = gBooks.find(b => b.id === book.globalBookId);
      if (gBook) {
        setBookDetails({
          fullDescription: gBook.content || "বইটির বিস্তারিত তথ্য পাওয়া যাচ্ছে না।",
          keyTopics: ["Global Collection", gBook.category],
          targetAudience: ["Everyone"],
          isPdf: gBook.fileType === 'application/pdf',
          fileName: gBook.fileName
        });
        setLoadingDetails(false);
        return;
      }
    }

    // Check if it's a user-uploaded book
    if (book.isUserBook && book.userBookId) {
      const userBook = await userBookService.getBook(book.userBookId);
      if (userBook) {
        setBookDetails({
          fullDescription: userBook.content || "বইটির কন্টেন্ট লোড করা হচ্ছে... (Loading book content...)",
          keyTopics: ["User Uploaded", userBook.fileType],
          targetAudience: ["You"],
          isPdf: userBook.fileType === 'application/pdf',
          fileData: userBook.fileData,
          fileName: userBook.fileName
        });
        setLoadingDetails(false);
        return;
      }
    }

    // Check for local IndexedDB offline data
    const savedBook = await storageService.getOfflineBook(book.title);
    if (savedBook && savedBook.details) {
      setBookDetails(savedBook.details);
      setLoadingDetails(false);
      return;
    }

    // Check for hardcoded offline data
    if (OFFLINE_BOOK_DATA[book.title]) {
      setTimeout(() => {
        setBookDetails(OFFLINE_BOOK_DATA[book.title]);
        setLoadingDetails(false);
      }, 500); // Small delay for UX feel
      return;
    }

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
    setActiveCategory(null);
    handleSearch(undefined, topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    // Load Selected Books by default on mount
    handleSearch(undefined, undefined, true, "Selected Books");
  }, []);

  const handleDeleteUserBook = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("আপনি কি নিশ্চিতভাবে এই বইটি মুছে ফেলতে চান? (Are you sure you want to delete this book?)")) {
      await userBookService.deleteBook(id);
      await loadUserBooks();
      handleSearch(undefined, undefined, activeCategory === "Selected Books");
    }
  };

  const handleDeleteGlobalBook = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("আপনি কি নিশ্চিতভাবে এই বইটি গ্লোবাল সংগ্রহ থেকে মুছে ফেলতে চান? (Admin Only)")) {
      await adminBookService.deleteGlobalBook(id);
      handleSearch(undefined, undefined, true, "Selected Books");
    }
  };

  const handleFileUpload = async (file: File, isGlobal = false) => {
    if (!file) return;

    setLoading(true);
    try {
      const isText = file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md');
      let content = '';
      
      if (isText) {
        content = await file.text();
      } else {
        // For non-text (PDF etc), we might just store metadata and a link in a real app,
        // but here we can't easily store large blobs in Firestore.
        // We'll simulate by saying "Uploaded" and storing placeholders if too large.
        content = `[File: ${file.name}] Content restricted for preview. In a production app, this would be stored in Firebase Storage.`;
      }

      if (isGlobal && isAdmin) {
        await adminBookService.uploadGlobalBook({
          title: file.name.split('.')[0],
          author: "Admin Contributed",
          description: `A book contributed by the community admin. File: ${file.name}`,
          category: "Shared Library",
          relevance: "গ্লোবাল কালেকশন এর অংশ (Part of Global Collection)",
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
          content: content,
          addedBy: user?.uid || 'anonymous'
        });
        alert("গ্লোবাল লাইব্রেরিতে বইটি সফলভাবে যুক্ত হয়েছে!");
      } else {
        const newUserBook: UserBook = {
          id: crypto.randomUUID(),
          title: file.name.split('.')[0],
          author: "Unknown (Self Uploaded)",
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
          content: isText ? content : undefined,
          fileData: !isText ? file : undefined,
          uploadedAt: Date.now()
        };
        await userBookService.saveBook(newUserBook);
        alert(`"${file.name}" সফলভাবে আপলোড করা হয়েছে!`);
      }

      await loadUserBooks();
      handleSearch(undefined, undefined, activeCategory === "Selected Books");
      
    } catch (err) {
      console.error('File upload failed:', err);
      alert('ফাইল আপলোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { bn: "তফসীর", en: "Tafsir" },
    { bn: "হাদিস", en: "Hadith" },
    { bn: "সীরাত", en: "Seerah" },
    { bn: "ফিকহ", en: "Fiqh" },
    { bn: "ইতিহাস", en: "History" },
    { bn: "আধ্যাত্মিকতা", en: "Spirituality" },
    { bn: "নির্বাচিত বই", en: "Selected Books" },
    { bn: "আমার সংগ্রহ", en: "My Collection" }
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
        <form onSubmit={(e) => handleSearch(e)} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="কুরআন, ফিকহ, সীরাত বা যেকোনো ইসলামিক বই খুঁজুন..."
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] text-lg font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 shadow-sm transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[24px] font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 active:scale-95"
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
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(query + ' Islamic book read online PDF')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-[24px] font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-95"
              onClick={(e) => !query.trim() && e.preventDefault()}
            >
              <Search size={18} />
              <span>Google</span>
            </a>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {categories.map((cat, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { 
                const combinedQuery = `${cat.bn} ${cat.en}`;
                setQuery(cat.en === "Selected Books" ? "" : combinedQuery); 
                setActiveCategory(cat.en);
                handleSearch(undefined, combinedQuery, cat.en === "Selected Books", cat.en); 
              }}
              className={cn(
                "group flex items-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 rounded-[24px] hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm active:scale-95 cursor-pointer",
                activeCategory === cat.en && "border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/5 text-emerald-700"
              )}
            >
              <div className="flex flex-col items-center leading-none text-center">
                <span className={cn(
                  "text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors",
                  activeCategory === cat.en && "text-emerald-700"
                )}>{cat.bn}</span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-500 transition-colors mt-1",
                  activeCategory === cat.en && "text-emerald-500"
                )}>({cat.en})</span>
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
                  onClick={() => handleViewDetails(book)}
                  className="group bg-white p-8 rounded-[40px] border border-slate-200 hover:border-emerald-300 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden flex flex-col h-full cursor-pointer"
                >
                  {/* Selected / Featured Badge */}
                  {activeCategory === "Selected Books" && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-wider z-10 shadow-sm border border-amber-200">
                      <Sparkles size={10} />
                      Selected Book
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-0 right-0 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-bl-[20px] text-[10px] font-black uppercase tracking-widest border-l border-b border-emerald-100 flex items-center gap-3">
                    <button 
                      onClick={(e) => handleSaveOffline(e, book)}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-xl transition-all shadow-sm active:scale-95 border",
                        book.isSavedOffline 
                          ? "bg-emerald-600 text-white border-emerald-500" 
                          : "bg-white text-slate-400 border-slate-100 hover:text-emerald-600"
                      )}
                      title={book.isSavedOffline ? "অফলাইন থেকে মুছুন (Remove from offline)" : "অফলাইনের জন্য সংরক্ষণ করুন (Save for offline)"}
                    >
                      {downloadingBookId === book.title ? (
                         <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Download size={14} />
                      )}
                    </button>
                    <span>{book.category}</span>
                    {(book as any).isUserBook && (
                      <button 
                        onClick={(e) => handleDeleteUserBook(e, (book as any).userBookId)}
                        className="w-8 h-8 -mr-2 bg-white flex items-center justify-center text-red-500 rounded-xl transition-all hover:bg-red-500 hover:text-white shadow-sm active:scale-95 border border-red-50"
                        title="মুছে ফেলুন (Delete)"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    {(book as any).isGlobalBook && isAdmin && (
                      <button 
                        onClick={(e) => handleDeleteGlobalBook(e, (book as any).globalBookId)}
                        className="w-8 h-8 -mr-2 bg-white flex items-center justify-center text-red-500 rounded-xl transition-all hover:bg-red-500 hover:text-white shadow-sm active:scale-95 border border-red-50"
                        title="Global Delete (Admin)"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 flex-grow">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      {(book as any).isUserBook ? <FileText size={24} /> : <BookOpen size={24} />}
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
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(book, 'offline');
                        }}
                        className="py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group/btn hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10 active:scale-95 text-xs px-2"
                      >
                        {(book as any).isOffline ? <Book size={14} /> : <Info size={14} />}
                        {(book as any).isOffline ? 'অফলাইন' : 'বিস্তারিত'}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(book, 'online');
                        }}
                        className="py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group/btn hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95 text-xs px-2"
                      >
                        <Search size={14} />
                        অনলাইন
                      </button>
                    </div>
                    
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.author + ' Islamic book read online PDF')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border border-slate-200 text-xs active:scale-95 shadow-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      গুগল সার্চ (Google Search)
                      <ArrowRight size={12} className="opacity-50" />
                    </a>
                  </div>
                </motion.div>
              ))}

              {/* User Upload Card */}
              {(activeCategory === "Selected Books" || activeCategory === "My Collection") && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: books.length * 0.1 }}
                  className="group bg-slate-50 p-8 rounded-[40px] border-2 border-dashed border-slate-200 hover:border-emerald-300 transition-all hover:bg-emerald-50/30 flex flex-col items-center justify-center text-center space-y-6 cursor-pointer relative overflow-hidden"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf,.doc,.docx,.txt';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleFileUpload(file, false);
                      }
                    };
                    input.click();
                  }}
                >
                  <div className="w-16 h-16 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform group-hover:bg-emerald-600 group-hover:text-white">
                    <Upload size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 leading-tight">ব্যক্তিগত আপলোড</h3>
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Personal Upload</p>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    আপনার নিজের পড়ার জন্য কোনো বই যুক্ত করুন।
                  </p>
                </motion.div>
              )}

              {/* Admin Global Upload Card */}
              {isAdmin && activeCategory === "Selected Books" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (books.length + 1) * 0.1 }}
                  className="group bg-indigo-50 p-8 rounded-[40px] border-2 border-dashed border-indigo-200 hover:border-indigo-500 transition-all hover:bg-indigo-100/30 flex flex-col items-center justify-center text-center space-y-6 cursor-pointer relative overflow-hidden"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf,.doc,.docx,.txt';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleFileUpload(file, true);
                      }
                    };
                    input.click();
                  }}
                >
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg">
                    Admin Only
                  </div>
                  <div className="w-16 h-16 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform group-hover:bg-indigo-600 group-hover:text-white">
                    <Sparkles size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 leading-tight">গ্লোবাল আপলোড</h3>
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">Global Admin Upload</p>
                  </div>
                  <p className="text-xs text-indigo-600 font-medium leading-relaxed">
                    সবার জন্য এই লাইব্রেরিতে বই যুক্ত করুন। (Shared with all users)
                  </p>
                </motion.div>
              )}
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
                    <div className="flex items-center gap-2">
                      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                        {selectedBook.title}
                      </h2>
                      {(selectedBook as any).isOffline && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border border-amber-200 shrink-0">
                          <Sparkles size={10} />
                          Offline Reader
                        </div>
                      )}
                    </div>
                    <p className="text-lg font-bold text-emerald-600">By {selectedBook.author}</p>
                  </div>
                </div>

                {/* Reading Mode Toggle */}
                <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit mx-auto sm:mx-0">
                  <button
                    onClick={() => setReadingMode('offline')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2",
                      readingMode === 'offline' 
                        ? "bg-white text-emerald-700 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <Book size={14} />
                    {(selectedBook as any).isOffline ? 'অফলাইন (Offline)' : 'বিস্তারিত (Details)'}
                  </button>
                  <button
                    onClick={() => setReadingMode('online')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2",
                      readingMode === 'online' 
                        ? "bg-white text-emerald-700 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <Search size={14} />
                    অনলাইন (Online)
                  </button>
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
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-[2px] flex-grow bg-slate-100" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                          {readingMode === 'offline' ? 'অফলাইন সারসংক্ষেপ (Offline Summary)' : 'অনলাইন সোর্স অনুসন্ধান (Online Sources)'}
                        </span>
                        <div className="h-[2px] flex-grow bg-slate-100" />
                      </div>
                      
                      {readingMode === 'offline' ? (
                        <div className="space-y-6">
                          {bookDetails.isPdf ? (
                            <div className="space-y-6">
                              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-200 text-center space-y-6">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                  <FileText size={40} />
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-xl font-black text-slate-900 line-clamp-2 px-4">{bookDetails.fileName}</h4>
                                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                    <Sparkles size={10} />
                                    PDF Document
                                  </div>
                                </div>
                                <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">
                                  আপনার আপলোড করা পিডিএফ ফাইলটি পড়ার জন্য নিচের বাটনটি চাপুন।
                                </p>
                                <div className="flex flex-col gap-3">
                                  <button 
                                    onClick={() => {
                                      if (bookDetails.fileData) {
                                        const url = URL.createObjectURL(bookDetails.fileData);
                                        const win = window.open(url, '_blank');
                                        if (!win) {
                                          alert("পপ-আপ ব্লক করা হয়েছে। দয়া করে আপনার ব্রাউজারে পারমিশন দিন। (Pop-up blocked. Please allow pop-ups for this site.)");
                                        }
                                      }
                                    }}
                                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-base shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                  >
                                    <BookOpen size={20} />
                                    বইটি ওপেন করুন (Open Book)
                                  </button>
                                  <a 
                                    href={bookDetails.fileData ? URL.createObjectURL(bookDetails.fileData) : '#'}
                                    download={bookDetails.fileName}
                                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-base shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                  >
                                    <Download size={20} />
                                    ডাউনলোড করুন (Download)
                                  </a>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-inner">
                              <div className="p-6 sm:p-10 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
                                <p className="text-lg text-slate-700 leading-[1.8] font-medium whitespace-pre-line">
                                  {bookDetails.fullDescription}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                            <div className="flex items-center gap-3 text-emerald-600 mb-2">
                              <BookOpen size={20} />
                              <h4 className="font-black text-slate-900">কিভাবে অনলাইনে পড়বেন?</h4>
                            </div>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                              যেহেতু এটি একটি অত্যন্ত জনপ্রিয় এবং গুরুত্বপূর্ণ বই, তাই এর অনেক অথেনটিক পিডিএফ এবং অনলাইন ভার্সন ইন্টারনেটে পাওয়া যায়। আপনি নিচের লিঙ্কগুলোর মাধ্যমে বিশ্বস্ত সোর্স থেকে বইটি সংগ্রহ করতে পারেন।
                            </p>
                            <div className="flex flex-col gap-3 pt-2">
                              <a 
                                href={`https://www.google.com/search?q=${encodeURIComponent(selectedBook.title + ' ' + selectedBook.author + ' PDF free download')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group"
                              >
                                <span className="text-sm font-bold text-slate-700">পিডিএফ (PDF) অনুসন্ধান করুন</span>
                                <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                              </a>
                              <a 
                                href={`https://www.google.com/search?q=${encodeURIComponent(selectedBook.title + ' ' + selectedBook.author + ' read online archive.org')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group"
                              >
                                <span className="text-sm font-bold text-slate-700">Archive.org ভার্সন</span>
                                <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {bookDetails && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {bookDetails.keyTopics && (
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
                          )}
                          
                          {bookDetails.targetAudience && (
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
                          )}
                        </div>

                        {bookDetails.regionsCovered && (
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
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-8 bg-amber-50 rounded-3xl text-center">
                    <p className="text-amber-700 font-bold">বিস্তারিত তথ্য লোড করা সম্ভব হয়নি। দয়া করে আবার চেষ্টা করুন।</p>
                  </div>
                )}

                  <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(selectedBook.title + ' ' + selectedBook.author + ' Islamic book read online PDF')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-5 bg-slate-900 text-white rounded-[24px] font-black text-base shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      <Book size={20} />
                      <span>অনলাইনে পড়ুন (Read Online)</span>
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
