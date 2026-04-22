import React, { useEffect, useState } from 'react';
import { 
    Users, 
    ShieldAlert, 
    FileText, 
    Clock,
    LineChart as LineChartIcon,
    BarChart as BarChartIcon,
    PieChart as PieChartIcon,
    Loader2
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
    Legend
} from 'recharts';
import KpiCard from '../components/KpiCard';
import { loadCrimeData, getDashboardStats } from '../utils/dataLoader';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const rawData = await loadCrimeData();
            const stats = getDashboardStats(rawData);
            setData(stats);
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
                    <p className="text-slate-400 font-medium animate-pulse text-lg">Loading Real Crime Data...</p>
                    <p className="text-slate-500 text-sm">Processing 2001-2021 dataset</p>
                </div>
            </div>
        );
    }

    if (!data) return <div className="text-white">Error loading data.</div>;

    const COLORS = ['#ff4d6d', '#ff758f', '#ff85a1', '#ffb3c1', '#ffccd5', '#8b5cf6', '#3b82f6'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h2>
                    <p className="text-slate-400 mt-1">Real-time analysis of crimes against women across India (2001-2021).</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-primary text-sm font-bold uppercase tracking-wider">Live Dataset</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard 
                    title="Total Cases (2001-2021)" 
                    value={data.totalCases.toLocaleString()} 
                    change={((data.trendData[data.trendData.length - 1]?.crimes || 0) - (data.trendData[0]?.crimes || 0)) / (data.trendData[0]?.crimes || 1) * 100} 
                    icon={FileText} 
                    color="text-primary"
                />
                <KpiCard 
                    title="Avg. Annual Cases" 
                    value={Math.round(data.totalCases / (data.trendData.length || 1)).toLocaleString()} 
                    change={data.trendData.length > 1 ? ((data.trendData[data.trendData.length - 1]?.crimes || 0) - (data.trendData[data.trendData.length - 2]?.crimes || 0)) / (data.trendData[data.trendData.length - 2]?.crimes || 1) * 100 : 0} 
                    icon={ShieldAlert} 
                    color="text-secondary"
                />
                <KpiCard 
                    title="States Tracked" 
                    value={data.topStates.length.toString()} 
                    change={0} 
                    icon={Users} 
                    color="text-emerald-400"
                />
                <KpiCard 
                    title="Dataset Range" 
                    value={`${data.trendData.length} Years`} 
                    change={0} 
                    icon={Clock} 
                    color="text-amber-400"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Line Chart */}
                <div className="glass-card flex flex-col group">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Crime Trends (Yearly)</h3>
                            <p className="text-slate-400 text-sm">Aggregated reported cases over time</p>
                        </div>
                        <div className="p-3 bg-surface-800 border border-white/5 rounded-2xl text-primary shadow-inner">
                            <LineChartIcon size={20} />
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis 
                                    dataKey="year" 
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
                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#121214', 
                                        borderColor: '#2a2a30',
                                        borderRadius: '16px',
                                        color: '#f1f5f9',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                    }}
                                    itemStyle={{ color: '#ff4d6d' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="crimes" 
                                    stroke="#ff4d6d" 
                                    strokeWidth={4} 
                                    dot={{ fill: '#ff4d6d', strokeWidth: 2, r: 4, stroke: '#0a0a0c' }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#ff85a1' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="glass-card flex flex-col group">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-secondary transition-colors">Top 10 Affected States</h3>
                            <p className="text-slate-400 text-sm">States with highest cumulative cases</p>
                        </div>
                        <div className="p-3 bg-surface-800 border border-white/5 rounded-2xl text-secondary shadow-inner">
                            <BarChartIcon size={20} />
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topStates} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    stroke="#64748b" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false}
                                    width={100}
                                />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                                    contentStyle={{ 
                                        backgroundColor: '#121214', 
                                        borderColor: '#2a2a30',
                                        borderRadius: '16px'
                                    }}
                                />
                                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                                    {data.topStates.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Crime Type Distribution */}
            <div className="glass-card group">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Crime Type Distribution</h3>
                        <p className="text-slate-400 text-sm">National breakdown by legal classification</p>
                    </div>
                    <div className="p-3 bg-surface-800 border border-white/5 rounded-2xl text-primary shadow-inner">
                        <PieChartIcon size={20} />
                    </div>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.crimeTypes}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.crimeTypes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#121214', 
                                    borderColor: '#2a2a30',
                                    borderRadius: '16px'
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
