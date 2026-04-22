import React, { useState } from 'react';
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
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-tight tracking-tight">
                    WomenCrimeInfo AI
                </h1>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-800 transition-all border border-white/5 shadow-lg"
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
        <div className="p-6 border-t border-white/5">
            <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-6 shadow-inner text-center group hover:bg-primary/10 transition-all duration-500">
                <p className="text-[10px] text-primary/60 font-bold uppercase tracking-[0.2em] mb-2">Emergency Help</p>
                <p className="text-white font-black text-3xl tracking-tighter group-hover:scale-110 transition-transform">112</p>
                <p className="text-[11px] text-slate-500 mt-2">National Helpline Center</p>
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
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-md animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            {/* Desktop sidebar — always visible */}
            <aside className="hidden lg:flex w-72 bg-surface-950 border-r border-white/5 flex-col fixed inset-y-0 left-0 z-50">
                <SidebarContent onClose={null} />
            </aside>

            {/* Mobile drawer — slides in */}
            <aside className={`
                lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-surface-950 border-r border-white/5
                flex flex-col transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                ${isOpen ? 'translate-x-0' : '-translate-x-full shadow-none'}
                ${isOpen ? 'shadow-[0_0_50px_rgba(0,0,0,0.5)]' : ''}
            `}>
                <SidebarContent onClose={onClose} />
            </aside>
        </>
    );
};

export default Sidebar;
