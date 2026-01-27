import React, { useState } from 'react';
import { LaneId, LANES } from '../types';

interface LaneSwitchSheetProps {
    currentLane: LaneId;
    onClose: () => void;
    onSwitch: (lane: LaneId) => void;
}

const LaneSwitchSheet: React.FC<LaneSwitchSheetProps> = ({ currentLane, onClose, onSwitch }) => {
    const [selected, setSelected] = useState<LaneId>(currentLane);

    return (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 animate-fade-in">
             <div className="absolute inset-0" onClick={onClose}></div>
             
             <div className="relative bg-background-light dark:bg-background-dark rounded-t-[2.5rem] shadow-2xl flex flex-col max-h-[90%] pb-8 animate-slide-up border-t border-white/10">
                {/* Handle */}
                <div className="flex h-6 w-full items-center justify-center pt-2" onClick={onClose}>
                    <div className="h-1.5 w-12 rounded-full bg-primary/20"></div>
                </div>

                <div className="mt-2">
                    <h4 className="text-primary text-xs font-bold leading-normal tracking-[0.1em] uppercase px-4 py-1 text-center">Switch Lane</h4>
                </div>

                <h2 className="text-[#112116] dark:text-white text-2xl font-bold leading-tight tracking-tight px-8 text-center pb-2 pt-2">
                    Change the Vibe
                </h2>
                
                <p className="text-gray-600 dark:text-[#93c8a5] text-sm font-normal leading-relaxed pb-4 pt-1 px-10 text-center opacity-80">
                    Select a new pace for your conversation. Your match won't be notified of the change.
                </p>

                <div className="flex-1 flex flex-col gap-3 px-6 py-2 overflow-y-auto min-h-0">
                    {Object.values(LANES).map((lane) => {
                        const isSelected = selected === lane.id;
                        return (
                            <label 
                                key={lane.id}
                                onClick={() => setSelected(lane.id)}
                                className={`flex items-center gap-4 rounded-2xl border-2 border-solid p-4 flex-row cursor-pointer transition-all 
                                    ${isSelected 
                                        ? 'border-primary bg-primary/10' 
                                        : 'border-primary/10 hover:bg-primary/5 hover:border-primary/30'
                                    }`}
                            >
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full 
                                    ${isSelected ? 'bg-primary text-background-dark' : 'bg-primary/10 text-primary'}`}>
                                    <span className={`material-symbols-outlined ${isSelected ? 'filled' : ''}`}>{lane.icon}</span>
                                </div>
                                <div className="flex grow flex-col">
                                    <p className="text-[#112116] dark:text-white text-base font-semibold leading-tight">{lane.title}</p>
                                    <p className="text-gray-500 dark:text-[#93c8a5] text-xs font-normal leading-normal opacity-80">{lane.description}</p>
                                </div>
                                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors
                                    ${isSelected ? 'border-primary' : 'border-[#346544]'}`}>
                                    {isSelected && <div className="h-3 w-3 bg-primary rounded-full"></div>}
                                </div>
                            </label>
                        );
                    })}
                </div>

                <div className="px-8 mt-6 flex flex-col items-center gap-4">
                    <button 
                        onClick={() => { onSwitch(selected); onClose(); }}
                        className="w-full bg-primary text-background-dark py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
                    >
                        Confirm Selection
                    </button>
                    <div className="flex items-center gap-2 opacity-60">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        <p className="text-[10px] text-center uppercase tracking-wider font-medium">
                            Your choice is private & won't be shared
                        </p>
                    </div>
                </div>

             </div>
        </div>
    );
};

export default LaneSwitchSheet;