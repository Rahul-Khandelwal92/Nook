import React from 'react';
import { Match } from '../types';

interface ProfileSheetProps {
    match: Match;
    onClose: () => void;
}

const ProfileSheet: React.FC<ProfileSheetProps> = ({ match, onClose }) => {
    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-background-dark animate-fade-in overflow-hidden">
             {/* Header Image Area */}
             <div className="relative h-[50%] w-full">
                 <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${match.avatar}')` }}
                 >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background-dark"></div>
                 </div>
                 
                 <button 
                    onClick={onClose}
                    className="absolute top-4 left-4 size-10 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md z-10 hover:bg-black/60 transition-colors"
                 >
                    <span className="material-symbols-outlined">expand_more</span>
                 </button>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto px-6 -mt-12 relative z-10 pb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-white leading-tight drop-shadow-md">
                        {match.name}, {match.age}
                    </h1>
                    
                    <div className="flex items-center gap-4 mt-2 text-white/80">
                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                             <span className="material-symbols-outlined text-sm text-primary">work</span>
                             <span className="text-xs font-medium uppercase tracking-wide">{match.job}</span>
                        </div>
                         <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                             <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                             <span className="text-xs font-medium uppercase tracking-wide">{match.location}</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">About Me</h3>
                        <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-primary/30 pl-4 py-1">
                            {match.bio}
                        </p>
                    </div>

                    <div className="mt-8">
                         <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Interests</h3>
                         <div className="flex flex-wrap gap-2">
                            {match.interests.map((interest, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-200 text-xs font-medium hover:bg-white/10 transition-colors cursor-default">
                                    {interest}
                                </span>
                            ))}
                         </div>
                    </div>
                    
                    {/* Placeholder for more photos */}
                     <div className="mt-8 grid grid-cols-2 gap-2">
                        <div className="aspect-[3/4] rounded-lg bg-white/5 animate-pulse flex items-center justify-center">
                            <span className="material-symbols-outlined text-white/10 text-4xl">image</span>
                        </div>
                        <div className="aspect-[3/4] rounded-lg bg-white/5 animate-pulse flex items-center justify-center">
                            <span className="material-symbols-outlined text-white/10 text-4xl">image</span>
                        </div>
                     </div>
                </div>
             </div>
        </div>
    );
};

export default ProfileSheet;