import React from 'react';
import { MOCK_USER } from '../types';

const MyProfile: React.FC = () => {
    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto bg-background-light dark:bg-background-dark overflow-y-auto pb-24">
            {/* Header/Cover */}
            <div className="relative h-64 w-full shrink-0">
                 <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${MOCK_USER.avatar}')` }}
                 >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background-light dark:to-background-dark"></div>
                 </div>
                 <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent">
                     <div className="flex justify-between items-end">
                         <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight drop-shadow-sm">
                                {MOCK_USER.name}, {MOCK_USER.age}
                            </h1>
                            <p className="text-slate-600 dark:text-white/60 text-sm font-medium">{MOCK_USER.job}</p>
                         </div>
                         <button className="size-10 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                             <span className="material-symbols-outlined">edit</span>
                         </button>
                     </div>
                 </div>
            </div>

            <div className="px-6 space-y-8 animate-fade-in">
                {/* Stats */}
                <div className="flex justify-between items-center bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex flex-col items-center flex-1 border-r border-slate-200 dark:border-white/10">
                         <span className="text-lg font-bold text-primary">85%</span>
                         <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40">Profile Complete</span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                         <span className="text-lg font-bold text-white">12</span>
                         <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-white/40">Matches</span>
                    </div>
                </div>

                {/* About */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">person</span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60">About Me</h3>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                        {MOCK_USER.bio}
                    </p>
                </div>

                {/* Location */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                         <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                         <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60">Location</h3>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm">
                         <p>{MOCK_USER.location}</p>
                    </div>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                         <span className="material-symbols-outlined text-primary text-lg">favorite</span>
                         <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60">Interests</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {MOCK_USER.interests.map((interest, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-200 text-xs font-medium">
                                {interest}
                            </span>
                        ))}
                         <button className="px-3 py-1.5 rounded-full border border-dashed border-slate-300 dark:border-white/20 text-slate-400 dark:text-white/40 text-xs font-medium hover:text-primary hover:border-primary transition-colors">
                            + Add Interest
                        </button>
                    </div>
                </div>

                {/* Settings Link */}
                <div className="pt-4 border-t border-slate-200 dark:border-white/5">
                    <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">App Settings</span>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;