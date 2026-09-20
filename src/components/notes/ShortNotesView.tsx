import React, { useState } from 'react';
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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ShortNote } from '../../types';
import { clsx } from 'clsx';

export const ShortNotesView: React.FC = () => {
  const { shortNotes, toggleSaveNote, awardXp } = useApp();
  const [selectedNote, setSelectedNote] = useState<ShortNote>(shortNotes[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    const textToCopy = `${selectedNote.title}\n\nWhat it is: ${selectedNote.whatItIs}\n\nThink of it like: ${selectedNote.thinkOfItLike}\n\nRemember:\n${selectedNote.rememberThis.map((r) => `• ${r}`).join('\n')}\n\nCommon Mistake: ${selectedNote.commonMistake}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-[#FAF6EE] p-5 sm:p-7 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
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
            Designed to read before interviews, lab vivas, or building new features.
          </p>
        </div>
      </div>

      {/* Split View: Left List of Notes, Right Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Note Selector Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-display font-black uppercase tracking-wider text-[#575757] px-1">
            AVAILABLE TOPICS ({shortNotes.length})
          </span>
          <div className="space-y-2.5">
            {shortNotes.map((note) => {
              const isSelected = selectedNote.id === note.id;
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
                  <span
                    className={clsx(
                      'text-[11px] font-semibold',
                      isSelected ? 'text-[#FAF6EE]/75' : 'text-[#575757]'
                    )}
                  >
                    {note.readTime}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reader Canvas */}
        <div className="lg:col-span-8 bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[5px_5px_0px_#171717] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#171717]/10 flex-wrap gap-3">
            <div>
              <span className="text-xs font-display font-black text-[#E9785A] uppercase tracking-wider">
                {selectedNote.category}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
                {selectedNote.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={copied ? <Check size={14} /> : <Copy size={14} />}
                onClick={handleCopy}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                variant={selectedNote.isSaved ? 'forest' : 'primary'}
                size="sm"
                icon={selectedNote.isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                onClick={() => {
                  toggleSaveNote(selectedNote.id);
                  if (!selectedNote.isSaved) {
                    awardXp(10, 'Saved Revision Note to Profile');
                  }
                }}
              >
                {selectedNote.isSaved ? 'Saved in Notes' : 'Save to my notes'}
              </Button>
            </div>
          </div>

          {/* 1. What It Is */}
          <div className="space-y-1.5">
            <span className="text-xs font-display font-black uppercase tracking-wider text-[#244B3A]">
              1. WHAT IT IS
            </span>
            <p className="text-sm sm:text-base font-medium text-[#171717] leading-relaxed">
              {selectedNote.whatItIs}
            </p>
          </div>

          {/* 2. Think of it like (Analogy) */}
          <div className="p-4 bg-[#F2C6A8]/40 rounded-2xl border-2 border-[#171717] space-y-1">
            <span className="text-xs font-display font-black text-[#171717] uppercase tracking-wider flex items-center gap-1.5">
              💡 2. THINK OF IT LIKE...
            </span>
            <p className="text-xs sm:text-sm text-[#171717] font-semibold leading-relaxed">
              {selectedNote.thinkOfItLike}
            </p>
          </div>

          {/* 3. Remember This */}
          <div className="space-y-2">
            <span className="text-xs font-display font-black uppercase tracking-wider text-[#244B3A]">
              3. KEY RULES TO REMEMBER
            </span>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#171717] font-medium">
              {selectedNote.rememberThis.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#E4A93A] font-black">✦</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Common Mistake */}
          <div className="p-4 bg-[#E9785A]/15 rounded-2xl border-2 border-[#E9785A] space-y-1">
            <span className="text-xs font-display font-black text-[#E9785A] uppercase tracking-wider">
              ⚠️ 4. COMMON MISTAKE TO AVOID
            </span>
            <p className="text-xs sm:text-sm text-[#171717] font-semibold">
              {selectedNote.commonMistake}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
