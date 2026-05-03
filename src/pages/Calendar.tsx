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

  const dayEvents = (day: HijriDate) => {
    return ISLAMIC_EVENTS.filter(e => e.day === day.day && e.month === day.month);
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

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Calendar Grid */}
        <section className="lg:col-span-12 space-y-6">
          <div className="flex items-center justify-between px-4">
             <div className="flex items-center gap-4">
               <button onClick={prevMonth} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                  <ChevronLeft size={20} />
               </button>
               <h3 className="text-xl font-bold text-slate-900 min-w-[150px] text-center">{currentGregorianMonth}</h3>
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
                        {day.gregorian.getDate()}
                     </span>
                     <span className={cn("text-[8px] md:text-[10px] font-bold opacity-50", isToday ? "text-primary-100" : "text-slate-400")}>
                        {day.day}
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

        {/* Detailed Event View or Search Results */}
        <section className="lg:col-span-12">
           <div className="flex items-center justify-between mb-6 px-4">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {search ? "Search Results" : "Upcoming Events"}
              </h3>
              {!search && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Cycle</span>}
           </div>

           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(search ? filteredEvents : ISLAMIC_EVENTS).map((event, idx) => {
                const isCurrentMonth = event.month === hijri.month;
                return (
                  <div 
                    key={idx}
                    className={cn(
                      "p-8 rounded-[32px] border transition-all hover:border-primary-200",
                      isCurrentMonth ? "bg-primary-50 border-primary-200" : "bg-white border-slate-200"
                    )}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center",
                        isCurrentMonth ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"
                      )}>
                        <Star size={24} fill={isCurrentMonth ? "currentColor" : "none"} />
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">{event.day} {HIJRI_MONTHS[event.month -1]}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hijri Date</p>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">{event.name}</h4>
                    <p className="text-sm text-slate-500 mb-4">{event.description}</p>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approx. Gregorian</span>
                       <span className="text-xs font-bold text-slate-900">
                          {/* We don't have exact gregorian for every event easily, but showing today's comparison works for recent events */}
                          Calculated annually
                       </span>
                    </div>
                  </div>
                );
              })}
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
                        <p className="text-slate-400 font-medium">No major Islamic events on this day.</p>
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
