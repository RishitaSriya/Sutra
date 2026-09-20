import { TechMeme } from '../types';

export const mockTechMemes: TechMeme[] = [
  {
    id: 'meme_01',
    author: 'Harsh Vardhan',
    handle: '@harsh_codes',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    college: 'IIIT Hyderabad',
    category: 'Programming',
    memeCard: {
      headline: 'Printing "Hello World" in 2 different universes 🌌',
      type: 'code-vs-code',
      leftBlock: {
        title: 'Python (3.12)',
        language: 'python',
        code: `print("Hello World!")`,
        badge: 'Chill vibe ☕',
      },
      rightBlock: {
        title: 'C++ (20)',
        language: 'cpp',
        code: `#include <iostream>

int main() {
    std::cout << "Hello World!" << std::endl;
    return 0;
}`,
        badge: 'Cerebral overload 🤯',
      },
      caption: 'My professor spent 45 minutes explaining std::endl in 1st year CSE lab...',
    },
    likes: 342,
    liked: false,
    commentsCount: 28,
    saved: false,
    learningMissionBridge: {
      badgeText: '5 MIN MICRO MISSION',
      hookTitle: 'Why does C++ have std::endl while Python just prints? Stream Buffers in 60s',
      duration: '5 MIN',
      xp: 25,
      targetTopic: 'I/O Streams & Buffers',
      targetLessonId: 'story_http_01',
    },
  },
  {
    id: 'meme_02',
    author: 'Pooja Nair',
    handle: '@pooja_ui',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    college: 'BMS College, Bengaluru',
    category: 'Debugging',
    memeCard: {
      headline: 'JavaScript Math is an abstract art gallery 🎨',
      type: 'stat-punchline',
      dialogue: [
        { speaker: 'Dev', text: 'Hey JS, what is typeof NaN?', mood: 'curious' },
        { speaker: 'JavaScript', text: '"number" of course!', mood: 'smug' },
        { speaker: 'Dev', text: 'What is [] + []?', mood: 'nervous' },
        { speaker: 'JavaScript', text: '"" (empty string). Deal with it.', mood: 'cool' },
        { speaker: 'Dev', text: 'What is [] + {}?', mood: 'sweating' },
        { speaker: 'JavaScript', text: '"[object Object]"', mood: 'evil' },
      ],
      caption: 'Tell me you code in JS without telling me you code in JS 😂',
    },
    likes: 512,
    liked: true,
    commentsCount: 64,
    saved: true,
    learningMissionBridge: {
      badgeText: '5 MIN MICRO MISSION',
      hookTitle: 'Why JS does weird math: Type Coercion & IEEE 754 Floats Demystified',
      duration: '5 MIN',
      xp: 25,
      targetTopic: 'JS Type Coercion',
      targetLessonId: 'story_http_01',
    },
  },
  {
    id: 'meme_03',
    author: 'Kiran Patel',
    handle: '@kiran_dsa',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    college: 'Nirma University, Ahmedabad',
    category: 'College',
    memeCard: {
      headline: 'The College Syllabus vs Industry Reality Gap 📉📈',
      type: 'code-vs-code',
      leftBlock: {
        title: 'College Lab (2026)',
        language: 'text',
        code: `• Blue Turbo C++ 3.0 window
• conio.h & clrscr()
• 8085 Microprocessor Pin diagram
• Print 50 star patterns on paper`,
        badge: 'Syllabus Dread 😴',
      },
      rightBlock: {
        title: 'Real Tech Jobs',
        language: 'text',
        code: `• React Server Components
• Distributed Tracing with OpenTelemetry
• Postgres Index Optimization
• Idempotent Payment Webhooks`,
        badge: 'What Actually Matters 🚀',
      },
      caption: 'Why wait for the syllabus to update in 2035 when you can learn real tech now?',
    },
    likes: 890,
    liked: true,
    commentsCount: 112,
    saved: false,
    learningMissionBridge: {
      badgeText: '5 MIN MICRO MISSION',
      hookTitle: 'How real web servers handle 10,000 requests without clrscr()',
      duration: '5 MIN',
      xp: 30,
      targetTopic: 'Client-Server Architecture',
      targetLessonId: 'story_http_01',
    },
  },
  {
    id: 'meme_04',
    author: 'Siddharth Rao',
    handle: '@sid_css',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    college: 'RV College, Bengaluru',
    category: 'Programming',
    memeCard: {
      headline: 'Centering a <div> in CSS: 2012 vs 2026',
      type: 'code-vs-code',
      leftBlock: {
        title: '2012 (Pain & Suffering)',
        language: 'css',
        code: `.box {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -100px;
  margin-left: -100px;
  /* Pray to all gods */
}`,
        badge: 'Nightmare 😭',
      },
      rightBlock: {
        title: '2026 (Supreme Peace)',
        language: 'css',
        code: `.container {
  display: grid;
  place-items: center;
}
/* Done. Go drink chai ☕ */`,
        badge: '1 Line Magic ✨',
      },
      caption: 'place-items: center saved an entire generation of frontend devs from therapy.',
    },
    likes: 673,
    liked: false,
    commentsCount: 45,
    saved: true,
    learningMissionBridge: {
      badgeText: '5 MIN MICRO MISSION',
      hookTitle: '3 modern ways to center any element without absolute positioning',
      duration: '5 MIN',
      xp: 25,
      targetTopic: 'CSS Alignment',
      targetLessonId: 'story_grid_02',
    },
  },
];
