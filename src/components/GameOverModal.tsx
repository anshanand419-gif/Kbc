import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Question } from '../types/quiz';
import { soundManager } from '../utils/sound';
import { speechManager } from '../utils/speech';

interface GameOverModalProps {
  status: 'won_jackpot' | 'walked_away' | 'wrong_answer' | 'timeout';
  prizeWon: string;
  clearedCount: number;
  lastQuestion: Question;
  onPlayAgain: () => void;
  onReviewDatabase: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  status,
  prizeWon,
  clearedCount,
  lastQuestion,
  onPlayAgain,
  onReviewDatabase,
}) => {
  const isJackpot = status === 'won_jackpot';

  useEffect(() => {
    if (isJackpot) {
      soundManager.playJackpot();
      speechManager.announceJackpot();
      // Multi-stage confetti blast
      const end = Date.now() + 3000;
      const interval: ReturnType<typeof setInterval> = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: ['#FFE17D', '#E5A93C', '#FFFFFF', '#60A5FA', '#34D399'],
        });
      }, 250);

      return () => clearInterval(interval);
    } else if (status === 'walked_away') {
      speechManager.announceWalkAway(prizeWon);
    }
  }, [isJackpot, status, prizeWon]);

  const getTitle = () => {
    switch (status) {
      case 'won_jackpot':
        return 'CONGRATULATIONS CROREPATI!';
      case 'walked_away':
        return 'SMART MOVE! GAME CONCLUDED';
      case 'timeout':
        return "TIME'S UP!";
      case 'wrong_answer':
        return 'INCORRECT ANSWER';
    }
  };

  const getSubtitle = () => {
    switch (status) {
      case 'won_jackpot':
        return 'You mastered all 16 levels across Anime, Marvel, Free Fire & Minecraft and won the grand jackpot of ₹7,00,00,000!';
      case 'walked_away':
        return `You chose to walk away and secured a verified cash prize of ${prizeWon}!`;
      case 'timeout':
        return `The clock ran out. By tournament rules, you take home your guaranteed safe amount of ${prizeWon}.`;
      case 'wrong_answer':
        return `An unfortunate mistake on question ${clearedCount + 1}. You fall back to your last guaranteed checkpoint of ${prizeWon}.`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl border border-amber-500/50 bg-[#09112e] p-6 sm:p-8 shadow-2xl text-center">
        {/* Header Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/30 via-amber-400/20 to-transparent border border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.3)] mb-4">
          {isJackpot ? (
            <Trophy className="h-10 w-10 text-amber-300 animate-bounce" />
          ) : status === 'walked_away' ? (
            <ShieldCheck className="h-10 w-10 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-10 w-10 text-amber-400" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-cinzel font-black tracking-wider text-amber-300">
          {getTitle()}
        </h2>

        {/* Prize Box */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 border border-amber-500/30">
          <p className="text-xs uppercase tracking-widest text-amber-400/80 mb-1">
            Total Prize Won
          </p>
          <p className="text-3xl sm:text-4xl font-mono-nums font-black text-amber-200">
            {prizeWon}
          </p>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
          {getSubtitle()}
        </p>

        {/* Question Review Snippet if wrong */}
        {status === 'wrong_answer' && (
          <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Correct Answer: {lastQuestion.options[lastQuestion.answer]}</span>
            </div>
            <p className="text-slate-400 italic">
              "{lastQuestion.explanation}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-98 whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Hotseat Again</span>
          </button>

          <button
            onClick={onReviewDatabase}
            className="w-full sm:w-auto px-5 py-3 rounded-xl font-medium text-sm border border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white transition-colors whitespace-nowrap"
          >
            Explore 50 Questions DB
          </button>
        </div>
      </div>
    </div>
  );
};
