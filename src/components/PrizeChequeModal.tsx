import React from 'react';
import { Award, Download, X, CheckCircle2 } from 'lucide-react';
import { formatPrizeForHindiSpeech } from '../utils/speech';

interface PrizeChequeModalProps {
  prizeMoney: string;
  isJackpot?: boolean;
  onClose: () => void;
}

export const PrizeChequeModal: React.FC<PrizeChequeModalProps> = ({
  prizeMoney,
  isJackpot = false,
  onClose,
}) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Convert prize to formal English words
  const getAmountInWords = (amount: string) => {
    switch (amount) {
      case '₹10,000': return 'TEN THOUSAND RUPEES ONLY';
      case '₹3,20,000': return 'THREE LAKH TWENTY THOUSAND RUPEES ONLY';
      case '₹7,00,00,000': return 'SEVEN CRORE RUPEES ONLY';
      case '₹1,00,00,000': return 'ONE CRORE RUPEES ONLY';
      case '₹50,00,000': return 'FIFTY LAKH RUPEES ONLY';
      case '₹25,00,000': return 'TWENTY-FIVE LAKH RUPEES ONLY';
      case '₹12,50,000': return 'TWELVE LAKH FIFTY THOUSAND RUPEES ONLY';
      case '₹6,40,000': return 'SIX LAKH FORTY THOUSAND RUPEES ONLY';
      default: return `${amount.replace('₹', '')} RUPEES ONLY`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-[#fdfbf7] via-[#f7f3e8] to-[#eedfbd] p-6 text-slate-900 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute right-4 bottom-4 text-7xl font-serif text-amber-900/5 select-none pointer-events-none font-cinzel">
          KBC
        </div>

        {/* Top Cheque Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-900/40">
          <div>
            <h3 className="font-cinzel text-lg sm:text-xl font-black tracking-widest text-amber-950">
              CROREPATI BANK OF INDIA
            </h3>
            <p className="text-[10px] text-amber-900/70 uppercase tracking-widest font-mono">
              Branch: Mumbai Hotseat Special · IFSC: KBCB0007CR
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-600 block">Date</span>
            <span className="font-mono text-xs font-bold text-amber-950 border border-amber-800/40 px-2 py-0.5 rounded bg-amber-100/60">
              {currentDate}
            </span>
          </div>
        </div>

        {/* Cheque Body */}
        <div className="mt-6 space-y-4 font-outfit text-xs">
          {/* Pay To */}
          <div className="flex items-center gap-2 border-b border-amber-900/30 pb-1">
            <span className="font-serif font-bold uppercase tracking-wider text-slate-700 w-16">
              PAY TO:
            </span>
            <span className="flex-1 font-cinzel font-bold text-sm tracking-wide text-amber-950">
              HOTSEAT CHAMPION / CONTESTANT
            </span>
            <span className="text-slate-500 font-serif">OR BEARER</span>
          </div>

          {/* Rupees in Words */}
          <div className="flex items-start gap-2 border-b border-amber-900/30 pb-1">
            <span className="font-serif font-bold uppercase tracking-wider text-slate-700 w-16">
              RUPEES:
            </span>
            <span className="flex-1 font-mono font-bold tracking-wider text-amber-900 text-xs sm:text-sm">
              {getAmountInWords(prizeMoney)}
            </span>
          </div>

          {/* Amount Box & Signatures */}
          <div className="flex items-end justify-between pt-4 gap-4">
            {/* Amount Box */}
            <div className="flex items-center gap-2 bg-amber-100/90 border-2 border-amber-800/60 px-4 py-2 rounded-lg shadow-inner">
              <span className="text-sm font-bold text-amber-900">₹</span>
              <span className="font-mono font-black text-xl sm:text-2xl tracking-wider text-amber-950">
                {prizeMoney}
              </span>
            </div>

            {/* Authorised Signature */}
            <div className="text-center">
              <div className="font-serif italic font-bold text-lg sm:text-xl text-amber-950 transform -rotate-3 select-none">
                Ansh Anand
              </div>
              <div className="border-t border-amber-900/60 pt-0.5 mt-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-700 block">
                  ANSH ANAND
                </span>
                <span className="text-[9px] text-slate-500 block">
                  Host & Quiz Master, KBC
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cheque MICR Strip */}
        <div className="mt-6 pt-3 border-t border-amber-900/40 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>⑈ 000412 ⑈ 400024016 ⑆ 007788 ⑈ 10</span>
          <span className="hidden sm:inline font-semibold text-amber-900">
            KBC WITH ANSH ANAND · OFFICIAL PRIZE GUARANTEE
          </span>
        </div>

        {/* Modal Close / Continue Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-900 hover:bg-amber-950 text-amber-100 shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Accept Cheque & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
