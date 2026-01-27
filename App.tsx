import React, { useState } from 'react';
import { LaneId, Match, MOCK_MATCHES } from './types';
import LaneSelection from './components/LaneSelection';
import ChatScreen from './components/ChatScreen';
import LaneSwitchSheet from './components/LaneSwitchSheet';
import MatchesList from './components/MatchesList';
import BottomNav, { Tab } from './components/BottomNav';
import MyProfile from './components/MyProfile';
import ExploreStack from './components/ExploreStack';
import SplashScreen from './components/SplashScreen';
import MobileHomeScreen from './components/MobileHomeScreen';

type Screen = 'main' | 'lane_setup' | 'chat';
type SystemState = 'home' | 'app';

const App: React.FC = () => {
  const [systemState, setSystemState] = useState<SystemState>('home');
  const [showSplash, setShowSplash] = useState(true);
  
  const [screen, setScreen] = useState<Screen>('main');
  const [activeTab, setActiveTab] = useState<Tab>('explore');
  
  const [currentLane, setCurrentLane] = useState<LaneId | null>(null);
  const [initialMessage, setInitialMessage] = useState<string | undefined>(undefined);
  const [isSwitching, setIsSwitching] = useState(false);
  
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // -- Navigation Handlers --

  const launchApp = () => {
      setSystemState('app');
      setShowSplash(true); 
      setScreen('main');
  };

  const goHome = () => {
      setSystemState('home');
  };

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setScreen('lane_setup');
  };

  const handleLaneSelect = (lane: LaneId, starter?: string) => {
    setInitialMessage(starter);
    setCurrentLane(lane);
    setScreen('chat');
  };

  const handleSkip = () => {
    setCurrentLane(LaneId.LightEasy);
    setScreen('chat');
  };

  const handleBackToMatches = () => {
      setSelectedMatch(null);
      setCurrentLane(null);
      setScreen('main');
  };

  const handleBackToLane = () => {
      setScreen('lane_setup');
  };

  const handleExploreMatch = (profile: Match) => {
      if (!matches.find(m => m.id === profile.id)) {
          setMatches(prev => [profile, ...prev]);
      }
  };

  // -- Android Navigation Logic --

  const handleAndroidBack = () => {
      if (systemState === 'home') return; // Do nothing on home screen

      if (screen === 'chat') {
          handleBackToLane();
      } else if (screen === 'lane_setup') {
          handleBackToMatches();
      } else if (screen === 'main') {
          // If on main screen, close app (go home)
          goHome();
      }
  };

  return (
    <div className="h-full w-full bg-[#000000] flex justify-center items-center font-sans">
        {/* Mobile Container Simulation */}
        <div className="h-full w-full max-w-md bg-background-light dark:bg-background-dark overflow-hidden relative shadow-2xl flex flex-col sm:rounded-[30px] sm:border-[8px] sm:border-black sm:h-[95vh]">
            
            {/* Viewport Area - Where App/Home resides */}
            <div className="flex-1 relative w-full overflow-hidden">
                {systemState === 'home' ? (
                    <MobileHomeScreen onLaunchApp={launchApp} />
                ) : (
                    <>
                        {showSplash ? (
                            <SplashScreen onFinish={() => setShowSplash(false)} />
                        ) : (
                            <div className="h-full w-full flex flex-col relative animate-fade-in">
                                {/* Main Tabbed View */}
                                {screen === 'main' && (
                                    <>
                                        <main className="flex-1 overflow-hidden relative">
                                            {activeTab === 'explore' && (
                                                <ExploreStack onMatch={handleExploreMatch} />
                                            )}
                                            {activeTab === 'matches' && (
                                                <MatchesList onSelectMatch={handleMatchSelect} />
                                            )}
                                            {activeTab === 'profile' && (
                                                <MyProfile />
                                            )}
                                        </main>
                                        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
                                    </>
                                )}

                                {/* Full Screen Overlays */}

                                {screen === 'lane_setup' && selectedMatch && (
                                    <div className="absolute inset-0 z-40 bg-background-dark animate-fade-in">
                                        <LaneSelection 
                                            match={selectedMatch}
                                            onSelect={handleLaneSelect} 
                                            onSkip={handleSkip} 
                                            onBack={handleBackToMatches}
                                        />
                                    </div>
                                )}

                                {screen === 'chat' && currentLane && selectedMatch && (
                                    <div className="absolute inset-0 z-40 bg-background-dark animate-fade-in">
                                        <ChatScreen 
                                            laneId={currentLane} 
                                            match={selectedMatch}
                                            onChangeLane={() => setIsSwitching(true)} 
                                            onBack={handleBackToLane}
                                            initialMessage={initialMessage}
                                        />
                                    </div>
                                )}

                                {/* Sheets */}
                                {isSwitching && currentLane && (
                                    <LaneSwitchSheet 
                                        currentLane={currentLane}
                                        onClose={() => setIsSwitching(false)}
                                        onSwitch={(lane) => setCurrentLane(lane)}
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Android Navigation Bar - Persistent */}
            <div className="h-12 bg-black w-full shrink-0 flex items-center justify-around z-[100] border-t border-white/5">
                 <button 
                    onClick={handleAndroidBack}
                    className="flex items-center justify-center size-12 active:opacity-50"
                 >
                     {/* Back Icon (Triangle) */}
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M15 19L7 12L15 5" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                 </button>

                 <button 
                    onClick={goHome}
                    className="flex items-center justify-center size-12 active:opacity-50"
                 >
                     {/* Home Icon (Circle) */}
                     <div className="size-4 rounded-full border-2 border-slate-200"></div>
                 </button>

                 <button 
                    className="flex items-center justify-center size-12 active:opacity-50"
                 >
                     {/* Overview Icon (Square) */}
                     <div className="size-4 rounded-[2px] border-2 border-slate-200"></div>
                 </button>
            </div>

        </div>
    </div>
  );
};

export default App;