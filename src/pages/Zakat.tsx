import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Info, Wallet, TrendingUp } from 'lucide-react';

export default function Zakat() {
  const [cash, setCash] = useState<number>(0);
  const [gold, setGold] = useState<number>(0);
  const [silver, setSilver] = useState<number>(0);
  const [debts, setDebts] = useState<number>(0);

  const total = (cash + gold + silver) - debts;
  const zakat = total > 0 ? (total * 0.025).toFixed(2) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-24 px-4 pt-8">
      <div className="text-center space-y-4">
         <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-200 mb-4">
            <Calculator size={32} />
         </div>
         <h1 className="text-4xl font-black text-slate-900">Zakat Calculator</h1>
         <p className="text-slate-500 font-medium">Calculate your obligatory 2.5% zakat with ease.</p>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-200 p-10 space-y-8 shadow-sm">
         <div className="grid gap-6">
            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2">Cash & Savings</label>
               <input 
                 type="number" 
                 value={cash} 
                 onChange={(e) => setCash(Number(e.target.value))}
                 className="w-full p-5 rounded-[24px] bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                 placeholder="0.00"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2">Gold & Silver Value</label>
               <input 
                 type="number" 
                 value={gold + silver} 
                 onChange={(e) => setGold(Number(e.target.value))}
                 className="w-full p-5 rounded-[24px] bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                 placeholder="0.00"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2">Debts Owed (Subtract)</label>
               <input 
                 type="number" 
                 value={debts} 
                 onChange={(e) => setDebts(Number(e.target.value))}
                 className="w-full p-5 rounded-[24px] bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                 placeholder="0.00"
               />
            </div>
         </div>

         <div className="p-8 rounded-[32px] bg-emerald-50 border border-emerald-100 flex flex-col items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Total Zakat Due</span>
            <span className="text-5xl font-black text-emerald-900">${zakat}</span>
            <p className="text-xs text-emerald-600 font-medium text-center">Based on 2.5% of your total net assets.</p>
         </div>
      </div>
    </div>
  );
}
