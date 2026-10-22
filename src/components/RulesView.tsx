import React from 'react';
import { Shield, HelpCircle, Trophy, Award, BookCheck } from 'lucide-react';
import { KBC_PRIZE_TIERS } from '../types/quiz';

export const RulesView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center gap-2 pb-4 border-b border-amber-950/60 mb-6">
        <BookCheck className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl font-cinzel font-bold text-amber-300">
          KBC WITH ANSH ANAND · OFFICIAL RULES
        </h2>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-[#09112e] border border-amber-950/60">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
            <Trophy className="w-4 h-4" />
            <span>The 16-Question Ladder</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hosted by <strong>Ansh Anand</strong>, contestants climb from Question 1 (₹1,000) all the way to Question 16 for the ultimate jackpot of <strong>₹7,00,00,000 (7 Crore)</strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#09112e] border border-amber-950/60">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
            <Shield className="w-4 h-4" />
            <span>Two Safe Padhaavs & Prize Cheques</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Once you correctly answer <strong>Padhaav 1 (₹10,000)</strong> or <strong>Padhaav 2 (₹3,20,000)</strong>, an official digital bank cheque signed by Ansh Anand is awarded, and that prize is permanently guaranteed.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#09112e] border border-amber-950/60">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Official Lifelines</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Players have access to <strong>50:50</strong>, <strong>Janta Janardan (Audience Poll)</strong>, <strong>Phone-a-Friend</strong> (30-second telephone link to an expert friend), and <strong>Sawaal Badlo (Flip Question)</strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#09112e] border border-amber-950/60">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
            <Award className="w-4 h-4" />
            <span>Fastest Finger First (FFF) & Walk Away</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Test your speed in the <strong>Fastest Finger First</strong> sequence challenge before taking the hotseat, and exercise your right to <strong>Walk Away</strong> with your winnings if you face a doubtful question.
          </p>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <h3 className="text-sm font-cinzel font-bold text-amber-300 uppercase tracking-wider mb-3">
        Difficulty Tiers
      </h3>
      <div className="space-y-3 mb-8">
        <div className="p-3 rounded-lg bg-[#060c24] border border-slate-800 text-xs">
          <span className="font-semibold text-emerald-400">Easy (₹1,000 - ₹10,000): </span>
          <span className="text-slate-300">
            Basic surface-level knowledge known by casual fans and gamers (e.g. Naruto's Nine-Tails name, Captain America's shield metal, Minecraft obsidian mining tools, Free Fire Gloo Walls).
          </span>
        </div>
        <div className="p-3 rounded-lg bg-[#060c24] border border-slate-800 text-xs">
          <span className="font-semibold text-blue-400">Medium (₹20,000 - ₹3,20,000): </span>
          <span className="text-slate-300">
            Intermediate knowledge requiring domain familiarity (e.g. Redstone tick conversion, character passive stats, Gojo's Domain Expansion name, Living Tribunal roles).
          </span>
        </div>
        <div className="p-3 rounded-lg bg-[#060c24] border border-slate-800 text-xs">
          <span className="font-semibold text-amber-400">Hard (₹6,40,000 - ₹1,00,00,000): </span>
          <span className="text-slate-300">
            In-depth technical mechanics and obscure lore (e.g. Java quasi-connectivity, entity cramming limits, Free Fire Charge Buster mechanics, Hickman's Beyonders Incursions, Kurapika's Nen limitation).
          </span>
        </div>
        <div className="p-3 rounded-lg bg-[#060c24] border border-slate-800 text-xs">
          <span className="font-semibold text-rose-400">Extreme Crorepati (₹7,00,00,000): </span>
          <span className="text-slate-300">
            Super niche master-level trivia that only hardcore experts know (e.g. exact End Gateway 1000-block ring generation logic, Hashirama's Shin Sūsenju summit technique, Marvel's House of Ideas cosmology, FFWS 2019 champion team Corinthians).
          </span>
        </div>
      </div>

      {/* Complete Ladder Table */}
      <h3 className="text-sm font-cinzel font-bold text-amber-300 uppercase tracking-wider mb-3">
        Official Prize Ladder
      </h3>
      <div className="rounded-xl border border-amber-950/60 overflow-hidden bg-[#060c24]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#09112e] text-slate-400 border-b border-amber-950/60">
            <tr>
              <th className="py-2.5 px-4 font-semibold">Question #</th>
              <th className="py-2.5 px-4 font-semibold">Prize Tier</th>
              <th className="py-2.5 px-4 font-semibold">Difficulty</th>
              <th className="py-2.5 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {KBC_PRIZE_TIERS.map((tier) => (
              <tr key={tier.level} className={tier.isSafePoint ? 'bg-amber-950/20' : ''}>
                <td className="py-2 px-4 font-mono-nums text-slate-400">Q{tier.level}</td>
                <td className="py-2 px-4 font-mono-nums font-bold text-amber-300">{tier.prize}</td>
                <td className="py-2 px-4 text-slate-300">{tier.difficulty}</td>
                <td className="py-2 px-4">
                  {tier.isSafePoint ? (
                    <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                      <Shield className="w-3 h-3" />
                      <span>{tier.level === 16 ? 'Jackpot' : 'Safe Point'}</span>
                    </span>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
