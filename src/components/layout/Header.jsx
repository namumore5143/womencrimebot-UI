import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, Sun, Moon, Menu, X, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { loadCrimeData } from '../../utils/dataLoader';

const Header = ({ onMenuClick }) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [allStates, setAllStates] = useState([]);
    const [filteredStates, setFilteredStates] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    // Load states list on mount
    useEffect(() => {
        const fetchStates = async () => {
            const data = await loadCrimeData();
            const uniqueStates = [...new Set(data.map(item => item.State))].sort();
            setAllStates(uniqueStates);
        };
        fetchStates();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter states as user types
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim()) {
            const matches = allStates.filter(s =>
                s.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredStates(matches);
            setShowDropdown(true);
        } else {
            setFilteredStates([]);
            setShowDropdown(false);
        }
    };

    // Navigate to state analysis when a state is clicked
    const handleStateSelect = (state) => {
        setSearchQuery('');
        setShowDropdown(false);
        navigate(`/analysis?state=${encodeURIComponent(state)}`);
    };

    // Handle enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && filteredStates.length > 0) {
            handleStateSelect(filteredStates[0]);
        }
    };

    return (
        <header className="h-14 sm:h-16 border-b border-[var(--border-color)] bg-surface-950/50 backdrop-blur-xl sticky top-0 z-40 px-3 sm:px-4 md:px-8 flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: hamburger + search */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-[var(--text-muted)] hover:text-primary transition-colors rounded-xl hover:bg-surface-800 flex-shrink-0"
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                {/* Search */}
                <div ref={searchRef} className="max-w-sm w-full relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => { if (searchQuery.trim()) setShowDropdown(true); }}
                        placeholder="Search states..."
                        className="bg-surface-900/50 border border-[var(--border-color)] text-[var(--text-main)] text-sm rounded-xl py-2 pl-9 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />

                    {/* Search dropdown */}
                    {showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-900 border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                            {filteredStates.length > 0 ? (
                                filteredStates.map((state) => (
                                    <button
                                        key={state}
                                        onClick={() => handleStateSelect(state)}
                                        className="w-full text-left px-4 py-3 text-sm text-[var(--text-main)] hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-3 border-b border-[var(--border-color)] last:border-b-0"
                                    >
                                        <MapPin size={14} className="text-primary flex-shrink-0" />
                                        <span>{state}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-4 text-sm text-[var(--text-muted)] text-center">
                                    No states found for "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: theme toggle + bell + profile */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
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

                <div className="h-7 w-px bg-[var(--border-color)] hidden sm:block" />

                <div className="flex items-center gap-2">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-[var(--text-main)] leading-tight">Welcome, User</p>
                        <p className="text-xs text-[var(--text-muted)]">Crime Analyst</p>
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
