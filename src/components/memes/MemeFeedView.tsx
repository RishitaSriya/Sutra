import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sparkles,
  Zap,
  ArrowRight,
  Laugh,
  Flame,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { TechMeme } from '../../types';
import { clsx } from 'clsx';

export const MemeFeedView: React.FC = () => {
  const { memes, likeMeme, saveMeme, startStoryLesson, awardXp, triggerConfetti } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [shareToast, setShareToast] = useState<string | null>(null);

  const categories = ['all', 'Programming', 'Debugging', 'College', 'DSA', 'AI'];

  const filteredMemes =
    selectedCategory === 'all'
      ? memes
      : memes.filter((m) => m.category === selectedCategory);

  const handleShare = (meme: TechMeme) => {
    navigator.clipboard.writeText(`Check out this relatable tech meme on SUTRA: "${meme.memeCard.headline}"`);
    setShareToast('Link copied to clipboard!');
    setTimeout(() => setShareToast(null), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-[#FAF6EE] p-5 sm:p-7 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="marigold" size="sm" icon={<Laugh size={13} />}>
              MEME → CURIOSITY → LEARNING
            </Badge>
            <span className="text-xs font-bold text-[#E9785A]">
              INDIAN STUDENT DEV CULTURE
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
            Tech Feed & Micro Missions
          </h2>
          <p className="text-xs sm:text-sm text-[#575757] font-semibold mt-0.5">
            Relatable struggles turned into 5-minute intuition-building breakthroughs.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={clsx(
              'px-3.5 py-1.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-2 select-none',
              selectedCategory === cat
                ? 'bg-[#244B3A] text-[#F7F1E3] border-[#171717] shadow-[2px_2px_0px_#171717]'
                : 'bg-[#FAF6EE] text-[#575757] border-[#171717]/30 hover:border-[#171717]'
            )}
          >
            {cat === 'all' ? 'All Memes' : cat}
          </button>
        ))}
      </div>

      {shareToast && (
        <div className="p-3 bg-[#E4A93A] text-[#171717] border-2 border-[#171717] rounded-xl text-center text-xs font-display font-bold shadow-[2px_2px_0px_#171717]">
          {shareToast}
        </div>
      )}

      {/* Memes List */}
      <div className="space-y-6">
        {filteredMemes.map((meme) => (
          <article
            key={meme.id}
            className="bg-[#FAF6EE] rounded-3xl border-2.5 border-[#171717] shadow-[5px_5px_0px_#171717] overflow-hidden"
          >
            {/* Meme Author Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b-2 border-[#171717]/10">
              <div className="flex items-center gap-3">
                <img
                  src={meme.avatar}
                  alt={meme.author}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-[#171717]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-sm text-[#171717]">
                      {meme.author}
                    </span>
                    <span className="text-xs text-[#575757]">{meme.handle}</span>
                  </div>
                  <p className="text-[10px] text-[#575757] font-semibold flex items-center gap-1">
                    <GraduationCap size={11} /> {meme.college}
                  </p>
                </div>
              </div>

              <Badge variant="peach" size="sm">
                {meme.category}
              </Badge>
            </div>

            {/* Meme Content Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <h3 className="font-display font-bold text-lg sm:text-xl text-[#171717] leading-snug">
                {meme.memeCard.headline}
              </h3>

              {/* Code vs Code comparison */}
              {meme.memeCard.type === 'code-vs-code' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {meme.memeCard.leftBlock && (
                    <div className="bg-[#F7F1E3] p-4 rounded-2xl border-2 border-[#171717] font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#575757]">
                        <span>{meme.memeCard.leftBlock.title}</span>
                        <span className="text-[10px] bg-[#E9785A]/20 px-1.5 py-0.5 rounded border border-[#E9785A]">
                          {meme.memeCard.leftBlock.badge}
                        </span>
                      </div>
                      <pre className="overflow-x-auto text-[#171717]">
                        <code>{meme.memeCard.leftBlock.code}</code>
                      </pre>
                    </div>
                  )}

                  {meme.memeCard.rightBlock && (
                    <div className="bg-[#171717] text-[#FAF6EE] p-4 rounded-2xl border-2 border-[#171717] font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-sans font-bold text-[#E4A93A]">
                        <span>{meme.memeCard.rightBlock.title}</span>
                        <span className="text-[10px] bg-[#244B3A] px-1.5 py-0.5 rounded border border-[#FAF6EE]/20">
                          {meme.memeCard.rightBlock.badge}
                        </span>
                      </div>
                      <pre className="overflow-x-auto">
                        <code>{meme.memeCard.rightBlock.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Dialogue scene */}
              {meme.memeCard.dialogue && (
                <div className="p-4 bg-[#F7F1E3] rounded-2xl border-2 border-[#171717] space-y-2">
                  {meme.memeCard.dialogue.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm font-sans">
                      <span className="font-display font-black text-[#244B3A] min-w-[70px]">
                        {d.speaker}:
                      </span>
                      <span className="font-medium text-[#171717]">{d.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs sm:text-sm text-[#575757] font-medium italic">
                “{meme.memeCard.caption}”
              </p>
            </div>

            {/* Social Interactions Bar */}
            <div className="px-5 py-3 bg-[#F7F1E3] border-t-2 border-[#171717]/10 flex items-center justify-between text-xs font-display font-bold">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => likeMeme(meme.id)}
                  className={clsx(
                    'flex items-center gap-1.5 cursor-pointer transition-all',
                    meme.liked ? 'text-[#E9785A]' : 'text-[#575757] hover:text-[#171717]'
                  )}
                >
                  <Heart
                    size={16}
                    className={meme.liked ? 'fill-[#E9785A]' : ''}
                  />
                  <span>{meme.likes}</span>
                </button>

                <div className="flex items-center gap-1.5 text-[#575757]">
                  <MessageCircle size={16} />
                  <span>{meme.commentsCount}</span>
                </div>

                <button
                  onClick={() => handleShare(meme)}
                  className="flex items-center gap-1.5 text-[#575757] hover:text-[#171717] cursor-pointer"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>

              <button
                onClick={() => saveMeme(meme.id)}
                className={clsx(
                  'cursor-pointer transition-all',
                  meme.saved ? 'text-[#E4A93A]' : 'text-[#575757] hover:text-[#171717]'
                )}
              >
                {meme.saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
            </div>

            {/* 🌟 THE BREAKTHROUGH: MEME -> CURIOSITY -> LEARNING BRIDGE */}
            <div className="p-4 sm:p-5 bg-[#244B3A] text-[#FAF6EE] border-t-2.5 border-[#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-display font-black bg-[#E4A93A] text-[#171717] px-2 py-0.5 rounded-full border border-[#171717]">
                    {meme.learningMissionBridge.badgeText}
                  </span>
                  <span className="text-xs font-bold text-[#E4A93A] flex items-center gap-1">
                    <Zap size={13} /> +{meme.learningMissionBridge.xp} XP
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm sm:text-base text-[#FAF6EE]">
                  😂 Too relatable? Want to actually understand this?
                </h4>
                <p className="text-xs text-[#FAF6EE]/80">
                  {meme.learningMissionBridge.hookTitle}
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                className="shrink-0"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                onClick={() => {
                  startStoryLesson(meme.learningMissionBridge.targetLessonId);
                }}
              >
                5 min mission →
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
