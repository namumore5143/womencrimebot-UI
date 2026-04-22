import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ChartBar, BrainCircuit, MessageSquare, ShieldAlert } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/analysis', icon: ChartBar, label: 'State Analysis' },
        { path: '/chatbot', icon: MessageSquare, label: 'Safety Assistant' },
    ];

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/20">
                    <ShieldAlert size={24} />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    WomenCrimeBot
                </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-800">
                <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Emergency Help</p>
                    <p className="text-white font-bold text-lg">112</p>
                    <p className="text-xs text-slate-400">National Helpline</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
