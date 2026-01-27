import React, { useState } from 'react';
import { LaneId, Match, MOCK_MATCHES } from './types';
import LaneSelection from './components/LaneSelection';
import ChatScreen from './components/ChatScreen';
import LaneSwitchSheet from './components/LaneSwitchSheet';
import MatchesList from './components/MatchesList';
import BottomNav, { Tab } from './components/BottomNav';
import MyProfile from './components/MyProfile';
import ExploreStack from './components/ExploreStack';

type Screen = 'main' | 'lane_setup' | 'chat';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('main');
  const [activeTab, setActiveTab] = useState<Tab>('explore');
  
  const [currentLane, setCurrentLane] = useState<LaneId | null>(null);
  const [initialMessage, setInitialMessage] = useState<string | undefined>(undefined);
  const [isSwitching, setIsSwitching] = useState(false);
  
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // -- Navigation Handlers --

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
      // If we were in lane setup from Explore, user might expect to go back to explore, 
      // but 'Matches' is also a safe fallback. 
      // Let's stick to 'matches' tab if we were chatting, 
      // or 'explore' if we just matched? 
      // For simplicity, just going back to main view.
  };

  const handleBackToLane = () => {
      setScreen('lane_setup');
  };

  const handleExploreMatch = (profile: Match) => {
      // Add to matches list if not already there
      if (!matches.find(m => m.id === profile.id)) {
          setMatches(prev => [profile, ...prev]);
      }
      // Optional: Trigger a "It's a Match" popup? 
      // For now, just silently add and maybe switch tab or show notification.
      // Let's auto-switch to matches tab to show progress?
      // Or just stay on explore. Staying on explore is better UX typically.
  };

  return (
    <div className="h-full w-full bg-black flex justify-center items-center">
        {/* Mobile Container Simulation */}
        <div className="h-full w-full max-w-md bg-background-light dark:bg-background-dark overflow-hidden relative shadow-2xl flex flex-col">
            
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
                <div className="absolute inset-0 z-50 bg-background-dark">
                    <LaneSelection 
                        match={selectedMatch}
                        onSelect={handleLaneSelect} 
                        onSkip={handleSkip} 
                        onBack={handleBackToMatches}
                    />
                </div>
            )}

            {screen === 'chat' && currentLane && selectedMatch && (
                <div className="absolute inset-0 z-50 bg-background-dark">
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
    </div>
  );
};

export default App;