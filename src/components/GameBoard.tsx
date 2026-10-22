import React, { useState, useEffect, useRef } from 'react';
import { Clock, ShieldAlert, ArrowRight, Lock, CheckCircle2, XCircle, LogOut, Volume2 } from 'lucide-react';
import { Question } from '../types/quiz';
import { soundManager } from '../utils/sound';
import { speechManager } from '../utils/speech';

interface GameBoardProps {
  question: Question;
  tierNumber: number;
  prizeMoney: string;
  safePrize: string;
  eliminatedOptions: number[];
  onAnswerCorrect: () => void;
  onAnswerWrong: () => void;
  onWalkAway: () => void;
  onTimeOut: () => void;
  isQuestionLocked: boolean;
  setIsQuestionLocked: (locked: boolean) => void;
  isAnswerRevealed: boolean;
  setIsAnswerRevealed: (revealed: boolean) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  question,
  tierNumber,
  prizeMoney,
  safePrize,
  eliminatedOptions,
  onAnswerCorrect,
  onAnswerWrong,
  onWalkAway,
  onTimeOut,
  isQuestionLocked,
  setIsQuestionLocked,
  isAnswerRevealed,
  setIsAnswerRevealed,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (tierNumber <= 5) return 30;
    if (tierNumber <= 10) return 45;
    return 60;
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const optionLetters = ['A', 'B', 'C', 'D'];

  // Reset state when new question appears
  useEffect(() => {
    setSelectedOption(null);
    setIsQuestionLocked(false);
    setIsAnswerRevealed(false);
    setShowQuitConfirm(false);

    const initialTime = tierNumber <= 5 ? 30 : tierNumber <= 10 ? 45 : 60;
    setTimeLeft(initialTime);
  }, [question, tierNumber, setIsQuestionLocked, setIsAnswerRevealed]);

  // Countdown timer effect
  useEffect(() => {
    if (isQuestionLocked || isAnswerRevealed) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          soundManager.playWrong();
          speechManager.announceWrongAnswer(safePrize);
          onTimeOut();
          return 0;
        }
        if (prev <= 10) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isQuestionLocked, isAnswerRevealed, onTimeOut, safePrize]);

  // Handle player clicking an option
  const handleSelectOption = (idx: number) => {
    if (isQuestionLocked || isAnswerRevealed || eliminatedOptions.includes(idx)) return;
    soundManager.playSelect();
    setSelectedOption(idx);
  };

  // Handle player confirming the lock
  const handleLockOption = () => {
    if (selectedOption === null || isQuestionLocked || isAnswerRevealed) return;

    setIsQuestionLocked(true);
    soundManager.playLock();
    // Voice: "Computer ji option X ko lock kiya jaye!"
    speechManager.announceLockPrompt(optionLetters[selectedOption]);

    // 1.8 seconds suspense delay
    setTimeout(() => {
      setIsAnswerRevealed(true);
      const isCorrect = selectedOption === question.answer;

      if (isCorrect) {
        soundManager.playCorrect();
        // Voice: "Sahi jawab! Shandaar! Aap jeet chuke hain... [prizeMoney]!"
        speechManager.announceCorrectAnswer(prizeMoney);
      } else {
        soundManager.playWrong();
        // Voice: "Afsos, yeh galat uttar hai. Aap le ja rahe hain [safePrize]."
        speechManager.announceWrongAnswer(safePrize);
        setTimeout(() => {
          onAnswerWrong();
        }, 2500);
      }
    }, 1800);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* Question Header Status */}
      <div className="w-full flex items-center justify-between px-2 mb-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="font-semibold text-amber-400">{question.category}</span>
          <span aria-hidden="true">·</span>
          <span>{question.difficulty}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-nums font-bold text-amber-200">{prizeMoney}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer Display */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-nums font-bold transition-colors ${
              timeLeft <= 10
                ? 'bg-red-950/80 text-red-400 border border-red-500/50 animate-pulse'
                : 'bg-[#0f173d] text-amber-300 border border-amber-900/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>

          {/* Walk Away CTA */}
          {!isQuestionLocked && !isAnswerRevealed && tierNumber > 1 && (
            <button
              onClick={() => setShowQuitConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Walk Away</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Question Display Box */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#0b143c] via-[#080d28] to-[#05081c] border-2 border-amber-500/40 p-6 sm:p-8 shadow-[0_0_30px_rgba(245,158,11,0.15)] text-center">
        {/* Subtle decorative diamond accents */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="px-4 py-0.5 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 uppercase tracking-widest">
            Question {tierNumber}
          </span>
          <button
            onClick={() => speechManager.announceQuestion(tierNumber, question.question)}
            title="Read Question Aloud"
            className="p-1 rounded-full bg-[#0f173d] border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-500/30 transition-all text-[10px]"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-100 leading-relaxed font-outfit max-w-3xl mx-auto mt-1">
          {question.question}
        </h1>
      </div>

      {/* 4 Options Grid (A, B, C, D) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full mt-5">
        {question.options.map((optionText, idx) => {
          const isEliminated = eliminatedOptions.includes(idx);
          const isSelected = selectedOption === idx;
          const isCorrectAnswer = idx === question.answer;

          // Compute button styling
          let optionClass =
            'relative flex items-center gap-3 p-4 rounded-xl border text-left text-sm font-medium transition-all ';

          if (isEliminated) {
            optionClass += 'bg-slate-950/40 border-slate-900/60 text-transparent cursor-not-allowed select-none opacity-20';
          } else if (isAnswerRevealed) {
            if (isCorrectAnswer) {
              optionClass += 'bg-emerald-950/90 border-2 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.35)] scale-[1.01]';
            } else if (isSelected && !isCorrectAnswer) {
              optionClass += 'bg-rose-950/90 border-2 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.35)]';
            } else {
              optionClass += 'bg-[#080e29]/70 border-slate-800 text-slate-500';
            }
          } else if (isQuestionLocked) {
            if (isSelected) {
              optionClass += 'bg-amber-950/90 border-2 border-amber-400 text-amber-200 animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.35)]';
            } else {
              optionClass += 'bg-[#080e29]/50 border-slate-800 text-slate-500 cursor-not-allowed';
            }
          } else if (isSelected) {
            optionClass += 'bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border-2 border-amber-400 text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.25)]';
          } else {
            optionClass += 'bg-[#091133]/90 hover:bg-[#101b4d] border-amber-900/40 hover:border-amber-500/60 text-slate-200 hover:text-white cursor-pointer active:scale-98';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isEliminated || isQuestionLocked || isAnswerRevealed}
              onClick={() => handleSelectOption(idx)}
              className={optionClass}
            >
              {/* Option Letter Badge */}
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 font-cinzel ${
                  isEliminated
                    ? 'invisible'
                    : isAnswerRevealed && isCorrectAnswer
                    ? 'bg-emerald-500 text-slate-950'
                    : isAnswerRevealed && isSelected && !isCorrectAnswer
                    ? 'bg-rose-600 text-white'
                    : isSelected
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
                }`}
              >
                {optionLetters[idx]}
              </span>

              {/* Option Text */}
              <span className="flex-1 font-outfit text-sm">
                {!isEliminated && optionText}
              </span>

              {/* Feedback Icon */}
              {isAnswerRevealed && isCorrectAnswer && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              {isAnswerRevealed && isSelected && !isCorrectAnswer && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Lock Confirmation Bar */}
      {selectedOption !== null && !isQuestionLocked && !isAnswerRevealed && (
        <div className="mt-5 w-full max-w-lg p-3 rounded-2xl bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 border border-amber-500/40 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Lock Option {optionLetters[selectedOption]}?</span>
          </div>

          <button
            onClick={handleLockOption}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <span>LOCK KIYA JAYE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Answer Revealed Explanation & Next Question CTA */}
      {isAnswerRevealed && (
        <div className="mt-5 w-full p-4 rounded-2xl bg-[#09112e] border border-amber-900/60 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                Explanation:
              </span>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {question.explanation}
              </p>
            </div>

            {selectedOption === question.answer && (
              <button
                onClick={onAnswerCorrect}
                className="shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 hover:from-emerald-400 hover:to-emerald-300 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <span>NEXT QUESTION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quit / Walk Away Confirmation Modal */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-[#09112e] p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-amber-300">
              WALK AWAY WITH CASH?
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Are you sure you want to quit the hotseat? You will safely bank your current winnings and conclude this game.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Continue Playing
              </button>
              <button
                onClick={() => {
                  setShowQuitConfirm(false);
                  onWalkAway();
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400"
              >
                Confirm Walk Away
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
