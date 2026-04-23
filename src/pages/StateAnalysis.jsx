import React, { useState, useEffect } from 'react';
import { 
    Filter, 
    ChevronDown, 
    MapPin, 
    AlertTriangle,
    Activity,
    Info,
    Loader2
} from 'lucide-react';
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip, 
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { loadCrimeData, getStateAnalysisData } from '../utils/dataLoader';

const COLORS = ['#ff4d6d', '#ff85a1', '#8b5cf6', '#3b82f6', '#10b981'];

const StateAnalysis = () => {
    const [allData, setAllData] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [stateData, setStateData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await loadCrimeData();
            setAllData(data);
            
            const uniqueStates = [...new Set(data.map(item => item.State))].sort();
            setStates(uniqueStates);
            
            if (uniqueStates.length > 0) {
                const defaultState = uniqueStates.includes("Maharashtra") ? "Maharashtra" : uniqueStates[0];
                setSelectedState(defaultState);
                const processed = getStateAnalysisData(data, defaultState);
                setStateData(processed);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
        const processed = getStateAnalysisData(allData, state);
        setStateData(processed);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-ping" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-slate-400 font-medium animate-pulse text-lg">Analyzing State Data...</p>
                    <p className="text-slate-500 text-sm">Processing regional crime statistics</p>
                </div>
            </div>
        );
    }

    if (!stateData) return <div className="text-white p-8">No data found for this state.</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="flex-1">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-main)] tracking-tight">Regional Deep-Dive</h2>
                    <p className="text-[var(--text-muted)] mt-1">State-specific crime analysis with dynamic filtering and trends.</p>
                </div>
                
                <div className="relative group min-w-[320px]">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary">
                        <MapPin size={20} />
                    </div>
                    <select 
                        value={selectedState}
                        onChange={handleStateChange}
                        className="bg-surface-900 border border-[var(--border-color)] text-[var(--text-main)] text-sm rounded-2xl py-4 pl-12 pr-12 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 w-full transition-all cursor-pointer hover:border-primary/40 shadow-2xl hover:shadow-primary/10"
                    >
                        {states.map(state => (
                            <option key={state} value={state} className="bg-surface-900 text-[var(--text-main)]">{state}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[var(--text-muted)]">
                        <ChevronDown size={20} />
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-card bg-primary/5 border-primary/20 hover:bg-primary/10 transition-all hover:scale-105">
                    <p className="text-primary/70 text-xs font-bold uppercase tracking-widest mb-2">Cumulative Cases</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-bold text-[var(--text-main)]">{stateData.total.toLocaleString()}</h3>
                        <span className="text-primary text-sm font-medium">Reports</span>
                    </div>
                </div>
                <div className="glass-card bg-secondary/5 border-secondary/20 hover:bg-secondary/10 transition-all hover:scale-105">
                    <p className="text-secondary/70 text-xs font-bold uppercase tracking-widest mb-2">Latest Recording</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-bold text-[var(--text-main)]">{stateData.latestYear}</h3>
                        <span className="text-secondary text-sm font-medium">Year</span>
                    </div>
                </div>
                <div className="glass-card bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 md:col-span-2 lg:col-span-1 transition-all hover:scale-105">
                    <p className="text-emerald-400/70 text-xs font-bold uppercase tracking-widest mb-2">Data Quality</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-bold text-[var(--text-main)]">High</h3>
                        <span className="text-emerald-400 text-sm font-medium">Verified</span>
                    </div>
                </div>
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Donut Chart */}
                <div className="lg:col-span-2 glass-card flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-primary/20 rounded-xl text-primary">
                            <Activity size={18} />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-main)]">Crime Distribution</h3>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stateData.categories}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {stateData.categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--surface-900)', borderColor: 'var(--border-color)', borderRadius: '16px', color: 'var(--text-main)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Yearly Trend Bar */}
                <div className="lg:col-span-3 glass-card flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-secondary/20 rounded-xl text-secondary">
                            <AlertTriangle size={18} />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-main)]">Yearly Growth Trend</h3>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stateData.trend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[var(--border-color)] opacity-20" vertical={false} />
                                <XAxis dataKey="year" stroke="currentColor" className="text-[var(--text-muted)]" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="currentColor" className="text-[var(--text-muted)]" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                                    contentStyle={{ backgroundColor: 'var(--surface-900)', borderColor: 'var(--border-color)', borderRadius: '16px', color: 'var(--text-main)' }}
                                />
                                <Bar dataKey="count" fill="#ff4d6d" radius={[6, 6, 0, 0]} barSize={45} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="glass-card bg-surface-900/50 border-white/5 flex gap-5 items-start p-8">
                <div className="bg-primary/20 p-3 rounded-2xl text-primary shadow-lg">
                    <Info size={24} />
                </div>
                <div>
                    <h4 className="text-[var(--text-main)] text-xl font-bold mb-2">Regional Intelligence Note</h4>
                    <p className="text-[var(--text-muted)] leading-relaxed max-w-3xl">
                        The data for <span className="text-primary font-semibold">{selectedState}</span> shows patterns typical of regional reporting shifts. High numbers often correlate with better reporting infrastructure and legal aid availability rather than just absolute crime rates. Analysis of the distribution helps in allocating specialized resources for specific crime categories like Domestic Violence or Kidnapping.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StateAnalysis;
