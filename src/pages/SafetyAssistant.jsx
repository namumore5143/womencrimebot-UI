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
    <div className="flex items-end gap-4 pl-2 animate-in fade-in duration-300">
        <div className="w-12 h-12 rounded-xl bg-surface-700 border border-white/10 flex-shrink-0 flex items-center justify-center shadow-lg">
            <Bot size={24} className="text-primary animate-pulse" />
        </div>
        <div className="bg-surface-700 border border-white/10 px-6 py-4 rounded-2xl rounded-bl-none shadow-lg">
            <div className="flex gap-2 items-center">
                <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
            <div className={`flex gap-4 max-w-[70%] items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                {!isUser && (
                    <div className="w-12 h-12 rounded-xl bg-surface-700 border border-white/10 flex-shrink-0 flex items-center justify-center shadow-lg self-end mb-2">
                        <Bot size={24} className="text-primary" />
                    </div>
                )}
                {isUser && (
                    <div className="w-12 h-12 rounded-xl pink-gradient flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/20 self-end mb-2">
                        <User size={24} className="text-white" />
                    </div>
                )}

                {/* Bubble stack */}
                <div className={`flex flex-col gap-2 min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* Main bubble */}
                    <div className={`relative px-6 py-4 rounded-2xl text-base md:text-lg leading-relaxed shadow-lg whitespace-pre-wrap break-words transition-all hover:shadow-xl ${
                        isUser
                            ? 'pink-gradient text-white rounded-br-none font-medium'
                            : 'bg-surface-700 text-slate-100 border border-white/10 rounded-bl-none'
                    }`}>
                        {msg.content}

                        {/* Copy button on hover */}
                        {!isUser && (
                            <button
                                onClick={handleCopy}
                                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all bg-surface-600 border border-white/10 rounded-lg p-2 text-slate-300 hover:text-white hover:bg-surface-500 shadow-lg"
                                title="Copy"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        )}
                    </div>

                    {/* Timestamp */}
                    <span className={`text-xs text-slate-500 font-medium px-2 ${isUser ? 'pr-2' : 'pl-2'}`}>{time}</span>

                    {/* Suggestion chips */}
                    {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2 max-w-full">
                            {msg.suggestions.slice(0, 3).map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSuggestionClick(s)}
                                    className="text-xs px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:text-white hover:border-primary/40 transition-all active:scale-95 shadow-sm"
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
    }, [messages, isLoading]);

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
        <div className="min-h-screen bg-slate-950 flex justify-center items-center p-4">
            {/* Centered Chat Container */}
            <div className="w-full max-w-6xl h-[90vh] bg-[#0f0f11] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col lg:flex-row">
                
                {/* LEFT: Main Chat Area (70% on desktop) */}
                <div className="flex-1 lg:flex-[7] flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-primary p-4 md:p-6 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 rounded-xl shadow-lg">
                                    <ShieldCheck className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white">Women Crime Assistant</h3>
                                    <p className="text-sm text-white/80">Empowering Safety through Data</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-sm font-bold uppercase transition-all ${
                                    isOnline ? 'text-emerald-300' : 'text-rose-300'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-300 animate-pulse' : 'bg-rose-300'}`} />
                                    {isOnline ? 'Active' : 'Offline'}
                                </div>
                                <button
                                    onClick={() => setMessages([messages[0]])}
                                    className="p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <RefreshCw size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6 bg-surface-800"
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
                            className="absolute bottom-24 right-8 p-3 rounded-xl bg-primary text-white shadow-xl shadow-primary/40 hover:bg-primary-dark transition-all z-10"
                        >
                            <ChevronDown size={20} />
                        </button>
                    )}

                    {/* Input Area */}
                    <div className="p-3 md:p-4 bg-surface-900 border-t border-white/10">
                        <form 
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="flex items-end gap-2 bg-surface-800 border border-white/10 rounded-xl p-2 md:p-3 focus-within:ring-2 focus-within:ring-primary/40 transition-all"
                        >
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    // Auto-resize textarea
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                }}
                                placeholder="Ask about crime trends, states, or safety..."
                                disabled={isLoading}
                                className="flex-1 bg-transparent text-slate-100 text-sm md:text-base placeholder-slate-500 focus:outline-none py-2 px-3 resize-none overflow-hidden min-h-[24px] max-h-[120px]"
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
                                className="pink-gradient hover:opacity-90 disabled:opacity-30 p-2 md:p-3 rounded-lg text-white transition-all active:scale-90 shadow-lg flex-shrink-0"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Suggestions Panel (30% on desktop) */}
                <div className="lg:flex-[3] bg-surface-900 border-l border-white/10 p-4 md:p-6 overflow-y-auto">
                    <div className="space-y-6">
                        {/* Quick Insights Title */}
                        <div>
                            <h4 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                                <Sparkles size={20} className="text-primary" />
                                Quick Insights
                            </h4>
                            <p className="text-slate-400 text-sm">Click any question to get instant answers</p>
                        </div>

                        {/* Suggestion Buttons */}
                        <div className="space-y-3">
                            {QUICK_STARTERS.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(q.query)}
                                    className="w-full text-left p-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary hover:text-white border border-primary/20 hover:border-primary/40 transition-all active:scale-95 shadow-lg hover:shadow-xl"
                                >
                                    <div className="font-medium">{q.label}</div>
                                    <div className="text-xs opacity-70 mt-1">Get detailed analysis</div>
                                </button>
                            ))}
                        </div>

                        {/* Help Section */}
                        <div className="border-t border-white/10 pt-6">
                            <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <Smartphone size={18} className="text-secondary" />
                                Emergency Help
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {HELPLINES.map(h => (
                                    <a
                                        key={h.num}
                                        href={`tel:${h.num}`}
                                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-800 border border-white/10 hover:border-secondary/40 transition-all group hover:scale-105"
                                    >
                                        <span className="text-xs text-slate-500 font-bold uppercase mb-1">{h.name.split(' ')[0]}</span>
                                        <span className="text-white font-bold group-hover:text-secondary">{h.num}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SafetyAssistant;
