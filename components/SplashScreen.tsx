import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        // Start fade out animation slightly before finishing
        const timer1 = setTimeout(() => {
            setAnimateOut(true);
        }, 2200);

        // Actually unmount
        const timer2 = setTimeout(() => {
            onFinish();
        }, 2600);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onFinish]);

    return (
        <div className={`absolute inset-0 z-[100] bg-background-dark flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${animateOut ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
            <div className="relative flex flex-col items-center animate-slide-up">
                 {/* Glow effect */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-[60px] rounded-full animate-pulse"></div>
                 
                 <h1 className="relative text-7xl font-bold text-white tracking-tighter flex items-baseline z-10 drop-shadow-2xl">
                    Nook<span className="text-primary text-8xl leading-none animate-bounce" style={{ animationDuration: '2s' }}>.</span>
                </h1>
                
                <div className="mt-8 relative z-10 overflow-hidden">
                    <p className="text-white/80 text-sm font-medium tracking-[0.3em] uppercase animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        Find your rhythm
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;