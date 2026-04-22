import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KpiCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change > 0;
  
  return (
    <div className="glass-card flex flex-col gap-4 hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl bg-surface-900 border border-white/10 ${color} transition-all hover:scale-110`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default KpiCard;
