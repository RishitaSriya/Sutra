import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { clsx } from 'clsx';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    openAuthModal,
    login,
    register,
    loginWithDemoAarav,
    loginWithDemoMeera,
    loginWithDemoKabir,
    loginWithDemoAnanya,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [college, setCollege] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync tab with AppContext if modal opens with a specific tab
  React.useEffect(() => {
    setActiveTab(authModalTab);
    setErrorMsg(null);
  }, [authModalTab, isAuthModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (activeTab === 'register') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return;
      }

      setIsLoading(true);
      try {
        await register({
          name: name.trim(),
          email: email.trim(),
          password,
          confirm_password: confirmPassword,
          college: college.trim() || 'Engineering College',
        });
      } catch (err: any) {
        setErrorMsg(err.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!email.trim()) {
        setErrorMsg('Please enter your email.');
        return;
      }
      if (!password) {
        setErrorMsg('Please enter your password.');
        return;
      }

      setIsLoading(true);
      try {
        await login(email.trim(), password);
      } catch (err: any) {
        setErrorMsg(err.message || 'Invalid email or password.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuickDemo = async (demoType: 'aarav' | 'meera' | 'kabir' | 'ananya') => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      if (demoType === 'aarav') {
        await loginWithDemoAarav();
      } else if (demoType === 'meera') {
        await loginWithDemoMeera();
      } else if (demoType === 'kabir') {
        await loginWithDemoKabir();
      } else {
        await loginWithDemoAnanya();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      maxWidth="md"
      title={activeTab === 'login' ? 'Welcome Back to Sutra' : 'Create Your Student Account'}
      badge={
        <Badge variant={activeTab === 'login' ? 'forest' : 'marigold'} size="sm">
          {activeTab === 'login' ? '🔑 Sign In' : '🚀 Get Started'}
        </Badge>
      }
    >
      <div className="space-y-5">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#ECE4D0] rounded-2xl border-2 border-[#171717]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
            }}
            className={clsx(
              'py-2 text-xs font-display font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer select-none',
              activeTab === 'login'
                ? 'bg-[#244B3A] text-[#FAF6EE] border border-[#171717] shadow-[2px_2px_0px_#171717]'
                : 'text-[#575757] hover:text-[#171717]'
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
            }}
            className={clsx(
              'py-2 text-xs font-display font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer select-none',
              activeTab === 'register'
                ? 'bg-[#E4A93A] text-[#171717] border border-[#171717] shadow-[2px_2px_0px_#171717]'
                : 'text-[#575757] hover:text-[#171717]'
            )}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-[#E9785A]/15 border-2 border-[#E9785A] rounded-2xl text-xs font-bold text-[#171717]">
            <AlertCircle size={16} className="text-[#E9785A] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-display font-bold uppercase text-[#575757] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#575757]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF6EE] border-2 border-[#171717] rounded-xl text-sm font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#244B3A]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-display font-bold uppercase text-[#575757] mb-1">
              College Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#575757]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu or name@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF6EE] border-2 border-[#171717] rounded-xl text-sm font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#244B3A]"
              />
            </div>
          </div>

          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-display font-bold uppercase text-[#575757] mb-1">
                College / University (Optional)
              </label>
              <div className="relative">
                <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#575757]" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. NIT Trichy / VNR VJIET"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF6EE] border-2 border-[#171717] rounded-xl text-sm font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#244B3A]"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-display font-bold uppercase text-[#575757] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#575757]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF6EE] border-2 border-[#171717] rounded-xl text-sm font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#244B3A]"
                />
              </div>
            </div>

            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-display font-bold uppercase text-[#575757] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#575757]" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF6EE] border-2 border-[#171717] rounded-xl text-sm font-semibold text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#244B3A]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Button
              variant={activeTab === 'login' ? 'primary' : 'forest'}
              size="lg"
              type="submit"
              disabled={isLoading}
              className="w-full justify-center text-sm"
              icon={isLoading ? <Sparkles className="animate-spin" size={16} /> : <ArrowRight size={16} />}
              iconPosition="right"
            >
              {isLoading
                ? 'Authenticating...'
                : activeTab === 'login'
                ? 'Sign In to Dashboard'
                : 'Create Account & Continue →'}
            </Button>
          </div>
        </form>

        {/* Quick Demo Pre-seed Access Box */}
        <div className="p-3.5 bg-[#FAF6EE] rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-display font-bold uppercase tracking-wider text-[#575757]">
              ⚡ Fast Demo Access (Pre-seeded Accounts)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('aarav')}
              className="p-2 bg-[#F7F1E3] hover:bg-[#E4A93A]/30 border-2 border-[#171717] rounded-xl text-left transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">🌐</span>
                <span className="font-display font-bold text-xs text-[#171717]">Aarav</span>
              </div>
              <p className="text-[10px] text-[#575757] font-semibold mt-0.5">
                Web Dev • Level 1
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('meera')}
              className="p-2 bg-[#F7F1E3] hover:bg-[#244B3A]/20 border-2 border-[#171717] rounded-xl text-left transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">📊</span>
                <span className="font-display font-bold text-xs text-[#171717]">Meera</span>
              </div>
              <p className="text-[10px] text-[#575757] font-semibold mt-0.5">
                Data Science • Level 1
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('kabir')}
              className="p-2 bg-[#F7F1E3] hover:bg-[#E9785A]/20 border-2 border-[#171717] rounded-xl text-left transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">🛡️</span>
                <span className="font-display font-bold text-xs text-[#171717]">Kabir</span>
              </div>
              <p className="text-[10px] text-[#575757] font-semibold mt-0.5">
                Cybersecurity • Level 1
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('ananya')}
              className="p-2 bg-[#F7F1E3] hover:bg-[#244B3A]/20 border-2 border-[#171717] rounded-xl text-left transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">📚</span>
                <span className="font-display font-bold text-xs text-[#171717]">Ananya</span>
              </div>
              <p className="text-[10px] text-[#575757] font-semibold mt-0.5">
                GATE CSE 2028
              </p>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
