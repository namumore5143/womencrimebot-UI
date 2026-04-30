import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Send, Bot, User, Loader2, ShieldCheck,
    Smartphone, Info, ExternalLink, WifiOff,
    Zap, Copy, Check, RefreshCw, ChevronDown,
    MessageCircle, X, Sparkles
} from 'lucide-react';

const API_BASE = 'https://women-crime-backend.onrender.com';

const QUICK_STARTERS = [
    { label: 'Rape cases 2018', query: 'Rape cases in 2018?' },
    { label: 'Most committed crime', query: 'What is the most committed crime?' },
    { label: 'Crime in Maharashtra', query: 'Crime in Maharashtra?' },
    { label: 'Highest crime year', query: 'Highest crime year?' },
    { label: 'Most dangerous state', query: 'Most dangerous state?' },
    { label: 'Kidnapping Maharashtra', query: 'Kidnapping in Maharashtra?' },
    { label: 'Crimes in Delhi', query: 'Crimes in Delhi?' },
    { label: 'Maharashtra crimes', query: 'Crimes in Maharashtra?' },
];

const HELPLINES = [
    { name: 'National Emergency', num: '112' },
    { name: "Women's Helpline", num: '1091' },
    { name: 'Police', num: '100' },
    { name: 'Childline', num: '1098' },
];

/* ── Typing dots animation ── */
const TypingIndicator = () => (
    <div className="flex items-end gap-3 pl-2 animate-in fade-in duration-300">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-surface-700 border border-[var(--border-color)] flex-shrink-0 flex items-center justify-center shadow-lg">
            <Bot size={18} className="text-primary animate-pulse" />
        </div>
        <div className="bg-surface-700 border border-[var(--border-color)] px-4 py-3 rounded-2xl rounded-bl-none shadow-lg">
            <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    </div>
);

/* ── Single message bubble ── */
const ChatMessage = ({ msg, onSuggestionClick, isNew }) => {
    const isUser = msg.role === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(msg.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const time = msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group ${isNew ? 'animate-in fade-in slide-in-from-bottom-4 duration-500' : ''}`}>
            <div className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[75%] items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                {!isUser && (
                    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-surface-700 border border-[var(--border-color)] flex-shrink-0 flex items-center justify-center shadow-lg self-end mb-1">
                        <Bot size={14} className="text-primary sm:hidden" />
                        <Bot size={20} className="text-primary hidden sm:block" />
                    </div>
                )}
                {isUser && (
                    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl pink-gradient flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/20 self-end mb-1">
                        <User size={14} className="text-white sm:hidden" />
                        <User size={20} className="text-white hidden sm:block" />
                    </div>
                )}

                {/* Bubble stack */}
                <div className={`flex flex-col gap-1 min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* Main bubble */}
                    <div
                        className={`relative px-3 sm:px-5 py-2 sm:py-3 rounded-2xl text-sm leading-relaxed shadow-lg whitespace-pre-wrap overflow-hidden transition-all hover:shadow-xl ${
                            isUser
                                ? 'pink-gradient text-white rounded-br-none font-medium'
                                : 'bg-surface-700 text-[var(--text-main)] border border-[var(--border-color)] rounded-bl-none'
                        }`}
                        style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                    >
                        {msg.content}

                        {/* Copy button on hover */}
                        {!isUser && (
                            <button
                                onClick={handleCopy}
                                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all bg-surface-800 border border-[var(--border-color)] rounded-lg p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-surface-700 shadow-lg"
                                title="Copy"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                        )}
                    </div>

                    {/* Timestamp */}
                    <span className={`text-[10px] text-[var(--text-muted)] font-medium px-1 ${isUser ? 'pr-2' : 'pl-2'}`}>{time}</span>

                    {/* Suggestion chips */}
                    {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1 max-w-full">
                            {msg.suggestions.slice(0, 3).map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSuggestionClick(s)}
                                    className="text-[10px] sm:text-xs px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:text-white hover:border-primary/40 transition-all active:scale-95 shadow-sm"
                                >
                                    {s.length > 25 ? s.substring(0, 25) + '...' : s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Main chatbot page ── */
const SafetyAssistant = () => {
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            content: "Welcome! I'm your **WomenCrimeInfo AI** 🤖\n\nI can help you explore real-world crime data across India from 2001 to 2021.\n\nAsk me about:\n✨ Total crimes in a specific year\n✨ Comparative state analysis\n✨ Specific crime types (Domestic Violence, Rape, etc.)\n✨ State-wise crime statistics\n✨ Year-wise trends\n\nHow can I assist you today?",
            suggestions: QUICK_STARTERS.map(q => q.query),
            timestamp: Date.now(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [newMsgIds, setNewMsgIds] = useState(new Set());
    const textareaRef = useRef(null);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = useCallback((smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, scrollToBottom]);

    const handleScroll = () => {
        const el = messagesContainerRef.current;
        if (!el) return;
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
        setShowScrollBtn(!isNearBottom);
    };

    const sendMessage = async (text) => {
        const userText = (text || input).trim();
        if (!userText || isLoading) return;

        const userMsgId = Date.now();
        const userMsg = { role: 'user', content: userText, timestamp: Date.now(), id: userMsgId };

        setInput('');
        setIsLoading(true);
        setMessages(prev => [...prev, userMsg]);

        try {
            const res = await axios.post(
                `${API_BASE}/api/dialogflow`,
                { text: userText },
                { timeout: 30000 }
            );

            const { reply, suggestions = [] } = res.data;
            const botText = reply || res.data.fulfillmentText || "I couldn't process that. Try asking about a state or a year.";

            const botMsgId = Date.now() + 1;
            setMessages(prev => [...prev, {
                role: 'bot',
                content: botText,
                suggestions: suggestions.length > 0 ? suggestions : QUICK_STARTERS.map(q => q.query).slice(0, 3),
                timestamp: Date.now(),
                id: botMsgId,
            }]);
            setNewMsgIds(prev => new Set(prev).add(botMsgId));
            setIsOnline(true);
        } catch (err) {
            setIsOnline(false);
            const errMsg = "Server is currently waking up or unavailable. Please try again in a moment.";
            setMessages(prev => [...prev, { role: 'bot', content: errMsg, timestamp: Date.now() }]);
        } finally {
            setIsLoading(false);
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    };

    return (
        /* ── Outer wrapper ──
           Mobile: scrollable column so chat + sidebar both visible
           Desktop: fixed height, internal scrolling only */
        <div className="w-full max-w-full p-0 sm:p-2 md:p-4
                        overflow-x-hidden overflow-y-auto lg:overflow-hidden
                        min-h-0 lg:h-[calc(100vh-8rem)]">

            {/* ── Main container: column on mobile → row on desktop ── */}
            <div className="w-full bg-surface-900 rounded-none sm:rounded-3xl shadow-2xl border border-[var(--border-color)]
                            flex flex-col lg:flex-row
                            min-h-[100dvh] lg:min-h-0 lg:h-full
                            overflow-visible lg:overflow-hidden">

                {/* ════════════════════════════════════════════════════
                    LEFT — Chat area (header + messages + input)
                    Mobile: full width, explicit height so it's visible FIRST
                    Desktop: flex-[7], side-by-side with right panel
                   ════════════════════════════════════════════════════ */}
                <div className="w-full lg:flex-[7] flex flex-col
                                h-[calc(100dvh-4rem)] lg:h-full
                                min-w-0 border-b lg:border-b-0 lg:border-r border-[var(--border-color)]">

                    {/* Chat Header */}
                    <div className="bg-primary px-4 py-3 sm:px-6 sm:py-4 flex-shrink-0">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="p-2 bg-white/20 rounded-xl shadow-lg flex-shrink-0">
                                    <ShieldCheck className="text-white" size={20} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white tracking-tight leading-none truncate">Women Crime Assistant</h3>
                                    <p className="text-xs text-white/80 mt-0.5 hidden sm:block">Empowering Safety through Data</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <div className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/20 border border-white/30 text-[10px] sm:text-xs font-bold uppercase transition-all ${
                                    isOnline ? 'text-emerald-300' : 'text-rose-300'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-300 animate-pulse' : 'bg-rose-300'}`} />
                                    <span className="hidden sm:inline">{isOnline ? 'Active' : 'Offline'}</span>
                                </div>
                                <button
                                    onClick={() => setMessages([messages[0]])}
                                    className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
                                    title="Reset Conversation"
                                >
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area — scrollable */}
                    <div
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 bg-surface-800 scroll-smooth"
                    >
                        {messages.map((msg, idx) => (
                            <ChatMessage
                                key={idx}
                                msg={msg}
                                onSuggestionClick={sendMessage}
                                isNew={newMsgIds.has(msg.id)}
                            />
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Scroll-to-bottom button */}
                    {showScrollBtn && (
                        <div className="relative">
                            <button
                                onClick={() => scrollToBottom()}
                                className="absolute -top-14 right-4 p-2.5 rounded-full bg-primary text-white shadow-xl shadow-primary/40 hover:bg-primary-dark transition-all z-10 animate-bounce"
                            >
                                <ChevronDown size={18} />
                            </button>
                        </div>
                    )}

                    {/* Input Area — always pinned at bottom of chat section */}
                    <div className="px-3 py-2 sm:px-4 sm:py-3 bg-surface-900 border-t border-[var(--border-color)] flex-shrink-0 w-full">
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="flex items-end gap-2 bg-surface-800 border border-[var(--border-color)] rounded-xl sm:rounded-2xl p-1.5 sm:p-2 focus-within:ring-2 focus-within:ring-primary/40 transition-all w-full"
                        >
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                }}
                                placeholder="Ask about crime trends, states, or years..."
                                disabled={isLoading}
                                className="flex-1 min-w-0 bg-transparent text-[var(--text-main)] text-sm placeholder-[var(--text-muted)] focus:outline-none py-2 sm:py-2.5 px-3 sm:px-4 resize-none overflow-y-auto min-h-[40px] max-h-[120px]"
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="pink-gradient hover:opacity-90 disabled:opacity-30 p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-white transition-all active:scale-95 shadow-lg flex-shrink-0"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════════
                    RIGHT — Suggestions + Helplines panel
                    Mobile: w-full, stacks BELOW chat (user scrolls down)
                    Desktop: flex-[3], side-by-side with chat
                   ════════════════════════════════════════════════════ */}
                <div className="w-full lg:flex-[3] bg-surface-900 p-4 sm:p-6 overflow-y-auto">

                    <div className="space-y-6">
                        {/* Quick Insights */}
                        <div>
                            <h4 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2 mb-3">
                                <Sparkles size={16} className="text-primary" />
                                Quick Insights
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                                {QUICK_STARTERS.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(q.query)}
                                        className="w-full text-left p-3 rounded-xl bg-surface-800 border border-[var(--border-color)] hover:border-primary/40 text-[var(--text-main)] transition-all active:scale-[0.98] group"
                                    >
                                        <div className="font-bold text-xs sm:text-sm group-hover:text-primary transition-colors truncate">{q.label}</div>
                                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5">Click to analyze</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Helplines */}
                        <div className="border-t border-[var(--border-color)] pt-4">
                            <h4 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2 mb-3">
                                <Smartphone size={16} className="text-secondary" />
                                Emergency Helplines
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                {HELPLINES.map(h => (
                                    <a
                                        key={h.num}
                                        href={`tel:${h.num}`}
                                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-800 border border-[var(--border-color)] hover:border-secondary/50 transition-all group active:scale-95"
                                    >
                                        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase mb-1">{h.name.split(' ')[0]}</span>
                                        <span className="text-[var(--text-main)] font-black text-sm group-hover:text-secondary">{h.num}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        
                        {/* Footer Info */}
                        <div className="bg-primary/5 rounded-2xl p-3 border border-primary/10">
                            <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1.5">
                                <Info size={14} />
                                Did you know?
                            </div>
                            <p className="text-[10px] sm:text-xs text-[var(--text-muted)] leading-relaxed">
                                This AI uses real government datasets (2001-2021) to provide accurate insights into crime trends across all Indian states.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SafetyAssistant;
