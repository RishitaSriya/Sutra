import { BossChallenge } from '../types';

export const mockBossChallenges: BossChallenge[] = [
  // Web Development Boss
  {
    id: 'challenge_boss_01',
    title: 'WEEKLY BOSS: The College Fest Traffic Apocalypse',
    difficulty: 4,
    duration: '60 MIN',
    skills: ['Two-Pointer Technique', 'Hash Tables', 'O(N) Optimization', 'Web Architecture'],
    scenario: 'It is 11:59 PM. 15,000 students are frantically booking concert passes on the college portal. The server is throttling at 99% CPU and duplicate requests are crashing the payment webhook.',
    objective: 'Implement an optimal O(N) Two-Pointer / Hash Map solve function to identify matching duplicate request pairs and resolve transaction locks in real time.',
    requirements: [
      'O(N) single-pass time complexity',
      'Handle negative numbers and duplicate elements correctly',
      'Pass large scale 10,000-element performance benchmark under 50ms',
    ],
    xpReward: 350,
    badgeReward: 'Fest Architect 🎪',
    accepted: false,
    completed: false,
    type: 'boss',
  },

  // Security Challenge
  {
    id: 'challenge_debug_01',
    title: 'WEEKLY BOSS: Zero-Day SQL Sanitizer & Query Builder',
    difficulty: 3,
    duration: '30 MIN',
    skills: ['SQL Security', 'Parameterized Queries', 'AppSec', 'OWASP Top 10'],
    scenario: 'An automated botnet is launching SQL injection probes against your authentication endpoint with payload sequences like `\' OR \'1\'=\'1`.',
    objective: 'Write a robust `sanitize_and_build(username)` function that separates query logic from data parameters using parameterized prepared statement tuples.',
    requirements: [
      'Return safe tuple format `(query_template, [params])`',
      'Completely neutralize malicious SQL payload syntax',
      'Zero memory leaks over 10,000 iterations',
    ],
    xpReward: 220,
    badgeReward: 'Bug Hunter 🔍',
    accepted: true,
    completed: false,
    type: 'debug',
  },

  // Data Science Challenge
  {
    id: 'challenge_ds_01',
    title: 'WEEKLY BOSS: Real-Time Feature Matrix Normalizer',
    difficulty: 3,
    duration: '45 MIN',
    skills: ['Data Science', 'Feature Engineering', 'Vectorization', 'Python/JS'],
    scenario: 'QuickMart’s recommendation model diverges because raw cart prices (₹10 to ₹50,000) skew gradient descent. You need an ultra-fast Min-Max normalizer.',
    objective: 'Implement `normalize_features(values)` that transforms unbounded numeric lists into [0.0, 1.0] normalized vectors while handling uniform and extreme edge cases.',
    requirements: [
      'Scale all numeric inputs strictly to [0.0, 1.0]',
      'Handle uniform arrays gracefully with zeros',
      'Precision rounded to 2 decimal places',
    ],
    xpReward: 280,
    badgeReward: 'Data Alchemist 🧪',
    accepted: false,
    completed: false,
    type: 'boss',
  },

  // GATE CSE Challenge
  {
    id: 'challenge_gate_01',
    title: 'WEEKLY BOSS: LRU Page Replacement Fault Simulator',
    difficulty: 4,
    duration: '60 MIN',
    skills: ['Operating Systems', 'LRU Cache', 'Memory Management', 'GATE CSE'],
    scenario: 'In a multi-threaded OS kernel, cache hit rates are degrading due to unoptimized LRU page eviction under limited RAM frames.',
    objective: 'Write an optimal `count_page_faults(pages, capacity)` function that processes memory reference strings and calculates total page faults under arbitrary frame capacities.',
    requirements: [
      'Simulate LRU eviction policy accurately',
      'Pass all standard reference string test suites',
      'Handle boundary conditions with frame capacity 1',
    ],
    xpReward: 350,
    badgeReward: 'Kernel Architect 🖥️',
    accepted: false,
    completed: false,
    type: 'boss',
  },

  // Speedrun Challenge
  {
    id: 'challenge_speed_01',
    title: 'BEAT THE CLOCK: 10-Minute Regex Security Audit',
    difficulty: 2,
    duration: '10 MIN',
    skills: ['Regular Expressions', 'ReDoS Prevention', 'Security Auditing'],
    scenario: 'An unescaped regular expression is vulnerable to catastrophic backtracking (ReDoS) under malicious input strings.',
    objective: 'Construct a linear-time safe validation pattern and patch the vulnerability before the timer expires.',
    requirements: [
      'Linear time matching O(N)',
      'Block catastrophic backtracking patterns',
    ],
    xpReward: 100,
    badgeReward: 'Speed Demon ⚡',
    accepted: false,
    completed: true,
    type: 'speedrun',
  },
];
