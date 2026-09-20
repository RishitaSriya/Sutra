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
  AlertCircle,
  Flame,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { BossChallenge } from '../../types';
import { sandboxApi, ChallengeEvaluateResponse, TestCaseResult } from '../../api/sandboxApi';
import { clsx } from 'clsx';

const CHALLENGE_STARTER_CODES: Record<string, { python: string; javascript: string }> = {
  challenge_boss_01: {
    python: `def solve(nums, target):
    """
    Return the two indices of numbers in 'nums' that add up to 'target'.
    Optimal Time Complexity: O(N), Space: O(N)
    """
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test locally:
print("Test result:", solve([2, 7, 11, 15], 9))
`,
    javascript: `function solve(nums, target) {
    /**
     * Return the two indices of numbers in 'nums' that add up to 'target'.
     * Optimal Time Complexity: O(N), Space: O(N)
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

// Test locally:
console.log("Test result:", JSON.stringify(solve([2, 7, 11, 15], 9)));
`
  },
  challenge_debug_01: {
    python: `def sanitize_and_build(username):
    """
    Sanitize and construct a parameterized query tuple.
    Returns: (safe_sql_template, params_tuple)
    """
    return ("SELECT * FROM users WHERE username = %s", (username,))

# Test locally:
query, params = sanitize_and_build("' OR '1'='1")
print("Safe Query:", query)
print("Parameters:", params)
`,
    javascript: `function sanitize_and_build(username) {
    // Return parameterized query object
    return {
        query: "SELECT * FROM users WHERE username = $1",
        params: [username]
    };
}

// Test locally:
console.log(JSON.stringify(sanitize_and_build("aarav_dev")));
`
  },
  challenge_ds_01: {
    python: `def normalize_features(values):
    """
    Min-Max Feature Scaling: bounds all numeric elements strictly in [0.0, 1.0].
    """
    if not values:
        return []
    min_v = min(values)
    max_v = max(values)
    if min_v == max_v:
        return [0.0] * len(values)
    return [round((x - min_v) / (max_v - min_v), 2) for x in values]

# Test locally:
print("Normalized vector:", normalize_features([10, 20, 30, 40, 50]))
`,
    javascript: `function normalize_features(values) {
    if (!values || values.length === 0) return [];
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    if (minV === maxV) return values.map(() => 0.0);
    return values.map(x => Number(((x - minV) / (maxV - minV)).toFixed(2)));
}

// Test locally:
console.log(JSON.stringify(normalize_features([10, 20, 30, 40, 50])));
`
  },
  challenge_gate_01: {
    python: `def count_page_faults(pages, capacity):
    """
    Simulate LRU page replacement and count total page faults.
    """
    memory = []
    faults = 0
    for page in pages:
        if page not in memory:
            faults += 1
            if len(memory) >= capacity:
                memory.pop(0)
            memory.append(page)
        else:
            memory.remove(page)
            memory.append(page)
    return faults

# Test locally (GATE 2021 Reference String):
print("Total faults:", count_page_faults([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2], 4))
`,
    javascript: `function count_page_faults(pages, capacity) {
    const memory = [];
    let faults = 0;
    for (const page of pages) {
        const idx = memory.indexOf(page);
        if (idx === -1) {
            faults++;
            if (memory.length >= capacity) {
                memory.shift();
            }
            memory.push(page);
        } else {
            memory.splice(idx, 1);
            memory.push(page);
        }
    }
    return faults;
}

// Test locally:
console.log("Faults:", count_page_faults([1, 2, 3, 1, 2, 3], 3));
`
  },
  challenge_speed_01: {
    python: `def solve(nums, target):
    # Regex linear audit
    return [0, 1]
`,
    javascript: `function solve(nums, target) {
    return [0, 1];
}
`
  }
};

export const BossChallengeView: React.FC = () => {
  const { bossChallenges, acceptBossChallenge, completeBossChallenge, awardXp, triggerConfetti } = useApp();
  const [selectedChallenge, setSelectedChallenge] = useState<BossChallenge>(bossChallenges[0]);
  
  // Interactive Sandbox Code State
  const [language, setLanguage] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState<string>(
    CHALLENGE_STARTER_CODES[bossChallenges[0]?.id]?.python || CHALLENGE_STARTER_CODES.challenge_boss_01.python
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [consoleOutput, setConsoleOutput] = useState<{ stdout: string; stderr: string; timeMs: number } | null>(null);
  const [evalResult, setEvalResult] = useState<ChallengeEvaluateResponse | null>(null);

  // Live Weekly Countdown Timer (e.g. 54h 28m remaining this week)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 54,
    minutes: 28,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59, hours: prev.hours };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectChallenge = (ch: BossChallenge) => {
    setSelectedChallenge(ch);
    const starter = CHALLENGE_STARTER_CODES[ch.id] || CHALLENGE_STARTER_CODES.challenge_boss_01;
    setCode(starter[language]);
    setConsoleOutput(null);
    setEvalResult(null);
  };

  const handleLanguageChange = (newLang: 'python' | 'javascript') => {
    setLanguage(newLang);
    const starter = CHALLENGE_STARTER_CODES[selectedChallenge.id] || CHALLENGE_STARTER_CODES.challenge_boss_01;
    setCode(starter[newLang]);
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
      const res = await sandboxApi.evaluateChallenge(selectedChallenge.id, {
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
        completeBossChallenge(selectedChallenge.id);
        awardXp(res.xp_awarded || selectedChallenge.xpReward, `Defeated Boss: ${selectedChallenge.title}`);
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
      <div className="bg-[#FAF6EE] p-5 sm:p-7 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="coral" size="sm" icon={<Swords size={12} />}>
              ARENA OF TRIALS & WEEKLY BOSSES
            </Badge>
            <span className="text-xs font-bold text-[#E9785A]">
              MULTI-TRACK REAL SANDBOX RUNNER
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
            Weekly Boss Battles & Challenges
          </h2>
          <p className="text-xs sm:text-sm text-[#575757] font-semibold mt-0.5">
            Test your intuition under high-pressure real-world test harness suites.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 bg-[#244B3A] text-[#FAF6EE] px-4 py-2.5 rounded-2xl border-2 border-[#171717] shadow-[3px_3px_0px_#171717]">
          <Clock size={16} className="text-[#E4A93A] animate-pulse" />
          <div>
            <span className="text-[10px] font-bold text-[#FAF6EE]/70 block uppercase">Weekly Boss Closes In</span>
            <span className="font-display font-black text-sm text-[#E4A93A]">
              {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>
        </div>
      </div>

      {/* Challenge Track Switcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {bossChallenges.map((ch) => {
          const isSelected = selectedChallenge.id === ch.id;
          return (
            <div
              key={ch.id}
              onClick={() => handleSelectChallenge(ch)}
              className={clsx(
                'p-4 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between gap-3 shadow-[3px_3px_0px_#171717]',
                isSelected
                  ? 'bg-[#244B3A] text-[#FAF6EE] border-[#171717] scale-[1.02]'
                  : 'bg-[#FAF6EE] text-[#171717] border-[#171717] hover:bg-[#ECE4D0]'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={clsx(
                      'text-[10px] font-display font-black uppercase px-2 py-0.5 rounded-full border',
                      isSelected
                        ? 'bg-[#1A362A] text-[#E4A93A] border-[#FAF6EE]/30'
                        : 'bg-[#F7F1E3] text-[#575757] border-[#171717]/30'
                    )}
                  >
                    {ch.type.toUpperCase()} • {ch.duration}
                  </span>
                  {ch.completed ? (
                    <span className="text-xs font-bold text-[#E4A93A] flex items-center gap-1">
                      <CheckCircle2 size={13} /> Defeated
                    </span>
                  ) : (
                    <span className="text-xs font-display font-black text-[#E9785A]">
                      +{ch.xpReward} XP
                    </span>
                  )}
                </div>
                <h4 className="font-display font-bold text-sm leading-snug line-clamp-2">
                  {ch.title}
                </h4>
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold border-t border-current/15 pt-2">
                <span>{ch.badgeReward}</span>
                <span className="flex items-center gap-0.5">
                  {'★'.repeat(ch.difficulty)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Sandbox Grid: Left Scenario & Objectives, Right Interactive Code Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mission Brief & Rules */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FAF6EE] p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#171717]/10">
              <span className="text-xs font-display font-black text-[#E9785A] uppercase tracking-wider">
                {selectedChallenge.type.toUpperCase()} ARENA BRIEF
              </span>
              <span className="text-xs font-bold text-[#244B3A]">
                Reward: {selectedChallenge.badgeReward}
              </span>
            </div>

            <div>
              <h3 className="font-display font-black text-xl text-[#171717] mb-2">
                {selectedChallenge.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[#575757] leading-relaxed">
                {selectedChallenge.scenario}
              </p>
            </div>

            <div className="p-3.5 bg-[#F2C6A8]/40 rounded-2xl border-2 border-[#171717] space-y-1">
              <span className="text-xs font-display font-black uppercase text-[#171717] flex items-center gap-1.5">
                <Zap size={14} className="text-[#E9785A]" /> PRIMARY OBJECTIVE
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#171717]">
                {selectedChallenge.objective}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-display font-black uppercase tracking-wider text-[#244B3A]">
                PASSING REQUIREMENTS
              </span>
              <ul className="space-y-1.5 text-xs text-[#171717] font-semibold">
                {selectedChallenge.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#F7F1E3] p-2 rounded-xl border border-[#171717]/15">
                    <span className="text-[#244B3A] font-black">✓</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              {selectedChallenge.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-[#FAF6EE] text-[#171717] rounded-lg border-1.5 border-[#171717] text-[10px] font-display font-bold shadow-[1px_1px_0px_#171717]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Terminal */}
        <div className="lg:col-span-7 space-y-4">
          {/* Code Editor Header */}
          <div className="bg-[#171717] text-[#FAF6EE] p-4 rounded-t-3xl border-2.5 border-[#171717] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 border border-black/50" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 border border-black/50" />
                <span className="w-3 h-3 rounded-full bg-green-500 border border-black/50" />
              </div>
              <span className="text-xs font-mono font-bold text-[#FAF6EE]/80 ml-2">
                solution.{language === 'python' ? 'py' : 'js'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="flex bg-[#262626] rounded-xl p-0.5 border border-white/10">
                <button
                  onClick={() => handleLanguageChange('python')}
                  className={clsx(
                    'px-2.5 py-1 text-xs font-bold rounded-lg transition-all',
                    language === 'python' ? 'bg-[#244B3A] text-[#FAF6EE]' : 'text-[#FAF6EE]/60 hover:text-white'
                  )}
                >
                  Python 3
                </button>
                <button
                  onClick={() => handleLanguageChange('javascript')}
                  className={clsx(
                    'px-2.5 py-1 text-xs font-bold rounded-lg transition-all',
                    language === 'javascript' ? 'bg-[#244B3A] text-[#FAF6EE]' : 'text-[#FAF6EE]/60 hover:text-white'
                  )}
                >
                  Node.js
                </button>
              </div>

              <button
                onClick={() => {
                  const starter = CHALLENGE_STARTER_CODES[selectedChallenge.id] || CHALLENGE_STARTER_CODES.challenge_boss_01;
                  setCode(starter[language]);
                  setConsoleOutput(null);
                  setEvalResult(null);
                }}
                className="p-1.5 rounded-lg bg-[#262626] hover:bg-[#333] text-[#FAF6EE]/70 hover:text-white transition-all"
                title="Reset Code"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Interactive Textarea Code Editor */}
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-72 p-4 font-mono text-xs sm:text-sm bg-[#1A1A1A] text-[#FAF6EE] border-x-2.5 border-b-2.5 border-[#171717] focus:outline-none resize-none leading-relaxed selection:bg-[#244B3A]"
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-3 bg-[#FAF6EE] p-3 rounded-2xl border-2.5 border-[#171717] shadow-[3px_3px_0px_#171717] flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              disabled={isRunning || isEvaluating}
              icon={<Play size={14} />}
              onClick={handleRunCode}
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>

            <Button
              variant="coral"
              size="md"
              disabled={isRunning || isEvaluating}
              icon={<Zap size={16} />}
              onClick={handleEvaluateHarness}
            >
              {isEvaluating ? 'Evaluating Harness...' : '⚡ Submit & Run Test Harness'}
            </Button>
          </div>

          {/* Evaluation / Console Output Section */}
          {evalResult && (
            <div
              className={clsx(
                'p-5 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-3 animate-in fade-in duration-200',
                evalResult.passed ? 'bg-[#244B3A] text-[#FAF6EE]' : 'bg-[#FAF6EE] text-[#171717]'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {evalResult.passed ? (
                    <CheckCircle2 size={20} className="text-[#E4A93A]" />
                  ) : (
                    <XCircle size={20} className="text-red-500" />
                  )}
                  <span className="font-display font-black text-base">
                    {evalResult.passed ? 'BOSS DEFEATED! ALL TEST SUITES PASSED 🎉' : 'TEST SUITE FAILED'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold">
                  {evalResult.passed_tests}/{evalResult.total_tests} Passed
                </span>
              </div>

              {/* Test Cases Results Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {evalResult.test_results.map((tr, idx) => (
                  <div
                    key={idx}
                    className={clsx(
                      'p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between',
                      tr.passed
                        ? 'bg-[#1A362A] border-green-500/40 text-green-300'
                        : 'bg-red-950/20 border-red-500/40 text-red-600'
                    )}
                  >
                    <span className="truncate mr-2">{tr.test_name}</span>
                    <span className="font-mono text-[10px] whitespace-nowrap font-bold">
                      {tr.passed ? '✓ PASS' : '✗ FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Console Output Drawer */}
          {consoleOutput && (
            <div className="bg-[#171717] text-[#FAF6EE] p-4 rounded-2xl border-2.5 border-[#171717] font-mono text-xs space-y-1.5 shadow-[3px_3px_0px_#171717]">
              <div className="flex items-center justify-between text-[#FAF6EE]/60 border-b border-white/10 pb-1 text-[10px]">
                <span className="flex items-center gap-1"><Terminal size={11} /> STDOUT & EXECUTION TELEMETRY</span>
                <span>{consoleOutput.timeMs}ms</span>
              </div>
              {consoleOutput.stdout && (
                <pre className="text-green-400 whitespace-pre-wrap">{consoleOutput.stdout}</pre>
              )}
              {consoleOutput.stderr && (
                <pre className="text-red-400 whitespace-pre-wrap">{consoleOutput.stderr}</pre>
              )}
              {!consoleOutput.stdout && !consoleOutput.stderr && (
                <span className="text-[#FAF6EE]/50 italic">Process finished with exit code 0 (no stdout).</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
