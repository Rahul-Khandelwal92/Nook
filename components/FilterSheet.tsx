import React, { useState } from 'react';

export interface FilterState {
    interestedIn: string; // 'Men', 'Women', 'Everyone'
    distance: number;
    ageRange: [number, number];
}

interface FilterSheetProps {
    onClose: () => void;
    currentFilters: FilterState;
    onApply: (filters: FilterState) => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ onClose, currentFilters, onApply }) => {
    const [interestedIn, setInterestedIn] = useState(currentFilters.interestedIn);
    const [distance, setDistance] = useState(currentFilters.distance);
    const [ageRange, setAgeRange] = useState<[number, number]>(currentFilters.ageRange);

    // Constants for Age Range
    const MIN_AGE = 18;
    const MAX_AGE = 50;

    const handleAgeChange = (index: 0 | 1, value: number) => {
        const newRange = [...ageRange];
        newRange[index] = value;
        // Simple constraint to prevent crossing
        if (index === 0 && newRange[0] >= newRange[1]) newRange[0] = newRange[1] - 1;
        if (index === 1 && newRange[1] <= newRange[0]) newRange[1] = newRange[0] + 1;
        setAgeRange(newRange as [number, number]);
    };

    const handleApply = () => {
        onApply({
            interestedIn,
            distance,
            ageRange
        });
        onClose();
    };

    // Calculate percentages for the age slider visuals
    const getPercent = (value: number) => Math.round(((value - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100);
    const minPercent = getPercent(ageRange[0]);
    const maxPercent = getPercent(ageRange[1]);

    return (
        <div className="absolute inset-0 z-[60] flex flex-col justify-end bg-black/60 animate-fade-in">
             <div className="absolute inset-0" onClick={onClose}></div>
             
             <div className="relative bg-background-light/90 dark:bg-surface-dark/95 backdrop-blur-xl rounded-t-[2.5rem] shadow-2xl flex flex-col max-h-[85%] animate-slide-up border-t border-white/10">
                {/* Handle */}
                <div className="flex h-6 w-full items-center justify-center pt-2 shrink-0" onClick={onClose}>
                    <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-white/20"></div>
                </div>

                {/* Header */}
                <div className="px-6 pt-2 pb-4 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold text-[#112116] dark:text-white">Filters</h2>
                    <button onClick={handleApply} className="text-sm text-primary font-medium">Done</button>
                </div>

                {/* Scrollable Content */}
                <div className="px-6 pb-6 flex-1 overflow-y-auto">
                    <div className="space-y-8">
                        {/* Gender */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60">Interested In</h3>
                            <div className="flex gap-3">
                                {['Men', 'Women', 'Everyone'].map((opt) => (
                                    <button 
                                        key={opt} 
                                        onClick={() => setInterestedIn(opt)}
                                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 border 
                                            ${interestedIn === opt 
                                                ? 'bg-primary text-background-dark border-primary shadow-lg shadow-primary/20' 
                                                : 'bg-slate-200 dark:bg-white/5 border-transparent dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/10'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Location Range */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60">Distance</h3>
                                <span className="text-xs font-medium text-slate-900 dark:text-white">Up to {distance}km</span>
                            </div>
                            <div className="relative flex items-center h-6">
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="50" 
                                    value={distance}
                                    onChange={(e) => setDistance(parseInt(e.target.value))}
                                    className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" 
                                />
                            </div>
                        </div>

                         {/* Age Range */}
                         <div className="space-y-3">
                            <div className="flex justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60">Age Range</h3>
                                <span className="text-xs font-medium text-slate-900 dark:text-white">{ageRange[0]} - {ageRange[1]}</span>
                            </div>
                            
                            <div className="relative h-6 flex items-center">
                                {/* Visual Track */}
                                <div className="absolute w-full h-1 bg-slate-200 dark:bg-white/10 rounded-lg overflow-hidden">
                                     {/* Active Range */}
                                     <div 
                                        className="absolute h-full bg-primary"
                                        style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                                     ></div>
                                </div>

                                {/* Input Thumbs (Stacked) */}
                                <input 
                                    type="range" 
                                    min={MIN_AGE} 
                                    max={MAX_AGE} 
                                    value={ageRange[0]} 
                                    onChange={(e) => handleAgeChange(0, Math.min(parseInt(e.target.value), ageRange[1] - 1))}
                                    className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none"
                                />
                                <input 
                                    type="range" 
                                    min={MIN_AGE} 
                                    max={MAX_AGE} 
                                    value={ageRange[1]} 
                                    onChange={(e) => handleAgeChange(1, Math.max(parseInt(e.target.value), ageRange[0] + 1))}
                                    className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer with Apply Button - Fixed to bottom of sheet */}
                <div className="p-6 pt-2 shrink-0 border-t border-slate-100 dark:border-white/5 mt-auto">
                    <button 
                        onClick={handleApply} 
                        className="w-full py-4 rounded-full bg-primary text-background-dark font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform hover:brightness-110"
                    >
                        Apply Filters
                    </button>
                </div>
             </div>
        </div>
    );
};

export default FilterSheet;