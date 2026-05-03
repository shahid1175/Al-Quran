
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
  return text
    .replace(/\[g\](.*?)\[\/g\]/g, '<span class="tajweed-highlight tajweed-ghunna cursor-help underline decoration-dotted" data-rule="Ghunna">$1</span>')
    .replace(/\[p\](.*?)\[\/p\]/g, '<span class="tajweed-highlight tajweed-qalqala cursor-help underline decoration-dotted" data-rule="Qalqala">$1</span>')
    .replace(/\[m\](.*?)\[\/m\]/g, '<span class="tajweed-highlight tajweed-madd cursor-help underline decoration-dotted" data-rule="Madd">$1</span>')
    .replace(/\[i\](.*?)\[\/i\]/g, '<span class="tajweed-highlight tajweed-ikhfa cursor-help underline decoration-dotted" data-rule="Ikhfa">$1</span>')
    .replace(/\[d\](.*?)\[\/d\]/g, '<span class="tajweed-highlight tajweed-idgham cursor-help underline decoration-dotted" data-rule="Idgham">$1</span>')
    .replace(/\[s\](.*?)\[\/s\]/g, '<span class="tajweed-highlight tajweed-ikhfa cursor-help underline decoration-dotted" data-rule="Ikhfa Shafawi">$1</span>')
    .replace(/\[y\](.*?)\[\/y\]/g, '<span class="tajweed-highlight tajweed-idgham cursor-help underline decoration-dotted" data-rule="Idgham Shafawi">$1</span>');
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
    color: 'bg-blue-500', 
    class: 'tajweed-qalqala' 
  },
  { 
    label: 'Madd', 
    description: 'হরফকে দীর্ঘ বা টেনে পড়া।',
    explanation: 'মদ্দের হরফ (আলিফ, ওয়াও, ইয়া) থাকলে ১ থেকে ৪ হারাকাত পর্যন্ত টেনে পড়তে হয়।',
    example: 'قَالَ (ক্বালা), سُوْءُ (সূউ)',
    color: 'bg-pink-500', 
    class: 'tajweed-madd' 
  },
  { 
    label: 'Ikhfa', 
    description: 'নুন সাকিন বা তানবীনকে লুকিয়ে পড়া।',
    explanation: 'নুন সাকিন বা তানবীনের পরে ইখফার ১৫টি হরফের কোনোটি আসলে হালকা গুন্নাহর সাথে লুকিয়ে পড়তে হবে।',
    example: 'مِنْ قَبْلِ (মিং ক্বাবলি)',
    color: 'bg-green-500', 
    class: 'tajweed-ikhfa' 
  },
  { 
    label: 'Idgham', 
    description: 'এক হরফকে অন্যটির সাথে মিলিয়ে পড়া।',
    explanation: 'নুন সাকিন বা তানবীনের পরে ইয়া, রা, মীম, লাম, ওয়াও, নুন (যুরমালুন) আসলে মিলিয়ে পড়তে হয়।',
    example: 'مَنْ يَعْمَلْ (মাইঁ ইয়া\'মাল)',
    color: 'bg-purple-500', 
    class: 'tajweed-idgham' 
  },
];
