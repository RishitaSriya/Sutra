import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Zap,
  Target,
  BookOpen,
  CheckCircle2,
  Trophy,
  Users,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const LandingHero: React.FC = () => {
  const {
    setView,
    setIsOnboardingOpen,
    openAuthModal,
    isAuthenticated,
    user,
    logout,
    loginWithDemoAarav,
    loginWithDemoAnanya,
  } = useApp();

  const journeySteps = [
    { step: '01', title: 'GOAL', icon: '🎯', desc: 'Pick your track & targets', color: 'bg-[#F2C6A8]' },
    { step: '02', title: 'STORY', icon: '🎬', desc: 'Enter real dilemmas & scenarios', color: 'bg-[#FAF6EE]' },
    { step: '03', title: 'CONCEPT', icon: '☕', desc: 'Chai-stall analogies & diagrams', color: 'bg-[#E4A93A]/30' },
    { step: '04', title: 'MISSION', icon: '⚡', desc: '15 to 60 min daily sprints', color: 'bg-[#D8D2E7]/50' },
    { step: '05', title: 'PRACTICE', icon: '🛠️', desc: 'Build code & solve PYQs', color: 'bg-[#6F8F72]/30' },
    { step: '06', title: 'MASTER', icon: '👑', desc: 'Defeat weekly bosses & drills', color: 'bg-[#E9785A]/30' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F1E3] py-8 sm:py-12 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="flex items-center justify-between pb-6 border-b-2.5 border-[#171717]/15">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#244B3A] text-[#F7F1E3] border-2 border-[#171717] shadow-[2.5px_2.5px_0px_#171717] flex items-center justify-center font-display font-black text-xl">
            ⚡
          </div>
          <div>
            <span className="font-display font-black text-2xl tracking-tight text-[#171717]">
              SUTRA
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#244B3A] block -mt-1">
              Student Learning World
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setView('home')}
                className="text-xs sm:text-sm font-display font-bold text-[#171717] px-3.5 py-1.5 hover:bg-[#ECE4D0] rounded-xl border border-transparent hover:border-[#171717] transition-all cursor-pointer"
              >
                Dashboard ({user.name})
              </button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => logout()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('login')}
                className="text-xs sm:text-sm font-display font-bold text-[#171717] px-3.5 py-1.5 hover:bg-[#ECE4D0] rounded-xl border border-[#171717]/20 hover:border-[#171717] transition-all cursor-pointer"
              >
                Sign In
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => openAuthModal('register')}
              >
                Sign Up →
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="py-10 sm:py-14 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 flex-wrap justify-center">
          <Badge variant="forest" size="md" icon={<Sparkles size={14} />}>
            NOT ANOTHER BORING LMS
          </Badge>
          <Badge variant="marigold" size="md" icon={<Flame size={14} />}>
            CAREER & GATE CSE TRACKS
          </Badge>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-[#171717] tracking-tight leading-[1.08]">
          Learning should feel like an{' '}
          <span className="relative inline-block text-[#244B3A]">
            adventure.
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 15C80 5 220 25 295 8"
                stroke="#E4A93A"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="text-base sm:text-xl text-[#575757] font-medium max-w-2xl mx-auto leading-relaxed">
          Choose what you want to become. Learn through stories, daily missions, and interactive level maps. Whether you are breaking into high-growth software roles or conquering GATE CSE for IITs, Sutra guides your journey.
        </p>

        {/* Demo User Fast Switcher Bento */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#FAF6EE] border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] max-w-2xl mx-auto space-y-3">
          <p className="font-display font-bold text-xs uppercase tracking-wider text-[#575757]">
            ⚡ Quick Test with Seeded Personas
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => loginWithDemoAarav()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#F7F1E3] hover:bg-[#E4A93A] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-display font-bold text-xs text-[#171717] transition-all cursor-pointer"
            >
              <span>👨‍💻 Demo: Aarav</span>
              <span className="text-[10px] bg-[#244B3A] text-[#FAF6EE] px-1.5 py-0.5 rounded">Career / Web Dev</span>
            </button>
            <button
              onClick={() => loginWithDemoAnanya()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#F7F1E3] hover:bg-[#6F8F72] hover:text-[#FAF6EE] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-display font-bold text-xs text-[#171717] transition-all cursor-pointer"
            >
              <span>👩‍🎓 Demo: Ananya</span>
              <span className="text-[10px] bg-[#E9785A] text-[#171717] px-1.5 py-0.5 rounded font-black">GATE CSE 2028</span>
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            variant="primary"
            size="xl"
            icon={<ArrowRight size={20} />}
            iconPosition="right"
            onClick={() => {
              if (isAuthenticated) {
                setView('home');
              } else {
                openAuthModal('register');
              }
            }}
          >
            Start your journey →
          </Button>
          <Button
            variant="secondary"
            size="xl"
            icon={<Compass size={20} />}
            onClick={() => {
              if (isAuthenticated) {
                setView('home');
              } else {
                openAuthModal('login');
              }
            }}
          >
            {isAuthenticated ? 'Open Dashboard' : 'Sign In'}
          </Button>
        </div>
      </section>

      {/* Visual Journey Roadmap: GOAL -> STORY -> CONCEPT -> MISSION -> PRACTICE -> MASTER */}
      <section className="py-8 border-t-2.5 border-[#171717]/15">
        <div className="text-center mb-6">
          <span className="text-xs font-display font-bold uppercase tracking-widest text-[#575757]">
            The Student-First Learning Pipeline
          </span>
          <h3 className="font-display font-bold text-2xl text-[#171717] mt-1">
            How You Level Up From Concept to Craft
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {journeySteps.map((item, idx) => (
            <div
              key={item.step}
              className={`relative p-4 rounded-2xl border-2 border-[#171717] shadow-[3px_3px_0px_#171717] ${item.color} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-display font-black text-[#575757] mb-2">
                  <span>{item.step}</span>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <h4 className="font-display font-black text-sm text-[#171717]">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#171717]/80 font-semibold mt-1 leading-snug">
                  {item.desc}
                </p>
              </div>
              {idx < 5 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-xs font-black bg-[#171717] text-[#FAF6EE] w-6 h-6 rounded-full flex items-center justify-center border border-[#FAF6EE]">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 pb-4 text-center text-xs font-semibold text-[#575757] flex flex-col sm:flex-row items-center justify-between gap-2 border-t-2 border-[#171717]/10">
        <div>
          Built with joy for Indian college tech minds • 100% Free prototype
        </div>
        <div className="flex items-center gap-4">
          <span>Web Dev</span>
          <span>•</span>
          <span>AI / ML</span>
          <span>•</span>
          <span>Full Stack</span>
          <span>•</span>
          <span>Cybersecurity</span>
        </div>
      </footer>
    </div>
  );
};
