import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KpiCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change > 0;
  
  return (
    <div className="glass-card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${color}`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default KpiCard;
