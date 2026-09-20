import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  HelpCircle,
  Code,
  Layers,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { aiApi, AiChatResponse, AiExplainResponse } from '../../api/aiApi';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { clsx } from 'clsx';

interface Message {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  persona?: string;
  suggestedFollowups?: string[];
  timestamp: string;
}

interface AiMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: string;
}

export const AiMentorModal: React.FC<AiMentorModalProps> = ({
  isOpen,
  onClose,
  initialContext
}) => {
  const { user, activeStoryLesson, addFlashcards, triggerConfetti } = useApp();
  const [activeTab, setActiveTab] = useState<'chat' | 'explain'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [explainQuery, setExplainQuery] = useState('');
  const [explainResult, setExplainResult] = useState<AiExplainResponse | null>(null);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const roleName = user.learningProfile?.careerPath || (user.trackType === 'exam' ? 'GATE CSE' : 'Web Developer');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'mentor',
      text: `Hello ${user.name}! I am your SUTRA AI Mentor for the **${roleName}** track. How can I help you master your current mission today?`,
      persona: `AI Mentor (${roleName})`,
      suggestedFollowups: [
        'Give me a hint on my current story mission',
        'Explain the core architectural trade-off',
        'What mistake do junior engineers make here?'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await aiApi.askMentor({
        message,
        lesson_context: activeStoryLesson?.title || initialContext || roleName,
      });

      const mentorMsg: Message = {
        id: `mentor_${Date.now()}`,
        sender: 'mentor',
        text: res.reply,
        persona: res.role_persona,
        suggestedFollowups: res.suggested_followups,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, mentorMsg]);
    } catch (err) {
      console.error('AI Chat error:', err);
      const errMsg: Message = {
        id: `mentor_err_${Date.now()}`,
        sender: 'mentor',
        text: 'Sorry, I encountered a brief network glitch. Let me know if you would like me to try again!',
        persona: `AI Mentor (${roleName})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!explainQuery.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const res = await aiApi.explain({ query: explainQuery });
      setExplainResult(res);
    } catch (err) {
      console.error('Explain error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCards = async () => {
    const topic = activeStoryLesson?.title || roleName;
    setIsGeneratingCards(true);
    try {
      const newCards = await aiApi.generateFlashcards(topic, 3);
      if (newCards && newCards.length > 0) {
        addFlashcards(newCards);
        triggerConfetti();
        const successMsg: Message = {
          id: `mentor_${Date.now()}`,
          sender: 'mentor',
          text: `🎉 I synthesized **${newCards.length} new active recall flashcards** on *"${topic}"* and added them to your Flashcards Deck!`,
          persona: `AI Mentor (${roleName})`,
          suggestedFollowups: ['What is the hardest question in this deck?'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, successMsg]);
      }
    } catch (err) {
      console.error('Generate cards error:', err);
    } finally {
      setIsGeneratingCards(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#171717]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF6EE] border-3 border-[#171717] rounded-3xl shadow-[8px_8px_0px_#171717] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2.5 border-[#171717] bg-[#F7F1E3] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#244B3A] text-[#F7F1E3] border-2 border-[#171717] flex items-center justify-center shadow-[2px_2px_0px_#171717]">
              <Sparkles size={20} className="text-[#F39C12] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg sm:text-xl text-[#171717]">
                  SUTRA AI Mentor
                </h3>
                <Badge variant="marigold" size="sm">
                  Powered by Gemini
                </Badge>
              </div>
              <p className="text-xs font-bold text-[#575757]">
                Tailored for {roleName} Track
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateCards}
              disabled={isGeneratingCards}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6EE] border-2 border-[#171717] text-xs font-display font-bold hover:bg-[#F39C12] hover:text-[#FAF6EE] transition-all shadow-[2px_2px_0px_#171717]"
              title="Generate 3 active recall cards"
            >
              <Layers size={14} />
              {isGeneratingCards ? 'Synthesizing...' : 'Synthesize Cards'}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#FAF6EE] border-2 border-[#171717] hover:bg-[#E74C3C] hover:text-white transition-all shadow-[2px_2px_0px_#171717] cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b-2 border-[#171717] bg-[#FAF6EE] text-xs font-display font-bold">
          <button
            onClick={() => setActiveTab('chat')}
            className={clsx(
              'flex-1 py-2.5 flex items-center justify-center gap-2 border-r border-[#171717] transition-all',
              activeTab === 'chat'
                ? 'bg-[#244B3A] text-[#F7F1E3]'
                : 'text-[#575757] hover:bg-[#F7F1E3]'
            )}
          >
            <Bot size={15} /> Socratic Tutoring
          </button>
          <button
            onClick={() => setActiveTab('explain')}
            className={clsx(
              'flex-1 py-2.5 flex items-center justify-center gap-2 transition-all',
              activeTab === 'explain'
                ? 'bg-[#244B3A] text-[#F7F1E3]'
                : 'text-[#575757] hover:bg-[#F7F1E3]'
            )}
          >
            <Code size={15} /> Code & Concept Deep Dive
          </button>
        </div>

        {/* Body */}
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col overflow-hidden min-h-[360px]">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#FAF6EE]/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={clsx(
                    'flex flex-col gap-1 max-w-[85%]',
                    msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  )}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#575757]">
                    {msg.sender === 'mentor' ? (
                      <>
                        <Sparkles size={11} className="text-[#F39C12]" />
                        <span>{msg.persona || 'AI Mentor'}</span>
                      </>
                    ) : (
                      <>
                        <span>You</span>
                        <UserIcon size={11} />
                      </>
                    )}
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={clsx(
                      'p-4 rounded-2xl border-2 text-sm leading-relaxed shadow-[3px_3px_0px_#171717]',
                      msg.sender === 'user'
                        ? 'bg-[#244B3A] text-[#FAF6EE] border-[#171717] rounded-tr-none'
                        : 'bg-[#FFFFFF] text-[#171717] border-[#171717] rounded-tl-none font-medium'
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>

                  {/* Suggested Followups */}
                  {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {msg.suggestedFollowups.map((f, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(f)}
                          className="text-[11px] font-display font-bold px-2.5 py-1 rounded-lg bg-[#FAF6EE] border border-[#171717] hover:bg-[#F7F1E3] text-[#171717] transition-all shadow-[1px_1px_0px_#171717]"
                        >
                          💡 {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs font-display font-bold text-[#244B3A] p-2 bg-[#F7F1E3] rounded-xl border border-[#171717] w-fit animate-pulse">
                  <Sparkles size={14} className="animate-spin text-[#F39C12]" />
                  <span>Gemini is thinking Socratically...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t-2.5 border-[#171717] bg-[#F7F1E3] flex items-center gap-2">
              <input
                type="text"
                placeholder={`Ask your ${roleName} mentor...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#171717] bg-[#FFFFFF] text-sm font-sans font-medium placeholder-[#575757]/70 focus:outline-none focus:ring-2 focus:ring-[#244B3A]"
              />
              <Button
                variant="primary"
                size="md"
                icon={<Send size={15} />}
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
              >
                Send
              </Button>
            </div>
          </div>
        ) : (
          /* Explain Deep Dive Tab */
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-display font-bold uppercase tracking-wider text-[#575757]">
                Enter Code Snippet or Complex Concept
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. TCP 3-Way Handshake, SQL Injection, IQR Outlier, PCB Context Switch"
                  value={explainQuery}
                  onChange={(e) => setExplainQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#171717] bg-[#FFFFFF] text-sm font-medium focus:outline-none"
                />
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Zap size={15} />}
                  onClick={handleExplain}
                  disabled={!explainQuery.trim() || isLoading}
                >
                  Deep Dive
                </Button>
              </div>
            </div>

            {explainResult && (
              <div className="p-5 bg-white rounded-2xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-4 animate-in fade-in">
                <div>
                  <Badge variant="forest" size="sm">{explainResult.role_persona}</Badge>
                  <h4 className="font-display font-black text-xl text-[#171717] mt-1">
                    {explainResult.title}
                  </h4>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-[#244B3A]">
                    Core Explanation
                  </span>
                  <p className="text-sm font-sans leading-relaxed text-[#171717]">
                    {explainResult.explanation}
                  </p>
                </div>

                <div className="p-3.5 bg-[#FAF6EE] rounded-xl border border-[#171717] space-y-1">
                  <span className="text-xs font-display font-bold text-[#E67E22] flex items-center gap-1">
                    💡 Mental Model & Analogy
                  </span>
                  <p className="text-xs font-medium text-[#171717] italic">
                    "{explainResult.analogy}"
                  </p>
                </div>

                <div className="p-3.5 bg-[#FDEDEC] rounded-xl border border-[#E74C3C] space-y-1">
                  <span className="text-xs font-display font-bold text-[#C0392B] flex items-center gap-1">
                    ⚠️ #1 Common Pitfall
                  </span>
                  <p className="text-xs font-medium text-[#C0392B]">
                    {explainResult.common_pitfall}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-[#575757]">
                    Key Takeaways for Interviews
                  </span>
                  <ul className="space-y-1">
                    {explainResult.key_takeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-medium text-[#171717]">
                        <CheckCircle2 size={13} className="text-[#244B3A] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
