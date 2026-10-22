import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { MoneyTree } from './components/MoneyTree';
import { Lifelines } from './components/Lifelines';
import { GameBoard } from './components/GameBoard';
import { AudiencePollModal } from './components/AudiencePollModal';
import { ExpertHintModal } from './components/ExpertHintModal';
import { GameOverModal } from './components/GameOverModal';
import { DatabaseExplorer } from './components/DatabaseExplorer';
import { JsonExportView } from './components/JsonExportView';
import { RulesView } from './components/RulesView';
import { INITIAL_50_QUESTIONS } from './data/questions';
import { Question, KBC_PRIZE_TIERS, LifelineState, Category } from './types/quiz';
import { Flame, Sparkles, Play, RotateCcw, Award, Volume2, Timer } from 'lucide-react';
import { soundManager } from './utils/sound';
import { speechManager } from './utils/speech';
import { generateQuestionDatabase } from './utils/questionGenerator';
import { FastestFingerFirst } from './components/FastestFingerFirst';
import { PhoneAFriendModal } from './components/PhoneAFriendModal';
import { PrizeChequeModal } from './components/PrizeChequeModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'database' | 'json' | 'rules'>('game');
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(speechManager.isEnabled());
  const [allQuestions, setAllQuestions] = useState<Question[]>(INITIAL_50_QUESTIONS);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Generate procedural question batches (1,000, 5,000, or 10,000)
  const handleGenerateCount = useCallback((count: number) => {
    setIsGenerating(true);
    setTimeout(() => {
      const newBatch = generateQuestionDatabase(count, allQuestions.length + 1);
      setAllQuestions((prev) => [...prev, ...newBatch]);
      setIsGenerating(false);
    }, 150);
  }, [allQuestions.length]);

  // Hotseat Game State
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('All'); // 'All' | 'Anime' | 'Marvel' | 'Free Fire' | 'Minecraft'
  const [currentTierIndex, setCurrentTierIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(INITIAL_50_QUESTIONS[0]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);

  // Lifelines
  const [lifelines, setLifelines] = useState<LifelineState>({
    fiftyFifty: true,
    audiencePoll: true,
    phoneAFriend: true,
    flipQuestion: true,
    expertHint: true,
  });
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);

  // Locks & Suspense
  const [isQuestionLocked, setIsQuestionLocked] = useState<boolean>(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);

  // Modals state
  const [showAudienceModal, setShowAudienceModal] = useState<boolean>(false);
  const [showExpertModal, setShowExpertModal] = useState<boolean>(false);
  const [showPhoneModal, setShowPhoneModal] = useState<boolean>(false);
  const [showFFFModal, setShowFFFModal] = useState<boolean>(false);
  const [showChequeModal, setShowChequeModal] = useState<boolean>(false);
  const [chequeAmount, setChequeAmount] = useState<string>('₹10,000');

  const [gameOverState, setGameOverState] = useState<{
    isOpen: boolean;
    status: 'won_jackpot' | 'walked_away' | 'wrong_answer' | 'timeout';
    prizeWon: string;
  }>({
    isOpen: false,
    status: 'wrong_answer',
    prizeWon: '₹0',
  });

  // Calculate guaranteed safe prize if wrong/timeout
  const getSafePrize = useCallback((tierIdx: number): string => {
    if (tierIdx >= 10) return KBC_PRIZE_TIERS[9].prize; // ₹3,20,000 (Level 10)
    if (tierIdx >= 5) return KBC_PRIZE_TIERS[4].prize;  // ₹10,000 (Level 5)
    return '₹0';
  }, []);

  // Pick question appropriate for current tier and selected domain with STRICT category isolation
  const pickQuestionForTier = useCallback((tierIdx: number, excludeIds: number[]): Question => {
    const targetDifficulty = KBC_PRIZE_TIERS[tierIdx].difficulty;

    // 1. Strict priority: Target domain, target difficulty, unused
    let pool = allQuestions.filter(q => {
      const matchCat = selectedDomain === 'All' || q.category === selectedDomain;
      const matchDiff = q.difficulty === targetDifficulty;
      const notUsed = !excludeIds.includes(q.id);
      return matchCat && matchDiff && notUsed;
    });

    // 2. Second priority: If exhausted, same target domain and same difficulty (reuse allowed)
    if (pool.length === 0) {
      pool = allQuestions.filter(q => {
        const matchCat = selectedDomain === 'All' || q.category === selectedDomain;
        const matchDiff = q.difficulty === targetDifficulty;
        return matchCat && matchDiff;
      });
    }

    // 3. Third priority: Same target domain, ANY difficulty (STRICT: Never leak to another category if domain is picked!)
    if (pool.length === 0) {
      pool = allQuestions.filter(q => {
        return selectedDomain === 'All' || q.category === selectedDomain;
      });
    }

    // 4. Absolute fallback only if domain was completely empty
    if (pool.length === 0) {
      pool = allQuestions;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }, [allQuestions, selectedDomain]);

  // Start new hotseat game
  const startNewGame = useCallback(() => {
    const firstQ = pickQuestionForTier(0, []);
    setCurrentTierIndex(0);
    setCurrentQuestion(firstQ);
    setUsedQuestionIds([firstQ.id]);
    setLifelines({
      fiftyFifty: true,
      audiencePoll: true,
      phoneAFriend: true,
      flipQuestion: true,
      expertHint: true,
    });
    setEliminatedOptions([]);
    setIsQuestionLocked(false);
    setIsAnswerRevealed(false);
    setGameOverState({ isOpen: false, status: 'wrong_answer', prizeWon: '₹0' });
    setGameStarted(true);
    setShowFFFModal(false);
  }, [pickQuestionForTier]);

  // Handle Lifeline: 50:50
  const handleUseFiftyFifty = () => {
    if (!lifelines.fiftyFifty) return;
    const incorrectIndices = [0, 1, 2, 3].filter(idx => idx !== currentQuestion.answer);
    const shuffled = [...incorrectIndices].sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, 2);

    setEliminatedOptions(toEliminate);
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));
  };

  // Handle Lifeline: Flip Question
  const handleUseFlipQuestion = () => {
    if (!lifelines.flipQuestion) return;
    const nextQ = pickQuestionForTier(currentTierIndex, [...usedQuestionIds, currentQuestion.id]);
    setCurrentQuestion(nextQ);
    setUsedQuestionIds(prev => [...prev, nextQ.id]);
    setEliminatedOptions([]);
    setIsQuestionLocked(false);
    setIsAnswerRevealed(false);
    setLifelines(prev => ({ ...prev, flipQuestion: false }));
  };

  // Handle Next Question after correct answer
  const handleAnswerCorrect = () => {
    const nextTier = currentTierIndex + 1;

    // Check if player just reached Padhaav 1 (Level 5 ₹10,000) or Padhaav 2 (Level 10 ₹3,20,000)
    if (currentTierIndex === 4) {
      setChequeAmount('₹10,000');
      setShowChequeModal(true);
    } else if (currentTierIndex === 9) {
      setChequeAmount('₹3,20,000');
      setShowChequeModal(true);
    }

    if (nextTier >= KBC_PRIZE_TIERS.length) {
      // WON 7 CRORE JACKPOT!
      setChequeAmount('₹7,00,00,000');
      setShowChequeModal(true);
      setGameOverState({
        isOpen: true,
        status: 'won_jackpot',
        prizeWon: KBC_PRIZE_TIERS[15].prize,
      });
      return;
    }

    const nextQ = pickQuestionForTier(nextTier, usedQuestionIds);
    setCurrentTierIndex(nextTier);
    setCurrentQuestion(nextQ);
    setUsedQuestionIds(prev => [...prev, nextQ.id]);
    setEliminatedOptions([]);
    setIsQuestionLocked(false);
    setIsAnswerRevealed(false);
  };

  // Handle Wrong Answer
  const handleAnswerWrong = () => {
    const safePrize = getSafePrize(currentTierIndex);
    setGameOverState({
      isOpen: true,
      status: 'wrong_answer',
      prizeWon: safePrize,
    });
  };

  // Handle Walk Away
  const handleWalkAway = () => {
    const prizeWon = currentTierIndex > 0 ? KBC_PRIZE_TIERS[currentTierIndex - 1].prize : '₹0';
    setGameOverState({
      isOpen: true,
      status: 'walked_away',
      prizeWon: prizeWon,
    });
  };

  // Handle Timeout
  const handleTimeOut = () => {
    const safePrize = getSafePrize(currentTierIndex);
    setGameOverState({
      isOpen: true,
      status: 'timeout',
      prizeWon: safePrize,
    });
  };

  return (
    <div className="min-h-screen bg-[#040817] text-slate-100 flex flex-col font-outfit selection:bg-amber-500/30">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isVoiceEnabled={isVoiceEnabled}
        setIsVoiceEnabled={setIsVoiceEnabled}
        totalQuestionsCount={allQuestions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {activeTab === 'game' && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-6">
            {!gameStarted ? (
              /* Hotseat Title Screen / Category Picker */
              <div className="w-full max-w-2xl mx-auto rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-[#091133] via-[#060b24] to-[#040817] p-6 sm:p-10 shadow-2xl text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hosted by Ansh Anand · Season 1</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-black tracking-wider text-amber-300 leading-tight">
                  KBC WITH ANSH ANAND
                </h1>
                <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
                  Experience the real television hotseat. 16 questions, 2 safe Padhaavs, Fastest Finger First, and the ₹7,00,00,000 jackpot!
                </p>

                {/* Host Welcome Audio Button */}
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => speechManager.announceShowIntro()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium border border-amber-500/40 bg-amber-950/40 text-amber-300 hover:bg-amber-900/40 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hear Host Ansh Anand's Welcome</span>
                  </button>
                </div>

                {/* Domain Selector */}
                <div className="mt-6 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                    Select Trivia Domain:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'All', label: 'All 4 Mixed', desc: 'Anime, Marvel, FF, Minecraft' },
                      { id: 'Free Fire', label: 'Free Fire MAX Only', desc: '100% Pure Free Fire' },
                      { id: 'Minecraft', label: 'Minecraft Only', desc: '100% Pure Minecraft' },
                      { id: 'Anime', label: 'Anime Lore Only', desc: 'Naruto, DBZ, AOT, JKK' },
                      { id: 'Marvel', label: 'Marvel & MCU Only', desc: 'Avengers & Comics' },
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDomain(d.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedDomain === d.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                            : 'bg-[#080e2a] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <p className="text-xs font-bold font-outfit text-slate-200">{d.label}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{d.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Hotseat CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setShowFFFModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-cinzel font-bold text-xs tracking-wider border-2 border-amber-400 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 shadow-lg active:scale-95 transition-all"
                  >
                    <Timer className="w-4 h-4 text-amber-400" />
                    <span>FASTEST FINGER FIRST</span>
                  </button>

                  <button
                    onClick={startNewGame}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-cinzel font-bold text-xs tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-xl shadow-amber-500/25 active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>DIRECT HOTSEAT</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('database')}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl font-medium text-xs border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    Database ({allQuestions.length} Qs)
                  </button>
                </div>
              </div>
            ) : (
              /* Active Gameplay Arena */
              <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left/Center Area: Lifelines & Gameboard */}
                <div className="lg:col-span-8 flex flex-col items-center gap-4 w-full">
                  {/* Lifelines Bar */}
                  <Lifelines
                    lifelines={lifelines}
                    onUseFiftyFifty={handleUseFiftyFifty}
                    onUseAudiencePoll={() => {
                      setLifelines(prev => ({ ...prev, audiencePoll: false }));
                      setShowAudienceModal(true);
                    }}
                    onUsePhoneAFriend={() => {
                      setLifelines(prev => ({ ...prev, phoneAFriend: false }));
                      setShowPhoneModal(true);
                    }}
                    onUseFlipQuestion={handleUseFlipQuestion}
                    onUseExpertHint={() => {
                      setLifelines(prev => ({ ...prev, expertHint: false }));
                      setShowExpertModal(true);
                    }}
                    isQuestionLocked={isQuestionLocked}
                    isAnswerRevealed={isAnswerRevealed}
                  />

                  {/* Main Gameboard */}
                  <GameBoard
                    question={currentQuestion}
                    tierNumber={currentTierIndex + 1}
                    prizeMoney={KBC_PRIZE_TIERS[currentTierIndex].prize}
                    safePrize={getSafePrize(currentTierIndex)}
                    eliminatedOptions={eliminatedOptions}
                    onAnswerCorrect={handleAnswerCorrect}
                    onAnswerWrong={handleAnswerWrong}
                    onWalkAway={handleWalkAway}
                    onTimeOut={handleTimeOut}
                    isQuestionLocked={isQuestionLocked}
                    setIsQuestionLocked={setIsQuestionLocked}
                    isAnswerRevealed={isAnswerRevealed}
                    setIsAnswerRevealed={setIsAnswerRevealed}
                  />
                </div>

                {/* Right Area: Money Tree Ladder */}
                <div className="lg:col-span-4 w-full">
                  <MoneyTree currentTierIndex={currentTierIndex} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Database Explorer Tab */}
        {activeTab === 'database' && (
          <DatabaseExplorer
            questions={allQuestions}
            onGenerateCount={handleGenerateCount}
            isGenerating={isGenerating}
          />
        )}

        {/* Raw JSON Export Tab */}
        {activeTab === 'json' && (
          <JsonExportView questions={allQuestions} />
        )}

        {/* Tournament Rules & Tiers Tab */}
        {activeTab === 'rules' && (
          <RulesView />
        )}
      </main>

      {/* Lifeline Modals */}
      {showAudienceModal && (
        <AudiencePollModal
          question={currentQuestion}
          eliminatedOptions={eliminatedOptions}
          onClose={() => setShowAudienceModal(false)}
        />
      )}

      {showPhoneModal && (
        <PhoneAFriendModal
          question={currentQuestion}
          onClose={() => setShowPhoneModal(false)}
        />
      )}

      {showExpertModal && (
        <ExpertHintModal
          question={currentQuestion}
          onClose={() => setShowExpertModal(false)}
        />
      )}

      {/* Digital Prize Cheque Presentation */}
      {showChequeModal && (
        <PrizeChequeModal
          prizeMoney={chequeAmount}
          isJackpot={chequeAmount === '₹7,00,00,000'}
          onClose={() => setShowChequeModal(false)}
        />
      )}

      {/* Fastest Finger First Modal */}
      {showFFFModal && (
        <FastestFingerFirst
          selectedCategory={selectedDomain}
          onSuccess={startNewGame}
          onSkip={startNewGame}
        />
      )}

      {/* Game Over / Victory Modal */}
      {gameOverState.isOpen && (
        <GameOverModal
          status={gameOverState.status}
          prizeWon={gameOverState.prizeWon}
          clearedCount={currentTierIndex}
          lastQuestion={currentQuestion}
          onPlayAgain={startNewGame}
          onReviewDatabase={() => {
            setGameOverState(prev => ({ ...prev, isOpen: false }));
            setActiveTab('database');
          }}
        />
      )}
    </div>
  );
}
