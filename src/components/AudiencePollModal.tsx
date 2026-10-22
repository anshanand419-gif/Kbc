import React, { useMemo } from 'react';
import { Users, X } from 'lucide-react';
import { Question } from '../types/quiz';

interface AudiencePollModalProps {
  question: Question;
  eliminatedOptions: number[];
  onClose: () => void;
}

export const AudiencePollModal: React.FC<AudiencePollModalProps> = ({
  question,
  eliminatedOptions,
  onClose,
}) => {
  // Generate poll distribution once
  const pollResults = useMemo(() => {
    const letters = ['A', 'B', 'C', 'D'];
    const activeIndices = [0, 1, 2, 3].filter(idx => !eliminatedOptions.includes(idx));
    
    // Weight for correct answer based on difficulty
    let correctWeight = 75;
    if (question.difficulty === 'Medium') correctWeight = 60;
    if (question.difficulty === 'Hard') correctWeight = 48;
    if (question.difficulty === 'Extreme') correctWeight = 38;

    const remainingPercent = 100 - correctWeight;
    const incorrectActive = activeIndices.filter(idx => idx !== question.answer);
    
    const percentages: { [key: number]: number } = {};
    percentages[question.answer] = correctWeight;

    if (incorrectActive.length === 1) {
      percentages[incorrectActive[0]] = remainingPercent;
    } else if (incorrectActive.length > 1) {
      // Distribute remaining among other active options
      let left = remainingPercent;
      incorrectActive.forEach((idx, i) => {
        if (i === incorrectActive.length - 1) {
          percentages[idx] = Math.max(0, left);
        } else {
          const share = Math.floor(Math.random() * (left - 5 * (incorrectActive.length - i - 1))) + 5;
          percentages[idx] = share;
          left -= share;
        }
      });
    }

    // Set 0 for eliminated
    eliminatedOptions.forEach(idx => {
      percentages[idx] = 0;
    });

    return [0, 1, 2, 3].map(idx => ({
      letter: letters[idx],
      optionText: question.options[idx],
      percent: percentages[idx] || 0,
      isCorrect: idx === question.answer,
      isEliminated: eliminatedOptions.includes(idx),
    }));
  }, [question, eliminatedOptions]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-[#09112e] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-amber-950/60">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="font-cinzel text-lg font-bold text-amber-300">
              JANTA JANARDAN POLL
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-300">
          Here is how the studio audience voted for this question:
        </p>

        <div className="mt-5 flex items-end justify-between gap-3 h-48 px-2 pt-6 pb-2 bg-[#05091a]/80 rounded-xl border border-amber-950/40">
          {pollResults.map((item) => (
            <div key={item.letter} className="flex-1 flex flex-col items-center h-full justify-end">
              <span className="text-xs font-mono-nums font-bold text-amber-300 mb-1">
                {item.percent}%
              </span>
              <div className="w-full max-w-[48px] bg-slate-800/80 rounded-t-md overflow-hidden flex flex-col justify-end h-32">
                <div
                  style={{ height: `${item.percent}%` }}
                  className={`w-full transition-all duration-700 rounded-t-md ${
                    item.isEliminated
                      ? 'bg-slate-700'
                      : 'bg-gradient-to-t from-amber-600 via-amber-400 to-amber-300'
                  }`}
                />
              </div>
              <div className="mt-2 text-center">
                <span className="inline-block w-6 h-6 rounded-full bg-amber-950/70 border border-amber-500/60 text-xs font-bold text-amber-200 leading-6">
                  {item.letter}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 hover:from-amber-500 hover:to-amber-400 shadow-md transition-all"
          >
            Back to Question
          </button>
        </div>
      </div>
    </div>
  );
};
