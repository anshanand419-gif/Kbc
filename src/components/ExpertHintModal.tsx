import React from 'react';
import { Sparkles, X, BrainCircuit } from 'lucide-react';
import { Question } from '../types/quiz';

interface ExpertHintModalProps {
  question: Question;
  onClose: () => void;
}

export const ExpertHintModal: React.FC<ExpertHintModalProps> = ({ question, onClose }) => {
  // Generate intelligent host commentary tailored to domain & question
  const getHostClue = (q: Question) => {
    switch (q.category) {
      case 'Anime':
        return `Pay close attention to key lore terms and Japanese naming conventions. In ${q.category}, power systems like Nen conditions, Devil Fruit classifications, or Domain Expansions follow strict internal logic. Think about the pivotal arc where this occurred.`;
      case 'Marvel':
        return `Differentiate between MCU film adaptations and original comic canon. Notice the cosmic hierarchies—entities like The Living Tribunal or The Beyonders belong to cosmic abstract realms far above planetary scale.`;
      case 'Free Fire':
        return `Evaluate active cooldown vs passive abilities. Remember character synergies (e.g. Alok's aura, Chrono's defensive dome, Hayato's armor pierce) and tactical weapon recoil patterns in Battle Royale.`;
      case 'Minecraft':
        return `Consider redstone tick timing (1 redstone tick = 2 game ticks) or dimension-specific mechanics. Look closely at technical Java vs Bedrock parity differences and entity bounding boxes.`;
      default:
        return `Analyze each option carefully. Eliminate the two options that don't match the specific conditions stated in the question.`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-[#09112e] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-amber-950/60">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-amber-400" />
            <h3 className="font-cinzel text-lg font-bold text-amber-300">
              COMPUTER JI EXPERT CLUE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-amber-950/20 border border-amber-900/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Quiz Master Insight:</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-outfit">
            "{getHostClue(question)}"
          </p>
        </div>

        <div className="mt-4 text-xs text-slate-400 space-y-1">
          <p>
            <strong className="text-slate-300">Category:</strong> {question.category} · {question.difficulty} Tier
          </p>
          <p>
            <strong className="text-slate-300">Prize Tier:</strong> {question.prize_money}
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 hover:from-amber-500 hover:to-amber-400 shadow-md transition-all"
          >
            Resume Play
          </button>
        </div>
      </div>
    </div>
  );
};
