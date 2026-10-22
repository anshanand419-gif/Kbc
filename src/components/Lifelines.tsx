import React from 'react';
import { Users, Shuffle, HelpCircle, SplitSquareVertical, PhoneCall } from 'lucide-react';
import { LifelineState } from '../types/quiz';
import { soundManager } from '../utils/sound';

interface LifelinesProps {
  lifelines: LifelineState;
  onUseFiftyFifty: () => void;
  onUseAudiencePoll: () => void;
  onUsePhoneAFriend: () => void;
  onUseFlipQuestion: () => void;
  onUseExpertHint: () => void;
  isQuestionLocked: boolean;
  isAnswerRevealed: boolean;
}

export const Lifelines: React.FC<LifelinesProps> = ({
  lifelines,
  onUseFiftyFifty,
  onUseAudiencePoll,
  onUsePhoneAFriend,
  onUseFlipQuestion,
  onUseExpertHint,
  isQuestionLocked,
  isAnswerRevealed,
}) => {
  const disabled = isQuestionLocked || isAnswerRevealed;

  const handleFiftyFifty = () => {
    if (!lifelines.fiftyFifty || disabled) return;
    soundManager.playLifeline();
    onUseFiftyFifty();
  };

  const handleAudiencePoll = () => {
    if (!lifelines.audiencePoll || disabled) return;
    soundManager.playLifeline();
    onUseAudiencePoll();
  };

  const handlePhoneAFriend = () => {
    if (!lifelines.phoneAFriend || disabled) return;
    soundManager.playLifeline();
    onUsePhoneAFriend();
  };

  const handleFlipQuestion = () => {
    if (!lifelines.flipQuestion || disabled) return;
    soundManager.playLifeline();
    onUseFlipQuestion();
  };

  const handleExpertHint = () => {
    if (!lifelines.expertHint || disabled) return;
    soundManager.playLifeline();
    onUseExpertHint();
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 w-full py-2">
      {/* 1. 50:50 */}
      <button
        onClick={handleFiftyFifty}
        disabled={!lifelines.fiftyFifty || disabled}
        title="50:50 - Remove two incorrect options"
        className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all ${
          lifelines.fiftyFifty && !disabled
            ? 'bg-[#0f173d] hover:bg-[#162152] border border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:scale-105 active:scale-95'
            : 'bg-slate-900/40 border border-slate-800 text-slate-600 cursor-not-allowed line-through'
        }`}
      >
        <SplitSquareVertical className="w-4 h-4 text-amber-400 group-disabled:text-slate-600" />
        <span>50:50</span>
      </button>

      {/* 2. Audience Poll */}
      <button
        onClick={handleAudiencePoll}
        disabled={!lifelines.audiencePoll || disabled}
        title="Audience Poll - Survey the studio audience"
        className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all ${
          lifelines.audiencePoll && !disabled
            ? 'bg-[#0f173d] hover:bg-[#162152] border border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:scale-105 active:scale-95'
            : 'bg-slate-900/40 border border-slate-800 text-slate-600 cursor-not-allowed line-through'
        }`}
      >
        <Users className="w-4 h-4 text-amber-400 group-disabled:text-slate-600" />
        <span>Audience Poll</span>
      </button>

      {/* 3. Phone A Friend */}
      <button
        onClick={handlePhoneAFriend}
        disabled={!lifelines.phoneAFriend || disabled}
        title="Phone-A-Friend - Call your expert friend (30s clock)"
        className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all ${
          lifelines.phoneAFriend && !disabled
            ? 'bg-[#0f173d] hover:bg-[#162152] border border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:scale-105 active:scale-95'
            : 'bg-slate-900/40 border border-slate-800 text-slate-600 cursor-not-allowed line-through'
        }`}
      >
        <PhoneCall className="w-4 h-4 text-amber-400 group-disabled:text-slate-600" />
        <span>Phone A Friend</span>
      </button>

      {/* 4. Flip Question */}
      <button
        onClick={handleFlipQuestion}
        disabled={!lifelines.flipQuestion || disabled}
        title="Flip Question - Swap with a fresh question"
        className={`group relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all ${
          lifelines.flipQuestion && !disabled
            ? 'bg-[#0f173d] hover:bg-[#162152] border border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:scale-105 active:scale-95'
            : 'bg-slate-900/40 border border-slate-800 text-slate-600 cursor-not-allowed line-through'
        }`}
      >
        <Shuffle className="w-4 h-4 text-amber-400 group-disabled:text-slate-600" />
        <span>Flip Question</span>
      </button>

      {/* 4. Ask Computer Ji / Expert Hint */}
      <button
        onClick={handleExpertHint}
        disabled={!lifelines.expertHint || disabled}
        title="Computer Ji / Expert Hint - Ask Quiz Master for a clue"
        className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all ${
          lifelines.expertHint && !disabled
            ? 'bg-[#0f173d] hover:bg-[#162152] border border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:scale-105 active:scale-95'
            : 'bg-slate-900/40 border border-slate-800 text-slate-600 cursor-not-allowed line-through'
        }`}
      >
        <HelpCircle className="w-4 h-4 text-amber-400 group-disabled:text-slate-600" />
        <span>Computer Ji Hint</span>
      </button>
    </div>
  );
};
