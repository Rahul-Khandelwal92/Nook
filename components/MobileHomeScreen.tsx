import React, { useState, useEffect } from 'react';

interface MobileHomeScreenProps {
    onLaunchApp: () => void;
}

const MobileHomeScreen: React.FC<MobileHomeScreenProps> = ({ onLaunchApp }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full w-full bg-cover bg-center relative flex flex-col overflow-hidden animate-fade-in"
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')" }}>
            
            {/* Status Bar Overlay */}
            <div className="w-full h-12 flex justify-between items-end px-6 pb-2 text-white text-xs font-medium z-10 bg-gradient-to-b from-black/30 to-transparent">
                <span className="tracking-wide">{time}</span>
                <div className="flex gap-1.5 items-center">
                    <span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
                    <span className="material-symbols-outlined text-[16px]">wifi</span>
                    <span className="material-symbols-outlined text-[16px]">battery_full</span>
                </div>
            </div>

            {/* App Grid */}
            <div className="flex-1 px-5 pt-10 grid grid-cols-4 gap-x-2 gap-y-6 content-start">
                
                {/* Dummy Apps */}
                <AppIcon icon="mail" color="bg-blue-500" label="Mail" />
                <AppIcon icon="calendar_today" color="bg-white text-black" label="Calendar" />
                <AppIcon icon="photo_library" color="bg-white text-black" label="Photos" />
                <AppIcon icon="settings" color="bg-gray-600" label="Settings" />
                
                {/* Nook App Icon */}
                <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={onLaunchApp}>
                    <div className="size-[60px] rounded-[14px] bg-background-dark flex items-center justify-center shadow-xl group-active:scale-90 transition-transform duration-200 relative overflow-hidden border border-white/10">
                         {/* Icon Gradient/Design */}
                         <div className="absolute inset-0 bg-gradient-to-br from-[#19e65e] to-[#112116] opacity-20"></div>
                         <h1 className="relative text-primary text-3xl font-bold tracking-tighter z-10">N<span className="text-white">.</span></h1>
                    </div>
                    <span className="text-white text-[11px] font-medium drop-shadow-md tracking-tight">Nook</span>
                </div>

                <AppIcon icon="map" color="bg-green-600" label="Maps" />
                <AppIcon icon="music_note" color="bg-red-500" label="Music" />
                <AppIcon icon="check_circle" color="bg-blue-400" label="Reminders" />
                <AppIcon icon="cloud" color="bg-sky-400" label="Weather" />
                <AppIcon icon="wallet" color="bg-black border border-white/20" label="Wallet" />
            </div>

            {/* Page Dots */}
            <div className="flex justify-center gap-2 mb-6">
                <div className="size-1.5 bg-white rounded-full"></div>
                <div className="size-1.5 bg-white/40 rounded-full"></div>
            </div>

            {/* Dock */}
            <div className="mx-4 mb-4 p-4 rounded-[35px] bg-white/20 backdrop-blur-xl border border-white/10 flex justify-between items-center px-6">
                <AppIcon icon="call" color="bg-green-500" size={54} />
                <AppIcon icon="chat_bubble" color="bg-green-500" size={54} />
                <AppIcon icon="explore" color="bg-blue-500" size={54} />
                <AppIcon icon="public" color="bg-blue-400" size={54} />
            </div>
        </div>
    );
};

const AppIcon = ({ icon, color, label, size = 60 }: any) => (
    <div className="flex flex-col items-center gap-1.5 opacity-100 transition-opacity cursor-pointer active:brightness-75">
        <div className={`${color} flex items-center justify-center rounded-[14px] shadow-lg`} style={{ width: size, height: size }}>
            <span className="material-symbols-outlined text-white text-[28px]">{icon}</span>
        </div>
        {label && <span className="text-white text-[11px] font-medium drop-shadow-md tracking-tight">{label}</span>}
    </div>
);

export default MobileHomeScreen;