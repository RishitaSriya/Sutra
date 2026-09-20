import React, { useState, useEffect } from 'react';
import {
  Swords,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  Play,
  Trophy,
  Shield,
  Star,
  ChevronRight,
  Code2,
  Terminal,
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { BossChallenge } from '../../types';
import { sandboxApi, ChallengeEvaluateResponse, TestCaseResult } from '../../api/sandboxApi';
import { clsx } from 'clsx';

const STARTER_CODES = {
  python: `def solve(nums, target):
    \"\"\"
    Return the two indices of numbers in 'nums' that add up to 'target'.
    Optimal Time Complexity: O(N), Space Complexity: O(N)
    \"\"\"
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test code locally:
result = solve([2, 7, 11, 15], 9)
print(f"Computed Result: {result}")
`,
  javascript: `function solve(nums, target) {
    /**
     * Return the two indices of numbers in 'nums' that add up to 'target'.
     * Optimal Time Complexity: O(N), Space Complexity: O(N)
     */
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (seen.has(diff)) {
            return [seen.get(diff), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

// Test code locally:
const result = solve([2, 7, 11, 15], 9);
console.log("Computed Result:", JSON.stringify(result));
`
};

export const BossChallengeView: React.FC = () => {
  const { bossChallenges, acceptBossChallenge, completeBossChallenge, awardXp, triggerConfetti } = useApp();
  const [selectedChallenge, setSelectedChallenge] = useState<BossChallenge>(bossChallenges[0]);
  
  // Interactive Sandbox Code State
  const [language, setLanguage] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState<string>(STARTER_CODES.python);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [consoleOutput, setConsoleOutput] = useState<{ stdout: string; stderr: string; timeMs: number } | null>(null);
  const [evalResult, setEvalResult] = useState<ChallengeEvaluateResponse | null>(null);

  const mainBoss = bossChallenges[0];

  const handleLanguageChange = (newLang: 'python' | 'javascript') => {
    setLanguage(newLang);
    setCode(STARTER_CODES[newLang]);
    setConsoleOutput(null);
    setEvalResult(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setEvalResult(null);
    try {
      const res = await sandboxApi.runCode({
        code,
        language
      });
      setConsoleOutput({
        stdout: res.stdout,
        stderr: res.stderr,
        timeMs: res.execution_time_ms
      });
    } catch (err: any) {
      setConsoleOutput({
        stdout: '',
        stderr: err.message || 'Execution error connecting to sandbox.',
        timeMs: 0
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleEvaluateHarness = async () => {
    setIsEvaluating(true);
    try {
      const res = await sandboxApi.evaluateChallenge(mainBoss.id, {
        code,
        language
      });
      setEvalResult(res);
      setConsoleOutput({
        stdout: res.stdout,
        stderr: res.stderr,
        timeMs: res.execution_time_ms
      });

      if (res.passed) {
        completeBossChallenge(mainBoss.id);
        awardXp(res.xp_awarded || mainBoss.xpReward, `Defeated Boss: ${mainBoss.title}`);
        triggerConfetti();
      }
    } catch (err: any) {
      console.error('Challenge evaluate error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-[#FAF6EE] p-5 sm:p-7 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="coral" size="sm" icon={<Swords size={12} />}>
              ARENA OF TRIALS & SANDBOX
            </Badge>
            <span className="text-xs font-bold text-[#E9785A]">
              MULTI-LANGUAGE REAL CODE EXECUTION
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
            Boss Battles & Live Code Sandbox
          </h2>
          <p className="text-xs sm:text-sm text-[#575757] font-semibold mt-0.5">
            Write real code, test against boundary suites, and prove production architectural mastery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="marigold" size="sm">
            ⚡ Python 3 & Node.js Ready
          </Badge>
        </div>
      </div>

      {/* Main Weekly Boss Arena */}
      <div className="bg-[#171717] text-[#FAF6EE] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[6px_6px_0px_#E9785A] space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#E9785A] text-[#171717] rounded-full font-display font-black text-xs uppercase tracking-wider">
              👑 CURRENT WEEKLY BOSS
            </span>
            <span className="text-xs font-display font-bold text-[#E4A93A] flex items-center gap-1">
              <Clock size={13} /> {mainBoss.duration}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= mainBoss.difficulty ? 'text-[#E4A93A] fill-[#E4A93A]' : 'text-[#575757]'}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-black text-2xl sm:text-4xl text-[#FAF6EE] leading-tight">
            {mainBoss.title}
          </h3>
          <p className="text-sm text-[#FAF6EE]/80 leading-relaxed max-w-3xl">
            {mainBoss.scenario}
          </p>
        </div>

        {/* Skills Required */}
        <div className="flex flex-wrap gap-2">
          {mainBoss.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs font-display font-bold px-3 py-1 rounded-xl bg-[#FAF6EE]/10 border border-[#FAF6EE]/20 text-[#FAF6EE]"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Requirements Box */}
        <div className="bg-[#FAF6EE]/5 p-4 rounded-2xl border border-[#FAF6EE]/15 space-y-2">
          <span className="text-xs font-display font-black uppercase tracking-wider text-[#E4A93A]">
            Boss Victory Requirements:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#FAF6EE]/90 font-medium">
            {mainBoss.requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#E4A93A] font-bold">✓</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Interactive Code Sandbox Canvas */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-2 bg-[#262626] p-2.5 rounded-2xl border border-[#FAF6EE]/15">
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-black text-[#FAF6EE] flex items-center gap-1.5 px-2">
                <Code2 size={14} className="text-[#E4A93A]" /> CODE EDITOR
              </span>
              
              {/* Language Switcher */}
              <div className="flex bg-[#171717] rounded-xl p-0.5 border border-[#FAF6EE]/20 text-xs font-bold">
                <button
                  onClick={() => handleLanguageChange('python')}
                  className={clsx(
                    'px-3 py-1 rounded-lg transition-all',
                    language === 'python' ? 'bg-[#244B3A] text-[#FAF6EE]' : 'text-[#FAF6EE]/60 hover:text-white'
                  )}
                >
                  🐍 Python 3
                </button>
                <button
                  onClick={() => handleLanguageChange('javascript')}
                  className={clsx(
                    'px-3 py-1 rounded-lg transition-all',
                    language === 'javascript' ? 'bg-[#244B3A] text-[#FAF6EE]' : 'text-[#FAF6EE]/60 hover:text-white'
                  )}
                >
                  ⚡ JavaScript
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCode(STARTER_CODES[language])}
                className="px-2.5 py-1 rounded-lg bg-[#171717] text-[#FAF6EE]/70 hover:text-white text-xs font-bold border border-[#FAF6EE]/20 flex items-center gap-1"
                title="Reset boilerplate code"
              >
                <RotateCcw size={12} /> Reset
              </button>

              <Button
                variant="secondary"
                size="sm"
                icon={<Play size={13} />}
                onClick={handleRunCode}
                disabled={isRunning || isEvaluating}
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles size={13} />}
                onClick={handleEvaluateHarness}
                disabled={isEvaluating || isRunning}
              >
                {isEvaluating ? 'Grading Tests...' : 'Grade & Submit ⚡'}
              </Button>
            </div>
          </div>

          {/* Textarea Code Editor */}
          <div className="relative font-mono text-xs">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              spellCheck={false}
              className="w-full p-4 rounded-2xl bg-[#0D1117] text-[#E6EDF3] border-2 border-[#FAF6EE]/20 focus:border-[#E4A93A] focus:outline-none leading-relaxed resize-y font-mono"
            />
          </div>

          {/* Real-time Terminal Output Console */}
          {consoleOutput && (
            <div className="bg-[#090D13] p-4 rounded-2xl border border-[#FAF6EE]/15 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-[#FAF6EE]/60 border-b border-[#FAF6EE]/10 pb-1.5">
                <span className="flex items-center gap-1.5 font-bold text-[#E4A93A]">
                  <Terminal size={13} /> EXECUTION CONSOLE
                </span>
                <span>Runtime: {consoleOutput.timeMs}ms</span>
              </div>

              {consoleOutput.stdout && (
                <div className="text-[#58A6FF] whitespace-pre-wrap">
                  {consoleOutput.stdout}
                </div>
              )}

              {consoleOutput.stderr && (
                <div className="text-[#F85149] whitespace-pre-wrap">
                  {consoleOutput.stderr}
                </div>
              )}
            </div>
          )}

          {/* Automated Test Case Results Accordion */}
          {evalResult && (
            <div className="bg-[#244B3A] p-5 border-2 border-[#E4A93A] rounded-2xl text-xs space-y-3 shadow-[4px_4px_0px_#171717]">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#FAF6EE]/20 pb-2">
                <div className="flex items-center gap-2 font-display font-black text-sm text-[#FAF6EE]">
                  {evalResult.passed ? (
                    <>
                      <CheckCircle2 size={18} className="text-[#E4A93A]" />
                      <span>ALL {evalResult.total_tests} TEST CASES PASSED! (Score: 100%)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} className="text-[#E9785A]" />
                      <span>{evalResult.passed_tests}/{evalResult.total_tests} TESTS PASSED (Score: {evalResult.score}%)</span>
                    </>
                  )}
                </div>

                <div className="text-[#FAF6EE] font-bold">
                  Total Harness Time: {evalResult.execution_time_ms}ms
                </div>
              </div>

              {/* AI Code Reviewer Feedback */}
              {evalResult.ai_feedback && (
                <div className="p-3 bg-[#FAF6EE]/10 rounded-xl border border-[#FAF6EE]/20 text-[#FAF6EE] font-medium leading-relaxed">
                  <span className="font-bold text-[#E4A93A] block mb-0.5">🧠 AI Socratic Review:</span>
                  {evalResult.ai_feedback}
                </div>
              )}

              {/* Test Cases List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {evalResult.test_results.map((tc, i) => (
                  <div
                    key={i}
                    className={clsx(
                      'p-3 rounded-xl border flex flex-col justify-between space-y-1.5',
                      tc.passed
                        ? 'bg-[#171717]/60 border-[#6F8F72] text-[#FAF6EE]'
                        : 'bg-[#171717]/80 border-[#E9785A] text-[#FAF6EE]'
                    )}
                  >
                    <div className="flex items-center justify-between font-display font-bold">
                      <span className="text-xs truncate max-w-[200px]">{tc.test_name}</span>
                      <span className={clsx('text-[11px] px-2 py-0.5 rounded-full font-black', tc.passed ? 'bg-[#244B3A] text-[#FAF6EE]' : 'bg-[#E9785A] text-[#171717]')}>
                        {tc.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#FAF6EE]/70 font-mono space-y-0.5">
                      <div>Input: <span className="text-[#FAF6EE]">{tc.input_data}</span></div>
                      <div>Expected: <span className="text-[#E4A93A]">{tc.expected_output}</span></div>
                      <div>Actual: <span className={tc.passed ? 'text-[#6F8F72]' : 'text-[#E9785A]'}>{tc.actual_output}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions & Rewards */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#FAF6EE]/15">
          <div className="flex items-center gap-3">
            <span className="text-xs font-display font-black text-[#E4A93A] flex items-center gap-1">
              <Zap size={16} /> +{mainBoss.xpReward} XP
            </span>
            <span className="text-xs font-display font-black text-[#FAF6EE] flex items-center gap-1">
              <Trophy size={16} className="text-[#E9785A]" /> Unlock Badge: {mainBoss.badgeReward}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {mainBoss.completed ? (
              <div className="flex items-center gap-2 text-sm font-display font-black text-[#6F8F72]">
                <CheckCircle2 size={18} /> BOSS DEFEATED! 🏆
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                icon={<Sparkles size={18} />}
                onClick={handleEvaluateHarness}
                disabled={isEvaluating}
              >
                {isEvaluating ? 'Grading Tests...' : 'Grade & Defeat Boss ⚡'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Other Challenge Trials Grid */}
      <div className="space-y-4">
        <span className="text-xs font-display font-black uppercase tracking-wider text-[#575757]">
          MORE TRIALS & SPEEDRUNS
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bossChallenges.slice(1).map((ch) => (
            <div
              key={ch.id}
              className="bg-[#FAF6EE] p-5 rounded-3xl border-2.5 border-[#171717] shadow-[3.5px_3.5px_0px_#171717] flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={ch.type === 'debug' ? 'peach' : 'lavender'} size="sm">
                    {ch.type.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-bold text-[#575757] flex items-center gap-1">
                    <Clock size={12} /> {ch.duration}
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-[#171717]">
                  {ch.title}
                </h4>
                <p className="text-xs text-[#575757] font-medium mt-1">
                  {ch.scenario}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t-2 border-[#171717]/10">
                <span className="text-xs font-display font-black text-[#E9785A]">
                  +{ch.xpReward} XP
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    awardXp(ch.xpReward, `Completed Trial: ${ch.title}`);
                    triggerConfetti();
                  }}
                >
                  {ch.completed ? 'Replay Trial' : 'Launch Trial →'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
