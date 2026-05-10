
export interface IslamicEvent {
  name: string;
  day: number;
  month: number; // 1-indexed (Hijri)
  description: string;
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  { 
    name: 'Islamic New Year', 
    day: 1, 
    month: 1, 
    description: 'হিজরি নববর্ষ - মহররম মাসের প্রথম দিন। এটি ইসলামী বর্ষপঞ্জির সূচনা এবং মুসলিম উম্মাহর জন্য একটি নতুন শুরুর দিন।' 
  },
  { 
    name: 'Ashura', 
    day: 10, 
    month: 1, 
    description: 'পবিত্র আশুরা - ইসলামের ইতিহাসে মহিমান্বিত একটি দিন। এই দিনে মুসা (আ.) ও তাঁর কওম ফেরাউনের হাত থেকে মুক্তি পেয়েছিলেন। ১০ই মহররম কারবালার শোকাবহ স্মৃতিও মুসলিমরা স্মরণ করেন।' 
  },
  { 
    name: 'Mawlid al-Nabi', 
    day: 12, 
    month: 3, 
    description: 'ঈদে মিলাদুন্নবী - ১২ই রবিউল আউয়াল মহানবী হযরত মুহাম্মদ (সা.)-এর জগত সংসারে আগমনের পবিত্র ও আনন্দঘন দিন।' 
  },
  { 
    name: 'Isra and Mi\'raj (Lailat al Miraj)', 
    day: 27, 
    month: 7, 
    description: 'লাইলাতুল মেরাজ - নবী কারীম (সা.)-এর উর্ধ্বাকাশ গমনের মহিমান্বিত রজনী। এই রাতে মহান আল্লাহ তাঁর প্রিয় নবীকে পাঁচ ওয়াক্ত নামাজ উপহার দিয়েছিলেন।' 
  },
  { 
    name: 'Laylat al-Baraat', 
    day: 15, 
    month: 8, 
    description: 'শবে বরাত - লাইলাতুল বরাত হলো মুক্তির রাত। এই রাতে আল্লাহ তাআলা অসংখ্য মানুষকে ক্ষমা করেন এবং বান্দার রিজিক ও ভাগ্য নির্ধারণ করা হয়।' 
  },
  { 
    name: 'Ramadan Begins', 
    day: 1, 
    month: 9, 
    description: 'পবিত্র রমজানের শুরু - রহমত, মাগফিরাত ও নাজাতের মাস। এই মাসে কুরআন নাযিল হয়েছে এবং মুমিনদের জন্য সিয়াম পালন বাধ্যতামূলক করা হয়েছে।' 
  },
  { 
    name: 'Laylat al-Qadr', 
    day: 27, 
    month: 9, 
    description: 'লাইলাতুল কদর - হাজার মাসের চেয়ে উত্তম এক রজনী। এই রাতে পবিত্র কুরআন অবতীর্ণের সূচনা হয়েছে।' 
  },
  { 
    name: 'Eid al-Fitr', 
    day: 1, 
    month: 10, 
    description: 'পবিত্র ঈদুল ফিতর - রমজানের দীর্ঘ সিয়াম সাধনার পর খুশির বার্তা নিয়ে আসে। এই দিন মুমিন বান্দারা আল্লাহর পক্ষ থেকে মহিমান্বিত পুরস্কার এবং অফুরন্ত আনন্দের অনুভব করেন।' 
  },
  { 
    name: 'Hajj Season Begins', 
    day: 8, 
    month: 12, 
    description: 'হজ্জ হেক্সা বা এহরামের দিন - মুসলিম উম্মাহর বিশ্ব সম্মেলন বা হজ্জের মূল আনুষ্ঠানিকতা শুরুর সময়।' 
  },
  { 
    name: 'Day of Arafah (Waqf Al Arafa)', 
    day: 9, 
    month: 12, 
    description: 'আরাফাতের দিন (ওয়াকফ আল আরাফা) - এটি হজ্জের সবচেয়ে গুরুত্বপূর্ণ অংশ। এই দিনে দুআ কবুলের বিশেষ সুযোগ থাকে এবং আল্লাহ তাআলা অসংখ্য মানুষকে জাহান্নাম থেকে মুক্তি দেন।' 
  },
  { 
    name: 'Eid al-Adha', 
    day: 10, 
    month: 12, 
    description: 'পবিত্র ঈদুল আদহা - ইসলামের ত্যাগের মহিমান্বিত একটি দিন। কুরবানীর মাধ্যমে আল্লাহর সন্তুষ্টি অর্জনের বিশেষ সময় এবং বিশ্বব্যাপী মুসলিম ভ্রাতৃত্বের উৎসব।' 
  }
];

export const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
  'Jumada al-Ula', 'Jumada al-Akhira', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
];

export interface HijriDate {
  day: number;
  month: number;
  monthName: string;
  year: number;
  gregorian: Date;
}

export function getHijriDate(date: Date = new Date()): HijriDate {
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).formatToParts(date);

  const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');
  const monthName = parts.find(p => p.type === 'month')?.value || '';
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '1446');
  
  // Find month index (1-12)
  const monthIndex = HIJRI_MONTHS.findIndex(m => m.toLowerCase().includes(monthName.toLowerCase().substring(0, 4))) + 1;

  return { day, month: monthIndex || 1, monthName, year, gregorian: date };
}

export function getDaysInMonth(year: number, month: number) {
  const date = new Date(year, month + 1, 0);
  return date.getDate();
}

export function getCalendarDays(year: number, month: number) {
  const daysInMonth = getDaysInMonth(year, month);
  const calendarDays: HijriDate[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    calendarDays.push(getHijriDate(date));
  }

  return calendarDays;
}

export function getNextEvent(currentHijri: { day: number, month: number }) {
  const sortedEvents = [...ISLAMIC_EVENTS].sort((a, b) => (a.month * 100 + a.day) - (b.month * 100 + b.day));
  let next = sortedEvents.find(e => (e.month * 100 + e.day) > (currentHijri.month * 100 + currentHijri.day));
  if (!next) next = sortedEvents[0];
  return next;
}
