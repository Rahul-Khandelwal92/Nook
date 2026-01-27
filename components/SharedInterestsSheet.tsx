import React, { useEffect, useState } from 'react';
import { generateIcebreakers } from '../services/geminiService';

interface SharedInterestsSheetProps {
    interests: string[];
    onClose: () => void;
    onSelectStarter: (text: string) => void;
}

const SharedInterestsSheet: React.FC<SharedInterestsSheetProps> = ({ interests, onClose, onSelectStarter }) => {
    const [icebreakers, setIcebreakers] = useState<string[]>([]);
    const [loadingIcebreakers, setLoadingIcebreakers] = useState(true);

    useEffect(() => {
        setLoadingIcebreakers(true);
        generateIcebreakers(interests)
            .then(starters => {
                setIcebreakers(starters);
                setLoadingIcebreakers(false);
            })
            .catch(() => setLoadingIcebreakers(false));
    }, [interests]);

    return (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 animate-fade-in">
             <div className="absolute inset-0" onClick={onClose}></div>
             
             <div className="relative bg-background-light dark:bg-background-dark rounded-t-[2.5rem] shadow-2xl flex flex-col max-h-[85%] pb-8 animate-slide-up border-t border-white/10">
                {/* Handle */}
                <div className="flex h-6 w-full items-center justify-center pt-2" onClick={onClose}>
                    <div className="h-1.5 w-12 rounded-full bg-primary/20"></div>
                </div>

                <div className="px-6 pt-2 pb-6 flex-1 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary">favorite</span>
                        <h2 className="text-xl font-bold text-[#112116] dark:text-white">Shared Interests</h2>
                    </div>

                    <div className="bg-surface-dark border border-white/5 rounded-2xl p-4 shadow-sm mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">You both like</h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {interests.map((interest, i) => (
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
                                            onClick={() => onSelectStarter(starter)}
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
             </div>
        </div>
    );
};

export default SharedInterestsSheet;