
/**
 * Al Quran Cloud ar.tajweed encoding:
 * - [g]: Ghunna
 * - [p]: Qalqala
 * - [m]: Madd
 * - [i]: Ikhfa
 * - [d]: Idgham
 * - [s]: Ikhfa Shafawi
 * - [y]: Idgham Shafawi
 */
export function parseTajweed(text: string): string {
  if (!text) return '';
  
  // We wrap the groups in spans with data attributes for click handling
  // Comprehensive tag support for api.alquran.cloud ar.tajweed
  return text
    .replace(/\[g\](.*?)\[\/g\]/g, '<span class="tajweed-ghunna cursor-help text-orange-500 font-bold" data-rule="Ghunna">$1</span>')
    .replace(/\[h\](.*?)\[\/h\]/g, '<span class="tajweed-ghunna cursor-help text-orange-500 font-bold" data-rule="Ghunna">$1</span>')
    .replace(/\[p\](.*?)\[\/p\]/g, '<span class="tajweed-qalqala cursor-help text-blue-600 font-bold" data-rule="Qalqala">$1</span>')
    .replace(/\[q\](.*?)\[\/q\]/g, '<span class="tajweed-qalqala cursor-help text-blue-600 font-bold" data-rule="Qalqala">$1</span>')
    .replace(/\[m\](.*?)\[\/m\]/g, '<span class="tajweed-madd cursor-help text-rose-600 font-bold" data-rule="Madd">$1</span>')
    .replace(/\[i\](.*?)\[\/i\]/g, '<span class="tajweed-ikhfa cursor-help text-emerald-600 font-bold" data-rule="Ikhfa">$1</span>')
    .replace(/\[n\](.*?)\[\/n\]/g, '<span class="tajweed-idgham cursor-help text-purple-600 font-bold" data-rule="Idgham">$1</span>')
    .replace(/\[d\](.*?)\[\/d\]/g, '<span class="tajweed-idgham cursor-help text-purple-600 font-bold" data-rule="Idgham">$1</span>')
    .replace(/\[s\](.*?)\[\/s\]/g, '<span class="tajweed-ikhfa-shafawi cursor-help text-teal-600 font-bold" data-rule="Ikhfa Shafawi">$1</span>')
    .replace(/\[y\](.*?)\[\/y\]/g, '<span class="tajweed-idgham-shafawi cursor-help text-indigo-600 font-bold" data-rule="Idgham Shafawi">$1</span>')
    .replace(/\[k\](.*?)\[\/k\]/g, '<span class="tajweed-iqlab cursor-help text-cyan-600 font-bold" data-rule="Iqlab">$1</span>')
    .replace(/\[l\](.*?)\[\/l\]/g, '<span class="tajweed-leen cursor-help text-lime-600 font-bold" data-rule="Madde Leen">$1</span>');
}

export interface TajweedRule {
  label: string;
  description: string;
  explanation: string;
  example: string;
  color: string;
  class: string;
}

export const TAJWEED_RULES: TajweedRule[] = [
  { 
    label: 'Ghunna', 
    description: 'নুন ও মীম মুসাদ্দাদ হলে গুন্নাহ করা ওয়াজিব।',
    explanation: 'নাক দিয়ে আওয়াজ বের করে পড়া। মীম (م) বা নুন (ن) এর উপর তাশদীদ থাকলে এটি অবশ্যই ২ হারাকাত পরিমাণ গুন্নাহ করে পড়তে হবে।',
    example: 'إِنَّا (ইন্না), ثُمَّ (সুম্মা)',
    color: 'bg-orange-500', 
    class: 'tajweed-ghunna' 
  },
  { 
    label: 'Qalqala', 
    description: '৫টি হরফে (ق ط ب ج দ) সাকিন হলে প্রতিধ্বনি করা।',
    explanation: 'হরফগুলো পড়ার সময় ধাক্কা লেগে বা প্রতিধ্বনিত হয়ে উচ্চারিত হবে। ক্বফ, তBinding, বা, জীম, দাল - এই ৫টি হরফ।',
    example: 'أَقْطَابُ (আক্বত্বাবু)',
    color: 'bg-blue-600', 
    class: 'tajweed-qalqala' 
  },
  { 
    label: 'Madd', 
    description: 'হরফকে দীর্ঘ বা টেনে পড়া।',
    explanation: 'মদ্দের হরফ (আলিফ, ওয়াও, ইয়া) থাকলে ১ থেকে ৪ হারাকাত পর্যন্ত টেনে পড়তে হয়।',
    example: 'قَالَ (ক্বালা), سُوْءُ (সূউ)',
    color: 'bg-rose-600', 
    class: 'tajweed-madd' 
  },
  { 
    label: 'Ikhfa', 
    description: 'নুন সাকিন বা তানবীনকে লুকিয়ে পড়া।',
    explanation: 'নুন সাকিন বা তানবীনের পরে ইখফার ১৫টি হরফের কোনোটি আসলে হালকা গুন্নাহর সাথে লুকিয়ে পড়তে হবে।',
    example: 'مِنْ قَبْلِ (মিং ক্বাবলি)',
    color: 'bg-emerald-600', 
    class: 'tajweed-ikhfa' 
  },
  { 
    label: 'Idgham', 
    description: 'এক হরফকে অন্যটির সাথে মিলিয়ে পড়া।',
    explanation: 'নুন সাকিন বা তানবীনের পরে ইয়া, রা, মীম, লাম, ওয়াও, নুন (যুরমালুন) আসলে মিলিয়ে পড়তে হয়।',
    example: 'مَنْ يَعْمَلْ (মাইঁ ইয়া\'মাল)',
    color: 'bg-purple-600', 
    class: 'tajweed-idgham' 
  },
  { 
    label: 'Ikhfa Shafawi', 
    description: 'মীম সাকিনকে লুকিয়ে পড়া।',
    explanation: 'মীম সাকিনের পরে বা (ب) আসলে গুন্নাহর সাথে লুকিয়ে পড়তে হয়।',
    example: 'تَرْمِيْهِمْ بِحِجَارَةٍ',
    color: 'bg-teal-600', 
    class: 'tajweed-ikhfa-shafawi' 
  },
  { 
    label: 'Idgham Shafawi', 
    description: 'এক মীমকে অন্য মীমের সাথে মিলিয়ে পড়া।',
    explanation: 'মীম সাকিনের পরে আরও একটি মীম (م) আসলে গুন্নাহর সাথে মিলিয়ে পড়তে হয়।',
    example: 'لَهُمْ مَّا يَشَاءُوْنَ',
    color: 'bg-indigo-600', 
    class: 'tajweed-idgham-shafawi' 
  },
  { 
    label: 'Iqlab', 
    description: 'নুন সাকিন বা তানবীনকে মীমে পরিবর্তন করে পড়া।',
    explanation: 'নুন সাকিন বা তানবীনের পরে বা (ب) আসলে তাকে মীম দ্বারা পরিবর্তন করে গুন্নাহর সাথে পড়তে হয়।',
    example: 'مِنْ بَعْدِ (মিম্ম বা\'দি)',
    color: 'bg-cyan-600', 
    class: 'tajweed-iqlab' 
  },
  { 
    label: 'Madde Leen', 
    description: 'ওয়াকফ হওয়ার সময় ২ হারাকাত পরিমাণ টেনে পড়া।',
    explanation: 'লীনের হরফ ২ টি: ওয়াও সাকিন (وْ) এবং ইয়া সাকিন (يْ) যার ডানে যবর থাকে। মদ্দের হরফের মত ওয়াকফ করার সময় এগুলো ১ থেকে ২ হারাকাত টেনে পড়তে হয়।',
    example: 'خَوْفٍ (খওফ্), قُرَيْشٍ (ক্বুরাইশ্)',
    color: 'bg-lime-600', 
    class: 'tajweed-leen' 
  },
];
