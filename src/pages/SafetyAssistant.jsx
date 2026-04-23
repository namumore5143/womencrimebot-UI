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
    <div className="flex items-end gap-3 sm:gap-4 pl-2 animate-in fade-in duration-300">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface-700 border border-[var(--border-color)] flex-shrink-0 flex items-center justify-center shadow-lg">
            <Bot size={20} sm:size={24} className="text-primary animate-pulse" />
        </div>
        <div className="bg-surface-700 border border-[var(--border-color)] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl rounded-bl-none shadow-lg">
            <div className="flex gap-1.5 sm:gap-2 items-center">
                <span className="w-2 sm:w-3 h-2 sm:h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 sm:w-3 h-2 sm:h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 sm:w-3 h-2 sm:h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
            <div className={`flex gap-2 sm:gap-4 max-w-[85%] sm:max-w-[70%] items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                {!isUser && (
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-surface-700 border border-[var(--border-color)] flex-shrink-0 flex items-center justify-center shadow-lg self-end mb-1 sm:mb-2">
                        <Bot size={18} sm:size={24} className="text-primary" />
                    </div>
                )}
                {isUser && (
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl pink-gradient flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/20 self-end mb-1 sm:mb-2">
                        <User size={18} sm:size={24} className="text-white" />
                    </div>
                )}

                {/* Bubble stack */}
                <div className={`flex flex-col gap-1 sm:gap-2 min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* Main bubble */}
                    <div className={`relative px-4 sm:px-6 py-2.5 sm:py-4 rounded-2xl text-sm sm:text-lg leading-relaxed shadow-lg whitespace-pre-wrap break-words transition-all hover:shadow-xl ${
                        isUser
                            ? 'pink-gradient text-white rounded-br-none font-medium'
                            : 'bg-surface-700 text-[var(--text-main)] border border-[var(--border-color)] rounded-bl-none'
                    }`}>
                        {msg.content}

                        {/* Copy button on hover */}
                        {!isUser && (
                            <button
                                onClick={handleCopy}
                                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all bg-surface-800 border border-[var(--border-color)] rounded-lg p-1.5 sm:p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-surface-700 shadow-lg"
                                title="Copy"
                            >
                                {copied ? <Check size={14} sm:size={16} /> : <Copy size={14} sm:size={16} />}
                            </button>
                        )}
                    </div>

                    {/* Timestamp */}
                    <span className={`text-[10px] sm:text-xs text-[var(--text-muted)] font-medium px-1 sm:px-2 ${isUser ? 'pr-2' : 'pl-2'}`}>{time}</span>

                    {/* Suggestion chips */}
                    {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-2 max-w-full">
                            {msg.suggestions.slice(0, 3).map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSuggestionClick(s)}
                                    className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:text-white hover:border-primary/40 transition-all active:scale-95 shadow-sm"
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
    const [showInfo, setShowInfo] = useState(false);
    const [newMsgIds, setNewMsgIds] = useState(new Set());
    const textareaRef = useRef(null);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

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
        <div className="h-[calc(100vh-120px)] w-full flex justify-center items-center p-0 sm:p-2 md:p-4">
            {/* Centered Chat Container */}
            <div className="w-full h-full bg-surface-900 rounded-none sm:rounded-3xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col lg:flex-row">
                
                {/* LEFT: Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0 border-b lg:border-b-0 lg:border-r border-[var(--border-color)]">
                    {/* Chat Header */}
                    <div className="bg-primary p-4 sm:p-6 flex-shrink-0">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="p-2 sm:p-3 bg-white/20 rounded-xl shadow-lg flex-shrink-0">
                                    <ShieldCheck className="text-white" size={20} sm:size={24} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-none">Women Crime Assistant</h3>
                                    <p className="text-xs sm:text-sm text-white/80 mt-1">Empowering Safety through Data</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 border border-white/30 text-[10px] sm:text-xs font-bold uppercase transition-all ${
                                    isOnline ? 'text-emerald-300' : 'text-rose-300'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-300 animate-pulse' : 'bg-rose-300'}`} />
                                    <span className="hidden xs:inline">{isOnline ? 'Active' : 'Offline'}</span>
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

                    {/* Messages Area */}
                    <div
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 bg-surface-800 scroll-smooth"
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

                    {/* Scroll Bottom Button */}
                    {showScrollBtn && (
                        <button
                            onClick={() => scrollToBottom()}
                            className="absolute bottom-32 right-8 p-3 rounded-full bg-primary text-white shadow-xl shadow-primary/40 hover:bg-primary-dark transition-all z-10 animate-bounce"
                        >
                            <ChevronDown size={20} />
                        </button>
                    )}

                    {/* Input Area */}
                    <div className="p-4 bg-surface-900 border-t border-[var(--border-color)]">
                        <form 
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="flex items-end gap-2 bg-surface-800 border border-[var(--border-color)] rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/40 transition-all max-w-4xl mx-auto w-full"
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
                                className="flex-1 bg-transparent text-[var(--text-main)] text-sm sm:text-base placeholder-[var(--text-muted)] focus:outline-none py-2.5 px-4 resize-none overflow-y-auto min-h-[44px] max-h-[120px]"
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
                                className="pink-gradient hover:opacity-90 disabled:opacity-30 p-3 rounded-xl text-white transition-all active:scale-95 shadow-lg flex-shrink-0"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Suggestions Panel */}
                <div className="w-full lg:w-80 xl:w-96 bg-surface-900 p-4 sm:p-6 overflow-y-auto flex-shrink-0">
                    <div className="space-y-8">
                        {/* Quick Insights */}
                        <div>
                            <h4 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2 mb-4">
                                <Sparkles size={18} className="text-primary" />
                                Quick Insights
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                                {QUICK_STARTERS.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(q.query)}
                                        className="w-full text-left p-3.5 rounded-xl bg-surface-800 border border-[var(--border-color)] hover:border-primary/40 text-[var(--text-main)] transition-all active:scale-[0.98] group"
                                    >
                                        <div className="font-bold text-xs sm:text-sm group-hover:text-primary transition-colors truncate">{q.label}</div>
                                        <div className="text-[10px] text-[var(--text-muted)] mt-1">Click to analyze</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Helplines */}
                        <div className="border-t border-[var(--border-color)] pt-6">
                            <h4 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2 mb-4">
                                <Smartphone size={18} className="text-secondary" />
                                Emergency Helplines
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {HELPLINES.map(h => (
                                    <a
                                        key={h.num}
                                        href={`tel:${h.num}`}
                                        className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-surface-800 border border-[var(--border-color)] hover:border-secondary/50 transition-all group active:scale-95"
                                    >
                                        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase mb-1">{h.name.split(' ')[0]}</span>
                                        <span className="text-[var(--text-main)] font-black text-sm sm:text-base group-hover:text-secondary">{h.num}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        
                        {/* Footer Info */}
                        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                            <div className="flex items-center gap-2 text-primary font-bold text-xs mb-2">
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

