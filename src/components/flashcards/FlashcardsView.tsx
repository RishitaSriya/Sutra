import React, { useState } from 'react';
import {
  RotateCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
  Layers,
  Code2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { aiApi } from '../../api/aiApi';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { clsx } from 'clsx';

export const FlashcardsView: React.FC = () => {
  const { flashcards, reviewFlashcard, addFlashcards, awardXp, triggerConfetti, triggerAiSimulation, user } = useApp();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const categories = ['all', ...Array.from(new Set(flashcards.map((c) => c.category).filter(Boolean)))];

  const effectiveCategory = categories.includes(selectedCategory) ? selectedCategory : 'all';

  const filteredCards =
    effectiveCategory === 'all'
      ? flashcards
      : flashcards.filter((c) => c.category === effectiveCategory);

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const handleGenerateCards = async () => {
    setIsGenerating(true);
    triggerAiSimulation('✨ Gemini AI: Synthesizing 3 high-yield active recall flashcards...');
    try {
      const topic = user.learningProfile?.careerPath || user.currentRole || 'Web Development';
      const newCards = await aiApi.generateFlashcards(topic, 3);
      if (newCards && newCards.length > 0) {
        addFlashcards(newCards);
        awardXp(30, 'Generated 3 AI Flashcards');
        triggerConfetti();
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (err) {
      console.error('Failed to generate AI cards:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (filteredCards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (filteredCards.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }
  };

  const handleAction = (remembered: boolean) => {
    if (!activeCard) return;
    reviewFlashcard(activeCard.id, remembered);
    handleNext();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-[#FAF6EE] p-5 sm:p-7 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="marigold" size="sm" icon={<Layers size={13} />}>
              SPACED REPETITION DECK
            </Badge>
            <span className="text-xs font-bold text-[#244B3A]">
              {filteredCards.length} CARDS ACTIVE TODAY
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
            Active Recall Flashcards
          </h2>
          <p className="text-xs sm:text-sm text-[#575757] font-semibold mt-0.5">
            Auto-synthesized from your completed story missions and lessons.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={<Sparkles size={14} className={clsx(isGenerating && 'animate-spin text-[#F39C12]')} />}
          disabled={isGenerating}
          onClick={handleGenerateCards}
        >
          {isGenerating ? 'Synthesizing...' : 'Generate New Cards'}
        </Button>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={clsx(
                'px-3 py-1.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-2 select-none',
                effectiveCategory === cat
                  ? 'bg-[#244B3A] text-[#F7F1E3] border-[#171717] shadow-[2px_2px_0px_#171717]'
                  : 'bg-[#FAF6EE] text-[#575757] border-[#171717]/30 hover:border-[#171717]'
              )}
            >
              {cat === 'all' ? 'All Decks' : cat}
            </button>
          ))}
        </div>
      )}

      {/* 3D Flashcard Canvas */}
      {activeCard ? (
        <div className="space-y-4">
          {/* Card Indicator */}
          <div className="flex items-center justify-between text-xs font-display font-black text-[#575757] px-2">
            <span>
              CARD {currentIndex + 1} OF {filteredCards.length}
            </span>
            <span>MASTERY SCORE: {activeCard.masteryScore}%</span>
          </div>

          {/* Interactive Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[320px] sm:min-h-[360px] relative select-none group"
          >
            <div
              className={clsx(
                'w-full min-h-[320px] sm:min-h-[360px] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[6px_6px_0px_#171717] flex flex-col justify-between transition-all duration-300',
                isFlipped ? 'bg-[#244B3A] text-[#FAF6EE]' : 'bg-[#FAF6EE] text-[#171717]'
              )}
            >
              {/* Top Card Info */}
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant={isFlipped ? 'marigold' : 'peach'}
                  size="sm"
                >
                  {activeCard.topic}
                </Badge>
                <span className="text-xs font-display font-bold opacity-75 flex items-center gap-1">
                  <RotateCw size={13} /> {isFlipped ? 'Answer View' : 'Tap to Flip'}
                </span>
              </div>

              {/* Main Content (Front vs Back) */}
              <div className="py-4 space-y-4">
                {!isFlipped ? (
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-center leading-snug">
                    {activeCard.question}
                  </h3>
                ) : (
                  <div className="space-y-3">
                    <p className="font-sans font-medium text-base sm:text-lg leading-relaxed text-center sm:text-left">
                      {activeCard.answer}
                    </p>
                    {activeCard.codeSnippet && (
                      <div className="bg-[#171717] text-[#FAF6EE] p-3.5 rounded-xl font-mono text-xs overflow-x-auto border border-[#FAF6EE]/20">
                        <pre>
                          <code>{activeCard.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="text-center pt-2 border-t border-current/15 text-xs font-display font-bold opacity-70">
                {!isFlipped ? 'Click card to reveal answer' : 'Choose result below to update mastery'}
              </div>
            </div>
          </div>

          {/* Spaced Repetition Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              icon={<ChevronLeft size={18} />}
              onClick={handlePrev}
            >
              Prev
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="coral"
                size="lg"
                icon={<XCircle size={18} />}
                onClick={() => handleAction(false)}
              >
                Review again
              </Button>
              <Button
                variant="primary"
                size="lg"
                icon={<CheckCircle2 size={18} />}
                onClick={() => handleAction(true)}
              >
                Got it! 🔥
              </Button>
            </div>

            <Button
              variant="secondary"
              size="md"
              icon={<ChevronRight size={18} />}
              iconPosition="right"
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-[#FAF6EE] rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-2">
          <p className="font-display font-black text-xl text-[#171717]">No flashcards available for this topic yet.</p>
          <p className="text-sm text-[#575757] font-semibold">
            Complete your daily story missions and lessons to unlock active recall cards for this domain.
          </p>
        </div>
      )}
    </div>
  );
};
