import React from 'react';

interface FilterSheetProps {
    onClose: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 animate-fade-in">
             <div className="absolute inset-0" onClick={onClose}></div>
             
             <div className="relative bg-background-light/90 dark:bg-surface-dark/95 backdrop-blur-xl rounded-t-[2.5rem] shadow-2xl flex flex-col max-h-[85%] pb-8 animate-slide-up border-t border-white/10">
                {/* Handle */}
                <div className="flex h-6 w-full items-center justify-center pt-2" onClick={onClose}>
                    <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-white/20"></div>
                </div>

                <div className="px-6 pt-2 pb-6 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#112116] dark:text-white">Filters</h2>
                        <button onClick={onClose} className="text-sm text-primary font-medium">Done</button>
                    </div>

                    <div className="space-y-8">
                        {/* Gender */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60">Interested In</h3>
                            <div className="flex gap-3">
                                {['Men', 'Women', 'Everyone'].map((opt, i) => (
                                    <button key={i} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors border ${i === 1 ? 'bg-primary text-background-dark border-primary' : 'bg-slate-200 dark:bg-white/5 border-transparent dark:border-white/10 text-slate-700 dark:text-slate-300'}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Location Range */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60">Distance</h3>
                                <span className="text-xs font-medium text-slate-900 dark:text-white">Up to 15km</span>
                            </div>
                            <input type="range" className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" />
                        </div>

                         {/* Age Range */}
                         <div className="space-y-3">
                            <div className="flex justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60">Age Range</h3>
                                <span className="text-xs font-medium text-slate-900 dark:text-white">22 - 28</span>
                            </div>
                             <div className="relative h-1 bg-slate-200 dark:bg-white/10 rounded-lg flex items-center">
                                 <div className="absolute left-[20%] right-[30%] h-1 bg-primary rounded-lg"></div>
                                 <div className="absolute left-[20%] size-4 bg-white rounded-full shadow-md border border-slate-200"></div>
                                 <div className="absolute right-[30%] size-4 bg-white rounded-full shadow-md border border-slate-200"></div>
                             </div>
                        </div>
                    </div>
                    
                    <button onClick={onClose} className="w-full mt-10 py-4 rounded-full bg-primary text-background-dark font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform">
                        Apply Filters
                    </button>
                </div>
             </div>
        </div>
    );
};

export default FilterSheet;