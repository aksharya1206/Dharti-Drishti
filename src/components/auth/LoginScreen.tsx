import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, CloudRain, Cpu, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface LoginScreenProps {
  onSwitchToSignUp: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitchToSignUp }) => {
  const { login, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState<UserRole>('Farm Manager');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@farm.com).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      login(email, role);
      setIsLoading(false);
    }, 600);
  };

  const handleDemoQuickLogin = (demoRole: UserRole, demoEmail: string, name: string) => {
    setEmail(demoEmail);
    setPassword('demo-agri-2026');
    setRole(demoRole);
    setIsLoading(true);
    setTimeout(() => {
      login(demoEmail, demoRole, name);
      setIsLoading(false);
    }, 450);
  };

  const handleGoogleClick = () => {
    showToast(
      'OAuth Simulation Notice',
      'Google OAuth is simulated for this prototype. Click any Quick Demo Login button below to access the full platform.',
      'info'
    );
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast(
      'Password Reset Request',
      'Password reset link would be dispatched via SMTP in production backend. Use the 1-Click demo credentials below.',
      'info'
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-agri-cream selection:bg-forest-600 selection:text-white">
      {/* LEFT PANEL: Brand, Imagery & Visual Identity */}
      <div className="lg:w-1/2 relative bg-forest-900 text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Real Agricultural Field Photographic Background with Subtle Dark Forest Green Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/90 to-forest-800/80" />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-forest-600/60 border border-forest-400/40 flex items-center justify-center shadow-lg backdrop-blur-md">
            <svg
              className="w-6 h-6 text-forest-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              Adaptive Farm Operations Agent
            </h1>
            <span className="text-xs uppercase tracking-widest text-forest-300 font-semibold">
              Agricultural Operations Platform
            </span>
          </div>
        </div>

        {/* Hero Copy & Value Propositions */}
        <div className="relative z-10 my-12 lg:my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-700/50 border border-forest-500/30 text-forest-200 text-xs font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-forest-300" />
            <span>Agentic Operations Coordination Engine</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
            Smarter Decisions. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-300 via-emerald-200 to-amber-200">
              Better Farms.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-emerald-100/80 leading-relaxed mb-8">
            Coordinate farm operations, respond to changing weather conditions, and make every piece of shared machinery and labor count across your farm network.
          </p>

          {/* Three Concise Benefit Indicators */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5 p-3 rounded-lg bg-forest-800/40 border border-forest-700/30 backdrop-blur-sm">
              <div className="p-2 rounded-md bg-forest-600/40 text-forest-300">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Weather-Aware Planning</h4>
                <p className="text-xs text-forest-200/80 mt-0.5">
                  Proactively reschedules spraying and sensitive field tasks before rain or gust fronts arrive.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-lg bg-forest-800/40 border border-forest-700/30 backdrop-blur-sm">
              <div className="p-2 rounded-md bg-forest-600/40 text-forest-300">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">AI-Powered Task Prioritisation</h4>
                <p className="text-xs text-forest-200/80 mt-0.5">
                  Evaluates crop disease risks, soil moisture, and pest outbreaks to elevate critical interventions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-lg bg-forest-800/40 border border-forest-700/30 backdrop-blur-sm">
              <div className="p-2 rounded-md bg-forest-600/40 text-forest-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Intelligent Resource Coordination</h4>
                <p className="text-xs text-forest-200/80 mt-0.5">
                  Detects overlapping equipment assignments and eliminates multi-farm bottleneck delays.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Bottom Footer */}
        <div className="relative z-10 pt-6 border-t border-forest-700/40 flex items-center justify-between text-xs text-forest-300/70">
          <span>Prototype v1.0 • Hackathon Edition</span>
          <span>Haryana Multi-Farm Network</span>
        </div>
      </div>

      {/* RIGHT PANEL: Modern Authentication Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-forest-900/5 border border-agri-border p-8 sm:p-10">
          {/* Card Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-forest-50 text-forest-700 text-xs font-medium mb-3 border border-forest-100">
              <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse"></span>
              Secure Portal Authentication
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-agri-charcoal">
              Welcome back
            </h2>
            <p className="text-sm text-agri-muted mt-1">
              Sign in to manage and coordinate your multi-farm operations.
            </p>
          </div>

          {/* Quick Demo Access Bar for Judges */}
          <div className="mb-6 p-3.5 rounded-xl bg-forest-50/70 border border-forest-200/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-forest-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                1-Click Demo Access for Judges
              </span>
              <span className="text-[10px] uppercase font-bold text-forest-600 tracking-wider">Demo Mode</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleDemoQuickLogin('Farm Manager', 'manager@dhartidrishti.ag', 'Vikram Choudhary')
                }
                className="px-2.5 py-1.5 rounded-lg bg-white border border-forest-200 text-forest-800 text-xs font-medium hover:bg-forest-600 hover:text-white hover:border-forest-600 transition-colors shadow-sm text-center"
              >
                Farm Manager
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDemoQuickLogin('Farm Owner', 'owner@dhartidrishti.ag', 'Rajinder Singh')
                }
                className="px-2.5 py-1.5 rounded-lg bg-white border border-forest-200 text-forest-800 text-xs font-medium hover:bg-forest-600 hover:text-white hover:border-forest-600 transition-colors shadow-sm text-center"
              >
                Farm Owner
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDemoQuickLogin('Agricultural Consultant', 'consultant@dhartidrishti.ag', 'Dr. M. Sharma')
                }
                className="px-2.5 py-1.5 rounded-lg bg-white border border-forest-200 text-forest-800 text-xs font-medium hover:bg-forest-600 hover:text-white hover:border-forest-600 transition-colors shadow-sm text-center"
              >
                Consultant
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-agri-charcoal mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="manager@dhartidrishti.ag"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-agri-charcoal placeholder-agri-muted/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-agri-red focus:ring-agri-red/20'
                    : 'border-agri-border focus:border-forest-600 focus:ring-forest-600/10'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-agri-red mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-agri-charcoal">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-forest-600 hover:text-forest-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm text-agri-charcoal placeholder-agri-muted/50 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-agri-red focus:ring-agri-red/20'
                      : 'border-agri-border focus:border-forest-600 focus:ring-forest-600/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-agri-muted hover:text-agri-charcoal"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-agri-red mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Role Selector & Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-600 border-agri-border focus:ring-forest-500"
                />
                <span className="text-xs text-agri-muted">Remember me</span>
              </label>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-agri-muted">Role:</span>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="text-xs bg-forest-50 border border-forest-200 text-forest-800 rounded px-2 py-1 font-medium focus:outline-none"
                >
                  <option value="Farm Manager">Farm Manager</option>
                  <option value="Farm Owner">Farm Owner</option>
                  <option value="Agricultural Consultant">Consultant</option>
                </select>
              </div>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-agri-border" />
            <span className="text-xs uppercase font-semibold text-agri-muted tracking-wider">OR</span>
            <div className="flex-1 h-px bg-agri-border" />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full py-2.5 px-4 rounded-xl border border-agri-border hover:bg-agri-cream/60 text-agri-charcoal font-medium text-sm flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer Navigation */}
          <div className="mt-6 text-center text-xs text-agri-muted">
            New to the platform?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-forest-700 font-semibold hover:underline"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

