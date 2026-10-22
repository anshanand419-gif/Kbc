import React, { useState, useMemo } from 'react';
import { Search, Filter, Copy, Check, Download, Layers, BookOpen, ChevronDown, ChevronUp, Sparkles, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Question, Category, Difficulty } from '../types/quiz';

interface DatabaseExplorerProps {
  questions: Question[];
  onGenerateCount: (count: number) => void;
  isGenerating: boolean;
}

export const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({
  questions,
  onGenerateCount,
  isGenerating,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 50;

  const categories: string[] = ['All', 'Anime', 'Marvel', 'Free Fire', 'Minecraft'];
  const difficulties: string[] = ['All', 'Easy', 'Medium', 'Hard', 'Extreme'];

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchCategory = selectedCategory === 'All' || q.category === selectedCategory;
      const matchDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      const matchSearch =
        searchQuery.trim() === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.options.some((opt) => opt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchDifficulty && matchSearch;
    });
  }, [questions, selectedCategory, selectedDifficulty, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage]);

  // Copy single question JSON
  const handleCopySingle = (q: Question) => {
    navigator.clipboard.writeText(JSON.stringify(q, null, 2));
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Copy entire JSON
  const handleCopyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(questions, null, 2));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Download questions.json
  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kbc_questions_${questions.length}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-amber-950/60">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-cinzel font-bold text-amber-300">
              QUESTION DATABASE
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Displaying {filteredQuestions.length} of {questions.length} questions formatted for Web & Game integration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Procedural Generation Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#09112e] border border-amber-900/60">
            <button
              onClick={() => onGenerateCount(1000)}
              disabled={isGenerating}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+1,000 Qs</span>
            </button>
            <button
              onClick={() => onGenerateCount(5000)}
              disabled={isGenerating}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+5,000 Qs</span>
            </button>
            <button
              onClick={() => onGenerateCount(10000)}
              disabled={isGenerating}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 fill-current" />}
              <span>Generate 10,000 Questions</span>
            </button>
          </div>

          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-amber-500/50 bg-[#0f173d] text-amber-300 hover:bg-[#162152] transition-colors"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied Full DB!' : 'Copy DB JSON'}</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 hover:from-amber-500 hover:to-amber-400 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search questions, options, lore..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#09112e] border border-amber-950/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#09112e] rounded-xl border border-amber-950/80 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#09112e] rounded-xl border border-amber-950/80 overflow-x-auto">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setSelectedDifficulty(diff);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="mb-4 flex items-center justify-between px-2 py-2 rounded-xl bg-[#09112e] border border-amber-950/60 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Page <strong className="text-amber-300 font-mono-nums">{currentPage}</strong> of <strong className="text-amber-300 font-mono-nums">{totalPages}</strong>
            </span>
            <span className="text-slate-600">·</span>
            <span>Showing {paginatedQuestions.length} items (50/page)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-[#060c24] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-[#060c24] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="flex flex-col gap-3">
        {paginatedQuestions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#09112e] border border-slate-800 text-slate-400 text-sm">
            No questions found matching your filter criteria. Try clearing search or filters.
          </div>
        ) : (
          paginatedQuestions.map((q) => {
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className="rounded-xl border border-amber-950/60 bg-[#09112e] overflow-hidden transition-all hover:border-amber-500/30"
              >
                {/* Collapsed Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="flex items-center justify-between p-4 cursor-pointer gap-4 hover:bg-slate-900/30"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono-nums flex items-center justify-center shrink-0">
                      #{q.id}
                    </span>

                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-semibold text-amber-400">{q.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{q.difficulty}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-nums font-semibold text-amber-200">{q.prize_money}</span>
                      </div>
                      <h3 className="text-sm font-medium text-slate-200 mt-0.5">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopySingle(q);
                      }}
                      title="Copy Question JSON"
                      className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
                    >
                      {copiedId === q.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-amber-950/40 bg-[#060c24]/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.answer;
                        const letters = ['A', 'B', 'C', 'D'];
                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center gap-2 p-2.5 rounded-lg text-xs ${
                              isCorrect
                                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold'
                                : 'bg-[#09112e] border border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                              {letters[optIdx]}
                            </span>
                            <span>{opt}</span>
                            {isCorrect && (
                              <span className="ml-auto text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs">
                      <strong className="text-amber-400 font-semibold">Explanation: </strong>
                      <span className="text-slate-300">{q.explanation}</span>
                    </div>

                    {/* Raw JSON Preview */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>Raw JSON Object:</span>
                        <button
                          onClick={() => handleCopySingle(q)}
                          className="text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <pre className="p-2.5 rounded-lg bg-[#040817] border border-slate-800 text-[11px] font-mono-nums text-amber-200/90 overflow-x-auto">
                        {JSON.stringify(q, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#09112e] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous 50
          </button>
          <span className="text-slate-400 font-mono-nums">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#09112e] text-slate-300 hover:text-amber-300 hover:border-amber-500/40 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next 50
          </button>
        </div>
      )}
    </div>
  );
};
