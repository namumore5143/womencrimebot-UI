import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <div className="max-w-md w-full relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search analytics data..." 
                        className="bg-slate-900/50 border border-slate-800 text-slate-200 text-sm rounded-xl py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950"></span>
                </button>
                <div className="h-8 w-[1px] bg-slate-800 mx-2"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">Analyst Portal</p>
                        <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                            <User size={20} className="text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
