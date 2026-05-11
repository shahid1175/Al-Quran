
export interface MakharijPoint {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  letters: string[];
  area: 'throat' | 'tongue' | 'lips' | 'nose' | 'mouth-empty';
  illustrationPos: { x: number; y: number }; // Percentage based for SVG overlay
}

export const MAKHAREJ_DATA: MakharijPoint[] = [
  {
    id: 1,
    name: "জওফ (মুখের খালি জায়গা)",
    nameAr: "الجوف",
    description: "মুখের এবং গলার ভেতরের খালি জায়গা থেকে মদ্দের ৩টি হরফ উচ্চারিত হয়।",
    letters: ["ا", "و", "ي"],
    area: 'mouth-empty',
    illustrationPos: { x: 50, y: 50 }
  },
  {
    id: 2,
    name: "আক্বসাল হলক্ব (গলার শেষ ভাগ)",
    nameAr: "أقصى الحلق",
    description: "হলক্ব বা কণ্ঠনালীর শুরু (বুকের দিক) থেকে উচ্চারিত হয়।",
    letters: ["ء", "ه"],
    area: 'throat',
    illustrationPos: { x: 50, y: 90 }
  },
  {
    id: 3,
    name: "অসাতুল হলক্ব (গলার মধ্যভাগ)",
    nameAr: "وسط الحلق",
    description: "কণ্ঠনালীর মাঝখান থেকে উচ্চারিত হয়।",
    letters: ["ع", "ح"],
    area: 'throat',
    illustrationPos: { x: 50, y: 80 }
  },
  {
    id: 4,
    name: "আদনাল হলক্ব (গলার শুরু ভাগ)",
    nameAr: "أدنى الحلق",
    description: "কণ্ঠনালীর শেষ অংশ (মুখের দিক) থেকে উচ্চারিত হয়।",
    letters: ["غ", "خ"],
    area: 'throat',
    illustrationPos: { x: 52, y: 72 }
  },
  {
    id: 5,
    name: "আক্বসাল লিসান (জিহ্বার গোড়া)",
    nameAr: "أقصى اللسان",
    description: "জিহ্বার গোড়া এবং তার বরাবর উপরের তালুর নরম অংশ থেকে উচ্চারিত হয়।",
    letters: ["ق"],
    area: 'tongue',
    illustrationPos: { x: 42, y: 65 }
  },
  {
    id: 6,
    name: "আক্বসাল লিসান (জিহ্বার গোড়া - ২)",
    nameAr: "أقصى اللسان",
    description: "জিহ্বার গোড়া থেকে একটু আগে এবং তার বরাবর উপরের তালুর শক্ত অংশ থেকে উচ্চারিত হয়।",
    letters: ["ك"],
    area: 'tongue',
    illustrationPos: { x: 45, y: 62 }
  },
  {
    id: 7,
    name: "অসাতুল লিসান (জিহ্বার মধ্যভাগ)",
    nameAr: "وسط اللسان",
    description: "জিহ্বার মাঝখান এবং তার বরাবর উপরের তালু থেকে উচ্চারিত হয়।",
    letters: ["ج", "ش", "ي"],
    area: 'tongue',
    illustrationPos: { x: 55, y: 58 }
  },
  {
    id: 8,
    name: "হাফফাতুল লিসান (জিহ্বার পাশ)",
    nameAr: "حافة اللسان",
    description: "জিহ্বার গোড়ার একপার্শ্বের কিনারা উপরের মাড়ির দাঁতের গোড়ার সাথে লাগিয়ে উচ্চারিত হয়।",
    letters: ["ض"],
    area: 'tongue',
    illustrationPos: { x: 60, y: 55 }
  },
  {
    id: 9,
    name: "আদনাল লিসান (জিহ্বার আগার পাশ)",
    nameAr: "أدنى اللسان",
    description: "জিহ্বার আগার একপার্শ্বের কিনারা এবং সামনের উপরের দাঁতের গোড়ার সাথে লাগিয়ে উচ্চারিত হয়।",
    letters: ["ل"],
    area: 'tongue',
    illustrationPos: { x: 65, y: 52 }
  },
  {
    id: 10,
    name: "তরোফুল লিসান (জিহ্বার আগা)",
    nameAr: "طرف اللسان",
    description: "জিহ্বার আগা এবং তার বরাবর সামনের উপরের দাঁতের গোড়ার মাড়ির সাথে লাগিয়ে উচ্চারিত হয়।",
    letters: ["ن"],
    area: 'tongue',
    illustrationPos: { x: 70, y: 50 }
  },
  {
    id: 11,
    name: "তরোফুল লিসান (জিহ্বার আগার পিঠ)",
    nameAr: "طرف اللسان",
    description: "জিহ্বার আগার পিঠ সামনের উপরের দুই দাঁতের গোড়ার সাথে লাগিয়ে উচ্চারিত হয়।",
    letters: ["ر"],
    area: 'tongue',
    illustrationPos: { x: 72, y: 48 }
  },
  {
    id: 12,
    name: "তরোফুল লিসান (জিহ্বার আগা - ৩)",
    nameAr: "طرف اللسان",
    description: "জিহ্বার আগা সামনের উপরের দুই দাঁতের গোড়ার সাথে লাগিয়ে উচ্চারিত হয়।",
    letters: ["ط", "د", "ت"],
    area: 'tongue',
    illustrationPos: { x: 78, y: 45 }
  },
  {
    id: 13,
    name: "তরোফুল লিসান (জিহ্বার আগা - ৪)",
    nameAr: "طرف اللسان",
    description: "জিহ্বার আগা এবং সামনের নিচের দুই দাঁতের পেট ও আগার সাথে লাগিয়ে উচ্চারিত হয়।",
    letters: ["ص", "س", "ز"],
    area: 'tongue',
    illustrationPos: { x: 82, y: 48 }
  },
  {
    id: 14,
    name: "তরোফুল লিসান (জিহ্বার আগা - ৫)",
    nameAr: "طرف اللسان",
    description: "জিহ্বার আগা সামনের উপরের দুই দাঁতের আগার সাথে লাগিয়ে উচ্চারিত হয়।",
    letters: ["ظ", "ذ", "ث"],
    area: 'tongue',
    illustrationPos: { x: 80, y: 40 }
  },
  {
    id: 15,
    name: "বাতনুল শাফাহ (নিচের ঠোঁট)",
    nameAr: "بطن الشفة",
    description: "নিচের ঠোঁটের পেট সামনের উপরের দুই দাঁতের আগার সাথে লাগিয়ে উচ্চারিত হয়।",
    letters: ["ف"],
    area: 'lips',
    illustrationPos: { x: 85, y: 45 }
  },
  {
    id: 16,
    name: "আশ-শাফাতান (দুই ঠোঁট)",
    nameAr: "الشفتان",
    description: "দুই ঠোঁট থেকে হরফগুলো উচ্চারিত হয়।",
    letters: ["ب", "م", "و"],
    area: 'lips',
    illustrationPos: { x: 92, y: 50 }
  },
  {
    id: 17,
    name: "আল-খাইশুম (নাসিকা)",
    nameAr: "الخيشوم",
    description: "নাকের বাঁশি থেকে গুন্নাহ উচ্চারিত হয়।",
    letters: ["Ghunna"],
    area: 'nose',
    illustrationPos: { x: 75, y: 25 }
  }
];
