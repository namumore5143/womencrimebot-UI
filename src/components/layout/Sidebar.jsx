import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ChartBar, MessageSquare, ShieldAlert, X, BrainCircuit } from 'lucide-react';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/analysis', icon: ChartBar, label: 'State Analysis' },
    { path: '/prediction', icon: BrainCircuit, label: 'ML Prediction' },
    { path: '/chatbot', icon: MessageSquare, label: 'Safety Assistant' },
];

const SidebarContent = ({ onClose }) => (
    <>
        {/* Logo row */}
        <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="pink-gradient p-2.5 rounded-2xl text-white shadow-lg shadow-primary/20">
                    <ShieldAlert size={24} />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--text-main)] to-[var(--text-muted)] bg-clip-text text-transparent leading-tight tracking-tight">
                    WomenCrimeInfo AI
                </h1>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-surface-800 transition-all border border-[var(--border-color)] shadow-lg"
                >
                    <X size={20} />
                </button>
            )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                    }
                >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                </NavLink>
            ))}
        </nav>

        {/* Emergency badge */}
        <div className="p-6 border-t border-[var(--border-color)]">
            <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-6 shadow-inner text-center group hover:bg-primary/10 transition-all duration-500">
                <p className="text-[10px] text-primary/60 font-bold uppercase tracking-[0.2em] mb-2">Emergency Help</p>
                <p className="text-[var(--text-main)] font-black text-3xl tracking-tighter group-hover:scale-110 transition-transform">112</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-2">National Helpline Center</p>
            </div>
        </div>
    </>
);

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            {/* Desktop sidebar — always visible */}
            <aside className="hidden lg:flex w-72 bg-surface-950 border-r border-[var(--border-color)] flex-col fixed inset-y-0 left-0 z-50">
                <SidebarContent onClose={null} />
            </aside>

            {/* Mobile drawer — slides in */}
            <aside className={`
                lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-surface-950 border-r border-[var(--border-color)]
                flex flex-col transform transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isOpen ? 'shadow-2xl' : ''}
            `}>
                <SidebarContent onClose={onClose} />
            </aside>
        </>
    );
};

export default Sidebar;

