import React, { useState } from 'react';
import { 
    Filter, 
    ChevronDown, 
    MapPin, 
    AlertTriangle,
    Activity,
    Info
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

const stateMetrics = {
    "Maharashtra": {
        total: 42000,
        trend: [
            { year: '2020', count: 35000 },
            { year: '2021', count: 38000 },
            { year: '2022', count: 40000 },
            { year: '2023', count: 42000 },
        ],
        categories: [
            { name: 'Domestic Violence', value: 35 },
            { name: 'Kidnapping', value: 20 },
            { name: 'Harassment', value: 25 },
            { name: 'Other', value: 20 },
        ],
        literacy: "82.3%",
        genderRatio: "929",
    },
    "Uttar Pradesh": {
        total: 56000,
        trend: [
            { year: '2020', count: 48000 },
            { year: '2021', count: 52000 },
            { year: '2022', count: 54000 },
            { year: '2023', count: 56000 },
        ],
        categories: [
            { name: 'Domestic Violence', value: 45 },
            { name: 'Kidnapping', value: 15 },
            { name: 'Harassment', value: 30 },
            { name: 'Other', value: 10 },
        ],
        literacy: "67.7%",
        genderRatio: "912",
    }
};

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

const StateAnalysis = () => {
    const [selectedState, setSelectedState] = useState("Maharashtra");
    const data = stateMetrics[selectedState] || stateMetrics["Maharashtra"];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Regional Deep-Dive</h2>
                    <p className="text-slate-400 mt-1">Detailed analysis and metrics for specific states.</p>
                </div>
                
                <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                        <MapPin size={18} />
                    </div>
                    <select 
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl py-3 pl-10 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600/50 w-full md:w-64 transition-all cursor-pointer"
                    >
                        {Object.keys(stateMetrics).map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
                        <ChevronDown size={18} />
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card bg-indigo-600/10 border-indigo-500/20">
                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">State Total Cases</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">{data.total.toLocaleString()}</h3>
                        <span className="text-indigo-400 text-sm font-medium">Reports</span>
                    </div>
                </div>
                <div className="glass-card bg-pink-600/10 border-pink-500/20">
                    <p className="text-pink-300 text-xs font-bold uppercase tracking-wider mb-1">Literacy Rate</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">{data.literacy}</h3>
                        <span className="text-pink-400 text-sm font-medium">Avg.</span>
                    </div>
                </div>
                <div className="glass-card bg-emerald-600/10 border-emerald-500/20">
                    <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">Gender Ratio</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">{data.genderRatio}</h3>
                        <span className="text-emerald-400 text-sm font-medium">F/1000M</span>
                    </div>
                </div>
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Donut Chart */}
                <div className="lg:col-span-2 glass-card">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity size={18} className="text-indigo-400" />
                        <h3 className="text-lg font-bold text-white">Crime Distribution</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.categories}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Yearly Trend Bar */}
                <div className="lg:col-span-3 glass-card">
                    <div className="flex items-center gap-2 mb-6">
                        <AlertTriangle size={18} className="text-pink-400" />
                        <h3 className="text-lg font-bold text-white">4-Year Growth Trend</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.trend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                                />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="glass-card bg-slate-900/30 border-slate-800 flex gap-4 items-start">
                <div className="bg-indigo-600/20 p-2 rounded-lg text-indigo-400">
                    <Info size={20} />
                </div>
                <div>
                    <h4 className="text-white font-bold mb-1">Analyst Note</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        The data for {selectedState} indicates a {selectedState === "Maharashtra" ? "steady increase" : "slight plateau"} in reported crimes. This may be attributed to improved reporting mechanisms and awareness campaigns in the region. Cross-referencing with literacy rates shows a moderate correlation between education and reporting frequency.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StateAnalysis;
