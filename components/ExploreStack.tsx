import React, { useState, useEffect } from 'react';
import { MOCK_EXPLORE_PROFILES, Match } from '../types';
import ProfileSheet from './ProfileSheet';
import FilterSheet, { FilterState } from './FilterSheet';

interface ExploreStackProps {
    onMatch: (profile: Match) => void;
}

const ExploreStack: React.FC<ExploreStackProps> = ({ onMatch }) => {
    // Initial Profiles
    const [profiles, setProfiles] = useState<Match[]>(MOCK_EXPLORE_PROFILES);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastDirection, setLastDirection] = useState<'left' | 'right' | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [showProfileDetails, setShowProfileDetails] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Filter State
    const [filters, setFilters] = useState<FilterState>({
        interestedIn: 'Everyone',
        distance: 20,
        ageRange: [18, 50]
    });

    const currentProfile = profiles[currentIndex];
    const nextProfile = profiles[currentIndex + 1];

    const applyFilters = (newFilters: FilterState) => {
        setFilters(newFilters);
        setIsRefreshing(true);
        setShowFilters(false); // Ensure sheet closes immediately

        // Simulate network/processing delay for visual feedback
        setTimeout(() => {
            const filtered = MOCK_EXPLORE_PROFILES.filter(p => {
                 // Gender
                 if (newFilters.interestedIn === 'Men' && p.gender !== 'male') return false;
                 if (newFilters.interestedIn === 'Women' && p.gender !== 'female') return false;
                 
                 // Distance
                 if (p.distance > newFilters.distance) return false;

                 // Age
                 if (p.age < newFilters.ageRange[0] || p.age > newFilters.ageRange[1]) return false;

                 return true;
            });
            setProfiles(filtered);
            setCurrentIndex(0); // Reset stack
            setIsRefreshing(false);
        }, 800);
    };

    const handleSwipe = (direction: 'left' | 'right') => {
        setLastDirection(direction);
        
        // Wait for animation
        setTimeout(() => {
            if (direction === 'right' && currentProfile) {
                onMatch(currentProfile);
            }
            setCurrentIndex(prev => prev + 1);
            setLastDirection(null);
        }, 300);
    };

    if (isRefreshing) {
        return (
            <div className="relative h-full w-full overflow-hidden p-4 pb-24 flex flex-col items-center justify-center animate-fade-in">
                 <header className="absolute top-2 left-0 right-0 flex justify-between items-center px-4 py-2 mb-2 z-10">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Nook <span className="text-primary text-4xl leading-none">.</span>
                    </h1>
                </header>
                
                 <div className="relative size-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary animate-pulse text-3xl">radar</span>
                    </div>
                </div>
                <p className="text-slate-500 dark:text-white/60 text-sm font-medium tracking-wide animate-pulse">
                    Curating profiles...
                </p>
            </div>
        );
    }

    if (!currentProfile) {
        return (
            <div className="flex flex-col items-center justify-center h-full pb-20 p-8 text-center animate-fade-in relative">
                 <header className="absolute top-2 left-0 right-0 flex justify-between items-center px-4 py-2 mb-2 z-10">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Nook <span className="text-primary text-4xl leading-none">.</span>
                    </h1>
                    <button 
                        onClick={() => setShowFilters(true)}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10"
                    >
                        <span className="material-symbols-outlined">tune</span>
                    </button>
                </header>

                <div className="size-24 rounded-full bg-surface-dark flex items-center justify-center mb-6 animate-bounce">
                    <span className="material-symbols-outlined text-4xl text-primary">radar</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No profiles found</h2>
                <p className="text-white/60 mb-8">Try adjusting your filters to see more people.</p>
                <button 
                    onClick={() => setShowFilters(true)}
                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-primary hover:bg-white/10 transition-colors"
                >
                    Adjust Filters
                </button>
                
                {showFilters && (
                    <FilterSheet 
                        onClose={() => setShowFilters(false)} 
                        currentFilters={filters}
                        onApply={applyFilters}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="relative h-full w-full overflow-hidden p-4 pb-24 flex flex-col">
            <header className="flex justify-between items-center px-2 py-2 mb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Nook <span className="text-primary text-4xl leading-none">.</span>
                </h1>
                <button 
                    onClick={() => setShowFilters(true)}
                    className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10"
                >
                    <span className="material-symbols-outlined">tune</span>
                </button>
            </header>

            <div className="relative flex-1 w-full max-w-sm mx-auto">
                {/* Next Card (Background) */}
                {nextProfile && (
                    <div className={`absolute inset-0 rounded-3xl overflow-hidden bg-surface-dark transform transition-all duration-300 ease-out border border-white/5
                         ${lastDirection ? 'scale-100 opacity-100' : 'scale-[0.92] translate-y-3 opacity-60'}
                    `}>
                         <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${nextProfile.avatar}')` }}
                        ></div>
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                )}

                {/* Current Card */}
                <div 
                    className={`absolute inset-0 rounded-3xl overflow-hidden bg-black shadow-2xl transition-transform duration-300 ease-out border border-white/10 will-change-transform z-10
                        ${lastDirection === 'left' ? '-translate-x-[150%] -rotate-[15deg]' : ''}
                        ${lastDirection === 'right' ? 'translate-x-[150%] rotate-[15deg]' : ''}
                    `}
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${currentProfile.avatar}')` }}
                    >
                         <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90"></div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 pb-24 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-3xl font-bold">{currentProfile.name}</h2>
                            <span className="text-2xl font-medium opacity-90">{currentProfile.age}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm font-medium text-white/80 mb-3">
                             <span className="material-symbols-outlined text-base">work</span>
                             <span>{currentProfile.job}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {currentProfile.interests.slice(0, 3).map((interest, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold border border-white/10">
                                    {interest}
                                </span>
                            ))}
                        </div>

                        <p className="text-sm leading-relaxed text-white/90 line-clamp-2 opacity-90">
                            {currentProfile.bio}
                        </p>
                    </div>

                    {/* Action Buttons Overlay */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6 z-20">
                         <button 
                            onClick={() => handleSwipe('left')}
                            className="size-14 rounded-full bg-black/40 backdrop-blur-md border-2 border-[#ff4b4b] text-[#ff4b4b] flex items-center justify-center hover:bg-[#ff4b4b] hover:text-white transition-all active:scale-90"
                        >
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>

                        <button 
                            onClick={() => setShowProfileDetails(true)}
                            className="size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
                        >
                            <span className="material-symbols-outlined text-xl">info</span>
                        </button>

                        <button 
                            onClick={() => handleSwipe('right')}
                            className="size-14 rounded-full bg-black/40 backdrop-blur-md border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all active:scale-90"
                        >
                            <span className="material-symbols-outlined text-3xl">favorite</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sheets */}
            {showFilters && (
                <FilterSheet 
                    onClose={() => setShowFilters(false)} 
                    currentFilters={filters}
                    onApply={applyFilters}
                />
            )}

            {showProfileDetails && currentProfile && (
                <ProfileSheet 
                    match={currentProfile} 
                    onClose={() => setShowProfileDetails(false)} 
                />
            )}
        </div>
    );
};

export default ExploreStack;