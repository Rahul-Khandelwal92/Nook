import React, { useEffect, useRef, useState } from 'react';
import { GuidanceResponse, LaneId, LANES, Message, Match } from '../types';
import { generateGuidance, generatePartnerReply } from '../services/geminiService';
import SharedInterestsSheet from './SharedInterestsSheet';
import ProfileSheet from './ProfileSheet';

interface ChatScreenProps {
    laneId: LaneId;
    match: Match;
    onChangeLane: () => void;
    onBack: () => void;
    initialMessage?: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ laneId, match, onChangeLane, onBack, initialMessage }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState(initialMessage || '');
    const [guidance, setGuidance] = useState<GuidanceResponse>({ type: 'none' });
    const [isPartnerTyping, setIsPartnerTyping] = useState(false);
    const [showReassurance, setShowReassurance] = useState(false);
    const [showInterestsSheet, setShowInterestsSheet] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    
    // Reaction State
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
    const [reactingToMessageId, setReactingToMessageId] = useState<string | null>(null);
    const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    // Timers
    const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const currentLane = LANES[laneId];

    const REACTION_OPTIONS = ['❤️', '😂', '😮', '😢', '🔥', '👍'];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isPartnerTyping, showReassurance]);

    // Initial Guidance & Focus
    useEffect(() => {
        const fetchOpeningGuidance = async () => {
            const g = await generateGuidance(laneId, [], true);
            setGuidance(g);
        };
        fetchOpeningGuidance();

        // If we have an initial message, focus the input so they can just hit send
        if (initialMessage && inputRef.current) {
            inputRef.current.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    // Anxiety Reduction Logic (Timer)
    useEffect(() => {
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        
        // If it's user's turn (last message was partner's) and they haven't typed for 8s
        const lastMsg = messages[messages.length - 1];
        if (messages.length > 0 && lastMsg?.sender === 'partner') {
             inactivityTimerRef.current = setTimeout(() => {
                 setShowReassurance(true);
                 // Fetch reassurance specific guidance if we want dynamic text, 
                 // or just use generic. Let's try dynamic.
                 generateGuidance(laneId, messages, false).then(g => {
                     if (g.type === 'reassurance') {
                         setGuidance(g);
                     } else {
                         // Fallback generic reassurance if model returns something else
                         setGuidance({
                             type: 'reassurance',
                             reassuranceText: "It’s okay to pause and think. There's no rush."
                         });
                     }
                 });
             }, 8000);
        } else {
            setShowReassurance(false);
        }

        return () => {
            if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        };
    }, [messages, laneId]);


    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;
        
        // 1. Add User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setGuidance({ type: 'none' }); // Clear guidance immediately
        setShowReassurance(false);

        // 2. Simulate Partner Typing & Reply
        setIsPartnerTyping(true);
        // Minimum delay for realism
        setTimeout(async () => {
            const replyText = await generatePartnerReply(laneId, [...messages, userMsg], match.name);
            
            const partnerMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: replyText,
                sender: 'partner',
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, partnerMsg]);
            setIsPartnerTyping(false);

            // 3. Generate New Guidance for User
            const newGuidance = await generateGuidance(laneId, [...messages, userMsg, partnerMsg]);
            setGuidance(newGuidance);
            
        }, 2000); // 2s simulated delay + API time
    };

    const handleChipClick = (chipText: string) => {
        setInputValue(chipText + " "); 
        inputRef.current?.focus();
    };

    const handleStarterSelect = (text: string) => {
        setInputValue(text + " ");
        inputRef.current?.focus();
        setShowInterestsSheet(false);
    };

    // Reaction Handlers
    const startLongPress = (id: string) => {
        longPressTimerRef.current = setTimeout(() => {
            setReactingToMessageId(id);
        }, 500); 
    };

    const cancelLongPress = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    const handleReaction = (msgId: string, emoji: string) => {
        setMessages(prev => prev.map(m => {
            if (m.id === msgId) {
                // Toggle if same, else set new
                const newReaction = m.reaction === emoji ? undefined : emoji;
                return { ...m, reaction: newReaction };
            }
            return m;
        }));
        setReactingToMessageId(null);
        setHoveredMessageId(null);
    };

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (reactingToMessageId && !(e.target as Element).closest('.reaction-picker-container')) {
                setReactingToMessageId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [reactingToMessageId]);


    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto bg-background-light dark:bg-background-dark relative">
             {/* Header */}
             <header className="sticky top-0 z-20 backdrop-blur-md bg-surface-dark/80 border-b border-primary/10 transition-colors">
                <div className="flex items-center p-4 pb-3 justify-between">
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={onBack}
                            className="flex items-center justify-center size-8 rounded-full hover:bg-white/10 transition-colors -ml-2"
                        >
                            <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="relative cursor-pointer group" onClick={() => setShowProfile(true)}>
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20 transition-all group-hover:ring-primary/50"
                                    style={{ backgroundImage: `url('${match.avatar}')` }}>
                                </div>
                                {match.isOnline && (
                                    <div className="absolute bottom-0 right-0 size-3 bg-primary border-2 border-background-dark rounded-full"></div>
                                )}
                            </div>
                            <div className="flex flex-col cursor-pointer" onClick={() => setShowProfile(true)}>
                                <h2 className="text-white text-base font-bold leading-tight tracking-tight hover:text-primary transition-colors">{match.name}, {match.age}</h2>
                                <p className={`text-[11px] font-medium leading-none uppercase tracking-widest opacity-80 ${currentLane.color}`}>
                                    {currentLane.title} Lane
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setShowInterestsSheet(true)} 
                            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary transition-all active:scale-95 hover:bg-primary/20"
                        >
                            <span className="material-symbols-outlined text-[20px]">favorite</span>
                        </button>
                         {/* Lane Switcher Trigger */}
                        <button onClick={onChangeLane} className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary transition-all active:scale-95 hover:bg-primary/20">
                            <span className="material-symbols-outlined text-[20px]">shuffle</span>
                        </button>
                        <button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary transition-all active:scale-95 hover:bg-primary/20">
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                    </div>
                </div>
                {/* MetaText - Status */}
                <div className="px-4 pb-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5">
                        <span className="size-1.5 rounded-full bg-primary/60 animate-pulse"></span>
                        <p className="text-primary/80 text-xs font-normal leading-normal">
                            {isPartnerTyping ? 'Typing...' : 'Will reply soon'}
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
                 <div className="flex justify-center my-6">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium px-4 py-1 border border-white/10 rounded-full">
                        Conversation started in {currentLane.title}
                    </span>
                </div>

                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex items-end gap-2 max-w-[85%] relative group ${msg.sender === 'user' ? 'ml-auto justify-end' : ''}`}
                        onMouseEnter={() => setHoveredMessageId(msg.id)}
                        onMouseLeave={() => setHoveredMessageId(null)}
                    >
                        {msg.sender === 'partner' && (
                             <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 shrink-0 mb-1 cursor-pointer" 
                                onClick={() => setShowProfile(true)}
                                style={{ backgroundImage: `url('${match.avatar}')` }}></div>
                        )}
                        
                        <div className={`flex flex-col gap-1 relative ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <p className="text-white/40 text-[11px] font-normal px-2">
                                {msg.sender === 'user' ? 'Me' : match.name}
                            </p>
                            
                            <div className="relative reaction-picker-container">
                                {/* Message Bubble */}
                                <div 
                                    className={`text-[15px] font-normal leading-relaxed rounded-2xl px-4 py-3 shadow-sm select-none transition-transform active:scale-[0.98] cursor-pointer ${
                                        msg.sender === 'user' 
                                        ? 'bg-primary text-background-dark rounded-br-none' 
                                        : 'bg-[#1e2f23] text-slate-100 rounded-bl-none'
                                    }`}
                                    onMouseDown={() => startLongPress(msg.id)}
                                    onMouseUp={cancelLongPress}
                                    onMouseLeave={cancelLongPress}
                                    onTouchStart={() => startLongPress(msg.id)}
                                    onTouchEnd={cancelLongPress}
                                >
                                    {msg.text}
                                </div>

                                {/* Reaction Picker Overlay */}
                                {reactingToMessageId === msg.id && (
                                    <div className={`absolute bottom-full mb-2 ${msg.sender === 'user' ? 'right-0' : 'left-0'} z-50 flex items-center gap-1 bg-surface-dark border border-white/10 rounded-full p-1.5 shadow-xl animate-slide-up`}>
                                        {REACTION_OPTIONS.map(emoji => (
                                            <button
                                                key={emoji}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReaction(msg.id, emoji);
                                                }}
                                                className={`size-8 flex items-center justify-center text-lg rounded-full hover:bg-white/10 hover:scale-110 transition-all ${msg.reaction === emoji ? 'bg-primary/20 border border-primary/50' : ''}`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Reaction Display */}
                                {msg.reaction && (
                                    <div 
                                        onClick={() => handleReaction(msg.id, msg.reaction!)}
                                        className={`absolute -bottom-3 ${msg.sender === 'user' ? 'right-2' : 'left-2'} z-10 bg-surface-dark border border-white/10 rounded-full px-1.5 py-0.5 text-xs shadow-md cursor-pointer hover:scale-110 transition-transform`}
                                    >
                                        {msg.reaction}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hover Trigger Button (Desktop) - Only show if not picking and no reaction (or even if reaction exists to change it) */}
                        {hoveredMessageId === msg.id && !reactingToMessageId && (
                            <button 
                                onClick={() => setReactingToMessageId(msg.id)}
                                className={`opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-8 ${msg.sender === 'user' ? '-left-8' : '-right-8'} size-6 flex items-center justify-center rounded-full bg-black/20 text-white/50 hover:bg-black/40 hover:text-white hover:scale-110`}
                            >
                                <span className="material-symbols-outlined text-[16px]">add_reaction</span>
                            </button>
                        )}
                    </div>
                ))}

                {isPartnerTyping && (
                     <div className="flex items-end gap-2 max-w-[85%] animate-fade-in">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 shrink-0 mb-1" 
                            style={{ backgroundImage: `url('${match.avatar}')` }}></div>
                        <div className="flex flex-col gap-1 items-start">
                             <div className="bg-[#1e2f23] rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center h-[46px]">
                                <span className="size-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="size-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="size-1.5 bg-white/40 rounded-full animate-bounce"></span>
                             </div>
                        </div>
                     </div>
                )}
                
                {/* Reassurance State */}
                {showReassurance && (
                    <div className="h-12 w-full"></div> 
                )}
                {showReassurance && (
                    <div className="mt-auto flex flex-col items-center px-8 pb-4 animate-fade-in">
                        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl px-6 py-4 border border-primary/10 backdrop-blur-sm">
                            <p className="text-gray-600 dark:text-white text-base font-medium leading-normal text-center italic opacity-80">
                                {guidance.reassuranceText || "It’s okay to pause and think."}
                            </p>
                            {!guidance.reassuranceText && (
                                 <p className="text-gray-400 dark:text-[#93c8a5] text-sm font-normal leading-normal mt-1 text-center">
                                    There’s no rush. Take your time.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </main>

            {/* Footer */}
            <footer className="absolute bottom-0 left-0 right-0 w-full z-30">
                {/* Guidance Chips - PERSISTENT: Not hidden when reassurance is shown */}
                {guidance.type !== 'none' && guidance.chips && guidance.chips.length > 0 && (
                     <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar animate-slide-up">
                        {guidance.chips.map((chip, i) => (
                             <button 
                                key={i}
                                onClick={() => handleChipClick(chip)}
                                className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#1e2f23]/90 backdrop-blur border border-primary/20 pl-4 pr-3 text-white transition-all active:bg-primary/20 hover:border-primary/50 whitespace-nowrap"
                             >
                                <p className="text-xs font-medium leading-normal">{chip}</p>
                                <span className="material-symbols-outlined text-sm opacity-60">arrow_outward</span>
                            </button>
                        ))}
                     </div>
                )}

                {/* Input Bar */}
                <div className="bg-background-dark/95 backdrop-blur-md p-4 pt-2 pb-4 border-t border-white/5">
                    <div className="flex items-center gap-2 bg-[#1e2f23] rounded-full px-4 py-1.5 border border-white/5 focus-within:border-primary/50 transition-colors">
                        <button className="text-white/40 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">add_circle</span>
                        </button>
                        <input 
                            ref={inputRef}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/30 text-[15px] py-2" 
                            placeholder={showReassurance ? "Type when you're ready..." : "Type a message..."}
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                        />
                        <button 
                            onClick={() => handleSendMessage(inputValue)}
                            disabled={!inputValue.trim()}
                            className={`bg-primary text-background-dark size-8 flex items-center justify-center rounded-full transition-transform active:scale-90 ${!inputValue.trim() && 'opacity-50 grayscale'}`}
                        >
                            <span className="material-symbols-outlined text-[20px] font-bold">arrow_upward</span>
                        </button>
                    </div>
                </div>
            </footer>

            {showInterestsSheet && (
                <SharedInterestsSheet 
                    interests={match.interests}
                    onClose={() => setShowInterestsSheet(false)}
                    onSelectStarter={handleStarterSelect}
                />
            )}

            {showProfile && (
                <ProfileSheet match={match} onClose={() => setShowProfile(false)} />
            )}
        </div>
    );
};

export default ChatScreen;