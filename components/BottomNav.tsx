import React from 'react';

export type Tab = 'explore' | 'matches' | 'profile';

interface BottomNavProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="absolute bottom-0 left-0 right-0 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-white/5 pb-2 pt-2 z-50 px-6">
            <div className="flex justify-between items-center h-16">
                <button 
                    onClick={() => onTabChange('explore')}
                    className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'explore' ? 'text-primary' : 'text-slate-400 dark:text-white/40'}`}
                >
                    <span className={`material-symbols-outlined text-[28px] ${activeTab === 'explore' ? 'filled' : ''}`}>style</span>
                    <span className="text-[10px] font-medium tracking-wide">Explore</span>
                </button>

                <button 
                    onClick={() => onTabChange('matches')}
                    className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'matches' ? 'text-primary' : 'text-slate-400 dark:text-white/40'}`}
                >
                    <span className={`material-symbols-outlined text-[28px] ${activeTab === 'matches' ? 'filled' : ''}`}>chat_bubble</span>
                    <span className="text-[10px] font-medium tracking-wide">Matches</span>
                </button>

                <button 
                    onClick={() => onTabChange('profile')}
                    className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'profile' ? 'text-primary' : 'text-slate-400 dark:text-white/40'}`}
                >
                    <span className={`material-symbols-outlined text-[28px] ${activeTab === 'profile' ? 'filled' : ''}`}>person</span>
                    <span className="text-[10px] font-medium tracking-wide">Profile</span>
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;