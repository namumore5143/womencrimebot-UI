import React from 'react';
import { 
    BrainCircuit, 
    TrendingUp, 
    Target, 
    Zap,
    ArrowRight
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

const predictionData = [
    { name: '2020', actual: 300, predicted: 300 },
    { name: '2021', actual: 320, predicted: 315 },
    { name: '2022', actual: 350, predicted: 345 },
    { name: '2023', actual: 380, predicted: 375 },
    { name: '2024', predicted: 410 },
    { name: '2025', predicted: 435 },
    { name: '2026', predicted: 460 },
];

const Prediction = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <BrainCircuit className="text-indigo-500" />
                        ML Forecasting
                    </h2>
                    <p className="text-slate-400 mt-1">Predictive analytics engine for crime trend anticipation.</p>
                </div>
                <div className="bg-indigo-600/20 px-4 py-2 rounded-full border border-indigo-500/30 text-indigo-400 text-sm font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    Model: LSTM-v4.2 Active
                </div>
            </div>

            {/* Model Confidence & Accuracy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <Target size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Model Accuracy</span>
                    </div>
                    <h4 className="text-3xl font-bold text-white">94.8%</h4>
                    <div className="mt-3 w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[94.8%] shadow-[0_0_8px_#10b981]" />
                    </div>
                </div>
                <div className="glass-card">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <Zap size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Computation Load</span>
                    </div>
                    <h4 className="text-3xl font-bold text-white">Low</h4>
                    <p className="text-emerald-400 text-sm font-medium mt-1">Optimized Execution</p>
                </div>
                <div className="glass-card">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <TrendingUp size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Risk Level</span>
                    </div>
                    <h4 className="text-3xl font-bold text-rose-500">Elevated</h4>
                    <p className="text-slate-500 text-sm mt-1">+12% Projected Increase</p>
                </div>
            </div>

            {/* Forecast Chart */}
            <div className="glass-card">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white">5-Year Forecast Projection</h3>
                        <p className="text-slate-400 text-sm">Deep learning model projection compared to historical actuals</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-indigo-600 rounded-full" />
                            <span className="text-slate-300">Actual Data</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-indigo-400/40 border border-indigo-400 border-dashed rounded-full" />
                            <span className="text-slate-300">AI Prediction</span>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={predictionData}>
                            <defs>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#64748b" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis 
                                stroke="#64748b" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                tickFormatter={(value) => `${value}k`}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="actual" 
                                stroke="#8b5cf6" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorActual)" 
                                strokeLinecap="round"
                            />
                            <Area 
                                type="monotone" 
                                dataKey="predicted" 
                                stroke="#c084fc" 
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorPredicted)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                <div className="glass-card hover:border-indigo-500/40 transition-colors group cursor-pointer">
                    <h4 className="text-white font-bold text-lg flex items-center justify-between">
                        Generate Risk Map
                        <ArrowRight size={18} className="text-slate-500 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" />
                    </h4>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        Export a heat-map of high-risk zones based on the current AI projection to help local administrative planning.
                    </p>
                </div>
                <div className="glass-card hover:border-pink-500/40 transition-colors group cursor-pointer">
                    <h4 className="text-white font-bold text-lg flex items-center justify-between">
                        Data Integrity Report
                        <ArrowRight size={18} className="text-slate-500 group-hover:translate-x-1 group-hover:text-pink-400 transition-all" />
                    </h4>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        Review the training datasets and validation benchmarks used to calibrate the current forecasting model.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Prediction;
