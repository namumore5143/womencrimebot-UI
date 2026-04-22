import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
    Send,
    Bot,
    User,
    Loader2,
    ShieldCheck,
    Smartphone,
    Info,
    ExternalLink,
    WifiOff,
    Zap
} from 'lucide-react';

const API_BASE = 'https://women-crime-backend.onrender.com';

const QUICK_STARTERS = [
    'Total crimes in 2020?',
    'Most dangerous state?',
    'Rape cases by year',
    'Crimes in Maharashtra',
];

const TypingIndicator = () => (
    <div className="flex justify-start">
        <div className="flex gap-3 items-end">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-indigo-500/30 flex-shrink-0 flex items-center justify-center shadow-md">
                <Bot size={18} className="text-indigo-400" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1.5 items-center h-4">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }} />
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }} />
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                </div>
            </div>
        </div>
    </div>
);

const ChatMessage = ({ msg, onSuggestionClick }) => {
    const isUser = msg.role === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[82%] items-end ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center shadow-md ${
                    isUser
                        ? 'bg-indigo-600 ring-2 ring-indigo-400/30'
                        : 'bg-slate-800 border border-indigo-500/30'
                }`}>
                    {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-indigo-400" />}
                </div>

                <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                        isUser
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-800/80 text-slate-200 border border-slate-700 rounded-tl-none'
                    }`}>
                        {msg.content}
                    </div>

                    {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {msg.suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSuggestionClick(s)}
                                    className="text-xs px-3 py-1.5 rounded-full bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 hover:border-indigo-400/60 transition-all active:scale-95"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {!isUser && msg.links && msg.links.length > 0 && (
                        <div className="flex flex-col gap-1.5 mt-1 w-full">
                            {msg.links.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all"
                                >
                                    <ExternalLink size={12} />
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SafetyAssistant = () => {
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            content: "Hello! I'm WomenCrimeInfoBot\nI provide information about crimes against women in India from 2001 to 2021.\nYou can ask about crime statistics by year, state, or crime type.",
            suggestions: QUICK_STARTERS,
            links: []
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text) => {
        const userText = text.trim();
        if (!userText || isLoading) return;

        setInput('');
        setIsLoading(true);
        setIsOnline(true);
        setMessages(prev => [...prev, { role: 'user', content: userText }]);

        try {
            const response = await axios.post(
                `${API_BASE}/api/dialogflow`,
                { text: userText },
                { timeout: 30000 }
            );

            const { reply, suggestions = [], links = [] } = response.data;

            const botText =
                reply ||
                response.data.fulfillmentText ||
                "I'm not sure about that. Try asking about a specific crime type, year, or state.";

            setMessages(prev => [...prev, {
                role: 'bot',
                content: botText,
                suggestions,
                links
            }]);
        } catch (error) {
            console.error('Chatbot error:', error);

            const isTimeout =
                error.code === 'ECONNABORTED' ||
                (error.message && error.message.includes('timeout'));
            const isNetwork = !error.response;

            if (isNetwork || isTimeout) setIsOnline(false);

            const errMsg = isTimeout
                ? "The server is waking up (free tier). Please retry in a few seconds."
                : "Something went wrong. Please check your connection and try again.";

            setMessages(prev => [...prev, {
                role: 'bot',
                content: errMsg,
                suggestions: [],
                links: []
            }]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <ShieldCheck className="text-emerald-500" />
                        Safety Assistant
                    </h2>
                    <p className="text-slate-400 mt-1 text-sm">
                        Rule-based chatbot powered by NCRB crime data (2001–2021).
                    </p>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
                    isOnline
                        ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-600/10 border-rose-500/20 text-rose-400'
                }`}>
                    {isOnline
                        ? <><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Connected</>
                        : <><WifiOff size={12} /> Disconnected</>
                    }
                </div>
            </div>

            {/* Main layout */}
            <div className="flex-1 flex flex-col lg:flex-row gap-5 overflow-hidden min-h-0">

                {/* Chat container */}
                <div className="flex-1 glass-card flex flex-col p-0 overflow-hidden min-h-0">

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0">
                        {messages.map((msg, idx) => (
                            <ChatMessage
                                key={idx}
                                msg={msg}
                                onSuggestionClick={sendMessage}
                            />
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-4 border-t border-slate-800 bg-slate-900/40 flex-shrink-0"
                    >
                        <div className="flex gap-3 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 items-center focus-within:ring-2 focus-within:ring-indigo-600/50 transition-all">
                            <input
                                ref={inputRef}
                                id="chatbot-input"
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask e.g. 'Total rapes in 2018?' or 'Crimes in UP'"
                                className="flex-1 bg-transparent text-slate-200 text-sm placeholder-slate-500 focus:outline-none"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                id="chatbot-send-btn"
                                disabled={!input.trim() || isLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl text-white transition-all active:scale-95 flex-shrink-0"
                            >
                                {isLoading
                                    ? <Loader2 size={17} className="animate-spin" />
                                    : <Send size={17} />
                                }
                            </button>
                        </div>
                        <p className="text-xs text-slate-600 mt-2 ml-1">
                            Press Enter to send
                        </p>
                    </form>
                </div>

                {/* Right sidebar */}
                <div className="w-full lg:w-72 flex flex-col gap-4 flex-shrink-0">

                    {/* Quick starters */}
                    <div className="glass-card bg-indigo-600/5 border-indigo-500/15">
                        <h4 className="text-white font-semibold flex items-center gap-2 mb-3 text-sm">
                            <Zap size={15} className="text-indigo-400" />
                            Quick Questions
                        </h4>
                        <div className="space-y-2">
                            {QUICK_STARTERS.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(q)}
                                    disabled={isLoading}
                                    className="block w-full text-left text-xs px-3 py-2.5 rounded-xl bg-slate-900/60 text-slate-300 hover:bg-indigo-600/20 hover:text-white border border-slate-800 hover:border-indigo-500/40 transition-all disabled:opacity-50"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Emergency helplines */}
                    <div className="glass-card bg-emerald-600/5 border-emerald-500/15">
                        <h4 className="text-white font-semibold flex items-center gap-2 mb-3 text-sm">
                            <Smartphone size={15} className="text-emerald-400" />
                            Emergency Helplines
                        </h4>
                        <ul className="space-y-3 text-xs text-slate-400">
                            {[
                                { name: 'National Emergency', num: '112' },
                                { name: "Women's Helpline", num: '1091' },
                                { name: 'Police', num: '100' },
                                { name: 'Childline', num: '1098' },
                            ].map(({ name, num }) => (
                                <li key={name} className="flex items-center justify-between">
                                    <span>{name}</span>
                                    <span className="font-bold text-white bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-lg">{num}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About bot */}
                    <div className="glass-card border-slate-800">
                        <h4 className="text-white font-semibold flex items-center gap-2 mb-2 text-sm">
                            <Info size={15} className="text-indigo-400" />
                            About this bot
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            This is a rule-based chatbot using NCRB (National Crime Records Bureau) data.
                            It answers questions about crime statistics across Indian states from{' '}
                            <strong className="text-slate-300">2001 to 2021</strong>.
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-indigo-400 bg-indigo-600/10 px-3 py-2 rounded-xl border border-indigo-500/20">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse flex-shrink-0" />
                            women-crime-backend.onrender.com
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SafetyAssistant;
