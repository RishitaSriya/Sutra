import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Clock,
  Sparkles,
  Zap,
  Copy,
  Check,
  FileText,
  Search,
  Plus,
  Loader2,
  X,
  Lightbulb,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ShortNote } from '../../types';
import { noteApi } from '../../api/noteApi';
import { clsx } from 'clsx';

const CATEGORIES = [
  'All',
  'Web Development',
  'Data Science',
  'Security & Systems',
  'GATE CSE',
  'Saved',
];

export const ShortNotesView: React.FC = () => {
  const { shortNotes, toggleSaveNote, awardXp, user, triggerConfetti } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [localNotes, setLocalNotes] = useState<ShortNote[]>(shortNotes);
  const [selectedNote, setSelectedNote] = useState<ShortNote>(shortNotes[0] || null);
  const [copied, setCopied] = useState<boolean>(false);

  // AI Synthesizer Modal State
  const [isSynthesizeOpen, setIsSynthesizeOpen] = useState<boolean>(false);
  const [aiTopic, setAiTopic] = useState<string>('');
  const [aiCategory, setAiCategory] = useState<string>(user?.currentRole || 'Web Development');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Sync if context notes change
  React.useEffect(() => {
    setLocalNotes(shortNotes);
    if (!selectedNote && shortNotes.length > 0) {
      setSelectedNote(shortNotes[0]);
    }
  }, [shortNotes]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return localNotes.filter((note) => {
      const matchesCat =
        selectedCategory === 'All'
          ? true
          : selectedCategory === 'Saved'
          ? note.isSaved
          : note.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            selectedCategory.toLowerCase().includes(note.category.toLowerCase());

      const matchesSearch =
        !searchQuery.trim() ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.whatItIs.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });
  }, [localNotes, selectedCategory, searchQuery]);

  const activeNote = selectedNote || filteredNotes[0] || localNotes[0];

  const handleCopy = () => {
    if (!activeNote) return;
    const textToCopy = `${activeNote.title}\n\nWhat it is: ${activeNote.whatItIs}\n\nThink of it like: ${activeNote.thinkOfItLike}\n\nRemember:\n${activeNote.rememberThis.map((r) => `• ${r}`).join('\n')}\n\nCommon Mistake: ${activeNote.commonMistake}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateAiNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsGenerating(true);
    setGenError(null);
    try {
      const generated = await noteApi.generateAiNote(aiTopic.trim(), aiCategory);
      setLocalNotes((prev) => [generated, ...prev]);
      setSelectedNote(generated);
      setIsSynthesizeOpen(false);
      setAiTopic('');
      awardXp(35, `Synthesized 60-Sec Note: ${generated.title}`);
      triggerConfetti();
    } catch (err: any) {
      setGenError(err.message || 'AI Note synthesis failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-[#FAF6EE] p-5 sm:p-7 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="peach" size="sm" icon={<Clock size={12} />}>
              60-SECOND REVISION SHEETS
            </Badge>
            <span className="text-xs font-bold text-[#244B3A]">
              ZERO FLUFF • PURE ESSENCE
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
            Short Notes for Quick Revision
          </h2>
          <p className="text-xs sm:text-sm text-[#575757] font-semibold mt-0.5">
            Designed to read before interviews, lab vivas, or building production features.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={<Sparkles size={16} />}
            onClick={() => setIsSynthesizeOpen(true)}
          >
            ✨ AI Synthesize Note
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-full text-xs font-display font-bold border-2 transition-all whitespace-nowrap shadow-[2px_2px_0px_#171717]',
                  isSelected
                    ? 'bg-[#244B3A] text-[#FAF6EE] border-[#171717]'
                    : 'bg-[#FAF6EE] text-[#171717] border-[#171717] hover:bg-[#ECE4D0]'
                )}
              >
                {cat === 'Saved' ? '★ Saved Notes' : cat}
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#575757]" />
          <input
            type="text"
            placeholder="Search concepts or rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold bg-[#FAF6EE] border-2 border-[#171717] rounded-xl shadow-[2px_2px_0px_#171717] focus:outline-none focus:ring-2 focus:ring-[#244B3A]"
          />
        </div>
      </div>

      {/* Split View: Left List of Notes, Right Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Note Selector Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-display font-black uppercase tracking-wider text-[#575757]">
              REVISION SHEETS ({filteredNotes.length})
            </span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="p-6 text-center bg-[#FAF6EE] rounded-2xl border-2 border-[#171717] text-xs font-bold text-[#575757]">
                No notes found matching your filter.
                <button
                  onClick={() => setIsSynthesizeOpen(true)}
                  className="block mx-auto mt-2 text-[#244B3A] underline font-bold"
                >
                  Synthesize one with AI →
                </button>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={clsx(
                      'p-4 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between gap-2',
                      isSelected
                        ? 'bg-[#244B3A] text-[#F7F1E3] border-[#171717] shadow-[3px_3px_0px_#171717]'
                        : 'bg-[#FAF6EE] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={clsx(
                          'text-[10px] font-display font-black uppercase tracking-wider',
                          isSelected ? 'text-[#E4A93A]' : 'text-[#575757]'
                        )}
                      >
                        {note.topic}
                      </span>
                      {note.isSaved && (
                        <span className="text-xs text-[#E4A93A] font-bold">★ Saved</span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-sm leading-snug">
                      {note.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span
                        className={clsx(
                          'text-[11px] font-semibold',
                          isSelected ? 'text-[#FAF6EE]/75' : 'text-[#575757]'
                        )}
                      >
                        {note.readTime}
                      </span>
                      <span
                        className={clsx(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                          isSelected
                            ? 'bg-[#1A362A] text-[#FAF6EE] border-[#FAF6EE]/30'
                            : 'bg-[#F7F1E3] text-[#171717] border-[#171717]/30'
                        )}
                      >
                        {note.category}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Reader Canvas */}
        {activeNote ? (
          <div className="lg:col-span-8 bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[5px_5px_0px_#171717] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#171717]/10 flex-wrap gap-3">
              <div>
                <span className="text-xs font-display font-black text-[#E9785A] uppercase tracking-wider">
                  {activeNote.category} • {activeNote.topic}
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
                  {activeNote.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={copied ? <Check size={14} /> : <Copy size={14} />}
                  onClick={handleCopy}
                >
                  {copied ? 'Copied!' : 'Copy Sheet'}
                </Button>
                <Button
                  variant={activeNote.isSaved ? 'forest' : 'primary'}
                  size="sm"
                  icon={activeNote.isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  onClick={() => {
                    toggleSaveNote(activeNote.id);
                    setLocalNotes((prev) =>
                      prev.map((n) => (n.id === activeNote.id ? { ...n, isSaved: !n.isSaved } : n))
                    );
                    if (!activeNote.isSaved) {
                      awardXp(10, 'Saved Revision Note to Profile');
                    }
                  }}
                >
                  {activeNote.isSaved ? 'Saved in Notes' : 'Save to my notes'}
                </Button>
              </div>
            </div>

            {/* 1. What It Is */}
            <div className="space-y-1.5">
              <span className="text-xs font-display font-black uppercase tracking-wider text-[#244B3A] flex items-center gap-1.5">
                <BookOpen size={14} /> 1. WHAT IT IS & WHY IT EXISTS
              </span>
              <p className="text-sm sm:text-base font-medium text-[#171717] leading-relaxed">
                {activeNote.whatItIs}
              </p>
            </div>

            {/* 2. Think of it like (Analogy) */}
            <div className="p-4 bg-[#F2C6A8]/40 rounded-2xl border-2 border-[#171717] space-y-1">
              <span className="text-xs font-display font-black text-[#171717] uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb size={14} className="text-[#E9785A]" /> 2. THINK OF IT LIKE...
              </span>
              <p className="text-xs sm:text-sm text-[#171717] font-semibold leading-relaxed">
                {activeNote.thinkOfItLike}
              </p>
            </div>

            {/* 3. Remember This */}
            <div className="space-y-2">
              <span className="text-xs font-display font-black uppercase tracking-wider text-[#244B3A] flex items-center gap-1.5">
                <Flame size={14} className="text-[#E4A93A]" /> 3. KEY ARCHITECTURAL INVARIANTS
              </span>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#171717] font-medium">
                {activeNote.rememberThis.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#F7F1E3] p-2.5 rounded-xl border border-[#171717]/15">
                    <span className="text-[#E4A93A] font-black">✦</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Common Mistake */}
            <div className="p-4 bg-[#E9785A]/15 rounded-2xl border-2 border-[#E9785A] space-y-1">
              <span className="text-xs font-display font-black text-[#E9785A] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={14} /> 4. #1 PRODUCTION MISTAKE TO AVOID
              </span>
              <p className="text-xs sm:text-sm text-[#171717] font-semibold">
                {activeNote.commonMistake}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* AI Synthesizer Modal */}
      {isSynthesizeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF6EE] max-w-lg w-full p-6 sm:p-7 rounded-3xl border-3 border-[#171717] shadow-[6px_6px_0px_#171717] space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b-2 border-[#171717]/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#244B3A] text-[#FAF6EE] flex items-center justify-center font-bold">
                  ✨
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-[#171717]">
                    Synthesize 60-Sec Note
                  </h3>
                  <span className="text-[11px] font-bold text-[#575757]">
                    Powered by Google Gemini 3.6 Flash
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsSynthesizeOpen(false)}
                className="w-8 h-8 rounded-full border-2 border-[#171717] bg-[#F7F1E3] flex items-center justify-center hover:bg-[#ECE4D0]"
              >
                <X size={16} />
              </button>
            </div>

            {genError && (
              <div className="p-3 bg-red-100 border-2 border-red-500 rounded-xl text-xs font-bold text-red-700">
                {genError}
              </div>
            )}

            <form onSubmit={handleGenerateAiNote} className="space-y-4">
              <div>
                <label className="block text-xs font-display font-black uppercase tracking-wider text-[#171717] mb-1.5">
                  Concept or Topic Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus (Raft), JWT vs Session Cookies, B+ Tree Indexing..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  required
                  className="w-full p-3 text-sm font-semibold bg-[#F7F1E3] border-2 border-[#171717] rounded-xl shadow-[2px_2px_0px_#171717] focus:outline-none focus:ring-2 focus:ring-[#244B3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-display font-black uppercase tracking-wider text-[#171717] mb-1.5">
                  Domain / Category
                </label>
                <select
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value)}
                  className="w-full p-3 text-sm font-bold bg-[#F7F1E3] border-2 border-[#171717] rounded-xl shadow-[2px_2px_0px_#171717] focus:outline-none focus:ring-2 focus:ring-[#244B3A]"
                >
                  <option value="Web Development">Web Development & Full-Stack</option>
                  <option value="Data Science">Data Science & Analytics</option>
                  <option value="Security & Systems">Security, SOC & Networks</option>
                  <option value="GATE CSE">GATE Computer Science & OS</option>
                </select>
              </div>

              <div className="p-3 bg-[#F2C6A8]/30 rounded-xl border border-[#171717]/20 text-[11px] font-semibold text-[#575757]">
                💡 SUTRA synthesizes a high-yield 60-second summary: intuition analogy, 3 architectural invariants, and the #1 production pitfall.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setIsSynthesizeOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isGenerating || !aiTopic.trim()}
                  icon={isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                >
                  {isGenerating ? 'Synthesizing...' : 'Generate 60-Sec Note (+35 XP)'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
