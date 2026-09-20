import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Compass,
  Clock,
  BookOpen,
  GraduationCap,
  Target,
  Layers,
  Flame,
  Check,
  Building2,
  ShieldCheck,
  Brain,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { clsx } from 'clsx';
import { examApi } from '../../api';
import { Exam } from '../../types';

export const OnboardingModal: React.FC = () => {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    user,
    onboardCareer,
    onboardExam,
    isLoading,
  } = useApp();

  // Root state: Track mode ('career' | 'exam')
  const [trackType, setTrackType] = useState<'career' | 'exam'>(
    user.trackType === 'exam' ? 'exam' : 'career'
  );
  const [step, setStep] = useState<number>(0); // 0 = Track Choice

  // Career Track State
  const [selectedRole, setSelectedRole] = useState<string>(
    user.currentRole && !user.currentRole.includes('Aspirant') ? user.currentRole : 'Web Developer'
  );
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(
    user.dreamCompanies.length > 0 ? user.dreamCompanies : ['Google', 'Microsoft', 'Amazon']
  );
  const [careerStyles, setCareerStyles] = useState<string[]>(
    user.learningStyles.length > 0 ? user.learningStyles : ['Stories', 'Hands-on']
  );
  const [careerTime, setCareerTime] = useState<number>(user.dailyTimeMinutes || 30);

  // GATE / Exam Track State
  const [examType, setExamType] = useState<string>(
    user.examDetails?.exam_type || 'GATE_CSE'
  );
  const [targetYear, setTargetYear] = useState<string>(
    user.examDetails?.target_year || '2028'
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    Array.isArray(user.examDetails?.goals)
      ? user.examDetails.goals
      : user.examDetails?.goals
      ? [user.examDetails.goals as string]
      : ['IIT / IISc', 'M.Tech']
  );
  const [prepLevel, setPrepLevel] = useState<string>(
    user.examDetails?.preparation_level || 'Just Starting'
  );
  const [examTime, setExamTime] = useState<number>(
    user.dailyTimeMinutes && user.dailyTimeMinutes >= 60 ? user.dailyTimeMinutes : 120
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    user.examDetails?.subjects && user.examDetails.subjects.length > 0
      ? user.examDetails.subjects
      : ['Programming & Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks']
  );

  // Catalog data for exams
  const [examsList, setExamsList] = useState<Exam[]>([]);

  useEffect(() => {
    examApi.getExams().then((data) => {
      if (data && data.length > 0) {
        setExamsList(data);
      }
    }).catch(() => {
      // ignore
    });
  }, []);

  // Total steps calculation
  // Step 0: Choose Track (Career vs GATE)
  // Career: Step 1 (Role) -> Step 2 (Companies) -> Step 3 (Preferences) -> Step 4 (Time)
  // GATE: Step 1 (Exam) -> Step 2 (Year) -> Step 3 (Goals) -> Step 4 (Prep Level) -> Step 5 (Time) -> Step 6 (Subjects)
  const totalSteps = trackType === 'career' ? 4 : 6;

  // Options Data
  const careerRoles = [
    { id: 'Web Developer', title: 'Web Developer', icon: '🌐', desc: 'Master client-side architecture, CSS magic, and state machines', tag: 'Fast Ramp-up' },
    { id: 'Full Stack Developer', title: 'Full Stack Developer', icon: '⚡', desc: 'End-to-end applications: React, Node.js, Postgres & Deployments', tag: 'High Demand' },
    { id: 'Software Developer', title: 'Software Developer (SDE)', icon: '💻', desc: 'DSA mastery, clean system architecture, algorithms & LeetCode', tag: 'Core Foundation' },
    { id: 'AI / ML', title: 'AI / ML Specialist', icon: '🧠', desc: 'Math intuition, neural nets, LLM orchestration, and embeddings', tag: 'Future Superpower' },
    { id: 'Data Scientist', title: 'Data Scientist', icon: '📊', desc: 'Transform messy data into predictive insights and statistical models', tag: 'Analytical' },
    { id: 'Cybersecurity', title: 'Cybersecurity Analyst', icon: '🛡️', desc: 'Threat defense, network vulnerabilities, cryptography & ethical hacking', tag: 'High Stakes' },
    { id: 'App Developer', title: 'App Developer', icon: '📱', desc: 'Cross-platform mobile apps with React Native & Flutter', tag: 'Mobile First' },
    { id: 'Product Designer', title: 'Product Designer', icon: '🎨', desc: 'Design systems, visual psychology, interaction design & Figma', tag: 'Creative UI' },
  ];

  const careerCompanies = [
    { id: 'Google', name: 'Google', logo: '🔍', type: 'Global Tech' },
    { id: 'Microsoft', name: 'Microsoft', logo: '🪟', type: 'Cloud & AI' },
    { id: 'Amazon', name: 'Amazon', logo: '📦', type: 'Distributed Scale' },
    { id: 'Atlassian', name: 'Atlassian', logo: '🔷', type: 'Dev Tools' },
    { id: 'Adobe', name: 'Adobe', logo: '🎨', type: 'Creative Tech' },
    { id: 'Zoho', name: 'Zoho', logo: '💼', type: 'Bootstrapped SaaS' },
    { id: 'Razorpay', name: 'Razorpay', logo: '💳', type: 'Fintech Titan' },
    { id: 'Swiggy', name: 'Swiggy', logo: '🛵', type: 'Hyperlocal Logistics' },
    { id: 'Infosys', name: 'Infosys', logo: '🏢', type: 'IT Services' },
    { id: 'TCS', name: 'TCS', logo: '🌐', type: 'Global Consulting' },
    { id: 'Wipro', name: 'Wipro', logo: '💡', type: 'Enterprise Digital' },
    { id: 'Other', name: 'Other Tech / Startups', logo: '🚀', type: 'Ecosystem' },
  ];

  const styleOptions = [
    { id: 'Stories', title: 'Story-Driven Narrative', icon: '🎬', desc: 'Learn through real engineering situations, dilemmas, and mission plots.' },
    { id: 'Visuals', title: 'Visual Diagrams & Analogies', icon: '🖼️', desc: 'Understand systems with real-world analogies (like Dhaba chai orders).' },
    { id: 'Hands-on', title: 'Hands-on Code & Sandbox', icon: '🛠️', desc: 'Build real components and inspect interactive packet sandboxes.' },
    { id: 'Challenges', title: 'Boss Challenges & Timers', icon: '🎮', desc: 'Pressure-test concepts with gamified boss battles and timed drills.' },
    { id: 'Mix', title: 'A Mix of Everything', icon: '✨', desc: 'Dynamic blend of stories, visuals, flashcards, and coding.' },
  ];

  const careerTimeOptions = [
    { value: 15, label: '15 min/day', subtitle: 'Quick Recall & 1 Flashcard Deck', icon: '⚡' },
    { value: 30, label: '30 min/day', subtitle: 'Main Daily Mission (Recommended)', icon: '🎯' },
    { value: 45, label: '45 min/day', subtitle: 'Mission + Hands-on Mini Practice', icon: '🔥' },
    { value: 60, label: '1 hour/day', subtitle: 'Deep Dive + Weekly Boss Challenge', icon: '🚀' },
    { value: 120, label: '2+ hours/day', subtitle: 'Full Power Mode + LeetCode Practice', icon: '🏆' },
  ];

  // GATE Options
  const gateExamOptions = [
    { id: 'GATE_CSE', title: 'GATE Computer Science (CS/IT)', icon: '💻', desc: 'Algorithms, OS, DBMS, Networks, TOC, Compiler Design & Math' },
    { id: 'GATE_DA', title: 'GATE Data Science & AI (DA)', icon: '🧠', desc: 'Probability, Linear Algebra, Machine Learning & AI Foundations' },
    { id: 'Other', title: 'Other Higher Studies / Research', icon: '📚', desc: 'Core theoretical foundation for MS/M.Tech research admissions' },
  ];

  const gateYears = ['GATE 2027', 'GATE 2028', 'Later', 'Not decided'];

  const gateGoals = [
    { id: 'IIT / IISc', label: 'IIT / IISc Direct Admission', icon: '🏛️' },
    { id: 'M.Tech', label: 'M.Tech in AI / Systems', icon: '🎓' },
    { id: 'PSU opportunities', label: 'PSU Recruitment (ISRO, BARC, ONGC)', icon: '⚡' },
    { id: 'Higher Studies', label: 'Higher Studies / MS Abroad', icon: '🌐' },
    { id: 'Specialization', label: 'Core Technical Specialization', icon: '🔬' },
    { id: 'I\'m still exploring', label: 'I\'m Still Exploring Options', icon: '🧭' },
  ];

  const gatePrepLevels = [
    { id: 'Just Starting', label: 'Just Starting', desc: 'Building first subject roadmap and foundational discipline', icon: '🌱' },
    { id: 'I\'ve studied some basics', label: 'Studied Some Basics', desc: 'Covered 1-2 subjects in college semesters', icon: '📖' },
    { id: 'I\'ve covered several subjects', label: 'Covered Several Subjects', desc: 'Completed 4+ major subjects, now solving PYQs', icon: '⚡' },
    { id: 'Revision stage', label: 'Revision Stage', desc: 'Consolidating formula notes and spaced repetition', icon: '🔄' },
    { id: 'Preparing for mocks', label: 'Preparing for Mocks', desc: 'Full length 65-question timed mock drills', icon: '🎯' },
  ];

  const gateTimeOptions = [
    { value: 30, label: '30 minutes/day', subtitle: 'Targeted Formula & PYQ Revision', icon: '⏱️' },
    { value: 60, label: '1 hour/day', subtitle: '1 Subject Concept + 5 PYQ Drill', icon: '⚡' },
    { value: 120, label: '2 hours/day', subtitle: 'Deep Concept Mission + PYQ Practice (Recommended)', icon: '🎯' },
    { value: 180, label: '3 hours/day', subtitle: 'Dual Subject Sprint + Active Recall', icon: '🔥' },
    { value: 240, label: '4+ hours/day', subtitle: 'Intensive AIR < 100 Power Mode', icon: '🏆' },
  ];

  const gateCseSubjectsList = [
    'Programming & Data Structures',
    'Algorithms',
    'Operating Systems',
    'DBMS',
    'Computer Networks',
    'Computer Organization',
    'Discrete Mathematics',
    'Theory of Computation',
    'Compiler Design',
    'Digital Logic',
    'Engineering Mathematics',
    'General Aptitude',
  ];

  const gateDaSubjectsList = [
    'Probability & Statistics',
    'Linear Algebra',
    'Calculus',
    'Programming',
    'Data Structures & Algorithms',
    'Database Management',
    'Machine Learning',
    'Artificial Intelligence',
    'Data Science',
    'General Aptitude',
  ];

  const currentSubjectsList =
    examType === 'GATE_DA' ? gateDaSubjectsList : gateCseSubjectsList;

  // Toggle Handlers
  const toggleCompany = (compName: string) => {
    if (selectedCompanies.includes(compName)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== compName));
    } else {
      if (selectedCompanies.length < 4) {
        setSelectedCompanies([...selectedCompanies, compName]);
      }
    }
  };

  const toggleStyle = (styleId: string) => {
    if (careerStyles.includes(styleId)) {
      setCareerStyles(careerStyles.filter((s) => s !== styleId));
    } else {
      setCareerStyles([...careerStyles, styleId]);
    }
  };

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const toggleSubject = (subjName: string) => {
    if (selectedSubjects.includes(subjName)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subjName));
    } else {
      setSelectedSubjects([...selectedSubjects, subjName]);
    }
  };

  // Submission
  const handleFinish = async () => {
    if (trackType === 'career') {
      const roleToPathIdMap: Record<string, string> = {
        'Web Developer': 'path_web_dev',
        'Full Stack Developer': 'path_full_stack',
        'Software Developer': 'path_sde',
        'AI / ML': 'path_ai_ml',
        'Data Scientist': 'path_data_science',
        'Cybersecurity': 'path_cybersecurity',
        'App Developer': 'path_app_dev',
        'Product Designer': 'path_product_design',
      };
      const pathId = roleToPathIdMap[selectedRole] || 'path_web_dev';

      await onboardCareer({
        career_path: selectedRole,
        learning_path_id: pathId,
        target_companies: selectedCompanies,
        daily_minutes: careerTime,
        learning_preferences: careerStyles,
      });
    } else {
      await onboardExam({
        exam_type: examType,
        target_year: targetYear,
        goals: selectedGoals,
        preparation_level: prepLevel,
        daily_minutes: examTime,
        subjects: selectedSubjects,
        learning_preferences: ['Stories', 'Hands-on'],
      });
    }
  };

  const getModalTitle = () => {
    if (step === 0) return 'Choose Your Learning Destination';
    if (trackType === 'career') {
      if (step === 1) return 'Choose Your Character Class';
      if (step === 2) return 'Which companies interest you?';
      if (step === 3) return 'How does your brain absorb concepts?';
      if (step === 4) return 'Set Your Daily Rhythm';
    } else {
      if (step === 1) return 'What exam are you preparing for?';
      if (step === 2) return 'Which year is your target exam?';
      if (step === 3) return 'What is your primary goal?';
      if (step === 4) return 'What is your current preparation level?';
      if (step === 5) return 'How much daily study time can you commit?';
      if (step === 6) return 'Which subjects are you studying currently?';
    }
    return 'Personalize Your Adventure';
  };

  return (
    <Modal
      isOpen={isOnboardingOpen}
      onClose={() => setIsOnboardingOpen(false)}
      maxWidth="2xl"
      title={getModalTitle()}
      badge={
        step === 0 ? (
          <Badge variant="marigold" size="sm">
            Step 0 • Track Choice
          </Badge>
        ) : (
          <Badge variant={trackType === 'career' ? 'forest' : 'marigold'} size="sm">
            {trackType === 'career' ? '💼 Career Track' : '📚 GATE Track'} • Step {step} of {totalSteps}
          </Badge>
        )
      }
    >
      <div className="space-y-6">
        {/* STEP 0: Track Selector (Career vs GATE) */}
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-[#575757]">
              Sutra is personalized for your specific path. Are you exploring software industry careers or preparing for higher studies/GATE?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Career Track */}
              <div
                onClick={() => setTrackType('career')}
                className={clsx(
                  'p-5 rounded-3xl border-2.5 transition-all cursor-pointer flex flex-col justify-between select-none',
                  trackType === 'career'
                    ? 'bg-[#244B3A] text-[#FAF6EE] border-[#171717] shadow-[4px_4px_0px_#171717] -translate-y-1'
                    : 'bg-[#FAF6EE] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl p-2.5 bg-[#FAF6EE] border border-[#171717] rounded-2xl">
                      💼
                    </span>
                    <Badge variant={trackType === 'career' ? 'marigold' : 'forest'} size="sm">
                      Career / Industry
                    </Badge>
                  </div>
                  <h3 className="font-display font-black text-xl leading-tight">
                    Software & Tech Careers
                  </h3>
                  <p
                    className={clsx(
                      'text-xs mt-2 leading-relaxed',
                      trackType === 'career' ? 'text-[#FAF6EE]/80' : 'text-[#575757]'
                    )}
                  >
                    Build real software products, master web/frontend/backend architectures, explore startup scenarios, and prepare for industry engineering interviews.
                  </p>
                </div>
                {trackType === 'career' && (
                  <div className="mt-4 pt-3 border-t border-[#FAF6EE]/20 flex items-center gap-1.5 text-xs font-bold text-[#E4A93A]">
                    <CheckCircle size={15} /> Selected Track
                  </div>
                )}
              </div>

              {/* Option 2: GATE Track */}
              <div
                onClick={() => setTrackType('exam')}
                className={clsx(
                  'p-5 rounded-3xl border-2.5 transition-all cursor-pointer flex flex-col justify-between select-none',
                  trackType === 'exam'
                    ? 'bg-[#244B3A] text-[#FAF6EE] border-[#171717] shadow-[4px_4px_0px_#171717] -translate-y-1'
                    : 'bg-[#FAF6EE] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl p-2.5 bg-[#FAF6EE] border border-[#171717] rounded-2xl">
                      📚
                    </span>
                    <Badge variant={trackType === 'exam' ? 'marigold' : 'peach'} size="sm">
                      GATE / Higher Studies
                    </Badge>
                  </div>
                  <h3 className="font-display font-black text-xl leading-tight">
                    GATE & Deep Theory
                  </h3>
                  <p
                    className={clsx(
                      'text-xs mt-2 leading-relaxed',
                      trackType === 'exam' ? 'text-[#FAF6EE]/80' : 'text-[#575757]'
                    )}
                  >
                    Master core computer science fundamentals (OS, DBMS, Algorithms, Networks, TOC) through situational situations, PYQs, and IIT/IISc target prep.
                  </p>
                </div>
                {trackType === 'exam' && (
                  <div className="mt-4 pt-3 border-t border-[#FAF6EE]/20 flex items-center gap-1.5 text-xs font-bold text-[#E4A93A]">
                    <CheckCircle size={15} /> Selected Track
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CAREER TRACK FLOW (Steps 1 to 4) */}
        {/* ========================================================================= */}

        {/* Career Step 1: Role Selection */}
        {trackType === 'career' && step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#575757]">
              Pick the tech character you want to build. This unlocks your story missions, skill trees, and challenges.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto p-1">
              {careerRoles.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={clsx(
                      'p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none',
                      isSelected
                        ? 'bg-[#244B3A] text-[#FAF6EE] border-[#171717] shadow-[3px_3px_0px_#171717] -translate-y-1'
                        : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-2xl">{role.icon}</span>
                        <span
                          className={clsx(
                            'text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                            isSelected
                              ? 'bg-[#E4A93A] text-[#171717] border-[#171717]'
                              : 'bg-[#FAF6EE] text-[#575757] border-[#171717]/40'
                          )}
                        >
                          {role.tag}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-sm leading-tight">
                        {role.title}
                      </h4>
                      <p
                        className={clsx(
                          'text-xs mt-1 leading-snug',
                          isSelected ? 'text-[#FAF6EE]/80' : 'text-[#575757]'
                        )}
                      >
                        {role.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#E4A93A]">
                        <CheckCircle size={14} /> Selected Class
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Career Step 2: Target Companies (Optional, Personalization only) */}
        {trackType === 'career' && step === 2 && (
          <div className="space-y-4">
            <div className="bg-[#FAF6EE] p-3.5 rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
              <p className="text-xs font-bold text-[#244B3A] flex items-center gap-1.5 mb-1">
                <ShieldCheck size={15} /> Context & Personalization (No False Guarantees)
              </p>
              <p className="text-xs text-[#575757] leading-relaxed">
                Company selection is purely for case studies, motivation, and project context (e.g. Razorpay payment webhooks or Swiggy routing). Selecting a company does not imply employment placement.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[#575757]">
              <span>Select up to 4 companies ({selectedCompanies.length}/4 chosen)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[45vh] overflow-y-auto p-1">
              {careerCompanies.map((comp) => {
                const isSelected = selectedCompanies.includes(comp.id);
                return (
                  <div
                    key={comp.id}
                    onClick={() => toggleCompany(comp.id)}
                    className={clsx(
                      'p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center select-none',
                      isSelected
                        ? 'bg-[#E4A93A] text-[#171717] border-[#171717] shadow-[3px_3px_0px_#171717] -translate-y-0.5 font-bold'
                        : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                    )}
                  >
                    <span className="text-2xl mb-1">{comp.logo}</span>
                    <span className="font-display font-bold text-xs">{comp.name}</span>
                    <span className="text-[9px] text-[#171717]/70 font-semibold mt-0.5">
                      {comp.type}
                    </span>
                    {isSelected && (
                      <span className="mt-1.5 text-[9px] bg-[#171717] text-[#FAF6EE] px-1.5 py-0.5 rounded-full font-bold">
                        ✓ Selected
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Career Step 3: Learning Preferences */}
        {trackType === 'career' && step === 3 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#575757]">
              How does your brain absorb concepts fastest? Select all that resonate.
            </p>
            <div className="space-y-2.5">
              {styleOptions.map((style) => {
                const isSelected = careerStyles.includes(style.id);
                return (
                  <div
                    key={style.id}
                    onClick={() => toggleStyle(style.id)}
                    className={clsx(
                      'p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 select-none',
                      isSelected
                        ? 'bg-[#244B3A] text-[#FAF6EE] border-[#171717] shadow-[3px_3px_0px_#171717]'
                        : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl p-2 rounded-xl bg-[#FAF6EE] border border-[#171717] text-[#171717]">
                        {style.icon}
                      </span>
                      <div>
                        <h4 className="font-display font-bold text-sm">
                          {style.title}
                        </h4>
                        <p
                          className={clsx(
                            'text-xs mt-0.5',
                            isSelected ? 'text-[#FAF6EE]/80' : 'text-[#575757]'
                          )}
                        >
                          {style.desc}
                        </p>
                      </div>
                    </div>
                    <div
                      className={clsx(
                        'w-6 h-6 rounded-lg border-2 flex items-center justify-center font-bold text-xs',
                        isSelected
                          ? 'bg-[#E4A93A] text-[#171717] border-[#171717]'
                          : 'bg-[#FAF6EE] border-[#171717]'
                      )}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Career Step 4: Daily Study Time */}
        {trackType === 'career' && step === 4 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#575757]">
              College schedules get busy. How much focused time can you realistically give each day?
            </p>
            <div className="space-y-2.5">
              {careerTimeOptions.map((opt) => {
                const isSelected = careerTime === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => setCareerTime(opt.value)}
                    className={clsx(
                      'p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 select-none',
                      isSelected
                        ? 'bg-[#E4A93A] text-[#171717] border-[#171717] shadow-[3px_3px_0px_#171717] -translate-y-0.5'
                        : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl">{opt.icon}</span>
                      <div>
                        <h4 className="font-display font-bold text-base">
                          {opt.label}
                        </h4>
                        <p className="text-xs text-[#171717]/80 font-medium mt-0.5">
                          {opt.subtitle}
                        </p>
                      </div>
                    </div>
                    <div
                      className={clsx(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs',
                        isSelected
                          ? 'bg-[#171717] text-[#FAF6EE] border-[#171717]'
                          : 'bg-[#FAF6EE] border-[#171717]'
                      )}
                    >
                      {isSelected ? '●' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GATE / EXAM TRACK FLOW (Steps 1 to 6 — NO COMPANY SELECTION!) */}
        {/* ========================================================================= */}

        {/* GATE Step 1: Exam Type */}
        {trackType === 'exam' && step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#575757]">
              Which GATE paper or theoretical specialization are you targeting?
            </p>
            <div className="space-y-3">
              {gateExamOptions.map((opt) => {
                const isSelected = examType === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setExamType(opt.id)}
                    className={clsx(
                      'p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 select-none',
                      isSelected
                        ? 'bg-[#244B3A] text-[#FAF6EE] border-[#171717] shadow-[3px_3px_0px_#171717]'
                        : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-3xl p-2 rounded-xl bg-[#FAF6EE] border border-[#171717] text-[#171717]">
                        {opt.icon}
                      </span>
                      <div>
                        <h4 className="font-display font-bold text-base">
                          {opt.title}
                        </h4>
                        <p
                          className={clsx(
                            'text-xs mt-0.5',
                            isSelected ? 'text-[#FAF6EE]/80' : 'text-[#575757]'
                          )}
                        >
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                    <div
                      className={clsx(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs',
                        isSelected
                          ? 'bg-[#E4A93A] text-[#171717] border-[#171717]'
                          : 'bg-[#FAF6EE] border-[#171717]'
                      )}
                    >
                      {isSelected ? '●' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GATE Step 2: Target Exam Year */}
        {trackType === 'exam' && step === 2 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#575757]">
              Which year are you planning to appear for GATE?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {gateYears.map((yearStr) => {
                const isSelected = targetYear === yearStr;
                return (
                  <div
                    key={yearStr}
                    onClick={() => setTargetYear(yearStr)}
                    className={clsx(
                      'p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between select-none',
                      isSelected
                        ? 'bg-[#E4A93A] text-[#171717] border-[#171717] shadow-[3px_3px_0px_#171717] -translate-y-0.5 font-bold'
                        : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🎯</span>
                      <span className="font-display font-bold text-base">{yearStr}</span>
                    </div>
                    {isSelected && (
                      <span className="text-xs bg-[#171717] text-[#FAF6EE] px-2 py-0.5 rounded-full font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GATE Step 3: Goals */}
        {trackType === 'exam' && step === 3 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#575757]">
              What are your key goals with GATE? (Select all that apply)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {gateGoals.map((g) => {
                const isSelected = selectedGoals.includes(g.id);
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className={clsx(
                      'p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 select-none',
                      isSelected
                        ? 'bg-[#244B3A] text-[#FAF6EE] border-[#171717] shadow-[3px_3px_0px_#171717]'
                        : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{g.icon}</span>
                      <span className="font-display font-bold text-xs sm:text-sm">
                        {g.label}
                      </span>
                    </div>
                    <div
                      className={clsx(
                        'w-5 h-5 rounded-md border-2 flex items-center justify-center font-bold text-xs shrink-0',
                        isSelected
                          ? 'bg-[#E4A93A] text-[#171717] border-[#171717]'
                          : 'bg-[#FAF6EE] border-[#171717]'
                      )}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GATE Step 4: Preparation Level */}
        {trackType === 'exam' && step === 4 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#575757]">
              Where are you currently in your GATE preparation journey?
            </p>
            <div className="space-y-2.5">
              {gatePrepLevels.map((lvl) => {
                const isSelected = prepLevel === lvl.id;
                return (
                  <div
                    key={lvl.id}
                    onClick={() => setPrepLevel(lvl.id)}
                    className={clsx(
                      'p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 select-none',
                      isSelected
                        ? 'bg-[#E4A93A] text-[#171717] border-[#171717] shadow-[3px_3px_0px_#171717] -translate-y-0.5'
                        : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lvl.icon}</span>
                      <div>
                        <h4 className="font-display font-bold text-sm">
                          {lvl.label}
                        </h4>
                        <p className="text-xs text-[#171717]/80 font-medium">
                          {lvl.desc}
                        </p>
                      </div>
                    </div>
                    <div
                      className={clsx(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs',
                        isSelected
                          ? 'bg-[#171717] text-[#FAF6EE] border-[#171717]'
                          : 'bg-[#FAF6EE] border-[#171717]'
                      )}
                    >
                      {isSelected ? '●' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GATE Step 5: Daily Study Time */}
        {trackType === 'exam' && step === 5 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#575757]">
              How many hours can you commit daily to focused GATE concept drills and problem solving?
            </p>
            <div className="space-y-2.5">
              {gateTimeOptions.map((opt) => {
                const isSelected = examTime === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => setExamTime(opt.value)}
                    className={clsx(
                      'p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 select-none',
                      isSelected
                        ? 'bg-[#244B3A] text-[#FAF6EE] border-[#171717] shadow-[3px_3px_0px_#171717] -translate-y-0.5'
                        : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                    )}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl">{opt.icon}</span>
                      <div>
                        <h4 className="font-display font-bold text-base">
                          {opt.label}
                        </h4>
                        <p
                          className={clsx(
                            'text-xs mt-0.5',
                            isSelected ? 'text-[#FAF6EE]/80' : 'text-[#575757]'
                          )}
                        >
                          {opt.subtitle}
                        </p>
                      </div>
                    </div>
                    <div
                      className={clsx(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs',
                        isSelected
                          ? 'bg-[#E4A93A] text-[#171717] border-[#171717]'
                          : 'bg-[#FAF6EE] border-[#171717]'
                      )}
                    >
                      {isSelected ? '●' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GATE Step 6: Subjects Selection */}
        {trackType === 'exam' && step === 6 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#575757]">
              <span>Select the subjects you are studying currently ({selectedSubjects.length} chosen):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[48vh] overflow-y-auto p-1">
              {currentSubjectsList.map((subj) => {
                const isSelected = selectedSubjects.includes(subj);
                return (
                  <div
                    key={subj}
                    onClick={() => toggleSubject(subj)}
                    className={clsx(
                      'p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 select-none',
                      isSelected
                        ? 'bg-[#E4A93A] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] font-bold'
                        : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[1.5px_1.5px_0px_#171717] hover:bg-[#ECE4D0]'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>📖</span>
                      <span className="font-display font-bold text-xs sm:text-sm">
                        {subj}
                      </span>
                    </div>
                    <div
                      className={clsx(
                        'w-5 h-5 rounded-md border-2 flex items-center justify-center font-bold text-xs shrink-0',
                        isSelected
                          ? 'bg-[#171717] text-[#FAF6EE] border-[#171717]'
                          : 'bg-[#FAF6EE] border-[#171717]'
                      )}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-[#171717]/15">
          {step > 0 ? (
            <Button
              variant="secondary"
              size="md"
              icon={<ArrowLeft size={16} />}
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          ) : (
            <span />
          )}

          {step < totalSteps ? (
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
              onClick={() => setStep(step + 1)}
            >
              {step === 0 ? 'Configure Track →' : 'Continue'}
            </Button>
          ) : (
            <Button
              variant="forest"
              size="lg"
              disabled={isLoading}
              icon={<Sparkles size={18} />}
              iconPosition="right"
              onClick={handleFinish}
            >
              {isLoading ? 'Activating Syllabus...' : 'Enter Learning World 🚀'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
