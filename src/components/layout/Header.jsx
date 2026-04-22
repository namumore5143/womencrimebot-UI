import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
    return (
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between gap-4">
            {/* Left: hamburger + search */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Hamburger — mobile only */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                {/* Search */}
                <div className="max-w-sm w-full relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search analytics data..."
                        className="bg-slate-900/50 border border-slate-800 text-slate-200 text-sm rounded-xl py-2 pl-9 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all"
                    />
                </div>
            </div>

            {/* Right: bell + profile */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950" />
                </button>

                <div className="h-7 w-px bg-slate-800" />

                <div className="flex items-center gap-2">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white leading-tight">Analyst Portal</p>
                        <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-600 p-[2px] flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                            <User size={18} className="text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
