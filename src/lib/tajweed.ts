
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
    .replace(/\[g\](.*?)\[\/g\]/g, '<span class="tajweed-ghunna cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#2E7D32]/30" data-rule="Ghunna" style="color: #2E7D32 !important;">$1</span>')
    .replace(/\[h\](.*?)\[\/h\]/g, '<span class="tajweed-ghunna cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#2E7D32]/30" data-rule="Ghunna" style="color: #2E7D32 !important;">$1</span>')
    .replace(/\[p\](.*?)\[\/p\]/g, '<span class="tajweed-qalqala cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#C62828]/30" data-rule="Qalqala" style="color: #C62828 !important;">$1</span>')
    .replace(/\[q\](.*?)\[\/q\]/g, '<span class="tajweed-qalqala cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#C62828]/30" data-rule="Qalqala" style="color: #C62828 !important;">$1</span>')
    .replace(/\[m\](.*?)\[\/m\]/g, '<span class="tajweed-madd cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#1565C0]/30" data-rule="Madd" style="color: #1565C0 !important;">$1</span>')
    .replace(/\[v\](.*?)\[\/v\]/g, '<span class="tajweed-madd-compulsory cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#0D47A1]/30" data-rule="Madd" style="color: #0D47A1 !important;">$1</span>')
    .replace(/\[i\](.*?)\[\/i\]/g, '<span class="tajweed-ikhfa cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#2E7D32]/30" data-rule="Ikhfa" style="color: #2E7D32 !important;">$1</span>')
    .replace(/\[n\](.*?)\[\/n\]/g, '<span class="tajweed-idgham cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#757575]/30" data-rule="Idgham" style="color: #757575 !important;">$1</span>')
    .replace(/\[d\](.*?)\[\/d\]/g, '<span class="tajweed-idgham cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#757575]/30" data-rule="Idgham" style="color: #757575 !important;">$1</span>')
    .replace(/\[s\](.*?)\[\/s\]/g, '<span class="tajweed-ikhfa-shafawi cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#2E7D32]/30" data-rule="Ikhfa Shafawi" style="color: #2E7D32 !important;">$1</span>')
    .replace(/\[y\](.*?)\[\/y\]/g, '<span class="tajweed-idgham-shafawi cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#757575]/30" data-rule="Idgham Shafawi" style="color: #757575 !important;">$1</span>')
    .replace(/\[k\](.*?)\[\/k\]/g, '<span class="tajweed-iqlab cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#2E7D32]/30" data-rule="Iqlab" style="color: #2E7D32 !important;">$1</span>')
    .replace(/\[l\](.*?)\[\/l\]/g, '<span class="tajweed-leen cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#B8860B]/30" data-rule="Madde Leen" style="color: #B8860B !important;">$1</span>')
    .replace(/\[o\](.*?)\[\/o\]/g, '<span class="tajweed-madd-allowable cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#EF6C00]/30" data-rule="Madd" style="color: #EF6C00 !important;">$1</span>')
    .replace(/\[t\](.*?)\[\/t\]/g, '<span class="tajweed-tafkhim cursor-help font-bold underline decoration-2 underline-offset-4 decoration-[#283593]/30" data-rule="Tafkhim" style="color: #283593 !important;">$1</span>');
}

export interface TajweedRule {
  label: string;
  description: string;
  explanation: string;
  example: string;
  color: string;
  textColor: string;
  class: string;
  audioUrl?: string;
}

export const TAJWEED_RULES: TajweedRule[] = [
  { 
    label: 'Ghunna', 
    description: 'ইখফা ও গুন্নাহ',
    explanation: 'নাক দিয়ে আওয়াজ বের করে পড়া। মীম (م) বা নুন (ন) এর উপর তাশদীদ থাকলে অবশ্যই ২ হারাকাত পরিমাণ গুন্নাহ করতে হবে।',
    example: '[g]إِنَّا[/g] أَعْطَيْنَاكَ الْكَوْثَرَ',
    color: 'bg-[#2E7D32]', 
    textColor: 'text-[#2E7D32]',
    class: 'tajweed-ghunna',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/108001.mp3'
  },
  { 
    label: 'Qalqala', 
    description: 'কলকলা',
    explanation: '৫টি হরফে (ক্বফ, ত্বো, বা, জীম, দাল) সাকিন হলে প্রতিধ্বনি করা। এগুলো পড়ার সময় ধাক্কা লেগে বা প্রতিধ্বনিত হবে।',
    example: 'قُلْ هُوَ اللّٰهُ [q]اَحَدٌ[/q]',
    color: 'bg-[#C62828]', 
    textColor: 'text-[#C62828]',
    class: 'tajweed-qalqala',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112001.mp3'
  },
  { 
    label: 'Madd', 
    description: 'প্রয়োজনীয় মাদ ৪ বা ৫ সেকেন্ড',
    explanation: 'হরফকে দীর্ঘ বা টেনে পড়া। মদ্দের হরফ থাকলে ৪ থেকে ৫ হারাকাত পর্যন্ত টেনে পড়তে হয়।',
    example: '[m]وَالصَّيْفِ[/m]',
    color: 'bg-[#1565C0]', 
    textColor: 'text-[#1565C0]',
    class: 'tajweed-madd',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/106002.mp3'
  },
  { 
    label: 'Compulsory Madd', 
    description: 'প্রয়োজনীয় মাদ ৬ সেকেন্ড',
    explanation: 'হরফকে দীর্ঘ করে ৬ হারাকাত পর্যন্ত টেনে পড়া। এটি সাধারণত বড় মদ্দের ক্ষেত্রে হয়।',
    example: 'وَلَا [v]الضَّآلِّينَ[/v]',
    color: 'bg-[#0D47A1]', 
    textColor: 'text-[#0D47A1]',
    class: 'tajweed-madd-compulsory',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001007.mp3'
  },
  { 
    label: 'Allowable Madd', 
    description: 'অনুমোদিত মাদ ২ বা ৪ বা ৬ সেকেন্ড',
    explanation: 'ওয়াকফের সময় বা নির্দিষ্ট স্থানে ২, ৪ অথবা ৬ হারাকাত পর্যন্ত টেনে পড়ার অনুমতি থাকে।',
    example: 'نَصْرُ اللَّهِ [o]وَالْفَتْحُ[/o]',
    color: 'bg-[#EF6C00]', 
    textColor: 'text-[#EF6C00]',
    class: 'tajweed-madd-allowable',
  },
  { 
    label: 'Idgham', 
    description: 'ইদগাম',
    explanation: 'নুন সাকিন বা তানবীনের পরে ইয়া, রা, মীম, লাম, ওয়াও, নুন (যুরমালুন) আসলে মিলিয়ে পড়তে হয়।',
    example: 'مِنْ [n]مَّسَدٍ[/n]',
    color: 'bg-[#757575]', 
    textColor: 'text-[#757575]',
    class: 'tajweed-idgham',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/111005.mp3'
  },
  { 
    label: 'Leen', 
    description: 'মাদ ২ সেকেন্ড',
    explanation: 'লীনের হরফের বামের হরফে ওয়াকফ হলে ২ হারাকাত পরিমাণ টেনে পড়তে হয়।',
    example: 'لِإِيلَافِ [l]قُرَيْشٍ[/l]',
    color: 'bg-[#B8860B]', 
    textColor: 'text-[#B8860B]',
    class: 'tajweed-leen',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/106001.mp3'
  },
  { 
    label: 'Tafkhim', 
    description: 'তাফখিম',
    explanation: 'নির্দিষ্ট কিছু হরফকে মোটা করে বা গম্ভীরভাবে উচ্চারণ করা হয়।',
    example: 'صِرَاطَ الَّذِينَ [t]أَنْعَمْتَ[/t]',
    color: 'bg-[#283593]', 
    textColor: 'text-[#283593]',
    class: 'tajweed-tafkhim',
  },
];
