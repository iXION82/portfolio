import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.random() * 12 + 3;
        return Math.min(prev + increment, 100);
      });
    }, 180);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setFadeOut(true), 600);
      const done = setTimeout(() => onComplete(), 1400);
      return () => {
        clearTimeout(timer);
        clearTimeout(done);
      };
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: '#05050f' }}
    >
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.08) 2px,
            rgba(0,0,0,0.08) 4px
          )`,
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? '#7c4dff' : i % 3 === 1 ? '#22d3ee' : '#e040fb',
              opacity: Math.random() * 0.5 + 0.2,
              animation: `loadingFloat ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>


      <div className="relative w-72 md:w-96 mb-8">
        
        <div className="h-[3px] w-full rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #7c4dff, #22d3ee, #e040fb)',
              boxShadow: '0 0 12px rgba(34,211,238,0.6), 0 0 30px rgba(124,77,255,0.3)',
            }}
          />
        </div>
        <div className="flex justify-between mt-3">
          <span className="font-pixel text-[10px] text-gray-500 tracking-widest">INITIALIZING</span>
          <span className="font-pixel text-[10px] text-cyan-400">{Math.floor(progress)}%</span>
        </div>
      </div>

      <p className="font-pixel text-[10px] text-gray-600 tracking-wider mb-10 h-4">
        {progress < 25
          ? 'LOADING STAR SYSTEMS...'
          : progress < 50
          ? 'CALIBRATING NAVIGATION...'
          : progress < 75
          ? 'POWERING UP ENGINES...'
          : progress < 100
          ? 'ENTERING ORBIT...'
          : 'LAUNCH READY'}
      </p>

      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 transition-opacity duration-500"
        style={{ opacity: progress > 30 ? 1 : 0 }}
      >
        <div className="flex items-center gap-2">
          <span
            className="font-pixel text-[11px] px-3 py-1.5 rounded border"
            style={{
              color: '#e040fb',
              borderColor: 'rgba(224,64,251,0.3)',
              background: 'rgba(224,64,251,0.08)',
              boxShadow: '0 0 10px rgba(224,64,251,0.15)',
            }}
          >
            HOLD F
          </span>
          <span className="font-pixel text-[10px] text-gray-500">TO SHOOT</span>
        </div>
      </div>

      <style>{`
        @keyframes loadingFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
