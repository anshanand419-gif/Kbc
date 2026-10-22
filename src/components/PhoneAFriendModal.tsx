import React, { useState, useEffect } from 'react';
import { PhoneCall, PhoneForwarded, Clock, CheckCircle2, User, X } from 'lucide-react';
import { Question } from '../types/quiz';
import { soundManager } from '../utils/sound';
import { speechManager } from '../utils/speech';

interface PhoneAFriendModalProps {
  question: Question;
  onClose: () => void;
}

export const PhoneAFriendModal: React.FC<PhoneAFriendModalProps> = ({ question, onClose }) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const optionLetters = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    speechManager.announcePhoneAFriend();
    // Simulate 2 seconds ringing
    const ringTimeout = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);

    return () => clearTimeout(ringTimeout);
  }, []);

  // 30 seconds countdown once connected
  useEffect(() => {
    if (callStatus !== 'connected') return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus]);

  // Friend response logic
  const getFriendAdvice = () => {
    const correctLetter = optionLetters[question.answer];
    const correctText = question.options[question.answer];

    if (question.difficulty === 'Easy' || question.difficulty === 'Medium') {
      return `Haan Ansh ji, bilkul sure hoon! Iska sahi jawab Option ${correctLetter} (${correctText}) hi hai. Maine yeh achhe se padha hua hai. Aap bina kisi shaq ke isko lock kar sakte hain!`;
    }
    if (question.difficulty === 'Hard') {
      return `Namaste Ansh ji! Yeh prashna thoda challenging hai, par 85% yakin hai ki Option ${correctLetter} (${correctText}) sahi hai. Main iske saath jaunga!`;
    }
    return `Ansh ji, Extreme level ka sawaal hai! Mujhe Option ${correctLetter} sabse zyada accurate lag raha hai, par thoda dhyan se sochiye!`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl border-2 border-amber-500/50 bg-[#09112e] p-6 shadow-2xl text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-950/60 mb-4">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-amber-400" />
            <h3 className="font-cinzel text-lg font-bold text-amber-300">
              PHONE-A-FRIEND LIFELINE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {callStatus === 'ringing' ? (
          <div className="py-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center animate-ping mb-4">
              <PhoneForwarded className="w-8 h-8 text-amber-300" />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              Connecting call to Expert Friend...
            </p>
            <p className="text-xs text-amber-400/80 mt-1">
              "Shrimati Tik-Tiki ji, 30 second shuru kijiye!"
            </p>
          </div>
        ) : (
          <div className="text-left animate-fadeIn">
            {/* Friend info bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center">
                  <User className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Expert Friend (Call Connected)</p>
                  <p className="text-[10px] text-emerald-400">Audio link clear · Mumbai Studio</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span>{secondsLeft}s</span>
              </div>
            </div>

            {/* Friend dialogue box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border border-amber-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed font-outfit">
              <p className="font-semibold text-amber-400 text-xs uppercase mb-1">
                Friend's Voice:
              </p>
              "{getFriendAdvice()}"
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow transition-all"
              >
                Back to Question
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
