import React from 'react';
import { Match, MOCK_MATCHES } from '../types';

interface MatchesListProps {
    onSelectMatch: (match: Match) => void;
}

const MatchesList: React.FC<MatchesListProps> = ({ onSelectMatch }) => {
    // In a real app, matches would be passed as a prop from App state. 
    // Using global mock for now, but ensure we render the list correctly.
    
    return (
        <div className="flex flex-col h-full w-full bg-background-light dark:bg-background-dark overflow-y-auto pb-20">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-white/5">
                <h1 className="text-2xl font-bold text-[#112116] dark:text-white">Matches</h1>
                <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </header>

            <main className="flex-1 p-4">
                <div className="space-y-2">
                    {MOCK_MATCHES.map((match) => (
                        <div 
                            key={match.id}
                            onClick={() => onSelectMatch(match)}
                            className={`flex items-center gap-4 p-3 rounded-2xl border transition-all cursor-pointer animate-fade-in active:scale-[0.98]
                                ${match.unread 
                                    ? 'bg-primary/5 border-primary/20 shadow-md' 
                                    : 'bg-white dark:bg-surface-dark border-slate-100 dark:border-white/5 shadow-sm'
                                }`}
                        >
                            <div className="relative shrink-0">
                                <div 
                                    className="size-16 rounded-full bg-cover bg-center border border-white/10"
                                    style={{ backgroundImage: `url('${match.avatar}')` }}
                                ></div>
                                {match.isOnline && (
                                    <div className="absolute bottom-0 right-0 size-3.5 bg-primary border-2 border-surface-light dark:border-surface-dark rounded-full"></div>
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`text-lg text-slate-900 dark:text-white truncate ${match.unread ? 'font-black' : 'font-bold'}`}>
                                        {match.name}
                                    </h3>
                                    <span className={`text-[11px] font-medium tracking-wide ${match.unread ? 'text-primary' : 'text-slate-400 dark:text-white/30'}`}>
                                        {match.lastActive || 'Recently'}
                                    </span>
                                </div>
                                
                                {match.lastMessage ? (
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm truncate pr-2 ${match.unread ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                                            {match.lastMessage}
                                        </p>
                                        {match.unread && (
                                            <div className="size-2.5 rounded-full bg-primary shrink-0"></div>
                                        )}
                                    </div>
                                ) : (
                                    /* New Match State (No messages yet) */
                                    <div className="flex flex-col gap-1">
                                         <p className="text-sm text-slate-500 dark:text-slate-400 truncate pr-2 italic">
                                            Start the conversation...
                                        </p>
                                        <div className="flex gap-1.5 overflow-hidden">
                                            {match.interests.slice(0, 2).map((interest, i) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 whitespace-nowrap">
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {!match.lastMessage && (
                                <div className="shrink-0 text-slate-300 dark:text-white/20">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MatchesList;