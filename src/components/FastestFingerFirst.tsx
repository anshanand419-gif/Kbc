import React, { useState, useEffect, useRef } from 'react';
import { Timer, Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { speechManager } from '../utils/speech';

interface FFFChallenge {
  title: string;
  category: string;
  items: string[];
  correctSequence: number[]; // e.g. [0, 1, 2, 3] indices into items
  explanation: string;
}

const FFF_CHALLENGES: FFFChallenge[] = [
  {
    title: 'Arrange these Minecraft tools in order of increasing mining tier:',
    category: 'Minecraft',
    items: ['Stone Pickaxe', 'Wooden Pickaxe', 'Diamond Pickaxe', 'Iron Pickaxe'],
    correctSequence: [1, 0, 3, 2], // Wooden -> Stone -> Iron -> Diamond
    explanation: 'Order: Wooden (Tier 0) → Stone (Tier 1) → Iron (Tier 2) → Diamond (Tier 3).'
  },
  {
    title: 'Arrange these MCU movies in order of cinema release date:',
    category: 'Marvel',
    items: ['The Avengers (2012)', 'Iron Man (2008)', 'Avengers: Endgame (2019)', 'Infinity War (2018)'],
    correctSequence: [1, 0, 3, 2], // Iron Man (2008) -> Avengers (2012) -> Infinity War (2018) -> Endgame (2019)
    explanation: 'Order: Iron Man (2008) → The Avengers (2012) → Infinity War (2018) → Endgame (2019).'
  },
  {
    title: 'Arrange these Free Fire weapons from shortest to longest effective combat range:',
    category: 'Free Fire',
    items: ['Assault Rifle (AK47)', 'Shotgun (M1887)', 'Sniper Rifle (AWM)', 'SMG (MP40)'],
    correctSequence: [1, 3, 0, 2], // Shotgun -> SMG -> AR -> Sniper
    explanation: 'Order: Shotgun (Shortest) → SMG → Assault Rifle → Sniper Rifle (Longest).'
  },
  {
    title: 'Arrange these Naruto ninja ranks in ascending hierarchy:',
    category: 'Anime',
    items: ['Jonin', 'Academy Student', 'Chunin', 'Genin'],
    correctSequence: [1, 3, 2, 0], // Student -> Genin -> Chunin -> Jonin
    explanation: 'Order: Academy Student → Genin → Chunin → Jonin.'
  }
];

interface FastestFingerFirstProps {
  onSuccess: () => void;
  onSkip: () => void;
  selectedCategory?: string;
}

export const FastestFingerFirst: React.FC<FastestFingerFirstProps> = ({
  onSuccess,
  onSkip,
  selectedCategory = 'All',
}) => {
  // Filter challenge matching category if possible
  const challenge = React.useMemo(() => {
    const match = FFF_CHALLENGES.find(c => c.category === selectedCategory);
    if (match) return match;
    return FFF_CHALLENGES[Math.floor(Math.random() * FFF_CHALLENGES.length)];
  }, [selectedCategory]);

  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [elapsed, setElapsed] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    speechManager.announceFFFStart();
    timerRef.current = setInterval(() => {
      setElapsed((Date.now() - startTime) / 1000);
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime]);

  const handleItemClick = (idx: number) => {
    if (selectedOrder.includes(idx) || isCompleted) return;

    soundManager.playSelect();
    const newOrder = [...selectedOrder, idx];
    setSelectedOrder(newOrder);

    // If all 4 selected, evaluate
    if (newOrder.length === 4) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsCompleted(true);

      const correct = newOrder.every((val, i) => val === challenge.correctSequence[i]);
      setIsCorrect(correct);

      if (correct) {
        soundManager.playCorrect();
      } else {
        soundManager.playWrong();
      }
    }
  };

  const handleReset = () => {
    setSelectedOrder([]);
    setIsCompleted(false);
    setIsCorrect(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-[#0a1236] via-[#060b24] to-[#040817] p-6 sm:p-8 text-center shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-amber-950/60 mb-4">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-amber-400" />
            <h3 className="font-cinzel text-lg font-black tracking-widest text-amber-300">
              FASTEST FINGER FIRST
            </h3>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40">
            <span>{elapsed.toFixed(2)}s</span>
          </div>
        </div>

        <p className="text-sm sm:text-base font-semibold text-slate-100 font-outfit mt-2">
          {challenge.title}
        </p>
        <p className="text-xs text-amber-400/80 mt-1">
          Click the items below in the exact correct sequence from 1 to 4!
        </p>

        {/* 4 Interactive Order Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {challenge.items.map((item, idx) => {
            const orderIndex = selectedOrder.indexOf(idx);
            const isPicked = orderIndex !== -1;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleItemClick(idx)}
                disabled={isPicked || isCompleted}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${
                  isPicked
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                    : 'bg-[#09112e] hover:bg-[#111e52] border-slate-800 text-slate-200 hover:border-amber-500/50'
                }`}
              >
                <span>{item}</span>
                {isPicked ? (
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center font-cinzel">
                    {orderIndex + 1}
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full border border-slate-700 text-slate-500 text-xs flex items-center justify-center">
                    ·
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Results Banner */}
        {isCompleted && (
          <div className={`mt-6 p-4 rounded-xl border text-xs sm:text-sm text-left animate-fadeIn ${
            isCorrect ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200' : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Brilliant! Sequence cleared in {elapsed.toFixed(2)} seconds!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Incorrect sequence!</span>
                </>
              )}
            </div>
            <p className="text-slate-300 text-xs">{challenge.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {isCorrect ? (
            <button
              onClick={onSuccess}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 hover:from-emerald-400 hover:to-emerald-300 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <span>ENTER HOTSEAT WITH ANSH ANAND</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : isCompleted ? (
            <button
              onClick={handleReset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs border border-amber-500/50 bg-[#0f173d] text-amber-300 hover:bg-[#162152] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          ) : null}

          <button
            onClick={onSkip}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Skip to Hotseat
          </button>
        </div>
      </div>
    </div>
  );
};
