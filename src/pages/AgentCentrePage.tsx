import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowRight,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { AgentRecommendation } from '../types';

export const AgentCentrePage: React.FC = () => {
  const {
    recommendations,
    timeline,
    approveRecommendation,
    rejectRecommendation,
    runPlanEngine,
    isGeneratingPlan
  } = useApp();

  const [expandedRecId, setExpandedRecId] = useState<string | null>('rec-1');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const pendingRecs = recommendations.filter(r => r.status === 'Pending');
  const approvedRecs = recommendations.filter(r => r.status === 'Approved');

  const filteredRecs = recommendations.filter(r => {
    if (statusFilter === 'All') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Autonomous AI Agent Centre"
        subtitle="Continuous background evaluation engine monitoring microclimates, resource contention, and agronomic risks to synthesize verified operational proposals."
        badge="Supervisory Agent Mode"
        action={
          <button
            onClick={runPlanEngine}
            disabled={isGeneratingPlan}
            className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-70"
          >
            <Sparkles className="w-4 h-4 text-forest-300" />
            <span>{isGeneratingPlan ? 'Evaluating Rules...' : 'Run Autonomous Assessment'}</span>
          </button>
        }
      />

      {/* Supervisory Agent Status Card */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white rounded-2xl p-6 shadow-md border border-forest-700/60">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="border-r border-forest-700/60 pr-3">
            <span className="text-[10px] uppercase font-bold text-forest-300 tracking-wider block mb-1">
              Agent State
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-heading font-extrabold text-base text-white">Active</span>
            </div>
            <span className="text-[11px] text-forest-200/80 block mt-0.5">Autonomous Sentinel</span>
          </div>

          <div className="border-r border-forest-700/60 pr-3">
            <span className="text-[10px] uppercase font-bold text-forest-300 tracking-wider block mb-1">
              Active Proposals
            </span>
            <span className="font-heading font-black text-2xl text-amber-300">
              {pendingRecs.length}
            </span>
            <span className="text-[11px] text-forest-200/80 block">Awaiting Operator Sign-off</span>
          </div>

          <div className="border-r border-forest-700/60 pr-3">
            <span className="text-[10px] uppercase font-bold text-forest-300 tracking-wider block mb-1">
              Confirmed Actions
            </span>
            <span className="font-heading font-black text-2xl text-emerald-300">
              {approvedRecs.length}
            </span>
            <span className="text-[11px] text-forest-200/80 block">Applied to Schedule</span>
          </div>

          <div className="border-r border-forest-700/60 pr-3">
            <span className="text-[10px] uppercase font-bold text-forest-300 tracking-wider block mb-1">
              Engine Cycle
            </span>
            <span className="font-heading font-bold text-base text-white">Continuous</span>
            <span className="text-[11px] text-forest-200/80 block">Rule-Based Demonstration</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-forest-300 tracking-wider block mb-1">
              Data Mode
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 border border-amber-300/30 font-bold inline-block">
              Demo Simulation
            </span>
            <span className="text-[11px] text-forest-200/80 block mt-1">Non-autonomous execution</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recommendations on Left, Activity Timeline Stream on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recommendations Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-agri-charcoal">
                Autonomous Recommendations ({filteredRecs.length})
              </h3>
              <p className="text-xs text-agri-muted">
                Every action is presented as a proposal with transparent explainability.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-agri-border text-xs">
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${statusFilter === tab
                      ? 'bg-forest-800 text-white shadow-xs'
                      : 'text-agri-muted hover:text-agri-charcoal'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredRecs.map(rec => {
            const isExpanded = expandedRecId === rec.id;

            let statusBadge = 'bg-amber-50 text-amber-900 border-amber-200 font-bold';
            if (rec.status === 'Approved') statusBadge = 'bg-emerald-50 text-forest-700 border-emerald-200 font-bold';
            if (rec.status === 'Rejected') statusBadge = 'bg-stone-100 text-stone-600 border-stone-200';

            return (
              <div
                key={rec.id}
                className="bg-white rounded-2xl border border-agri-border overflow-hidden shadow-sm hover:border-forest-300 transition-all"
              >
                {/* Header */}
                <div className="p-5 sm:p-6 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forest-100 text-forest-800">
                        {rec.category}
                      </span>
                      <span className="text-[10px] text-agri-muted">{rec.timestamp}</span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${statusBadge}`}>
                        {rec.status}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-forest-800">
                      {rec.farmsAffected.join(', ')}
                    </span>
                  </div>

                  <h4 className="font-heading font-extrabold text-base text-agri-charcoal mb-2">
                    {rec.title}
                  </h4>

                  <p className="text-xs text-agri-charcoal/90 leading-relaxed mb-3">
                    <span className="font-bold text-forest-900">Trigger: </span>
                    {rec.triggerReason}
                  </p>

                  <div className="p-3 rounded-xl bg-forest-50/70 border border-forest-100 text-xs">
                    <span className="font-bold text-forest-900 block mb-0.5">Proposed Action:</span>
                    <span className="text-forest-800 leading-relaxed">{rec.proposedAction}</span>
                  </div>
                </div>

                {/* Deep Explainability Section (Expandable) */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 py-4 bg-agri-cream/40 border-t border-agri-border/80 space-y-3 text-xs animate-scale-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-white border border-agri-border">
                        <span className="font-bold text-forest-900 block mb-1">
                          1. Why does it matter?
                        </span>
                        <p className="text-agri-muted leading-relaxed">{rec.whyItMatters}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-agri-border">
                        <span className="font-bold text-forest-900 block mb-1">
                          2. Expected Operational Outcome:
                        </span>
                        <p className="text-forest-700 leading-relaxed font-medium">{rec.expectedOutcome}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-agri-border">
                      <span className="font-bold text-forest-900 block mb-1">
                        3. Constraints Evaluated:
                      </span>
                      <ul className="list-disc list-inside text-agri-muted space-y-0.5">
                        {rec.constraintsConsidered.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-red-50/60 border border-red-200">
                      <span className="font-bold text-agri-red block mb-1">
                        4. What happens if the user rejects it?
                      </span>
                      <p className="text-agri-charcoal/80 leading-relaxed">{rec.rejectionImpact}</p>
                    </div>
                  </div>
                )}

                {/* Card Action Footer */}
                <div className="px-5 sm:px-6 py-3.5 bg-stone-50 border-t border-agri-border flex items-center justify-between text-xs">
                  <button
                    onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                    className="text-forest-700 font-semibold hover:text-forest-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Explainability Details' : 'Deep Explainability Breakdown'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center gap-2">
                    {rec.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => rejectRecommendation(rec.id)}
                          className="px-3 py-1.5 rounded-lg border border-agri-border bg-white hover:bg-red-50 hover:text-agri-red text-agri-muted font-medium transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => approveRecommendation(rec.id)}
                          className="px-4 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-900 text-white font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-forest-300" />
                          <span>Approve & Apply</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-agri-muted">
                        Decision Recorded ({rec.status})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Agent Activity Timeline Stream */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-agri-border p-5 sm:p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-agri-border mb-4">
            <div>
              <h3 className="font-heading font-bold text-sm text-agri-charcoal">
                Agent Activity Timeline
              </h3>
              <p className="text-[11px] text-agri-muted">
                Audit stream of evaluations & trigger conditions
              </p>
            </div>
            <Clock className="w-4 h-4 text-forest-700" />
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-forest-200">
            {timeline.map((event, idx) => (
              <div key={event.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-forest-700 border-2 border-white shadow-xs group-hover:scale-125 transition-transform" />

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-forest-800 uppercase tracking-wide">
                      {event.badge}
                    </span>
                    <span className="text-agri-muted">{event.timestamp}</span>
                  </div>

                  <h5 className="font-heading font-bold text-xs text-agri-charcoal">
                    {event.title}
                  </h5>

                  <p className="text-xs text-agri-muted leading-relaxed">
                    {event.description}
                  </p>

                  {event.farmName && (
                    <span className="inline-block text-[10px] text-forest-700 font-medium bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                      {event.farmName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-3 border-t border-agri-border/60 text-[11px] text-agri-muted">
            Audited immutable event ledger for hackathon demonstration.
          </div>
        </div>
      </div>
    </div>
  );
};
