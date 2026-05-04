import React from 'react';

export default function MakkahLive() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4 pt-8">
       <div className="space-y-2">
         <h1 className="text-4xl font-black text-slate-900 tracking-tight">Makkah Live</h1>
         <p className="text-slate-500 font-medium">Watch the Live stream from Masjid al-Haram, 24/7.</p>
      </div>

      <div className="aspect-video w-full rounded-[48px] bg-slate-900 overflow-hidden shadow-2xl border-8 border-white">
        <iframe 
          width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/m7H00E46BCY?autoplay=1" 
          title="Makkah Live" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-10 rounded-[48px] bg-white border border-slate-200 space-y-4 shadow-sm">
            <h3 className="text-2xl font-bold">Virtue of Makkah</h3>
            <p className="text-slate-500 leading-relaxed font-medium">Massjid al-Haram is the holiest site in Islam. One prayer in this Masjid is equal to 100,000 prayers elsewhere.</p>
         </div>
         <div className="p-10 rounded-[48px] bg-white border border-slate-200 space-y-4 shadow-sm">
            <h3 className="text-2xl font-bold">Tawaf Counter</h3>
            <p className="text-slate-500 leading-relaxed font-medium">Performing Tawaf is a form of worship that signifies the unity of believers in the worship of the One God.</p>
         </div>
      </div>
    </div>
  );
}
