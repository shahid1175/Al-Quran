import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HandHeart, MessageSquare, Heart, Send, CheckCircle2 } from 'lucide-react';

const PRAYERS = [
  { id: 1, name: 'Anonymous', text: 'Please pray for my mother\'s health. She is undergoing surgery tomorrow.', likes: 12, time: '2h ago' },
  { id: 2, name: 'Ahmad S.', text: 'Dua for my exams and success in this world and Hereafter.', likes: 8, time: '5h ago' },
  { id: 3, name: 'Fatima Z.', text: 'Seeking peace and guidance during difficult times.', likes: 24, time: '1d ago' },
];

export default function PrayerRequests() {
  const [request, setRequest] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!request) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setRequest("");
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-24 px-4 pt-8">
      <div className="space-y-2">
         <h1 className="text-4xl font-black text-slate-900 tracking-tight">Prayer Requests</h1>
         <p className="text-slate-500 font-medium">A community wall to share and support each other through Dua.</p>
      </div>

      <div className="bg-primary-900 rounded-[48px] p-10 text-white space-y-6 shadow-2xl">
         <h3 className="text-2xl font-bold flex items-center gap-2">
           <MessageSquare size={24} className="text-primary-400" />
           Share your request
         </h3>
         <textarea 
            placeholder="Write your prayer request here... (visible to community)"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            className="w-full h-32 p-6 rounded-[32px] bg-white/10 border border-white/10 focus:ring-2 focus:ring-primary-500 text-white placeholder:text-white/40 resize-none"
         />
         <button 
           onClick={handleSend}
           disabled={sent}
           className="w-full py-5 rounded-[24px] bg-white text-primary-900 font-extrabold text-lg flex items-center justify-center gap-2 transition-all hover:bg-primary-50"
         >
           {sent ? (
             <>
               <CheckCircle2 size={24} className="text-emerald-500" />
               <span>Sent to community</span>
             </>
           ) : (
             <>
               <Send size={20} />
               <span>Post Request</span>
             </>
           )}
         </button>
      </div>

      <div className="space-y-6">
         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Community Wall</h4>
         <div className="grid gap-6">
            {PRAYERS.map((p) => (
              <motion.div 
                key={p.id}
                className="p-8 rounded-[40px] bg-white border border-slate-200 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                         <HandHeart size={16} />
                      </div>
                      <span className="font-bold text-slate-900">{p.name}</span>
                   </div>
                   <span className="text-[10px] font-bold text-slate-300 uppercase">{p.time}</span>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed italic">"{p.text}"</p>
                <div className="flex items-center gap-2">
                   <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-500 text-xs font-bold hover:bg-rose-100 transition-all">
                      <Heart size={14} fill="currentColor" />
                      <span>{p.likes} Ameen</span>
                   </button>
                </div>
              </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}
