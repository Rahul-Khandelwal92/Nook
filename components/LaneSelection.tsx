import React, { useEffect } from 'react';
import { LaneId, LANES, Match } from '../types';
import { generateIcebreakers } from '../services/geminiService';

interface LaneSelectionProps {
    match: Match;
    onSelect: (lane: LaneId, starter?: string) => void;
    onSkip: () => void;
    onBack: () => void;
}

const LaneSelection: React.FC<LaneSelectionProps> = ({ match, onSelect, onSkip, onBack }) => {
    const [selectedId, setSelectedId] = React.useState<LaneId | null>(null);
    const [icebreakers, setIcebreakers] = React.useState<string[]>([]);
    const [loadingIcebreakers, setLoadingIcebreakers] = React.useState(true);

    useEffect(() => {
        setLoadingIcebreakers(true);
        generateIcebreakers(match.interests)
            .then(starters => {
                setIcebreakers(starters);
                setLoadingIcebreakers(false);
            })
            .catch(() => setLoadingIcebreakers(false));
    }, [match.interests]);

    const handleConfirm = () => {
        if (selectedId) {
            onSelect(selectedId);
        }
    };

    const handleStarterClick = (starter: string) => {
        // Default to Light & Easy for quick starters
        onSelect(LaneId.LightEasy, starter);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto bg-background-light dark:bg-background-dark overflow-y-auto">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onBack}
                        className="flex items-center justify-center size-10 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="size-10 rounded-full bg-center bg-cover border-2 border-primary/20"
                                style={{ backgroundImage: `url('${match.avatar}')` }}>
                            </div>
                            <div className="absolute bottom-0 right-0 size-3 bg-primary rounded-full border-2 border-background-dark"></div>
                        </div>
                        <div>
                            <h2 className="text-base font-bold leading-tight">Chatting with {match.name}</h2>
                            <p className="text-xs text-primary font-medium">{match.isOnline ? 'Online' : 'Offline'}</p>
                        </div>
                    </div>
                </div>
                <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-2xl">info</span>
                </button>
            </header>

            <main className="flex-1 flex flex-col px-4 pt-6 pb-8">
                
                {/* Shared Interests & Icebreakers Module */}
                <div className="mb-6 animate-fade-in">
                    <div className="bg-surface-dark border border-white/5 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-primary text-sm">favorite</span>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">You both like</h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {match.interests.map((interest, i) => (
                                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 text-slate-300 text-xs font-medium border border-white/5">
                                    {interest}
                                </span>
                            ))}
                        </div>

                        <div className="space-y-2">
                             <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Quick Starters</h3>
                             {loadingIcebreakers ? (
                                <div className="space-y-2">
                                    <div className="h-8 bg-white/5 rounded-lg w-full animate-pulse"></div>
                                    <div className="h-8 bg-white/5 rounded-lg w-3/4 animate-pulse"></div>
                                </div>
                             ) : (
                                <div className="flex flex-col gap-2">
                                    {icebreakers.map((starter, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => handleStarterClick(starter)}
                                            className="text-left bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 rounded-xl px-3 py-2.5 transition-all active:scale-[0.99] group"
                                        >
                                            <p className="text-[#93c8a5] text-sm leading-snug group-hover:text-primary transition-colors">
                                                "{starter}"
                                            </p>
                                        </button>
                                    ))}
                                </div>
                             )}
                        </div>
                    </div>
                </div>

                <div className="mb-6 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Or pick a vibe</h1>
                    <p className="text-slate-500 dark:text-[#93c8a5] text-xs px-6">
                        Choose a "Lane" to set the pace manually.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    {/* Light & Easy */}
                    <button 
                        onClick={() => setSelectedId(LaneId.LightEasy)}
                        className={`text-left flex flex-col h-full transition-all duration-200 ${selectedId === LaneId.LightEasy ? 'scale-[1.02] ring-2 ring-primary' : 'hover:scale-[1.01]'}`}
                    >
                        <div className="bg-surface-dark rounded-2xl p-4 flex-1 border-t-4 border-t-[#93c8a5] flex flex-col h-full border border-white/5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="size-10 shrink-0 bg-[#93c8a5]/10 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#93c8a5] text-xl">filter_drama</span>
                                </div>
                                <span className="text-[#93c8a5] text-[10px] font-bold uppercase tracking-wider text-right leading-tight">Soft<br />Blue/Green</span>
                            </div>
                            <h4 className="text-white text-base font-bold mb-1">Light & Easy</h4>
                            <p className="text-[#93c8a5]/70 text-[11px] leading-snug">Low pressure, casual icebreakers to get the ball rolling.</p>
                        </div>
                    </button>

                    {/* Thoughtful & Calm */}
                    <button 
                         onClick={() => setSelectedId(LaneId.ThoughtfulCalm)}
                         className={`text-left flex flex-col h-full transition-all duration-200 ${selectedId === LaneId.ThoughtfulCalm ? 'scale-[1.02] ring-2 ring-primary' : 'hover:scale-[1.01]'}`}
                    >
                        <div className="bg-surface-dark rounded-2xl p-4 flex-1 border-t-4 border-t-[#b19cd9] flex flex-col h-full border border-white/5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="size-10 shrink-0 bg-[#b19cd9]/10 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#b19cd9] text-xl">self_improvement</span>
                                </div>
                                <span className="text-[#b19cd9] text-[10px] font-bold uppercase tracking-wider text-right leading-tight">Lavender</span>
                            </div>
                            <h4 className="text-white text-base font-bold mb-1">Thoughtful & Calm</h4>
                            <p className="text-[#b19cd9]/70 text-[11px] leading-snug">Deeper questions for a meaningful connection.</p>
                        </div>
                    </button>

                    {/* Playful but Safe */}
                    <button 
                         onClick={() => setSelectedId(LaneId.PlayfulSafe)}
                         className={`text-left flex flex-col h-full col-span-2 transition-all duration-200 ${selectedId === LaneId.PlayfulSafe ? 'scale-[1.02] ring-2 ring-primary' : 'hover:scale-[1.01]'}`}
                    >
                        <div className="bg-surface-dark rounded-2xl p-4 flex-1 border-l-4 border-l-[#f8ad9d] flex flex-row items-center gap-4 border border-white/5">
                            <div className="size-12 shrink-0 bg-[#f8ad9d]/10 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#f8ad9d] text-2xl">celebration</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h4 className="text-white text-base font-bold">Playful but Safe</h4>
                                    <span className="text-[#f8ad9d] text-[10px] font-bold uppercase tracking-wider">Warm Peach</span>
                                </div>
                                <p className="text-[#f8ad9d]/70 text-[11px] leading-snug">Fun prompts and games with clear boundaries.</p>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="mt-auto flex flex-col items-center gap-4">
                    <button 
                        onClick={handleConfirm}
                        disabled={!selectedId}
                        className={`w-full py-4 rounded-full font-bold text-base shadow-[0_4px_20px_rgba(25,230,94,0.3)] transition-all ${
                            selectedId 
                                ? 'bg-primary text-[#112116] active:scale-[0.98] opacity-100' 
                                : 'bg-white/10 text-white/30 cursor-not-allowed opacity-50'
                        }`}
                    >
                        Select Selected Lane
                    </button>
                    <button 
                        onClick={onSkip}
                        className="text-slate-500 dark:text-[#93c8a5] font-medium text-sm hover:text-primary transition-colors py-2"
                    >
                        Skip and go to regular chat
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LaneSelection;