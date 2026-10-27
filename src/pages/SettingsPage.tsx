import React, { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Sliders,
  Database,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Key,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';

export const SettingsPage: React.FC = () => {
  const { user, resetAllDemoData, showToast } = useApp();

  const [unit, setUnit] = useState<'Acres' | 'Hectares'>('Acres');
  const [currency, setCurrency] = useState('INR (₹)');
  const [autoRescheduleWeather, setAutoRescheduleWeather] = useState(false);
  const [notifyConflicts, setNotifyConflicts] = useState(true);
  const [notifyWeatherRisk, setNotifyWeatherRisk] = useState(true);
  const [conservatismLevel, setConservatismLevel] = useState('Moderate (Balances input cost vs crop safety)');

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Platform preferences updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Settings & System Configurations"
        subtitle="Manage user profiles, agricultural unit preferences, autonomous agent thresholds, and external API credentials."
        badge="Platform Config"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile and Preferences */}
        <div className="lg:col-span-8 space-y-6">
          {/* User Profile Section */}
          <div className="bg-white rounded-2xl border border-agri-border p-6 shadow-sm">
            <div className="flex items-center gap-3.5 pb-4 border-b border-agri-border mb-4">
              <div className="w-12 h-12 rounded-xl bg-forest-800 text-white font-black text-base flex items-center justify-center uppercase">
                {user?.name ? user.name.slice(0, 2) : 'AG'}
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-agri-charcoal">
                  {user?.name || 'Farm Manager'}
                </h3>
                <span className="text-xs text-agri-muted">{user?.email}</span>
                <span className="inline-block ml-2 text-[10px] px-2 py-0.5 rounded bg-forest-50 text-forest-700 font-bold">
                  {user?.role}
                </span>
              </div>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-agri-charcoal mb-1">Area Units</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-agri-border bg-white text-agri-charcoal focus:outline-none"
                  >
                    <option value="Acres">Acres (Standard Indian Agronomy)</option>
                    <option value="Hectares">Hectares (Metric Standard)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-agri-charcoal mb-1">Currency Standard</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-agri-border bg-white text-agri-charcoal focus:outline-none"
                  >
                    <option value="INR (₹)">Indian Rupee (INR ₹)</option>
                    <option value="USD ($)">US Dollar (USD $)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-agri-charcoal mb-1">
                  Planning Conservatism & Rain Tolerance
                </label>
                <select
                  value={conservatismLevel}
                  onChange={e => setConservatismLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-agri-border bg-white text-agri-charcoal focus:outline-none"
                >
                  <option value="Aggressive">Aggressive (Tolerates 50% rain probability)</option>
                  <option value="Moderate (Balances input cost vs crop safety)">
                    Moderate (Default: Triggers reschedule at &gt; 60% rain probability)
                  </option>
                  <option value="Ultra-Conservative">Ultra-Conservative (Reschedules if rain &gt; 30%)</option>
                </select>
              </div>

              {/* Notification Toggles */}
              <div className="pt-3 border-t border-agri-border space-y-2.5">
                <span className="font-bold text-agri-charcoal block">Alert Notifications</span>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyConflicts}
                    onChange={e => setNotifyConflicts(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-700"
                  />
                  <span>Notify immediately when shared machinery is double-booked</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyWeatherRisk}
                    onChange={e => setNotifyWeatherRisk(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-700"
                  />
                  <span>Dispatch weather washout warning when precipitation probability exceeds 60%</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold transition-all shadow-xs"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </div>

          {/* Reset Demo State Section */}
          <div className="bg-white rounded-2xl border border-agri-border p-6 shadow-sm">
            <h3 className="font-heading font-bold text-base text-agri-charcoal mb-1">
              Demonstration & Hackathon Controls
            </h3>
            <p className="text-xs text-agri-muted mb-4 leading-relaxed">
              If you have applied revised plans, resolved conflicts, or ran contingency simulations, you can restore all 3 Haryana plots, tasks, and recommendations to the pristine starting scenario.
            </p>

            <button
              onClick={resetAllDemoData}
              className="px-4 py-2.5 rounded-xl border border-forest-300 bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-forest-700" />
              <span>Reset Entire Dataset to Initial Demo State</span>
            </button>
          </div>
        </div>

        {/* Right Column: Data Sources & Credential Integrations */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-agri-border p-6 shadow-sm space-y-5 h-fit text-xs">
          <div className="pb-3 border-b border-agri-border">
            <h3 className="font-heading font-bold text-base text-agri-charcoal">
              Data Integrations
            </h3>
            <p className="text-[11px] text-agri-muted">
              Distinguishing live APIs from prototype demo heuristics
            </p>
          </div>

          <div className="space-y-4">
            {/* Weather API */}
            <div className="p-3.5 rounded-xl border border-agri-border bg-agri-cream/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-agri-charcoal">OpenWeather / IMD Radar</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  Demo Simulated
                </span>
              </div>
              <p className="text-[11px] text-agri-muted">
                Requires <code className="bg-white px-1 rounded">WEATHER_API_KEY</code> for live Doppler radar feed. Currently running deterministic Haryana sample.
              </p>
            </div>

            {/* Vision Model */}
            <div className="p-3.5 rounded-xl border border-agri-border bg-agri-cream/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-agri-charcoal">Crop Disease Vision Model</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  Rule Heuristic Demo
                </span>
              </div>
              <p className="text-[11px] text-agri-muted">
                Requires CNN / Vision transformer endpoint for leaf image inference. Manual agronomy scouting fallback currently active.
              </p>
            </div>

            {/* IoT Soil Telemetry */}
            <div className="p-3.5 rounded-xl border border-agri-border bg-agri-cream/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-agri-charcoal">Borewell & Soil Telemetry</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  Simulated Nodes
                </span>
              </div>
              <p className="text-[11px] text-agri-muted">
                MQTT broker connection needed for physical LoRaWAN soil moisture probes.
              </p>
            </div>

            {/* Backend LLM Agent */}
            <div className="p-3.5 rounded-xl border border-agri-border bg-agri-cream/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-agri-charcoal">LLM Reasoning Agent</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-forest-100 text-forest-800">
                  Client Rule Engine
                </span>
              </div>
              <p className="text-[11px] text-agri-muted">
                Deterministic operations engine running in browser with 100% explainability.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-agri-border/60 text-[11px] text-agri-muted">
            Adaptive Farm Operations Agent • Production Design System v1.0
          </div>
        </div>
      </div>
    </div>
  );
};
