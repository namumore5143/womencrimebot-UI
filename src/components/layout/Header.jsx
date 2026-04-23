import React from 'react';
import { Bell, Search, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ onMenuClick }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="h-16 border-b border-[var(--border-color)] bg-surface-950/50 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between gap-4">
            {/* Left: search only */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Search */}
                <div className="max-w-sm w-full relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input
                        type="text"
                        placeholder="Search analytics data..."
                        className="bg-surface-900/50 border border-[var(--border-color)] text-[var(--text-main)] text-sm rounded-xl py-2 pl-9 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
            </div>

            {/* Right: theme toggle + bell + profile */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <button 
                    onClick={toggleTheme}
                    className="p-2 text-[var(--text-muted)] hover:text-primary transition-colors rounded-xl hover:bg-surface-800"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="p-2 text-[var(--text-muted)] hover:text-primary transition-colors relative rounded-xl hover:bg-surface-800">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-surface-950" />
                </button>

                <div className="h-7 w-px bg-[var(--border-color)]" />

                <div className="flex items-center gap-2">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-[var(--text-main)] leading-tight">Analyst Portal</p>
                        <p className="text-xs text-[var(--text-muted)]">Administrator</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px] flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-surface-900 flex items-center justify-center">
                            <User size={18} className="text-[var(--text-muted)]" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

