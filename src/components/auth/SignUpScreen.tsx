import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface SignUpScreenProps {
  onSwitchToLogin: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSwitchToLogin }) => {
  const { login, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Farm Manager');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required.';
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid email.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    if (!agreeTerms) {
      errs.agreeTerms = 'You must accept the terms of service.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      login(email, role, fullName);
      setIsLoading(false);
      showToast('Account Created', `Welcome to Adaptive Farm Operations, ${fullName}!`, 'success');
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-agri-cream selection:bg-forest-600 selection:text-white">
      {/* LEFT PANEL */}
      <div className="lg:w-5/12 relative bg-forest-900 text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1600&auto=format&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/90 to-forest-800/80" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-600/60 border border-forest-400/40 flex items-center justify-center shadow-lg">
            <svg
              className="w-5 h-5 text-forest-300"
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
          <span className="font-heading font-bold text-lg text-white">Adaptive Farm Operations</span>
        </div>

        <div className="relative z-10 my-8 max-w-sm">
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
            Scale Operations Across All Your Plots
          </h3>
          <p className="text-sm text-forest-200/80 leading-relaxed mb-6">
            Join agricultural leaders coordinating field crews, irrigation networks, and machinery with intelligent, weather-adaptive scheduling.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-forest-300 shrink-0" />
              <span>Multi-plot resource allocation & tracking</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-forest-300 shrink-0" />
              <span>Real-time weather risk mitigation alerts</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-forest-300 shrink-0" />
              <span>Conflict-free shared equipment scheduling</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-forest-400">
          Haryana Agricultural Network Initiative • 2026
        </div>
      </div>

      {/* RIGHT PANEL: Sign Up Form */}
      <div className="lg:w-7/12 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-forest-900/5 border border-agri-border p-8 sm:p-10">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="inline-flex items-center gap-1.5 text-xs text-agri-muted hover:text-agri-charcoal font-medium mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </button>

          <div className="mb-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-agri-charcoal">
              Create an account
            </h2>
            <p className="text-sm text-agri-muted mt-1">
              Select your role to configure your operational dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-agri-charcoal mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                placeholder="e.g. Vikram Choudhary"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-agri-charcoal placeholder-agri-muted/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.fullName
                    ? 'border-agri-red focus:ring-agri-red/20'
                    : 'border-agri-border focus:border-forest-600 focus:ring-forest-600/10'
                }`}
              />
              {errors.fullName && <p className="text-xs text-agri-red mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-agri-charcoal mb-1">
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
              {errors.email && <p className="text-xs text-agri-red mt-1">{errors.email}</p>}
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-xs font-semibold text-agri-charcoal mb-1.5">
                Primary Operational Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Farm Manager', 'Farm Owner', 'Agricultural Consultant'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-3 py-2 rounded-lg border text-xs font-medium text-center transition-all ${
                      role === r
                        ? 'bg-forest-800 text-white border-forest-800 shadow-sm'
                        : 'bg-white text-agri-charcoal border-agri-border hover:bg-forest-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-agri-charcoal mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="Min 6 chars"
                    className={`w-full px-3 py-2 rounded-lg border text-sm text-agri-charcoal focus:outline-none focus:ring-2 ${
                      errors.password
                        ? 'border-agri-red focus:ring-agri-red/20'
                        : 'border-agri-border focus:border-forest-600 focus:ring-forest-600/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-agri-muted"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-agri-red mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-charcoal mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  placeholder="Re-type password"
                  className={`w-full px-3 py-2 rounded-lg border text-sm text-agri-charcoal focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-agri-red focus:ring-agri-red/20'
                      : 'border-agri-border focus:border-forest-600 focus:ring-forest-600/10'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-agri-red mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => {
                    setAgreeTerms(e.target.checked);
                    if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: undefined });
                  }}
                  className="mt-0.5 w-4 h-4 rounded text-forest-600 border-agri-border focus:ring-forest-500"
                />
                <span className="text-xs text-agri-muted leading-tight">
                  I agree to the Agricultural Network Terms of Service and acknowledge that this prototype uses simulated demonstration planning heuristics.
                </span>
              </label>
              {errors.agreeTerms && <p className="text-xs text-agri-red mt-1">{errors.agreeTerms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-agri-muted">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-forest-700 font-semibold hover:underline"
            >
              Sign in instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
