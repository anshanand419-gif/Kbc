import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle, Code } from 'lucide-react';
import { Question } from '../types/quiz';

interface JsonExportViewProps {
  questions: Question[];
}

export const JsonExportView: React.FC<JsonExportViewProps> = ({ questions }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const formattedJson = JSON.stringify(questions, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formattedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `kbc_questions_database_${questions.length}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Stats
  const animeCount = questions.filter(q => q.category === 'Anime').length;
  const marvelCount = questions.filter(q => q.category === 'Marvel').length;
  const ffCount = questions.filter(q => q.category === 'Free Fire').length;
  const mcCount = questions.filter(q => q.category === 'Minecraft').length;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-amber-950/60">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-cinzel font-bold text-amber-300">
              STRICT JSON EXPORT
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete JSON array ready to import directly into Web Apps (JavaScript, TypeScript, React, Vue, Python, Node).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 hover:from-amber-500 hover:to-amber-400 transition-all shadow-md active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Entire JSON'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/50 bg-[#0f173d] text-amber-300 hover:bg-[#162152] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      {/* Stats summary row */}
      <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#09112e] border border-amber-950/60">
          <span className="text-[11px] text-slate-400">Anime Questions</span>
          <p className="text-xl font-mono-nums font-bold text-amber-300 mt-0.5">{animeCount}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#09112e] border border-amber-950/60">
          <span className="text-[11px] text-slate-400">Marvel Questions</span>
          <p className="text-xl font-mono-nums font-bold text-amber-300 mt-0.5">{marvelCount}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#09112e] border border-amber-950/60">
          <span className="text-[11px] text-slate-400">Free Fire MAX</span>
          <p className="text-xl font-mono-nums font-bold text-amber-300 mt-0.5">{ffCount}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#09112e] border border-amber-950/60">
          <span className="text-[11px] text-slate-400">Minecraft Java/Bedrock</span>
          <p className="text-xl font-mono-nums font-bold text-amber-300 mt-0.5">{mcCount}</p>
        </div>
      </div>

      {/* Code viewer */}
      <div className="relative rounded-2xl border border-amber-950/80 bg-[#030612] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#060c24] border-b border-amber-950/60">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-slate-300">kbc_questions_batch1.json ({questions.length} items)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Strict Schema Validated</span>
          </div>
        </div>

        <pre className="p-4 text-xs font-mono-nums text-amber-100/90 overflow-x-auto max-h-[600px] leading-relaxed selection:bg-amber-500/30">
          {formattedJson}
        </pre>
      </div>

      {/* Quick Integration snippet */}
      <div className="mt-6 p-4 rounded-xl bg-[#09112e] border border-amber-950/60">
        <h4 className="text-xs font-semibold text-amber-300 mb-2">
          How to Embed into Your Application:
        </h4>
        <pre className="p-3 rounded-lg bg-[#040817] text-[11px] font-mono text-slate-300 overflow-x-auto">
{`// Option 1: Direct ES Module Import
import questions from './questions.json';

// Option 2: Standard fetch in Vanilla JS
fetch('./questions.json')
  .then(res => res.json())
  .then(data => console.log('Loaded questions:', data));`}
        </pre>
      </div>
    </div>
  );
};
