import React from 'react';
import { Bot, Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AgentInsightCard: React.FC = () => {
  const { setActivePage, runPlanEngine, isGeneratingPlan } = useApp();

  return (
    <div className="rounded-2xl bg-gradient-to-br from-forest-800 via-forest-900 to-forest-800 text-white p-6 sm:p-7 shadow-lg relative overflow-hidden border border-forest-600/40">
      {/* Subtle background glow */}
      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-forest-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-600/80 border border-forest-400/40 flex items-center justify-center text-forest-300">
              <Bot className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-sm tracking-wide text-forest-200 uppercase">
              Agent Operational Insight
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
              Pending Review
            </span>
          </div>

          <p className="text-sm sm:text-base text-emerald-50 leading-relaxed mb-2 font-normal">
            &ldquo;Rain is forecast during the planned field-operation window for{' '}
            <span className="font-bold text-amber-200">Farm A (Sonipat)</span>. Review the schedule before assigning the shared equipment to another farm.{' '}
            <span className="text-forest-200 underline decoration-forest-400 decoration-dotted">
              No schedule has been changed automatically.
            </span>
            &rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-forest-200/90 pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              Precipitation Probability: 82% at 14:00
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-300" />
              Human-in-the-loop: Requires Operator Sign-off
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => setActivePage('agent-centre')}
            className="px-4 py-2.5 rounded-xl bg-forest-700/80 hover:bg-forest-600 border border-forest-500/50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Review Recommendation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={runPlanEngine}
            disabled={isGeneratingPlan}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-forest-300 via-emerald-200 to-amber-200 text-forest-900 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-102 cursor-pointer disabled:opacity-70"
          >
            <Sparkles className="w-4 h-4 text-forest-800" />
            <span>Open Operations Planner</span>
          </button>
        </div>
      </div>
    </div>
  );
};

