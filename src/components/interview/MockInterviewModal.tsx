import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Building2,
  Award,
  ChevronRight,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Briefcase,
  Layers,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { aiApi, InterviewStartResponse, InterviewRespondResponse } from '../../api/aiApi';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { clsx } from 'clsx';

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TARGET_COMPANIES = [
  { name: 'Razorpay', domain: 'Fintech & High-Volume Payments', color: '#0C2340', accent: '#3395FF', icon: '💳' },
  { name: 'Google', domain: 'Distributed Systems & Hyperscale', color: '#1A73E8', accent: '#34A853', icon: '🌐' },
  { name: 'Microsoft', domain: 'Cloud Microservices & Resiliency', color: '#0078D4', accent: '#FFB900', icon: '☁️' },
  { name: 'CrowdStrike', domain: 'High-Throughput Kernel & Security', color: '#E01E26', accent: '#FF5A5F', icon: '🛡️' },
  { name: 'Swiggy', domain: 'Real-time Geospatial & Logistics', color: '#FC8019', accent: '#FFA441', icon: '🛵' },
];

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({ isOpen, onClose }) => {
  const { user, triggerConfetti } = useApp();
  
  const userRole = user.learningProfile?.careerPath || (user.trackType === 'exam' ? 'GATE CSE Journey' : 'Web Developer');
  const [selectedCompany, setSelectedCompany] = useState<string>('Razorpay');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [interviewData, setInterviewData] = useState<InterviewStartResponse | null>(null);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [candidateAnswer, setCandidateAnswer] = useState<string>('');
  const [lastEvaluation, setLastEvaluation] = useState<InterviewRespondResponse | null>(null);
  const [history, setHistory] = useState<Array<{ round: number; question: string; answer: string; evaluation: InterviewRespondResponse }>>([]);
  const [showHint, setShowHint] = useState<boolean>(false);

  const answerInputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize or start an interview
  const handleStartInterview = async (companyName: string = selectedCompany) => {
    setIsLoading(true);
    setLastEvaluation(null);
    setHistory([]);
    setCandidateAnswer('');
    setShowHint(false);
    setCurrentRound(1);
    
    try {
      const res = await aiApi.startInterview({
        company: companyName,
        role: userRole
      });
      setInterviewData(res);
      setSelectedCompany(companyName);
    } catch (err) {
      console.error('Failed to start interview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !interviewData) {
      handleStartInterview('Razorpay');
    }
  }, [isOpen]);

  const handleSubmitAnswer = async () => {
    if (!interviewData || !candidateAnswer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const activeQuestion = (lastEvaluation && lastEvaluation.next_question) 
      ? lastEvaluation.next_question 
      : interviewData.question;

    try {
      const res = await aiApi.respondInterview({
        interview_id: interviewData.interview_id,
        company: interviewData.company,
        role: userRole,
        question: activeQuestion,
        answer: candidateAnswer.trim(),
        round_number: currentRound
      });

      setLastEvaluation(res);
      setHistory(prev => [
        ...prev,
        {
          round: currentRound,
          question: activeQuestion,
          answer: candidateAnswer.trim(),
          evaluation: res
        }
      ]);

      if (res.is_completed) {
        triggerConfetti();
      }
    } catch (err) {
      console.error('Failed to evaluate interview answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextRound = () => {
    if (lastEvaluation?.next_round) {
      setCurrentRound(lastEvaluation.next_round);
      setCandidateAnswer('');
      setLastEvaluation(null);
      setShowHint(false);
      setTimeout(() => {
        answerInputRef.current?.focus();
      }, 100);
    }
  };

  if (!isOpen) return null;

  const currentCompanyObj = TARGET_COMPANIES.find(c => c.name === selectedCompany) || TARGET_COMPANIES[0];
  const activeQuestionText = (lastEvaluation && lastEvaluation.next_question) 
    ? lastEvaluation.next_question 
    : (interviewData?.question || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FAF6EE] text-[#171717] border-3 border-[#171717] rounded-2xl shadow-[8px_8px_0px_#171717] overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#244B3A] text-[#FAF6EE] border-b-3 border-[#171717]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F39C12] text-[#171717] border-2 border-[#171717] flex items-center justify-center font-black shadow-[2px_2px_0px_#171717] text-lg">
              {currentCompanyObj.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg sm:text-xl tracking-wide uppercase">
                  AI Mock Technical Interview
                </h2>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#E0533C] text-white border border-[#171717]">
                  Gemini Live
                </span>
              </div>
              <p className="text-xs text-[#FAF6EE]/80 font-medium">
                Targeting <span className="font-bold text-[#F39C12]">{selectedCompany}</span> • {userRole} Track
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FAF6EE] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#E0533C] hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Company Quick-Selector & Rounds Progress */}
        <div className="px-5 py-3 bg-[#EFE9DB] border-b-2 border-[#171717] flex flex-wrap items-center justify-between gap-3">
          {/* Company Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            <span className="text-xs font-black uppercase text-[#171717]/70 mr-1 flex items-center gap-1">
              <Building2 size={13} /> Company:
            </span>
            {TARGET_COMPANIES.map(comp => (
              <button
                key={comp.name}
                onClick={() => handleStartInterview(comp.name)}
                disabled={isLoading || isSubmitting}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black border-2 transition-all cursor-pointer whitespace-nowrap',
                  selectedCompany === comp.name
                    ? 'bg-[#171717] text-[#FAF6EE] border-[#171717] shadow-[2px_2px_0px_#F39C12]'
                    : 'bg-[#FAF6EE] text-[#171717] border-[#171717] hover:bg-[#F39C12]/20'
                )}
              >
                <span>{comp.icon}</span>
                <span>{comp.name}</span>
              </button>
            ))}
          </div>

          {/* 3-Round Step Tracker */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map(round => {
              const isPast = round < currentRound || (round === currentRound && lastEvaluation?.is_completed);
              const isCurrent = round === currentRound && !lastEvaluation?.is_completed;
              return (
                <div
                  key={round}
                  className={clsx(
                    'flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black border-1.5 transition-all',
                    isPast
                      ? 'bg-[#244B3A] text-white border-[#171717]'
                      : isCurrent
                      ? 'bg-[#F39C12] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717]'
                      : 'bg-[#FAF6EE]/60 text-[#171717]/40 border-[#171717]/30'
                  )}
                >
                  {isPast ? <CheckCircle2 size={12} /> : <span>R{round}</span>}
                  <span className="hidden md:inline">
                    {round === 1 ? 'System Design' : round === 2 ? 'Deep Dive' : 'Scale & Verdict'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-[#244B3A] border-t-transparent rounded-full animate-spin" />
              <p className="font-display font-black text-sm uppercase tracking-wider text-[#244B3A]">
                Summoning {selectedCompany} Lead Bar Raiser...
              </p>
            </div>
          ) : !interviewData ? (
            <div className="text-center py-16">
              <p className="font-bold text-sm text-[#171717]/70">No active interview session.</p>
              <Button onClick={() => handleStartInterview()} className="mt-4">
                Start Mock Interview
              </Button>
            </div>
          ) : (
            <>
              {/* Interviewer Persona Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF6EE] border-2.5 border-[#171717] shadow-[3px_3px_0px_#171717]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#244B3A] text-white flex items-center justify-center font-black text-sm border border-[#171717]">
                    <Cpu size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-black text-xs sm:text-sm uppercase tracking-wide">
                        {interviewData.interviewer_persona}
                      </h4>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>
                    <p className="text-[11px] text-[#171717]/70">
                      Technical Bar Raiser • Live Socratic Evaluation
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStartInterview(selectedCompany)}
                  className="text-xs flex items-center gap-1"
                >
                  <RotateCcw size={13} />
                  <span>Restart</span>
                </Button>
              </div>

              {/* Question & Context Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E0533C] text-white border border-[#171717]">
                    Round {currentRound} Question
                  </span>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 text-xs font-bold text-[#244B3A] hover:underline cursor-pointer"
                  >
                    <HelpCircle size={14} />
                    <span>{showHint ? 'Hide Hint' : 'Show Architectural Hint'}</span>
                  </button>
                </div>

                <p className="font-serif text-sm sm:text-base font-semibold leading-relaxed text-[#171717]">
                  {activeQuestionText}
                </p>

                {showHint && interviewData.context_hint && (
                  <div className="p-3 rounded-lg bg-[#FAF6EE] border-2 border-[#F39C12] text-xs space-y-1 animate-fade-in">
                    <div className="flex items-center gap-1.5 font-black text-[#F39C12] uppercase tracking-wide">
                      <Sparkles size={13} />
                      <span>Interviewer Constraint / Hint</span>
                    </div>
                    <p className="text-[#171717]/80">{interviewData.context_hint}</p>
                  </div>
                )}
              </div>

              {/* Evaluation Card (When Answer Has Been Evaluated) */}
              {lastEvaluation && (
                <div className="p-5 rounded-xl bg-[#FAF6EE] border-3 border-[#171717] shadow-[5px_5px_0px_#171717] space-y-4 animate-slide-up">
                  {/* Verdict & Score Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-[#171717]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F39C12] text-[#171717] border-2 border-[#171717] flex flex-col items-center justify-center font-black shadow-[2px_2px_0px_#171717]">
                        <span className="text-lg leading-none">{lastEvaluation.score}</span>
                        <span className="text-[9px] uppercase">/ 10</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-black text-sm uppercase">
                            {lastEvaluation.is_completed ? 'Final Interview Assessment' : 'Round Evaluation'}
                          </h4>
                          {lastEvaluation.verdict && (
                            <span className={clsx(
                              'text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-[#171717]',
                              lastEvaluation.verdict === 'Strong Hire' ? 'bg-emerald-500 text-white' :
                              lastEvaluation.verdict === 'Hire' ? 'bg-[#3395FF] text-white' : 'bg-[#E0533C] text-white'
                            )}>
                              {lastEvaluation.verdict}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#171717]/70">
                          XP Earned: <span className="font-black text-[#244B3A]">+{lastEvaluation.xp_awarded} XP</span> • Total: {lastEvaluation.total_xp} XP
                        </p>
                      </div>
                    </div>

                    {!lastEvaluation.is_completed ? (
                      <Button
                        onClick={handleNextRound}
                        className="flex items-center gap-1.5 shadow-[3px_3px_0px_#171717]"
                      >
                        <span>Proceed to Round {lastEvaluation.next_round}</span>
                        <ChevronRight size={16} />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStartInterview()}
                        className="flex items-center gap-1.5 bg-[#244B3A] text-white shadow-[3px_3px_0px_#171717]"
                      >
                        <RotateCcw size={15} />
                        <span>Start Next Company Mock</span>
                      </Button>
                    )}
                  </div>

                  {/* Feedback Text */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-black uppercase tracking-wider text-[#171717]/70">
                      Technical Bar Raiser Feedback
                    </h5>
                    <p className="text-xs sm:text-sm text-[#171717]/90 leading-relaxed bg-white p-3 rounded-lg border-2 border-[#171717]">
                      {lastEvaluation.feedback}
                    </p>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lastEvaluation.key_strengths && lastEvaluation.key_strengths.length > 0 && (
                      <div className="p-3 rounded-lg bg-emerald-50 border-2 border-emerald-600 space-y-1.5">
                        <div className="flex items-center gap-1 text-xs font-black text-emerald-800 uppercase">
                          <CheckCircle2 size={14} /> Key Strengths
                        </div>
                        <ul className="space-y-1">
                          {lastEvaluation.key_strengths.map((str, idx) => (
                            <li key={idx} className="text-xs text-emerald-900 flex items-start gap-1.5">
                              <span className="font-bold">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {lastEvaluation.improvements && lastEvaluation.improvements.length > 0 && (
                      <div className="p-3 rounded-lg bg-amber-50 border-2 border-amber-600 space-y-1.5">
                        <div className="flex items-center gap-1 text-xs font-black text-amber-800 uppercase">
                          <TrendingUp size={14} /> Architectural Gaps to Fill
                        </div>
                        <ul className="space-y-1">
                          {lastEvaluation.improvements.map((imp, idx) => (
                            <li key={idx} className="text-xs text-amber-900 flex items-start gap-1.5">
                              <span className="font-bold">•</span>
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Answer Submission Box (If Round is Active) */}
              {(!lastEvaluation || !lastEvaluation.is_completed) && !lastEvaluation?.next_round && (
                <div className="p-4 rounded-xl bg-[#FAF6EE] border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5">
                      <MessageSquare size={14} /> Your Solution & System Architecture:
                    </label>
                    <span className="text-[11px] text-[#171717]/60 font-mono">
                      {candidateAnswer.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>

                  <textarea
                    ref={answerInputRef}
                    rows={6}
                    value={candidateAnswer}
                    onChange={(e) => setCandidateAnswer(e.target.value)}
                    placeholder="Walk the interviewer through your step-by-step approach. Mention data stores, concurrency control (locks/idempotency), caching, failovers, and complexity trade-offs..."
                    className="w-full p-3.5 text-xs sm:text-sm font-sans bg-white border-2 border-[#171717] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#244B3A] shadow-inner placeholder:text-[#171717]/40 resize-y"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#171717]/60">
                        💡 Tip: Be specific with protocols, cache keys & failure scenarios.
                      </span>
                    </div>

                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={isSubmitting || !candidateAnswer.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#244B3A] text-white shadow-[3px_3px_0px_#171717]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Evaluating Architecture...</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Submit Round {currentRound} Answer</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
