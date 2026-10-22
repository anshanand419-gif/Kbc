import React from 'react';
import { Shield, Trophy, Check } from 'lucide-react';
import { KBC_PRIZE_TIERS } from '../types/quiz';

interface MoneyTreeProps {
  currentTierIndex: number;
}

export const MoneyTree: React.FC<MoneyTreeProps> = ({ currentTierIndex }) => {
  // We display levels from 16 (top) down to 1 (bottom)
  const reversedTiers = [...KBC_PRIZE_TIERS].reverse();

  return (
    <div className="w-full rounded-2xl bg-[#09102c]/90 border border-amber-900/40 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-amber-950/60">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-cinzel font-bold tracking-wider text-amber-300">
            MONEY TREE
          </h2>
        </div>
        <span className="text-xs text-amber-400/80 font-mono-nums">
          Level {currentTierIndex + 1} / 16
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {reversedTiers.map((tier) => {
          const tierIndex = tier.level - 1;
          const isCurrent = tierIndex === currentTierIndex;
          const isCompleted = tierIndex < currentTierIndex;
          const isSafe = tier.isSafePoint;

          let rowClasses = "flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ";

          if (isCurrent) {
            rowClasses += "bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-amber-500/30 border border-amber-400 text-amber-200 font-bold shadow-[0_0_12px_rgba(251,191,36,0.25)] scale-[1.02]";
          } else if (isCompleted) {
            rowClasses += "bg-emerald-950/20 text-emerald-400 border border-emerald-900/30";
          } else if (isSafe) {
            rowClasses += "text-amber-300 bg-amber-950/20 border border-amber-900/30";
          } else {
            rowClasses += "text-slate-400 hover:text-slate-200";
          }

          return (
            <div key={tier.level} className={rowClasses}>
              <div className="flex items-center gap-2">
                <span className="w-5 text-right font-mono-nums text-slate-500">
                  {tier.level}
                </span>
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : isSafe ? (
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <span className="w-3.5" />
                )}
                <span className="font-outfit">
                  {isSafe && tier.level === 16 ? 'Jackpot' : isSafe ? 'Safe Level' : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono-nums font-semibold tracking-wide">
                  {tier.prize}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-amber-950/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Guaranteed Checkpoints (₹10K & ₹3.2L)</span>
        </div>
      </div>
    </div>
  );
};
