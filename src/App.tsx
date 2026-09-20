import React from 'react';
import { useApp } from './context/AppContext';
import { DesktopSidebar } from './components/navigation/DesktopSidebar';
import { TopHeader } from './components/navigation/TopHeader';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { LandingHero } from './components/landing/LandingHero';
import { DashboardView } from './components/dashboard/DashboardView';
import { LevelMapView } from './components/learning/LevelMapView';
import { StoryLearningView } from './components/learning/StoryLearningView';
import { DailyMissionsView } from './components/missions/DailyMissionsView';
import { FlashcardsView } from './components/flashcards/FlashcardsView';
import { ShortNotesView } from './components/notes/ShortNotesView';
import { BossChallengeView } from './components/challenges/BossChallengeView';
import { SquadView } from './components/community/SquadView';
import { MemeFeedView } from './components/memes/MemeFeedView';
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { ProfileView } from './components/profile/ProfileView';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { AuthModal } from './components/auth/AuthModal';
import { AIThinkingBanner } from './components/common/AIThinkingBanner';
import { XpCelebrationToast } from './components/common/XpCelebrationToast';
import { AiMentorTrigger } from './components/ai/AiMentorTrigger';
import { MockInterviewModal } from './components/interview/MockInterviewModal';

const AppContent: React.FC = () => {
  const { currentView, isAuthenticated, isMockInterviewOpen, setIsMockInterviewOpen } = useApp();

  if (currentView === 'landing' || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#F7F1E3]">
        <AIThinkingBanner />
        <XpCelebrationToast />
        <LandingHero />
        <AuthModal />
        <OnboardingModal />
      </main>
    );
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <DashboardView />;
      case 'learn':
        return <LevelMapView />;
      case 'story-lesson':
        return <StoryLearningView />;
      case 'missions':
        return <DailyMissionsView />;
      case 'flashcards':
        return <FlashcardsView />;
      case 'notes':
        return <ShortNotesView />;
      case 'challenges':
        return <BossChallengeView />;
      case 'squad':
        return <SquadView />;
      case 'memes':
        return <MemeFeedView />;
      case 'opportunities':
        return <OpportunitiesView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F1E3] text-[#171717] font-sans antialiased">
      {/* Ambient Simulated AI Status */}
      <AIThinkingBanner />

      {/* Real-time XP Celebration Toast */}
      <XpCelebrationToast />

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal />

      {/* AI Mock Technical Interview Room Modal */}
      <MockInterviewModal
        isOpen={isMockInterviewOpen}
        onClose={() => setIsMockInterviewOpen(false)}
      />

      {/* Multi-step Gamified Onboarding Modal */}
      <OnboardingModal />

      {/* Desktop Editorial Left Sidebar Dock */}
      <DesktopSidebar />

      {/* Main App Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <TopHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating SUTRA AI Mentor Trigger */}
      <AiMentorTrigger />

      {/* Mobile Bottom Navigation Bar & Contextual Drawer */}
      <MobileBottomNav />
    </div>
  );
};

export function App() {
  return <AppContent />;
}

export default App;
