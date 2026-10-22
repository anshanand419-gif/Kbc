import React from 'react';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { speechManager } from '../utils/speech';

interface NavbarProps {
  activeTab: 'game' | 'database' | 'json' | 'rules';
  setActiveTab: (tab: 'game' | 'database' | 'json' | 'rules') => void;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  isVoiceEnabled: boolean;
  setIsVoiceEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  totalQuestionsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
  isVoiceEnabled,
  setIsVoiceEnabled,
  totalQuestionsCount,
}) => {
  const toggleSound = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
  };

  const toggleVoice = () => {
    const next = speechManager.toggleEnabled();
    setIsVoiceEnabled(next);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-950/40 bg-[#060c24]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('game')}
          className="text-base sm:text-lg font-cinzel font-black tracking-widest text-amber-300 whitespace-nowrap shrink-0 hover:text-amber-200 transition-colors"
        >
          KBC WITH ANSH ANAND
        </button>

        {/* Zone 2: Clean single-line text links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('game')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'game'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-100'
            }`}
          >
            Hotseat Game
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'database'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-100'
            }`}
          >
            Database ({totalQuestionsCount})
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'json'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-100'
            }`}
          >
            JSON Raw Export
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'rules'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-100'
            }`}
          >
            Rules & Tiers
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Host Voice Dialogue Toggle */}
          <button
            onClick={toggleVoice}
            title={isVoiceEnabled ? 'Host voice enabled ("Aap jeet chuke hain...")' : 'Host voice disabled'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              isVoiceEnabled
                ? 'border-amber-500/70 bg-amber-500/20 text-amber-200'
                : 'border-slate-800 bg-slate-900/60 text-slate-400'
            }`}
          >
            {isVoiceEnabled ? (
              <>
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Host Voice: ON</span>
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Host Voice: OFF</span>
              </>
            )}
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-900/60 bg-amber-950/30 text-amber-200 hover:bg-amber-900/40 transition-colors whitespace-nowrap shrink-0"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">FX Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">FX On</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
