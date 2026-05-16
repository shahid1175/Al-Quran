
export interface MakharijPoint {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  pronunciationGuide: string;
  letters: {
    char: string;
    audio?: string;
  }[];
  area: 'throat' | 'tongue' | 'lips' | 'nose' | 'mouth-empty';
  illustrationPos: { x: number; y: number }; // Percentage based for SVG overlay
}

export const MAKHAREJ_DATA: MakharijPoint[] = [
  {
    id: 1,
    name: "জওফ (মুখের খালি জায়গা)",
    nameAr: "الجوف",
    description: "মুখের এবং গলার ভেতরের খালি জায়গা থেকে মদ্দের ৩টি হরফ উচ্চারিত হয়।",
    pronunciationGuide: "মুখের খালি জায়গা থেকে বাতাস ছেড়ে দিয়ে স্বাভাবিকভাবে উচ্চারণ করুন।",
    letters: [
      { char: "ا", audio: "https://www.islamcan.com/arabic-alphabet/audio/alif.mp3" },
      { char: "و", audio: "https://www.islamcan.com/arabic-alphabet/audio/waw.mp3" },
      { char: "ي", audio: "https://www.islamcan.com/arabic-alphabet/audio/ya.mp3" }
    ],
    area: 'mouth-empty',
    illustrationPos: { x: 50, y: 50 }
  },
  {
    id: 2,
    name: "আক্বসাল হলক্ব (গলার শেষ ভাগ)",
    nameAr: "أقصى الحلق",
    description: "হলক্ব বা কণ্ঠনালীর শুরু (বুকের দিক) থেকে উচ্চারিত হয়।",
    pronunciationGuide: "বুকের উপরিভাগ থেকে হলক্ব শুরু হওয়ার স্থান থেকে উচ্চারণ করুন।",
    letters: [
      { char: "ء", audio: "https://www.islamcan.com/arabic-alphabet/audio/hamza.mp3" },
      { char: "ه", audio: "https://www.islamcan.com/arabic-alphabet/audio/ha.mp3" }
    ],
    area: 'throat',
    illustrationPos: { x: 50, y: 90 }
  },
  {
    id: 3,
    name: "অসাতুল হলক্ব (গলার মধ্যভাগ)",
    nameAr: "وسط الحلق",
    description: "কণ্ঠনালীর মাঝখান থেকে উচ্চারিত হয়।",
    pronunciationGuide: "হলক্বের একেবারে মাঝখান থেকে চেপে উচ্চারণ করুন।",
    letters: [
      { char: "ع", audio: "https://www.islamcan.com/arabic-alphabet/audio/ain.mp3" },
      { char: "ح", audio: "https://www.islamcan.com/arabic-alphabet/audio/hhaa.mp3" }
    ],
    area: 'throat',
    illustrationPos: { x: 50, y: 80 }
  },
  {
    id: 4,
    name: "আদনাল হলক্ব (গলার শুরু ভাগ)",
    nameAr: "أدنى الحلق",
    description: "কণ্ঠনালীর শেষ অংশ (মুখের দিক) থেকে উচ্চারিত হয়।",
    pronunciationGuide: "জিহ্বার গোড়া যেখানে হলক্বের সাথে মিশেছে সেখান থেকে উচ্চারণ করুন।",
    letters: [
      { char: "غ", audio: "https://www.islamcan.com/arabic-alphabet/audio/ghain.mp3" },
      { char: "خ", audio: "https://www.islamcan.com/arabic-alphabet/audio/khha.mp3" }
    ],
    area: 'throat',
    illustrationPos: { x: 52, y: 72 }
  },
  {
    id: 5,
    name: "আক্বসাল লিসান (জিহ্বার গোড়া)",
    nameAr: "أقصى اللسان",
    description: "জিহ্বার গোড়া এবং তার বরাবর উপরের তালুর নরম অংশ থেকে উচ্চারিত হয়।",
    pronunciationGuide: "জিহ্বার গোড়া উপরের তালুর নরম অংশের সাথে লাগিয়ে সজোরে উচ্চারণ করুন।",
    letters: [
      { char: "ق", audio: "https://www.islamcan.com/arabic-alphabet/audio/qaf.mp3" }
    ],
    area: 'tongue',
    illustrationPos: { x: 42, y: 65 }
  },
  {
    id: 6,
    name: "আক্বসাল লিসান (জিহ্বার গোড়া - ২)",
    nameAr: "أقصى اللسان",
    description: "জিহ্বার গোড়া থেকে একটু আগে এবং তার বরাবর উপরের তালুর শক্ত অংশ থেকে উচ্চারিত হয়।",
    pronunciationGuide: "ক্বফ-এর মাখরাজ থেকে সামান্য সামনে এগিয়ে তালুর শক্ত অংশে লাগিয়ে উচ্চারণ করুন।",
    letters: [
      { char: "ك", audio: "https://www.islamcan.com/arabic-alphabet/audio/kaf.mp3" }
    ],
    area: 'tongue',
    illustrationPos: { x: 45, y: 62 }
  },
  {
    id: 7,
    name: "অসাতুল লিসান (জিহ্বার মধ্যভাগ)",
    nameAr: "وسط اللسان",
    description: "জিহ্বার মাঝখান এবং তার বরাবর উপরের তালু থেকে উচ্চারিত হয়।",
    pronunciationGuide: "জিহ্বার মাঝখানের পিঠ উপরের তালুর সাথে লাগিয়ে উচ্চারণ করুন।",
    letters: [
      { char: "ج", audio: "https://www.islamcan.com/arabic-alphabet/audio/jeem.mp3" },
      { char: "শ", audio: "https://www.islamcan.com/arabic-alphabet/audio/sheen.mp3" },
      { char: "ي", audio: "https://www.islamcan.com/arabic-alphabet/audio/ya.mp3" }
    ],
    area: 'tongue',
    illustrationPos: { x: 55, y: 58 }
  },
  {
    id: 8,
    name: "হাফফাতুল লিসান (জিহ্বার পাশ)",
    nameAr: "حافة اللسان",
    description: "জিহ্বার গোড়ার একপার্শ্বের কিনারা উপরের মাড়ির দাঁতের গোড়ার সাথে লাগিয়ে উচ্চারিত হয়।",
    pronunciationGuide: "জিহ্বার বাম অথবা ডান পাশের অংশ উপরের মাড়ির দাঁতের সাথে লাগিয়ে মোটা করে উচ্চারণ করুন।",
    letters: [
      { char: "ض", audio: "https://www.islamcan.com/arabic-alphabet/audio/daad.mp3" }
    ],
    area: 'tongue',
    illustrationPos: { x: 60, y: 55 }
  },
  {
    id: 9,
    name: "আদনাল লিসান (জিহ্বার আগার পাশ)",
    nameAr: "أدنى اللسان",
    description: "জিহ্বার আগার একপার্শ্বের কিনারা এবং সামনের উপরের দাঁতের গোড়ার সাথে লাগিয়ে উচ্চারিত হয়।",
    pronunciationGuide: "জিহ্বার আগার এক পাশের অংশ উপরের দাঁতের গোড়ার মাড়ির সাথে লাগিয়ে উচ্চারণ করুন।",
    letters: [
      { char: "ل", audio: "https://www.islamcan.com/arabic-alphabet/audio/lam.mp3" }
    ],
    area: 'tongue',
    illustrationPos: { x: 65, y: 52 }
  },
  {
    id: 10,
    name: "তরোফুল লিসান (জিহ্বার আগা)",
    nameAr: "طرف اللسان",
    description: "জিহ্বার আগা এবং তার বরাবর সামনের উপরের দাঁতের গোড়ার মাড়ির সাথে লাগিয়ে উচ্চারিত হয়।",
    pronunciationGuide: "জিহ্বার আগা উপরের দাঁতের মাড়ির সাথে লাগিয়ে উচ্চারণ করুন।",
    letters: [
      { char: "ন", audio: "https://www.islamcan.com/arabic-alphabet/audio/noon.mp3" }
    ],
    area: 'tongue',
    illustrationPos: { x: 70, y: 50 }
  },
  {
    id: 11,
    name: "তরোফুল লিসান (জিহ্বার আগার পিঠ)",
    nameAr: "طرف اللسان",
    description: "জিহ্বার আগার পিঠ সামনের উপরের দুই দাঁতের গোড়ার সাথে লাগিয়ে উচ্চারিত হয়।",
    pronunciationGuide: "জিহ্বার আগার উল্টো পিঠ উপরের অগ্রবর্তী দাঁত দুটির গোড়ার সাথে লাগিয়ে উচ্চারণ করুন।",
    letters: [
      { char: "র", audio: "https://www.islamcan.com/arabic-alphabet/audio/ra.mp3" }
    ],
    area: 'tongue',
    illustrationPos: { x: 72, y: 48 }
  },
  {
    id: 12,
    name: "তরোফুল লিসান (জিহ্বার আগা - ৩)",
    nameAr: "طرف اللسان",
    description: "জিহ্বার আগা সামনের উপরের দুই দাঁতের গোড়ার সাথে লাগিয়ে উচ্চারিত হয়।",
    pronunciationGuide: "জিহ্বার আগা সামনের উপরের দুই দাঁতের গোড়ার সাথে লাগিয়ে উচ্চারণ করুন।",
    letters: [
      { char: "ط", audio: "https://www.islamcan.com/arabic-alphabet/audio/tto.mp3" },
      { char: "দ", audio: "https://www.islamcan.com/arabic-alphabet/audio/dal.mp3" },
      { char: "ত", audio: "https://www.islamcan.com/arabic-alphabet/audio/ta.mp3" }
    ],
    area: 'tongue',
    illustrationPos: { x: 78, y: 45 }
  },
  {
    id: 13,
    name: "তরোফুল লিসান (জিহ্বার আগা - ৪)",
    nameAr: "طرف اللسان",
    description: "জিহ্বার আগা এবং সামনের নিচের দুই দাঁতের পেট ও আগার সাথে লাগিয়ে উচ্চারিত হয়।",
    pronunciationGuide: "জিহ্বার আগা সামনের নিচের দুই দাঁতের উপরিভাগের সাথে লাগিয়ে শিস দিয়ে উচ্চারণ করুন।",
    letters: [
      { char: "ص", audio: "https://www.islamcan.com/arabic-alphabet/audio/sad.mp3" },
      { char: "স", audio: "https://www.islamcan.com/arabic-alphabet/audio/seen.mp3" },
      { char: "জ", audio: "https://www.islamcan.com/arabic-alphabet/audio/za.mp3" }
    ],
    area: 'tongue',
    illustrationPos: { x: 82, y: 48 }
  },
  {
    id: 14,
    name: "তরোফুল লিসান (জিহ্বার আগা - ৫)",
    nameAr: "طرف اللسان",
    description: "জিহ্বার আগা সামনের উপরের দুই দাঁতের আগার সাথে লাগিয়ে উচ্চারিত হয়।",
    pronunciationGuide: "জিহ্বার আগা সামনের উপরের দুই দাঁতের আগার সাথে সামান্য লাগিয়ে উচ্চারণ করুন।",
    letters: [
      { char: "ظ", audio: "https://www.islamcan.com/arabic-alphabet/audio/thao.mp3" },
      { char: "ذ", audio: "https://www.islamcan.com/arabic-alphabet/audio/dhal.mp3" },
      { char: "ث", audio: "https://www.islamcan.com/arabic-alphabet/audio/tha.mp3" }
    ],
    area: 'tongue',
    illustrationPos: { x: 80, y: 40 }
  },
  {
    id: 15,
    name: "বাতনুল শাফাহ (নিচের ঠোঁট)",
    nameAr: "بطن الشفة",
    description: "নিচের ঠোঁটের পেট সামনের উপরের দুই দাঁতের আগার সাথে লাগিয়ে উচ্চারিত হয়।",
    pronunciationGuide: "নিচের ঠোঁটের ভেতরের অংশ উপরের অগ্রবর্তী দুই দাঁতের আগার সাথে লাগিয়ে উচ্চারণ করুন।",
    letters: [
      { char: "ف", audio: "https://www.islamcan.com/arabic-alphabet/audio/fa.mp3" }
    ],
    area: 'lips',
    illustrationPos: { x: 85, y: 45 }
  },
  {
    id: 16,
    name: "আশ-শাফাতান (দুই ঠোঁট)",
    nameAr: "الشفتان",
    description: "দুই ঠোঁট থেকে হরফগুলো উচ্চারিত হয়।",
    pronunciationGuide: "দুই ঠোঁটের বিভিন্ন অংশ ব্যবহার করে উচ্চারণ করুন।",
    letters: [
      { char: "ب", audio: "https://www.islamcan.com/arabic-alphabet/audio/ba.mp3" },
      { char: "ম", audio: "https://www.islamcan.com/arabic-alphabet/audio/meem.mp3" },
      { char: "ও", audio: "https://www.islamcan.com/arabic-alphabet/audio/waw.mp3" }
    ],
    area: 'lips',
    illustrationPos: { x: 92, y: 50 }
  },
  {
    id: 17,
    name: "আল-খাইশুম (নাসিকা)",
    nameAr: "الخيشوم",
    description: "নাকের বাঁশি থেকে গুন্নাহ উচ্চারিত হয়।",
    pronunciationGuide: "নাকের বাঁশি থেকে গুঞ্জনধ্বনি বা গুন্নাহ সহকারে উচ্চারণ করুন।",
    letters: [
      { char: "গুন্নাহ", audio: "https://www.islamcan.com/arabic-alphabet/audio/ghunnah.mp3" }
    ],
    area: 'nose',
    illustrationPos: { x: 75, y: 25 }
  }
];
