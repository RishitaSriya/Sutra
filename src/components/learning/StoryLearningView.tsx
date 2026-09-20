import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Code2,
  Flame,
  Zap,
  RotateCcw,
  Check,
  ChevronRight,
  BookOpen,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { clsx } from 'clsx';
import { learningApi, progressApi } from '../../api';

export const StoryLearningView: React.FC = () => {
  const { activeStoryLesson, setView, awardXp, triggerConfetti, triggerAiSimulation } = useApp();
  const [phase, setPhase] = useState<'story' | 'interactive' | 'breakdown' | 'quiz' | 'practice'>('story');

  // Interactive Ordering State
  const [items, setItems] = useState<string[]>(activeStoryLesson?.interactiveMoment?.initialItems || []);
  const [orderVerified, setOrderVerified] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<boolean>(false);

  // Quiz State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (activeStoryLesson?.interactiveMoment?.initialItems) {
      setItems(activeStoryLesson.interactiveMoment.initialItems);
    } else {
      setItems([]);
    }
    setOrderVerified(false);
    setOrderError(false);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setPhase('story');
  }, [activeStoryLesson?.id]);

  // Move item up / down in ordering challenge
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
    setOrderError(false);
  };

  const handleVerifyOrder = () => {
    // Check if matches correct order
    const isCorrect = items.every(
      (item, idx) => item === activeStoryLesson.interactiveMoment.correctOrder[idx]
    );

    if (isCorrect) {
      setOrderVerified(true);
      setOrderError(false);
      awardXp(40, 'Packet Wire Sequencing Mastered');
      triggerConfetti();
    } else {
      setOrderError(true);
    }
  };

  const handleQuizSubmit = async (optionId: string) => {
    setSelectedOption(optionId);
    setQuizSubmitted(true);
    const chosen = activeStoryLesson.miniChallenge.options.find((o) => o.id === optionId);
    if (chosen?.isCorrect) {
      awardXp(30, 'Mini Challenge Solved');
      triggerConfetti();
    }
    try {
      await progressApi.answerQuestion(activeStoryLesson.id, optionId);
    } catch (err) {
      console.warn('Backend quiz submit sync error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
      {/* Top Breadcrumb & Phase Steps */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF6EE] p-4 sm:p-5 rounded-2xl border-2 border-[#171717] shadow-[3px_3px_0px_#171717]">
        <div className="flex items-center gap-2">
          <Badge variant="forest" size="sm">
            LEVEL 0{activeStoryLesson.levelNumber}
          </Badge>
          <span className="font-display font-bold text-sm text-[#171717]">
            {activeStoryLesson.title}
          </span>
        </div>

        {/* Phase Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-display font-bold">
          {[
            { id: 'story', label: '1. Story' },
            { id: 'interactive', label: '2. Wire Sim' },
            { id: 'breakdown', label: '3. Concept' },
            { id: 'quiz', label: '4. Mini Test' },
            { id: 'practice', label: '5. Practice' },
          ].map((step) => (
            <button
              key={step.id}
              onClick={() => setPhase(step.id as any)}
              className={clsx(
                'px-2.5 py-1 rounded-lg border transition-all cursor-pointer select-none',
                phase === step.id
                  ? 'bg-[#244B3A] text-[#F7F1E3] border-[#171717] shadow-[1px_1px_0px_#171717]'
                  : 'bg-[#F7F1E3] text-[#575757] border-transparent hover:border-[#171717]/40'
              )}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* PHASE 1: STORY NARRATIVE */}
      {phase === 'story' && (
        <section className="bg-[#FAF6EE] p-6 sm:p-10 rounded-3xl border-2.5 border-[#171717] shadow-[6px_6px_0px_#171717] space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-black text-[#E9785A] uppercase tracking-wider">
              {activeStoryLesson.roleContext}
            </span>
            <span className="text-xs font-bold text-[#575757]">Chapter 1 / 5</span>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#171717] leading-tight">
              {activeStoryLesson.title}
            </h2>
            <div className="p-4 bg-[#F2C6A8]/30 rounded-2xl border-2 border-[#171717]">
              <p className="text-sm font-semibold text-[#171717]">
                {activeStoryLesson.narrative.premise}
              </p>
            </div>
            <div className="p-4 bg-[#E4A93A]/20 rounded-2xl border-2 border-[#171717]">
              <p className="text-sm font-semibold text-[#171717]">
                {activeStoryLesson.narrative.dilemma}
              </p>
            </div>
          </div>

          {/* Mission Objective Callout */}
          <div className="p-5 bg-[#244B3A] text-[#FAF6EE] rounded-2xl border-2 border-[#171717] shadow-[3px_3px_0px_#171717] space-y-2">
            <span className="text-xs font-display font-black text-[#E4A93A] uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={14} /> YOUR MISSION OBJECTIVE
            </span>
            <p className="text-sm sm:text-base font-medium">
              {activeStoryLesson.narrative.objective}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-[#171717]/10">
            <Button variant="secondary" size="md" onClick={() => setView('learn')}>
              Back to Roadmap
            </Button>
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              onClick={() => {
                setPhase('interactive');
                triggerAiSimulation('✨ Simulating live network socket packets between client and server...');
              }}
            >
              Step Inside The Wire →
            </Button>
          </div>
        </section>
      )}

      {/* PHASE 2: INTERACTIVE WIRE SIMULATION & SEQUENCING */}
      {phase === 'interactive' && (
        <section className="bg-[#FAF6EE] p-6 sm:p-10 rounded-3xl border-2.5 border-[#171717] shadow-[6px_6px_0px_#171717] space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="marigold" size="sm" icon={<Sparkles size={13} />}>
              INTERACTIVE REVEAL
            </Badge>
            <span className="text-xs font-bold text-[#575757]">Step 2 / 5</span>
          </div>

          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
              Connect the Broken Request Flow
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#575757] mt-1">
              {activeStoryLesson.interactiveMoment.prompt}
            </p>
          </div>

          {/* Draggable/Movable Items Stack */}
          <div className="space-y-2.5">
            {items.map((itemText, idx) => (
              <div
                key={itemText}
                className={clsx(
                  'flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 font-display text-xs sm:text-sm font-bold transition-all select-none',
                  orderVerified
                    ? 'bg-[#244B3A] text-[#F7F1E3] border-[#171717] shadow-[2px_2px_0px_#171717]'
                    : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[2.5px_2.5px_0px_#171717]'
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      'w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-black',
                      orderVerified
                        ? 'bg-[#E4A93A] text-[#171717] border-[#171717]'
                        : 'bg-[#FAF6EE] text-[#171717] border-[#171717]'
                    )}
                  >
                    {idx + 1}
                  </span>
                  <span>{itemText}</span>
                </div>

                {/* Move Controls */}
                {!orderVerified && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, 'up')}
                      className="p-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#E4A93A] border border-[#171717] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      disabled={idx === items.length - 1}
                      onClick={() => moveItem(idx, 'down')}
                      className="p-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#E4A93A] border border-[#171717] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Feedback message */}
          {orderError && (
            <div className="p-3.5 bg-[#E9785A]/20 border-2 border-[#E9785A] rounded-2xl flex items-center gap-2 text-xs font-bold text-[#171717]">
              <AlertCircle size={16} className="text-[#E9785A]" />
              <span>Almost! Remember: DNS must resolve the domain to an IP before HTTP requests can travel.</span>
            </div>
          )}

          {orderVerified && (
            <div className="p-4 bg-[#6F8F72]/20 border-2 border-[#244B3A] rounded-2xl space-y-1">
              <span className="text-xs font-display font-black text-[#244B3A] flex items-center gap-1.5">
                <CheckCircle2 size={16} /> PERFECT CONNECTION ESTABLISHED 🔥
              </span>
              <p className="text-xs text-[#171717] font-semibold">
                {activeStoryLesson.interactiveMoment.explanationAfterSuccess}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t-2 border-[#171717]/10">
            <Button variant="secondary" size="md" onClick={() => setPhase('story')}>
              Back to Premise
            </Button>
            {!orderVerified ? (
              <Button variant="primary" size="lg" onClick={handleVerifyOrder}>
                Verify Sequence ✨
              </Button>
            ) : (
              <Button
                variant="forest"
                size="lg"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
                onClick={() => setPhase('breakdown')}
              >
                What Just Happened? →
              </Button>
            )}
          </div>
        </section>
      )}

      {/* PHASE 3: CONCEPT BREAKDOWN ("WHAT JUST HAPPENED?") */}
      {phase === 'breakdown' && (
        <section className="bg-[#FAF6EE] p-6 sm:p-10 rounded-3xl border-2.5 border-[#171717] shadow-[6px_6px_0px_#171717] space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="forest" size="sm">
              VISUAL CONCEPT BREAKDOWN
            </Badge>
            <span className="text-xs font-bold text-[#575757]">Step 3 / 5</span>
          </div>

          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
              {activeStoryLesson.conceptBreakdown.title}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#575757] mt-1">
              {activeStoryLesson.conceptBreakdown.summary}
            </p>
          </div>

          {/* Real-World Analogy (Chai Cafe) */}
          <div className="p-5 bg-[#F2C6A8]/40 rounded-2xl border-2 border-[#171717] shadow-[3px_3px_0px_#171717] space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeStoryLesson.conceptBreakdown.realWorldAnalogy.icon}</span>
              <h4 className="font-display font-black text-base text-[#171717]">
                {activeStoryLesson.conceptBreakdown.realWorldAnalogy.title}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#171717] font-medium leading-relaxed">
              {activeStoryLesson.conceptBreakdown.realWorldAnalogy.story}
            </p>
          </div>

          {/* Visual Diagram Flow */}
          <div className="space-y-3">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#575757]">
              Visual Step-by-Step Architecture:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeStoryLesson.conceptBreakdown.visualDiagramFlow.map((flow) => (
                <div
                  key={flow.step}
                  className="p-3.5 bg-[#F7F1E3] rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717] space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-display font-bold">
                    <span className="text-[#244B3A]">STEP 0{flow.step} • {flow.actor}</span>
                    <span className="text-[10px] bg-[#E4A93A] text-[#171717] px-1.5 py-0.5 rounded border border-[#171717]">
                      {flow.action}
                    </span>
                  </div>
                  <p className="text-xs text-[#575757] font-medium">
                    {flow.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes & Golden Rule */}
          <div className="space-y-3 pt-2">
            <div className="p-4 bg-[#FAF6EE] rounded-2xl border-2 border-[#171717]">
              <span className="text-xs font-display font-black text-[#E9785A] uppercase tracking-wider block mb-1.5">
                ⚠️ Top Mistakes Students Make in Exams & Interviews:
              </span>
              <ul className="space-y-1 text-xs text-[#575757] font-semibold list-disc list-inside">
                {activeStoryLesson.conceptBreakdown.commonMistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#244B3A] text-[#FAF6EE] rounded-2xl border-2 border-[#171717] shadow-[2.5px_2.5px_0px_#171717]">
              <span className="text-xs font-display font-black text-[#E4A93A] uppercase tracking-wider block mb-1">
                ⭐ THE GOLDEN RULE
              </span>
              <p className="text-xs sm:text-sm font-medium">
                {activeStoryLesson.conceptBreakdown.goldenRule}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-[#171717]/10">
            <Button variant="secondary" size="md" onClick={() => setPhase('interactive')}>
              Back to Sim
            </Button>
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              onClick={() => setPhase('quiz')}
            >
              Test Me Now →
            </Button>
          </div>
        </section>
      )}

      {/* PHASE 4: MINI CHALLENGES & SCENARIO QUIZ */}
      {phase === 'quiz' && (
        <section className="bg-[#FAF6EE] p-6 sm:p-10 rounded-3xl border-2.5 border-[#171717] shadow-[6px_6px_0px_#171717] space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="coral" size="sm" icon={<Zap size={13} />}>
              SCENARIO MINI CHALLENGE
            </Badge>
            <span className="text-xs font-bold text-[#575757]">Step 4 / 5</span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-display font-black text-[#E9785A] uppercase tracking-wider">
              {activeStoryLesson.miniChallenge.context}
            </span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#171717] leading-snug">
              {activeStoryLesson.miniChallenge.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {activeStoryLesson.miniChallenge.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => handleQuizSubmit(option.id)}
                  className={clsx(
                    'p-4 rounded-2xl border-2 font-display transition-all cursor-pointer select-none flex flex-col justify-between gap-2',
                    isSelected
                      ? option.isCorrect
                        ? 'bg-[#244B3A] text-[#F7F1E3] border-[#171717] shadow-[3px_3px_0px_#171717]'
                        : 'bg-[#E9785A] text-[#171717] border-[#171717] shadow-[3px_3px_0px_#171717]'
                      : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{option.label}</span>
                    {isSelected && (
                      <span className="text-xs font-black">
                        {option.isCorrect ? '✓ CORRECT' : '✕ INCORRECT'}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <p
                      className={clsx(
                        'text-xs font-semibold pt-1 border-t',
                        option.isCorrect
                          ? 'text-[#E4A93A] border-[#F7F1E3]/20'
                          : 'text-[#171717] border-[#171717]/20'
                      )}
                    >
                      {option.feedback}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-[#171717]/10">
            <Button variant="secondary" size="md" onClick={() => setPhase('breakdown')}>
              Review Breakdown
            </Button>
            <Button
              variant="forest"
              size="lg"
              disabled={!quizSubmitted}
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              onClick={() => setPhase('practice')}
            >
              Practice for Real →
            </Button>
          </div>
        </section>
      )}

      {/* PHASE 5: NOW USE IT (PRACTICE) */}
      {phase === 'practice' && (
        <section className="bg-[#FAF6EE] p-6 sm:p-10 rounded-3xl border-2.5 border-[#171717] shadow-[6px_6px_0px_#171717] space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="marigold" size="sm" icon={<Code2 size={13} />}>
              NOW USE IT IN REAL CODE
            </Badge>
            <span className="text-xs font-bold text-[#575757]">Step 5 / 5</span>
          </div>

          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
              {activeStoryLesson.practiceTask.title}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#575757] mt-1">
              {activeStoryLesson.practiceTask.description}
            </p>
          </div>

          {/* Starter Code Sandbox Viewer */}
          {activeStoryLesson.practiceTask.starterSnippet && (
            <div className="bg-[#171717] text-[#FAF6EE] p-4 sm:p-5 rounded-2xl border-2 border-[#171717] shadow-[4px_4px_0px_#E4A93A] font-mono text-xs sm:text-sm overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#FAF6EE]/20 text-xs text-[#E4A93A] font-sans font-bold">
                <span>merchantStatus.js</span>
                <span>JavaScript Async / Await</span>
              </div>
              <pre>
                <code>{activeStoryLesson.practiceTask.starterSnippet}</code>
              </pre>
            </div>
          )}

          {/* Pro-Tip Box */}
          <div className="p-4 bg-[#F2C6A8]/40 rounded-2xl border-2 border-[#171717] space-y-1">
            <span className="text-xs font-display font-black text-[#171717] uppercase tracking-wider">
              💡 PRO HINT
            </span>
            <p className="text-xs text-[#171717] font-semibold">
              {activeStoryLesson.practiceTask.hint}
            </p>
          </div>

          {/* External Practice Link (e.g. JS Playground / MDN) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-[#171717]/10">
            {activeStoryLesson.practiceTask.externalLinkUrl && (
              <a
                href={activeStoryLesson.practiceTask.externalLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-display font-bold text-[#244B3A] hover:underline"
              >
                {activeStoryLesson.practiceTask.externalLinkText} <ExternalLink size={14} />
              </a>
            )}

            <Button
              variant="forest"
              size="lg"
              icon={<Flame size={18} />}
              onClick={async () => {
                awardXp(50, 'Completed Entire Story Mission Chapter');
                triggerConfetti();
                try {
                  await learningApi.completeLesson(activeStoryLesson.id);
                } catch (err) {
                  console.warn('Backend lesson complete sync error:', err);
                }
                setView('home');
              }}
            >
              Complete Chapter (+50 XP) 🏆
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};
