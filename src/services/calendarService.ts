
export interface IslamicEvent {
  name: string;
  day: number;
  month: number; // 1-indexed (Hijri)
  description: string;
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  { name: 'Isra and Mi\'raj', day: 27, month: 7, description: 'The Prophet\'s Night Journey and Ascension' },
  { name: 'Ramadan Begins', day: 1, month: 9, description: 'Month of Fasting' },
  { name: 'Laylat al-Qadr', day: 27, month: 9, description: 'The Night of Power' },
  { name: 'Eid al-Fitr', day: 1, month: 10, description: 'Festival of Breaking the Fast' },
  { name: 'Hajj Season Begins', day: 8, month: 12, description: 'Annual Pilgrimage to Mecca' },
  { name: 'Day of Arafah', day: 9, month: 12, description: 'The peak of Hajj' },
  { name: 'Eid al-Adha', day: 10, month: 12, description: 'Festival of Sacrifice' },
  { name: 'Islamic New Year', day: 1, month: 1, description: '1st of Muharram' },
  { name: 'Ashura', day: 10, month: 1, description: 'Day of Remembrance' },
  { name: 'Mawlid al-Nabi', day: 12, month: 3, description: 'Birth of the Prophet' }
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
