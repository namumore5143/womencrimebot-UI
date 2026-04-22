import React from 'react';
import { 
    Users, 
    ShieldAlert, 
    FileText, 
    Clock,
    LineChart as LineChartIcon,
    BarChart as BarChartIcon
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
    Cell
} from 'recharts';
import KpiCard from '../components/KpiCard';

const trendData = [
    { name: 'Jan', crimes: 4000 },
    { name: 'Feb', crimes: 3000 },
    { name: 'Mar', crimes: 2000 },
    { name: 'Apr', crimes: 2780 },
    { name: 'May', crimes: 1890 },
    { name: 'Jun', crimes: 2390 },
    { name: 'Jul', crimes: 3490 },
];

const stateData = [
    { name: 'U.P.', count: 56000, color: '#8b5cf6' },
    { name: 'Rajasthan', count: 42000, color: '#ec4899' },
    { name: 'Maharashtra', count: 38000, color: '#3b82f6' },
    { name: 'M.P.', count: 35000, color: '#10b981' },
    { name: 'West Bengal', count: 32000, color: '#f59e0b' },
];

const Dashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h2>
                <p className="text-slate-400 mt-1">Holistic view of crime statistics against women across India.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard 
                    title="Total Cases Reported" 
                    value="4,28,278" 
                    change={4.2} 
                    icon={FileText} 
                    color="text-indigo-400"
                />
                <KpiCard 
                    title="Active Investigations" 
                    value="1,12,450" 
                    change={-2.1} 
                    icon={ShieldAlert} 
                    color="text-pink-400"
                />
                <KpiCard 
                    title="Conviction Rate" 
                    value="26.5%" 
                    change={1.5} 
                    icon={Users} 
                    color="text-emerald-400"
                />
                <KpiCard 
                    title="Avg. Response Time" 
                    value="18 min" 
                    change={-12} 
                    icon={Clock} 
                    color="text-amber-400"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Line Chart */}
                <div className="glass-card flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white">Crime Trends</h3>
                            <p className="text-slate-400 text-sm">Monthly reported cases (2025)</p>
                        </div>
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-indigo-400">
                            <LineChartIcon size={20} />
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
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
                                    tickFormatter={(value) => `${value / 1000}k`}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#0f172a', 
                                        borderColor: '#1e293b',
                                        borderRadius: '12px',
                                        color: '#f1f5f9'
                                    }}
                                    itemStyle={{ color: '#8b5cf6' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="crimes" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={3} 
                                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4, stroke: '#0f172a' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="glass-card flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white">Top Affected States</h3>
                            <p className="text-slate-400 text-sm">Based on total reported cases</p>
                        </div>
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-pink-400">
                            <BarChartIcon size={20} />
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stateData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    stroke="#64748b" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    width={100}
                                />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ 
                                        backgroundColor: '#0f172a', 
                                        borderColor: '#1e293b',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {stateData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
