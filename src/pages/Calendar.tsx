import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Info, ChevronLeft, Search, Star, Moon, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { getHijriDate, ISLAMIC_EVENTS, HIJRI_MONTHS, getCalendarDays, HijriDate } from '../services/calendarService';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState<HijriDate | null>(null);
  const [hijriMode, setHijriMode] = useState(false);

  const hijri = useMemo(() => getHijriDate(new Date()), []);
  
  const calendarDays = useMemo(() => {
    return getCalendarDays(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const filteredEvents = useMemo(() => {
    return ISLAMIC_EVENTS.filter(e => 
      e.name.toLowerCase().includes(search.toLowerCase()) || 
      HIJRI_MONTHS[e.month - 1].toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleEventClick = (event: any) => {
    const months: Record<string, number> = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };

    let targetDate: Date;
    if (typeof event.month === 'string' && months[event.month] !== undefined) {
      // Use 2026 as the base year for these events
      targetDate = new Date(2026, months[event.month], parseInt(event.day));
    } else {
      return;
    }

    setCurrentDate(targetDate);
    
    // Get hijri info for the target date
    const hInfo = getHijriDate(targetDate);
    
    // Try to match event by name to handle Hijri date shifts
    const matchedEvent = ISLAMIC_EVENTS.find(e => 
      event.name && (e.name.toLowerCase().includes(event.name.toLowerCase()) || event.name.toLowerCase().includes(e.name.toLowerCase()))
    );

    setSelectedDay({
      ...hInfo,
      gregorian: targetDate,
      // @ts-ignore - adding a hint for the modal
      forceEvent: matchedEvent
    });

    setHijriMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dayEvents = (day: any) => {
    const events = ISLAMIC_EVENTS.filter(e => e.day === day.day && e.month === day.month);
    if (events.length === 0 && day.forceEvent) {
      return [day.forceEvent];
    }
    return events;
  };

  const currentGregorianMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md py-4 -mx-4 lg:-mx-10 px-8 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Islamic Calendar</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{hijri.year} Hijri Year</p>
          </div>
        </div>
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
           <button 
             onClick={() => setHijriMode(false)}
             className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", !hijriMode ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400")}
           >
             Gregorian
           </button>
           <button 
             onClick={() => setHijriMode(true)}
             className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", hijriMode ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400")}
           >
             Hijri
           </button>
        </div>
      </header>

      {/* Current Selection / Hero */}
      <section className="rounded-[40px] bg-primary-900 p-8 md:p-12 text-white shadow-2xl shadow-primary-900/40 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-2">
             <div className="flex items-center gap-2 text-primary-400 mb-2">
                <Moon size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Today</span>
             </div>
             <h2 className="text-5xl md:text-6xl font-black">{hijri.day} {hijri.monthName}</h2>
             <p className="text-2xl opacity-70 font-medium">{hijri.year} AH • {new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long' }).format(new Date())}</p>
           </div>
           
           <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                placeholder="Search events (e.g. Ramadan)" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all backdrop-blur-md"
              />
           </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Calendar Grid */}
        <section className="lg:col-span-12 space-y-6">
          <div className="flex items-center justify-between px-4">
             <div className="flex items-center gap-4">
               <button onClick={prevMonth} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                  <ChevronLeft size={20} />
               </button>
               <h3 className="text-xl font-bold text-slate-900 min-w-[200px] text-center">
                 {hijriMode ? `${calendarDays[15].monthName} ${calendarDays[15].year} AH` : currentGregorianMonth}
               </h3>
               <button onClick={nextMonth} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                  <ChevronRight size={20} />
               </button>
             </div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click a day to see details</span>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/40">
            <div className="grid grid-cols-7 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d}</div>
              ))}
            </div>
            
          <div className="grid grid-cols-7 gap-2 md:gap-4">
             {/* Padding for first day */}
             {[...Array(calendarDays[0].gregorian.getDay())].map((_, i) => (
               <div key={`pad-${i}`} className="aspect-square" />
             ))}
             
             {calendarDays.map((day, idx) => {
               const events = dayEvents(day);
               const hasEvent = events.length > 0;
               const isToday = day.gregorian.toDateString() === new Date().toDateString();
               
               return (
                 <button 
                   key={idx}
                   onClick={() => setSelectedDay(day)}
                   className={cn(
                     "aspect-square rounded-2xl md:rounded-3xl flex flex-col items-center justify-center relative transition-all group",
                     isToday ? "bg-primary-900 text-white shadow-lg shadow-primary-900/20" : "bg-slate-50 hover:bg-primary-50",
                     hasEvent && !isToday && "ring-2 ring-primary-100"
                   )}
                 >
                   <span className={cn("text-xs md:text-sm font-black", isToday ? "text-white" : "text-slate-900 group-hover:text-primary-700")}>
                      {hijriMode ? day.day : day.gregorian.getDate()}
                   </span>
                   <span className={cn("text-[8px] md:text-[10px] font-bold opacity-50", isToday ? "text-primary-100" : "text-slate-400")}>
                      {hijriMode ? day.gregorian.getDate() : day.day}
                   </span>
                   
                   {hasEvent && (
                     <div className={cn(
                       "absolute bottom-2 h-1.5 w-1.5 rounded-full",
                       isToday ? "bg-primary-300" : "bg-primary-500"
                     )} />
                   )}
                 </button>
               );
             })}
          </div>
          </div>
        </section>

        {/* Islamic Events & Upcoming Adjustments */}
        <section className="lg:col-span-12 space-y-12 py-10">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Islamic Events</h2>
            <p className="text-slate-400 font-medium">Important dates in the Islamic Calendar</p>
          </div>
          
          {/* Upcoming Holiday Hero */}
            <button 
              onClick={() => handleEventClick({ month: 'May', day: '26', name: 'Day of Arafah' })}
              className="w-full bg-white rounded-[48px] border border-slate-100 p-12 text-center space-y-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all active:scale-[0.98] group"
            >
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all">Upcoming Islamic Holiday</p>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">Waqf Al Arafa – Hajj</h3>
            <p className="text-xl text-slate-500 font-medium">
               <span className="text-slate-900">Tuesday, 26 May 2026</span>
               <span className="mx-3 opacity-30">|</span>
               <span className="text-emerald-700">09 Dhu al-Hijjah 1447</span>
            </p>
          </button>

          <div className="grid gap-8 md:grid-cols-2">
            {(search ? filteredEvents : [
              { month: 'Feb', day: '15', name: 'Isra and Mi\'raj (Lailat al Miraj)', date: 'Sunday, 27 Rajab 1447' },
              { month: 'Mar', day: '4', name: 'Laylat al-Baraat', date: 'Wednesday, 15 Sha’ban 1447' },
              { month: 'Mar', day: '20', name: 'Ramadan Begins', date: 'Friday, 01 Ramadan 1447' },
              { month: 'Apr', day: '19', name: 'Eid al-Fitr', date: 'Sunday, 01 Shawwal 1447' },
              { month: 'May', day: '26', name: 'Day of Arafah (Waqf Al Arafa)', date: 'Tuesday, 09 Dhu al-Hijjah 1447' },
              { month: 'May', day: '27', name: 'Eid al-Adha', date: 'Wednesday, 10 Dhu al-Hijjah 1447' }
            ]).map((event, i) => (
              <button 
                key={i} 
                onClick={() => handleEventClick(event)}
                className="flex items-center text-left gap-6 p-6 bg-white rounded-3xl border border-slate-50 hover:border-emerald-100 transition-all group hover:shadow-xl hover:shadow-emerald-500/5 active:scale-95"
              >
                <div className="flex flex-col items-center w-20 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-sm group-hover:bg-emerald-50 transition-colors">
                  <div className="w-full bg-slate-900 py-1.5 text-center group-hover:bg-emerald-600 transition-colors">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{event.month}</span>
                  </div>
                  <div className="py-3">
                    <span className="text-3xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{event.day}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{'name' in event ? event.name : ''}</h4>
                  <p className="text-sm font-bold text-slate-400">{'date' in event ? event.date : `${event.day} ${HIJRI_MONTHS[event.month - 1]}`}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center pt-8">
            <button className="inline-flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all">
              Show more Special Islamic Days
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>

      {/* Selected Day Info Modal */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/20 backdrop-blur-sm sm:items-center sm:p-4">
             <motion.div 
               initial={{ y: "100%", opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: "100%", opacity: 0 }}
               className="w-full max-w-lg rounded-t-[48px] bg-white p-10 sm:rounded-[48px] shadow-2xl relative"
             >
                <button 
                  onClick={() => setSelectedDay(null)}
                  className="absolute right-8 top-8 p-3 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <X size={24} />
                </button>

                <div className="mb-10">
                   <div className="flex items-center gap-2 text-primary-600 mb-2">
                       <CalendarIcon size={16} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Date Details</span>
                   </div>
                   <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                     {selectedDay.day} {selectedDay.monthName}
                   </h3>
                   <p className="text-lg text-slate-400 font-medium tracking-tight">
                      {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(selectedDay.gregorian)}
                   </p>
                </div>

                <div className="space-y-4">
                   {dayEvents(selectedDay).length > 0 ? (
                     dayEvents(selectedDay).map((event, i) => (
                       <div key={i} className="p-8 rounded-[32px] bg-primary-50 border border-primary-200">
                          <h4 className="text-2xl font-black text-primary-900 mb-2">{event.name}</h4>
                          <p className="text-primary-800 leading-relaxed">{event.description}</p>
                       </div>
                     ))
                   ) : (
                     <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                        <Info className="mx-auto text-slate-200 mb-4" size={48} />
                        <p className="text-slate-400 font-medium">আজকের দিনে বড় কোনো ইসলামী দিবস বা উৎসব নেই। তবে প্রতিটি দিনই ইবাদত ও আল্লাহর নৈকট্য লাভের জন্য গুরুত্বপূর্ণ।</p>
                     </div>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
