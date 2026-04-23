import React, { useState, useEffect } from 'react';
import { 
    BrainCircuit, 
    TrendingUp, 
    Target, 
    Zap,
    ArrowRight,
    Loader2
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
import { loadCrimeData, getDashboardStats } from '../utils/dataLoader';
import { predictFutureCrimes, getPredictionChartData } from '../utils/predictionModel';

const Prediction = () => {
    const [chartData, setChartData] = useState([]);
    const [futurePredictions, setFuturePredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const rawData = await loadCrimeData();
            const stats = getDashboardStats(rawData);
            
            if (stats && stats.trendData) {
                const predictions = predictFutureCrimes(stats.trendData);
                const chart = getPredictionChartData(stats.trendData, predictions);
                setChartData(chart);
                setFuturePredictions(predictions);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-ping" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-slate-400 font-medium animate-pulse text-lg">Training ML Model...</p>
                    <p className="text-slate-500 text-sm">Analyzing trends and generating predictions</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div className="flex-1">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-main)] tracking-tight flex items-center gap-3">
                        <BrainCircuit className="text-primary" />
                        ML Forecasting
                    </h2>
                    <p className="text-[var(--text-muted)] mt-1">AI-powered predictive analytics for crime trend forecasting (2022-2031).</p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    Linear Regression Model Active
                </div>
            </div>

            {/* Prediction Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {futurePredictions.map((pred, i) => (
                    <div key={pred.year} className="glass-card p-4 hover:border-primary/30 group transition-all hover:scale-105 flex flex-col justify-between min-h-[140px]">
                        <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)]">
                            <Target size={16} className="group-hover:text-primary transition-colors flex-shrink-0" />
                            <span className="text-[10px] font-bold uppercase tracking-widest truncate">Year {pred.year}</span>
                        </div>
                        <h4 className="text-2xl font-bold text-[var(--text-main)] truncate">{pred.predicted.toLocaleString()}</h4>
                        <p className="text-primary/80 text-[10px] font-bold uppercase mt-1">Predicted Cases</p>
                    </div>
                ))}
            </div>


            {/* Forecast Chart */}
            <div className="glass-card">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-[var(--text-main)]">Future Crime Projection</h3>
                        <p className="text-[var(--text-muted)] text-sm">Linear regression projection compared to historical actuals</p>
                    </div>
                    <div className="flex items-center gap-6 text-xs font-medium">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-primary rounded-full" />
                            <span className="text-[var(--text-muted)]">Actual Data</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-secondary/40 border border-secondary border-dashed rounded-full" />
                            <span className="text-[var(--text-muted)]">AI Prediction</span>
                        </div>
                    </div>
                </div>

                <div className="h-[450px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff4d6d" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#ff4d6d" stopOpacity={0.1}/>
                                </linearGradient>
                                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff85a1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ff85a1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[var(--border-color)] opacity-20" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="currentColor" 
                                className="text-[var(--text-muted)]"
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis 
                                stroke="currentColor" 
                                className="text-[var(--text-muted)]"
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'var(--surface-900)', borderColor: 'var(--border-color)', borderRadius: '16px', color: 'var(--text-main)' }}
                                formatter={(value, name) => [
                                    value?.toLocaleString(), 
                                    name === 'actual' ? 'Historical Data' : 'AI Prediction'
                                ]}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="actual" 
                                stroke="#ff4d6d" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorActual)" 
                                strokeLinecap="round"
                                connectNulls
                            />
                            <Area 
                                type="monotone" 
                                dataKey="predicted" 
                                stroke="#ff85a1" 
                                strokeDasharray="8 4"
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorPredicted)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Model Confidence & Accuracy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                <div className="glass-card hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3 mb-4 text-[var(--text-muted)]">
                        <Zap size={20} className="text-amber-400" />
                        <h4 className="text-[var(--text-main)] font-bold">Prediction Logic</h4>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                        The model uses <span className="text-primary font-semibold">Linear Regression</span> trained on 21 years of historical data (2001-2021). It analyzes year-over-year trends and generates statistically-grounded projections for 2022-2031.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                        Model accuracy based on historical trend analysis
                    </div>
                </div>
                <div className="glass-card hover:border-secondary/20 transition-all">
                    <div className="flex items-center gap-3 mb-4 text-[var(--text-muted)]">
                        <TrendingUp size={20} className="text-emerald-400" />
                        <h4 className="text-[var(--text-main)] font-bold">Trend Analysis</h4>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                        Projections indicate <span className="text-secondary font-semibold">continuing trends</span> in reported cases. Rising numbers often reflect increased awareness and improved reporting mechanisms rather than solely increased criminal activity.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Based on 21-year historical pattern analysis
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Prediction;
