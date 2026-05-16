import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronLeft, Star, StarOff, Info, Play, Award, Sparkles, Mic } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { parseTajweed, TAJWEED_RULES, TajweedRule } from '../lib/tajweed';
import { cn } from '../lib/utils';
import RecitationAnalyzer from '../components/RecitationAnalyzer';
import TajweedRuleModal from '../components/TajweedRuleModal';
import MakharijDiagram from '../components/MakharijDiagram';
import TajweedColorSheet from '../components/TajweedColorSheet';

const TAJWEED_SYLLABUS = [
  {
    chapter: "প্রথম অধ্যায়",
    title: "তাজওইদের পরিচয়, হুকুম ও উদ্দেশ্য",
    topics: ["তাজওইদের পরিচয়", "হুকুম", "উদ্দেশ্য"],
    qa: [
      { q: "তাজবীদ শব্দের অর্থ কি?", a: "তাজবীদ শব্দের অর্থ হলো সুন্দর করা, বিন্যস্ত করা বা সুশোভিত করা।" },
      { q: "তাজবীদ শাস্ত্রের হুকুম কি?", a: "তাজবীদ অনুযায়ী কুরআন পড়া প্রত্যেক মুসলিমের জন্য ফরজে আইন বা বাধ্যতামূলক।" },
      { q: "তাজবীদের মূল উদ্দেশ্য কি?", a: "কুরআন পাঠে জিহ্বার ভুল সংশোধন করা এবং মহান আল্লাহর সন্তুষ্টি অর্জন করা।" }
    ]
  },
  {
    chapter: "দ্বিতীয় অধ্যায়",
    title: "লাহান ও এর প্রকারসমূহ",
    topics: ["লাহান জালি", "লাহান খাফি"],
    qa: [
      { q: "লাহান জালি কাকে বলে?", a: "স্পষ্ট বা বড় ভুলকে লাহান জালি বলে। যেমন হরফের পরিবর্তে অন্য হরফ উচ্চারণ করা বা হরকতে ভুল করা। এটি করা হারাম।" },
      { q: "লাহান খাফি বলতে কি বুঝায়?", a: "অস্পষ্ট বা সূক্ষ্ম ভুলকে লাহান খাফি বলে। যেমন গুন্নাহ সঠিক পরিমাণে না করা বা মাদ কম করা। এটি করা মাকরূহ।" }
    ]
  },
  {
    chapter: "তৃতীয় অধ্যায়",
    title: "তিলাওয়াতের প্রকারভেদ",
    topics: ["আত-তাহক্বিক", "আল-হাদার", "আত-তাদওইর"],
    qa: [
      { q: "তাহক্বিক তিলাওয়াত কি?", a: "অত্যন্ত ধীরস্থিরভাবে ও তাজবীদের সকল নিয়ম সূক্ষ্মভাবে মেনে পড়া।" },
      { q: "হাদার তিলাওয়াত কি?", a: "তাজবীদের নিয়ম অক্ষুণ্ণ রেখে দ্রুতগতিতে পড়া, যা সাধারণত মুখস্থ করার সময় ব্যবহার করা হয়।" },
      { q: "তাদওইর তিলাওয়াত কি?", a: "মধ্যম গতিতে তিলাওয়াত করা, যা তাহক্বিক ও হাদারের মাঝামাঝি।" }
    ]
  },
  {
    chapter: "চতুর্থ অধ্যায়",
    title: "আল-ইস্তিয়াজাহর পরিচয় ও বিধিবিধান",
    topics: [
      "যেসব জায়গায় ইস্তিয়াজাহ সশব্দে পড়তে হয়",
      "যেসব জায়গায় ইস্তিয়াজাহ নিঃশব্দে পড়তে হয়",
      "তিলাওয়াতের শুরুতে ইস্তিয়াজাহ পড়ার নিয়ম",
      "সুরাহ আত-তাওবার আগে ইস্তিয়াজাহ পড়ার নিয়ম",
      "ইস্তিয়াজাহ-সংক্রান্ত আরও কিছু নিয়ম"
    ],
    qa: [
      { q: "ইস্তিয়াজাহ কি?", a: "আউযুবিল্লাহি মিনাশ শায়তানির রাজীম - তিলাওয়াতের শুরুতে শয়তান থেকে আশ্রয় চাওয়া।" },
      { q: "কখন সশব্দে ইস্তিয়াজাহ পড়তে হয়?", a: "যখন কেউ অন্যকে কুরআন শেখাতে তিলাওয়াত শুরু করে বা উচ্চৈঃস্বরে পড়ার বৈঠক শুরু হয়।" },
      { q: "সুরা তাওবার শুরুতে ইস্তিয়াজাহ পড়ার নিয়ম কি?", a: "তিলাওয়াত শুরু করার সময় ইস্তিয়াজাহ পড়তে হবে, তবে বাসমালাহ ছাড়া সুরা তাওবা শুরু করতে হবে।" }
    ]
  },
  {
    chapter: "পঞ্চম অধ্যায়",
    title: "আল-বাসমালাহর পরিচয় ও বিধিবিধান",
    topics: [
      "বাসমালাহ পড়ার নিয়ম-কানুন",
      "সুরাহ আত-তাওবাহ ও সুরাহ আল-আনফাল একত্রে পড়ার নিয়ম"
    ],
    qa: [
      { q: "বাসমালাহ কি?", a: "বিসমিল্লাহির রাহমানির রাহীম। এটি তিলাওয়াতের বরকত।" },
      { q: "সুরা তাওবা ও আনফাল একত্রে পড়ার নিয়ম কি?", a: "মাঝখানে কোনো বিরতি বা বাসমালাহ ছাড়াই সুরা আনফাল শেষে সুরা তাওবা শুরু করা যায় (ওয়াসল), অথবা সাকাত বা ওয়াকফ করা যায়।" }
    ]
  },
  {
    chapter: "ষষ্ঠ অধ্যায়",
    title: "মাখরাজের বিবরণ ও প্রকারসমূহ",
    topics: [
      "মাখরাজ আম",
      "মাখরাজ খাস",
      "মাখরাজ আম ও মাখরাজ খাসের প্রকারসমূহ",
      "মাখরাজের চিত্র"
    ],
    qa: [
      { q: "মাখরাজ আম এবং মাখরাজ খাস কি?", a: "মাখরাজ আম হলো প্রধান ৫টি অঙ্গ (যেমন: মুখগহ্বর, কণ্ঠনালী, জিহ্বা, দুই ঠোঁট ও নাসিকা)। মাখরাজ খাস হলো ওই অঙ্গগুলোর নির্দিষ্ট ১৭টি স্থান।" },
      { q: "জিহ্বা থেকে কয়টি হরফ উচ্চারিত হয়?", a: "জিহ্বার বিভিন্ন অংশ থেকে ১০টি মাখরাজে মোট ১৮টি হরফ উচ্চারিত হয়।" }
    ]
  },
  {
    chapter: "সপ্তম অধ্যায়",
    title: "সিফাতের বিবরণ",
    topics: [
      "সিফাতের প্রকারসমূহ",
      "সিফাত আসলিয়্যার প্রকারসমূহ",
      "সিফাত মুতাদদ্দাহর বিস্তারিত বিবরণ",
      "সিফাত গাইর মুতাদদ্দাহর বিস্তারিত বিবরণ",
      "সিফাত আরদিয়্যার প্রকারসমূহ"
    ],
    qa: [
      { q: "সিফাত বলতে কি বুঝায়?", a: "হরফের উচ্চারণের অবস্থা বা গুণাগুণকে সিফাত বলে।" },
      { q: "সিফাত মুতাদদ্দাহ কি?", a: "বিপরীতধর্মী সিফাত, যা পরস্পর জোড়ায় জোড়ায় থাকে (যেমন: হামস ও জাহর)।" },
      { q: "সিফাত আরদিয়্যাহ বলতে কি বুঝায়?", a: "ওই সকল গুণ যা সবসময় থাকে না, বিশেষ কারণে সৃষ্টি হয় (যেমন: গুন্নাহ বা মাদ)।" }
    ]
  },
  {
    chapter: "অষ্টম অধ্যায়",
    title: "নুন সাকিন ও তানওইন এবং মিম সাকিনের বিবরণ",
    topics: [
      "নুন সাকিনের পরিচয়",
      "তানওইনের পরিচয়",
      "নুন সাকিন ও তানওইনের হুকুম",
      "মিম সাকিনের পরিচয়"
    ],
    qa: [
      { q: "নুন সাকিন ও তানওইনের হুকুম কয়টি?", a: "ইযহার, ইদগাম, ইখফা ও ইক্বলাব - এই ৪টি প্রধান হুকুম।" },
      { q: "মিম সাকিনের হুকুম কি কি?", a: "মিম সাকিনের হুকুম ৩টি: ইদগামে শাফাওয়ী, ইখফায়ে শাফাওয়ী ও ইযহারে শাফাওয়ী।" }
    ]
  },
  {
    chapter: "নবম অধ্যায়",
    title: "তাফখিম ও তারকিকের বিবরণ",
    topics: [
      "তাফখিমের পরিচয়",
      "তারকিকের পরিচয়",
      "তাফখিম ও তারকিকের প্রকারসমূহ",
      "সব সময় তাফখিম",
      "কখনো তাফখিম কখনো তারকিক",
      "সব সময় তারকিক"
    ],
    qa: [
      { q: "কোন হরফগুলো সবসময় তাফখিম (মোটা) হয়?", a: "সাতটি হরফ (খুস্-সা দ্বগ-তিন ক্বিদ্ব - خ ص ض غ ط ق ظ) সবসময় মোটা করে পড়তে হয়।" },
      { q: "রা (র) হরফ কখন তাফখিম হয়?", a: "রা-এর ওপর যবর বা পেশ থাকলে তা তাফখিম বা মোটা হয়।" }
    ]
  },
  {
    chapter: "দশম অধ্যায়",
    title: "মাদের পরিচয় ও প্রকারভেদ",
    topics: [
      "মাদ আসলির প্রকারসমূহ",
      "মাদ ফারয়ির প্রকারসমূহ"
    ],
    qa: [
      { q: "মাদ আসলি কি?", a: "মদ্দের হরফের পর কোনো হামজাহ বা সাকিন না আসলে ১ হারাকাত পরিমাণ টেনে পড়াকে মাদ আসলি বলে।" },
      { q: "মাদ ফারয়ি কাকে বলে?", a: "হামজাহ বা সাকিন থাকার কারণে বেশি টেনে পড়াকে মাদ ফারয়ি (যেমন: ৪ হারাকাত মাদ) বলে।" }
    ]
  },
  {
    chapter: "একাদশ অধ্যায়",
    title: "ওয়াকফ এবং ইবতিদা’র বিবরণ",
    topics: [
      "ওয়াকফের পরিচয় ও প্রকারসমূহ",
      "ইবতিদা’র পরিচয় ও প্রকারসমূহ"
    ],
    qa: [
      { q: "ওয়াকফ তাম কি?", a: "অর্থ পূর্ণভাবে শেষ হওয়ার জায়গায় থামা।" },
      { q: "ওয়াকফ ক্ববীহ কি?", a: "এমন জায়গায় থামা যেখানে অর্থ অসম্পূর্ণ বা ভুল থেকে যায়। এমন জায়গায় থামলে আগের শব্দ থেকে মিলিয়ে পড়া উচিত।" }
    ]
  },
  {
    chapter: "দ্বাদশ অধ্যায়",
    title: "লাম তা’রিফ",
    topics: [
      "লাম ক্বমারিয়্যার পরিচয়",
      "লাম সামসিয়্যার পরিচয়"
    ],
    qa: [
      { q: "ক্বমারী হরফ কয়টি?", a: "১৪টি হরফ (আবগি হাজ্জাকা অখাফ আক্বিমাহ)। এগুলোর আগে আলিফ-লাম থাকলে লাম স্পষ্ট পড়তে হয়।" },
      { q: "শামসী হরফ কয়টি?", a: "১৪টি হরফ। এগুলোর আগে আলিফ-লাম আসলে লাম উচ্চারিত হয় না বরং পরের হরফের সাথে তাশদীদযুক্ত হয়।" }
    ]
  },
  {
    chapter: "ত্রয়োদশ অধ্যায়",
    title: "হামজাতুল ওয়াসল",
    topics: ["হামজাতুল ওয়াসল এর ব্যবহার"],
    qa: [
      { q: "হামজাতুল ওয়াসল শব্দের শুরুতে থাকলে কি হয়?", a: "শুরুতে পড়লে জবর, জের বা পেশ দিয়ে পড়া হয়। যেমন: আল-হামদু।" },
      { q: "মাঝখানে থাকলে কি হয়?", a: "মাঝখানে বা সন্ধি অবস্থায় এটি পড়ে যায় বা উচ্চারিত হয় না।" }
    ]
  },
  {
    chapter: "চতুর্দশ অধ্যায়",
    title: "ওয়াকফর চিহ্নসমূহের বিবরণ",
    topics: ["কুরআনের বিভিন্ন ওয়াকফ চিহ্ন"],
    qa: [
      { q: "মীম (م) চিহ্ন কি নির্দেশ করে?", a: "এটি 'ওয়াকফে লাযিম' বা অবশ্যই থামার চিহ্ন।" },
      { q: "লাম-আলিফ (لا) চিহ্ন কি নির্দেশ করে?", a: "এটি না থামার নির্দেশ দেয়। থামা অনুচিত।" },
      { q: "জীম (ج) চিহ্ন কি নির্দেশ করে?", a: "এটি থামা বা না থামা দুই দিকেই জায়িয বা অনুমতি দেয়।" }
    ]
  }
];

export default function TajweedLessons() {
  const [practiceVerse, setPracticeVerse] = useState<string | null>(null);
  const [activeRule, setActiveRule] = useState<TajweedRule | null>(null);
  const [activeTab, setActiveTab] = useState<'rules' | 'syllabus' | 'makharij' | 'guide'>('rules');
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  const navigate = useNavigate();

  const startPractice = (verse: string) => {
    setPracticeVerse(verse);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleChapter = (chapter: string) => {
    setExpandedChapter(prev => prev === chapter ? null : chapter);
  };

  const DETAILED_RULES = [
    {
      title: "অগ্নি পরীক্ষা: গুন্নাহ (Ghunnah)",
      definition: "গুন্নাহ হলো নাসারন্ধ্র বা নাকের বাঁশি দিয়ে আওয়াজ বের করা। এটি তাজবীদের অন্যতম সৌন্দর্য। যখন নুন (ن) বা মীম (م) এর উপর তাশদীদ থাকে, তখন ২ হারাকাত পরিমাণ গুন্নাহ করা ওয়াজিব।",
      importance: "সঠিক গুন্নাহ ছাড়া তিলাওয়াতের সৌন্দর্য এবং অনেক ক্ষেত্রে অর্থও অসম্পূর্ণ থেকে যায়। এটি তিলাওয়াতে একটি ছন্দময় প্রবাহ তৈরি করে।",
      rules: [
        "তাশদীদযুক্ত নুুন ও মীম সবসময় ২ হারাকাত পরিমাণ গুন্নাহ হবে।",
        "ইখফা-এর ক্ষেত্রেও নাকের বাঁশি ব্যবহার করে গুন্নাহ হয়।",
        "ইদগামে বা-গুন্নাহর ক্ষেত্রে হরফ দুটিকে মিলিয়ে গুন্নাহ করতে হয়।"
      ],
      examples: [
        { text: "إِنَّ اللهَ مَعَ الصَّابِرِينَ", bn: "ইন্নাল্লাহা মা'আস সাবিরীন", audio: "https://everyayah.com/data/Alafasy_128kbps/002153.mp3" },
        { text: "عَمَّ يَتَسَاءَلُونَ", bn: "আম্মা ইয়াতাসালুন", audio: "https://everyayah.com/data/Alafasy_128kbps/078001.mp3" }
      ],
      icon: <Sparkles className="text-emerald-500" size={24} />,
      color: "emerald"
    },
    {
      title: "প্রতিধ্বনি: কলকলা (Qalqala)",
      definition: "কলকলা মানে হলো প্রতিধ্বনি বা ধাক্কা দিয়ে পড়া। কলকলার হরফ ৫টি: ক্বফ (ق), ত্বো (ط), বা (ب), জীম (ج), দাল (দ)। সংক্ষেপে একে 'কুতুবু জাদিন' বলা হয়।",
      importance: "এই হরফগুলো সাকিন বা ওয়াকফ অবস্থায় থাকলে এগুলোর মাখরাজে একটি ধাক্কা দিতে হয়, যাতে এর উচ্চারণ প্রতিধ্বনিত হয়ে পুনরায় কানে আসে।",
      rules: [
        "হরফ পাঁচটি সাকিন অবস্থায় থাকলে কলকলা হয়।",
        "ওয়াকফ অবস্থায় হরফটি আসলে সবচেয়ে শক্তিশালী কলকলা হয় (যেমন সুরা ইখলাসের শেষে)।",
        "হরফের মাখরাজকে শক্তভাবে আঁকড়ে ধরে দ্রুত ছেড়ে দিতে হয়।"
      ],
      examples: [
        { text: "قُلْ هُوَ اللّٰهُ اَحَدٌ", bn: "ক্বুল হুয়াল্লাহু আহাদ(দ্)", audio: "https://everyayah.com/data/Alafasy_128kbps/112001.mp3" },
        { text: "فِي الْعُقَدِ", bn: "ফিল উক্বদ(দ্)", audio: "https://everyayah.com/data/Alafasy_128kbps/113004.mp3" }
      ],
      icon: <Award className="text-red-500" size={24} />,
      color: "red"
    },
    {
      title: "দীর্ঘকরণ: মাদ (Madd)",
      definition: "মাদ মানে হলো দীর্ঘ করা বা টেনে পড়া। মদ্দের প্রধান হরফ ৩টি: খালি আলিফ (ا), সাকিন ওয়াও (و) যার আগে পেশ আছে, এবং সাকিন ইয়া (ي) যার আগে যের আছে।",
      importance: "মাদের সঠিক প্রয়োগ তিলাওয়াতের মাধুর্য বাড়ায় এবং হরফের সঠিক উচ্চারণ নিশ্চিত করে। মাদের ভুলে অনেক সময় শব্দের অর্থ বদলে যেতে পারে।",
      rules: [
        "মাদ আসলি বা আসল মাদ ১ হারাকাত (১ আলিফ) পরিমাণ টানতে হয়।",
        "মাদ ফারয়ি বা শাখা মাদ ৪ থেকে ৬ হারাকাত পর্যন্ত টানা হয়ে থাকে (চিহ্ন: মোটা বা চিকন বাঁকা চিহ্ন)।",
        "লীনের হরফের পর ওয়াকফ হলেও মাদ হয়।"
      ],
      examples: [
        { text: "قَالَ لَا أَعْبُدُ", bn: "ক্ব-লা লা আ'বুদু", audio: "https://everyayah.com/data/Alafasy_128kbps/109002.mp3" },
        { text: "فِي دِينِ اللَّهِ", bn: "ফী দী-নিল্লাহ", audio: "https://everyayah.com/data/Alafasy_128kbps/110002.mp3" }
      ],
      icon: <BookOpen className="text-blue-500" size={24} />,
      color: "blue"
    },
    {
      title: "স্পষ্টকরণ: ইযহার (Izhar)",
      definition: "ইযহার মানে স্পষ্ট করে পড়া। নুন সাকিন বা তানফীনের পরে ৬টি হরফের (ء ه ع ح غ خ) কোনো একটি আসলে গুন্নাহ না করে স্পষ্টভাবে হরফের মাখরাজ থেকে পড়তে হয়।",
      importance: "এটি নিশ্চিত করে যে হরফগুলো তাদের নিজস্ব মাখরাজ থেকে কোনো রকম বিলম্ব বা গুন্নাহ ছাড়াই উচ্চারিত হচ্ছে।",
      rules: [
        "হলকী হরফ ৬টি সবসময় মনে রাখতে হবে: হামযাহ, হা, আইন, হা, গাইন, খা।",
        "এই হরফগুলোর আগে নুন সাকিন বা তানফীন আসলে একদম স্বাভাবিকভাবে পড়তে হবে।"
      ],
      examples: [
        { text: "مِنْ حَيْثُ", bn: "মিন হাইছু", audio: "https://everyayah.com/data/Alafasy_128kbps/002150.mp3" },
        { text: "عَذَابٌ أَلِيمٌ", bn: "আযাবুন আলীম", audio: "https://everyayah.com/data/Alafasy_128kbps/002010.mp3" }
      ],
      icon: <Info className="text-slate-500" size={24} />,
      color: "slate"
    }
  ];


  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md py-4 -mx-4 lg:-mx-10 px-8 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 rounded-2xl transition-all text-slate-800 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform text-orange-500" />
            <span className="text-sm font-bold">ফিরে যান</span>
          </button>
          <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">তাজবীদ শিক্ষা</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tajweed Rules Guide</p>
          </div>
        </div>
      </header>

      {/* Hero Welcome */}
      {!practiceVerse && (
        <section className="rounded-[48px] bg-gradient-to-br from-orange-400 to-orange-600 p-10 text-white shadow-2xl shadow-orange-500/20 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold border border-white/20">
                <Award size={16} />
                <span>Free for everyone</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">সহজ বাংলা ভাষায় তাজবীদ শিখন</h2>
            <p className="text-xl text-orange-50/80 max-w-xl font-medium">
              কুরআন সঠিকভাবে তিলাওয়াত করার জন্য তাজবীদ জানা অত্যন্ত গুরুত্বপূর্ণ। এখানে আমরা প্রধান নিয়মগুলো ব্যাখ্যা করেছি।
            </p>
            <button 
              onClick={() => startPractice("اَهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ")}
              className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-orange-50 transition-all active:scale-95"
            >
              <Mic size={20} />
              AI দিয়ে তিলাওয়াত যাচাই করুন
            </button>
          </div>
        </section>
      )}

      {/* AI Practice Lab - Shows when requested */}
      <AnimatePresence>
        {practiceVerse && (
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Sparkles size={20} className="text-emerald-600" />
                AI প্র্যাকটিস ল্যাব
              </h3>
              <button 
                onClick={() => setPracticeVerse(null)}
                className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                বন্ধ করুন (Close)
              </button>
            </div>
            <RecitationAnalyzer initialVerse={practiceVerse} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-slate-200/50 rounded-3xl w-fit mx-auto overflow-x-auto no-scrollbar max-w-full">
        <button
          onClick={() => setActiveTab('rules')}
          className={cn(
            "px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
            activeTab === 'rules' ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          ব্যবহারিক নিয়ম
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={cn(
            "px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
            activeTab === 'guide' ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          বিস্তারিত গাইড
        </button>
        <button
          onClick={() => setActiveTab('makharij')}
          className={cn(
            "px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
            activeTab === 'makharij' ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          মাখরাজ চিত্র
        </button>
        <button
          onClick={() => setActiveTab('syllabus')}
          className={cn(
            "px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
            activeTab === 'syllabus' ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          পাঠ্যক্রম
        </button>
      </div>

      {activeTab === 'guide' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">তাজবীদের বিস্তারিত গাইড</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              কুরআন তিলাওয়াতের প্রতিটি নিয়মকে আরও গভীরে গিয়ে বুঝুন এবং উদাহরণের মাধ্যমে আপনার পঠন শৈলীকে উন্নত করুন।
            </p>
          </div>

          <div className="grid gap-8">
            {DETAILED_RULES.map((rule, idx) => (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-xl shadow-slate-100 group"
              >
                <div className="p-8 md:p-12 space-y-10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                          rule.color === 'emerald' ? "bg-emerald-50" :
                          rule.color === 'red' ? "bg-red-50" :
                          rule.color === 'blue' ? "bg-blue-50" :
                          "bg-slate-50"
                        )}>
                          {rule.icon}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">{rule.title}</h3>
                      </div>
                      <p className="text-xl font-medium text-slate-700 leading-relaxed font-bangla">
                        {rule.definition}
                      </p>
                    </div>
                    <div className="md:w-1/3 bg-slate-50 p-6 rounded-3xl border border-dotted border-slate-200 space-y-3 shrink-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">গুরুত্ব (Significance)</p>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                        "{rule.importance}"
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="flex items-center gap-2 text-sm font-black text-orange-600 uppercase tracking-widest">
                        <ChevronLeft size={16} /> প্রধান বৈশিষ্ট্যসমূহ
                      </h4>
                      <ul className="space-y-4">
                        {rule.rules.map((r, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:border-slate-200 transition-colors">
                            <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-black shrink-0">
                              {rIdx + 1}
                            </div>
                            <p className="text-slate-700 font-medium text-sm leading-relaxed">{r}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-6">
                      <h4 className="flex items-center gap-2 text-sm font-black text-orange-600 uppercase tracking-widest">
                        <Sparkles size={16} /> উদাহরণ ও উচ্চারণ
                      </h4>
                      <div className="grid gap-4">
                        {rule.examples.map((ex, eIdx) => (
                           <div key={eIdx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group/ex">
                             <div className="space-y-2">
                               <p className="text-2xl font-bold text-slate-900 font-arabic" dir="rtl">{ex.text}</p>
                               <p className="text-xs font-bold text-slate-400 font-bangla">{ex.bn}</p>
                             </div>
                             <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const audio = new Audio(ex.audio);
                                    audio.play();
                                  }}
                                  className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-orange-500 hover:shadow-lg transition-all active:scale-95 border border-slate-100"
                                >
                                  <Play size={20} fill="currentColor" />
                                </button>
                                <button
                                  onClick={() => startPractice(ex.text)}
                                  className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all active:scale-95",
                                    rule.color === 'emerald' ? "bg-emerald-500 shadow-emerald-200" :
                                    rule.color === 'red' ? "bg-red-500 shadow-red-200" :
                                    rule.color === 'blue' ? "bg-blue-500 shadow-blue-200" :
                                    "bg-slate-900 shadow-slate-200"
                                  )}
                                >
                                  <Mic size={20} />
                                </button>
                             </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'makharij' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900">মাখরাজের চিত্র ও বর্ণনা</h2>
            <p className="text-slate-500 font-medium">হরফসমূহ উচ্চারণের ১৭টি নির্দিষ্ট স্থান সহজে শিখুন</p>
          </div>
          <MakharijDiagram />
        </motion.div>
      )}

      {activeTab === 'rules' ? (
        /* Rules Grid */
        <div className="grid gap-8">
          {TAJWEED_RULES.map((rule, idx) => (
            <motion.section 
              key={rule.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              id={rule.label.toLowerCase()}
              className="group"
            >
              <div 
                className="bg-white rounded-[40px] border border-slate-200 p-8 md:p-10 shadow-xl shadow-slate-200/40 hover:border-primary-200 transition-all border-l-[6px]"
                style={{ borderLeftColor: rule.color.replace('bg-[', '').replace(']', '') }}
              >
                <div className="flex flex-col md:flex-row gap-8">
                   <div className="md:w-1/3 space-y-4">
                      <div className={cn("h-16 w-16 rounded-3xl flex items-center justify-center text-white shadow-lg", rule.color)}>
                         <BookOpen size={32} />
                      </div>
                      <div>
                         <h3 className="text-3xl font-black text-slate-900 mb-1">{rule.label}</h3>
                         <p className={cn("text-lg font-bold", rule.textColor)}>{rule.description}</p>
                      </div>
                   </div>
                   
                   <div className="md:w-2/3 space-y-6">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                         <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">বিস্তারিত ব্যাখ্যা (Explanation)</h4>
                         <p className="text-slate-700 leading-relaxed text-lg font-medium">
                           {rule.explanation}
                         </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">উদাহরণ (Example)</h4>
                            <p 
                              className={cn("text-3xl font-serif text-right", rule.textColor)} 
                              style={{ direction: 'rtl' }}
                              dangerouslySetInnerHTML={{ __html: parseTajweed(rule.example) }}
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <button 
                              onClick={() => setActiveRule(rule)}
                              className="flex items-center justify-center gap-3 bg-slate-100 text-slate-900 rounded-3xl p-4 font-bold hover:bg-slate-200 transition-colors"
                            >
                               <Play size={18} fill="currentColor" />
                               <span className="text-sm">শুনুন</span>
                            </button>
                            <button 
                              onClick={() => startPractice(rule.example)}
                              className={cn("flex items-center justify-center gap-3 text-white rounded-3xl p-4 font-bold transition-transform active:scale-95 shadow-lg", rule.color)}
                            >
                               <Mic size={18} />
                               <span className="text-sm">পরীক্ষা করুন</span>
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      ) : (
        /* Syllabus / Curriculum View */
        <div className="space-y-8">
          <div className="grid gap-6">
            {TAJWEED_SYLLABUS.map((chapter, idx) => (
              <motion.div
                key={chapter.chapter}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "bg-white rounded-[32px] p-8 border transition-all cursor-pointer",
                  expandedChapter === chapter.chapter ? "border-orange-200 shadow-lg" : "border-slate-200 shadow-sm hover:shadow-md"
                )}
                onClick={() => toggleChapter(chapter.chapter)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{chapter.chapter}</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">{chapter.title}</h3>
                  </div>
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-bold transition-colors",
                    expandedChapter === chapter.chapter ? "bg-orange-500 text-white" : "bg-slate-50 text-slate-300"
                  )}>
                    {idx + 1}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  {chapter.topics.map((topic, tIdx) => (
                    <div 
                      key={tIdx}
                      className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium border border-slate-100"
                    >
                      {topic}
                    </div>
                  ))}
                </div>

                <AnimatePresence>
                  {expandedChapter === chapter.chapter && chapter.qa && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 border-t border-slate-100 space-y-6">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-orange-600 uppercase tracking-widest">
                          <Info size={16} />
                          বহুল জিজ্ঞাসিত প্রশ্ন ও উত্তর
                        </h4>
                        <div className="grid gap-4">
                          {chapter.qa.map((item, qIdx) => (
                            <div key={qIdx} className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100/50">
                              <p className="font-bold text-slate-900 mb-2 flex gap-3">
                                <span className="text-orange-500">Q:</span>
                                {item.q}
                              </p>
                              <p className="text-slate-600 leading-relaxed flex gap-3">
                                <span className="text-emerald-500 font-bold">A:</span>
                                {item.a}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400">
                  {expandedChapter === chapter.chapter ? "সংক্ষিপ্ত বিবরণ দেখতে ক্লিক করুন" : "প্রশ্ন ও উত্তর দেখতে ক্লিক করুন"}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Gamification Teaser */}
      <section className="bg-primary-900 rounded-[48px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4">
           <h3 className="text-3xl font-black">শিখুন এবং পয়েন্ট অর্জন করুন!</h3>
           <p className="text-lg opacity-70">তাজবীদ কুইজ সম্পন্ন করে ব্যাজ সংগ্রহ করুন। সবার জন্য উন্মুক্ত!</p>
        </div>
        <button className="whitespace-nowrap px-8 py-4 bg-primary-500 rounded-2xl font-bold hover:bg-primary-400 transition-all shadow-xl shadow-primary-500/20">
          কুইজ শুরু করুন
        </button>
      </section>

      <AnimatePresence>
        {activeRule && (
          <TajweedRuleModal 
            rule={activeRule} 
            onClose={() => setActiveRule(null)} 
          />
        )}
      </AnimatePresence>
      <TajweedColorSheet onRuleClick={setActiveRule} />
    </div>
  );
}
