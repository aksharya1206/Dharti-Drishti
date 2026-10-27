import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Wrench,
  X,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PlanGeneratorModal: React.FC = () => {
  const { planResult, applyProposedPlan, clearPlanResult, isGeneratingPlan } = useApp();

  if (isGeneratingPlan) {
    return (
      <div className="fixed inset-0 z-50 bg-forest-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-agri-border text-center">
          <div className="w-16 h-16 rounded-2xl bg-forest-100 text-forest-700 mx-auto flex items-center justify-center mb-4 relative">
            <Sparkles className="w-8 h-8 text-forest-600 animate-spin" />
          </div>
          <h3 className="font-heading font-bold text-lg text-agri-charcoal mb-2">
            Evaluating Farm Operations Schedule
          </h3>
          <p className="text-xs text-agri-muted mb-4 leading-relaxed">
            Running rule-based optimization across 3 Haryana farm plots: checking precipitation forecasts, machinery availability, and task priority queues...
          </p>
          <div className="w-full bg-forest-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-forest-600 h-full w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!planResult) return null;

  return (
    <div className="fixed inset-0 z-50 bg-forest-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-agri-border overflow-hidden my-8 animate-scale-up">
        {/* Header */}
        <div className="bg-forest-800 text-white p-6 sm:p-7 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-forest-600/70 border border-forest-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-forest-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-forest-700 text-forest-200">
                  Prototype Planning Engine
                </span>
                <span className="text-[10px] text-forest-300">
                  Rule-Based Demonstration • Generated at {planResult.generatedAt}
                </span>
              </div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
                Proposed Operations Plan & Rescheduling
              </h2>
            </div>
          </div>
          <button
            onClick={clearPlanResult}
            className="p-1.5 rounded-lg text-forest-300 hover:text-white hover:bg-forest-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine Applied Rules Banner */}
        <div className="bg-forest-50 border-b border-forest-100 px-6 py-3 flex flex-wrap items-center gap-2 text-xs text-forest-900">
          <span className="font-semibold flex items-center gap-1 text-forest-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
            Transparent Rules Triggered:
          </span>
          {planResult.engineRulesApplied.map((rule, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full bg-white border border-forest-200 text-forest-800 font-medium text-[11px]"
            >
              {rule}
            </span>
          ))}
        </div>

        {/* Content Body: Before-and-After Comparison */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[60vh] overflow-y-auto">
          <div>
            <h3 className="font-heading font-bold text-base text-agri-charcoal mb-1">
              Before & After Schedule Comparison
            </h3>
            <p className="text-xs text-agri-muted">
              Review each proposed revision. The agent has de-conflicted shared machinery and postponed chemical spraying to avoid forecast rainfall.
            </p>
          </div>

          <div className="space-y-4">
            {planResult.changes.map((ch, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-agri-border overflow-hidden bg-agri-cream/30 p-4 sm:p-5 transition-all hover:border-forest-400"
              >
                {/* Task title and farm */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-bold text-forest-700 uppercase tracking-wide">
                      {ch.farmName}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-agri-charcoal">
                      {ch.taskTitle}
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                    <AlertTriangle className="w-3 h-3 text-agri-amber" />
                    {ch.ruleTriggered}
                  </span>
                </div>

                {/* Diff Grid: Original vs Revised */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {/* Original */}
                  <div className="p-3 rounded-lg bg-red-50/60 border border-red-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-agri-red block mb-1">
                      Original Schedule (Conflicts / Risks)
                    </span>
                    <div className="space-y-1 text-xs text-agri-charcoal">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-agri-red" />
                        <span className="font-medium line-through">{ch.originalTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wrench className="w-3.5 h-3.5 text-agri-red" />
                        <span>{ch.originalResource}</span>
                      </div>
                    </div>
                  </div>

                  {/* Proposed Revised */}
                  <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 block mb-1">
                      Proposed Revised Schedule (Optimised)
                    </span>
                    <div className="space-y-1 text-xs text-agri-charcoal">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-forest-600" />
                        <span className="font-bold text-forest-900">{ch.newTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wrench className="w-3.5 h-3.5 text-forest-600" />
                        <span className="font-semibold text-forest-900">{ch.newResource}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Explainability Matrix */}
                <div className="p-3 rounded-lg bg-white border border-agri-border space-y-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-agri-charcoal shrink-0 w-28">Why it changed:</span>
                    <span className="text-agri-muted">{ch.reason}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-forest-800 shrink-0 w-28">Operational Benefit:</span>
                    <span className="text-forest-700 font-medium">{ch.benefit}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-agri-red shrink-0 w-28">Risk Avoided:</span>
                    <span className="text-agri-red/90">{ch.riskAvoided}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-50 border-t border-agri-border p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-agri-muted">
            <span className="font-semibold text-agri-charcoal">Note:</span> Confirming will update the live operational schedule across all 3 Haryana plots.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={clearPlanResult}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-agri-border bg-white text-agri-charcoal text-xs font-semibold hover:bg-agri-cream transition-colors"
            >
              Reject / Close
            </button>
            <button
              onClick={applyProposedPlan}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-forest-300" />
              <span>Confirm & Apply Proposed Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

