import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';

export const WhatIfSimulatorPage: React.FC = () => {
  const {
    activeScenarioId,
    simulationResult,
    runSimulation,
    resetSimulation,
    tasks
  } = useApp();

  const [selectedScenario, setSelectedScenario] = useState<string>('rain-risk-conflict');

  const scenariosList = [
    {
      id: 'rain-risk-conflict',
      badge: 'Core Hackathon Scenario',
      title: 'Rain Risk (Sonipat) + Shared Pump Contention',
      description:
        'Convective rain cell arrives at Farm A (Sonipat) at 14:00 coinciding with a concurrent booking on Solar Pump #1 by Farm B (Karnal).',
      triggers: ['Precipitation > 80% at 14:00', 'Geographical pump overlap (52 km)'],
    },
    {
      id: 'pump-failure',
      badge: 'Machinery Outage',
      title: 'Solar Booster Pump #1 Mechanical Breakdown',
      description:
        'Simulates sudden solar inverter failure on the primary submersible booster pump, cutting pumping capacity by 50%.',
      triggers: ['Pump #1 offline for 24h repair', 'Depot auxiliary pump allocation'],
    },
    {
      id: 'labor-shortage',
      badge: 'Labor Contingency',
      title: 'Field Operations Team Alpha Absent (Sickness)',
      description:
        'Team Alpha (4 skilled crew) is unavailable; tests how the engine re-routes Team Beta between urgent aphid treatment and routine wheat top-dressing.',
      triggers: ['Crew capacity reduced from 7 to 3', 'Aphid containment prioritized'],
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="What-If Contingency Simulator"
        subtitle="Interactively stress-test multi-farm operations against sudden weather anomalies, equipment failures, and labor shocks before executing in the field."
        badge="Contingency Engine"
      />

      {/* Scenario Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenariosList.map(sc => {
          const isSelected = selectedScenario === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className={`rounded-2xl border p-5 cursor-pointer transition-all flex flex-col justify-between ${isSelected
                  ? 'bg-white border-forest-600 ring-2 ring-forest-600/20 shadow-md'
                  : 'bg-white border-agri-border hover:border-forest-300 hover:shadow-xs'
                }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forest-100 text-forest-800">
                    {sc.badge}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-forest-600' : 'border-stone-300'
                      }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-forest-600" />}
                  </div>
                </div>

                <h4 className="font-heading font-bold text-sm text-agri-charcoal mb-1.5">
                  {sc.title}
                </h4>

                <p className="text-xs text-agri-muted leading-relaxed mb-3">
                  {sc.description}
                </p>
              </div>

              <div className="pt-2 border-t border-agri-border/60 text-[11px] text-agri-charcoal/80 space-y-1">
                {sc.triggers.map((t, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-forest-600" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulator Run Toolbar */}
      <div className="bg-white rounded-2xl border border-agri-border p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-base text-agri-charcoal">
            Selected: {scenariosList.find(s => s.id === selectedScenario)?.title}
          </h3>
          <p className="text-xs text-agri-muted">
            The planner engine will re-evaluate constraints and formulate a feasible alternative schedule.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {simulationResult && (
            <button
              onClick={resetSimulation}
              className="px-4 py-2.5 rounded-xl border border-agri-border bg-white hover:bg-agri-cream text-agri-charcoal text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Scenario</span>
            </button>
          )}

          <button
            onClick={() => runSimulation(selectedScenario)}
            className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Run Multi-Farm Simulation</span>
          </button>
        </div>
      </div>

      {/* Simulation Results: Side-by-Side Comparison */}
      {simulationResult ? (
        <div className="space-y-6 animate-scale-up">
          {/* Summary Metric Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-agri-border p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-agri-muted block mb-1">
                Tasks Rescheduled
              </span>
              <span className="font-heading text-2xl font-black text-forest-800">
                {simulationResult.tasksRescheduled}
              </span>
              <span className="text-[11px] text-agri-muted block mt-0.5">Optimized windows</span>
            </div>

            <div className="bg-white rounded-xl border border-agri-border p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-agri-muted block mb-1">
                Conflicts Remaining
              </span>
              <span className="font-heading text-2xl font-black text-emerald-600">
                {simulationResult.conflictsRemaining}
              </span>
              <span className="text-[11px] text-forest-700 block mt-0.5">Zero Bottlenecks</span>
            </div>

            <div className="bg-white rounded-xl border border-agri-border p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-agri-muted block mb-1">
                Weather Washout Risk
              </span>
              <span className="font-heading text-2xl font-black text-emerald-600">
                Mitigated
              </span>
              <span className="text-[11px] text-forest-700 block mt-0.5">Fungicide saved</span>
            </div>

            <div className="bg-white rounded-xl border border-agri-border p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-agri-muted block mb-1">
                Engine Decision Rules
              </span>
              <span className="font-heading text-2xl font-black text-agri-charcoal">
                Deterministic
              </span>
              <span className="text-[11px] text-agri-muted block mt-0.5">Transparent logic</span>
            </div>
          </div>

          {/* Side by Side Schedules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Schedule */}
            <div className="bg-white rounded-2xl border border-agri-border p-5 shadow-sm space-y-3">
              <div className="pb-3 border-b border-agri-border flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-agri-charcoal">
                    Original Baseline Schedule
                  </h4>
                  <span className="text-[11px] text-agri-red font-semibold">
                    Contains Overlaps & Weather Vulnerabilities
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-agri-red">
                  Unadjusted
                </span>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
                {simulationResult.originalTasks.map(t => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-xl border text-xs ${t.hasConflict
                        ? 'border-red-300 bg-red-50/70'
                        : t.weatherRiskTag
                          ? 'border-amber-300 bg-amber-50/70'
                          : 'border-agri-border bg-stone-50/50'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-forest-800">{t.farmName}</span>
                      <span className="font-semibold text-agri-charcoal">
                        {t.startTime} - {t.endTime}
                      </span>
                    </div>
                    <p className="font-heading font-semibold text-agri-charcoal mb-1">{t.title}</p>
                    <div className="text-[11px] text-agri-muted">
                      Equipment: <strong>{t.resourceName}</strong>
                    </div>

                    {t.hasConflict && (
                      <span className="inline-block mt-1 text-[10px] text-agri-red font-bold">
                        ⚠️ Overlaps on Solar Pump #1
                      </span>
                    )}
                    {t.weatherRiskTag && (
                      <span className="inline-block mt-1 text-[10px] text-agri-amber font-bold">
                        ⚠️ 82% Rain Washout Risk
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Revised Simulated Schedule */}
            <div className="bg-white rounded-2xl border-2 border-forest-600 p-5 shadow-sm space-y-3">
              <div className="pb-3 border-b border-agri-border flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-forest-900">
                    Simulated Adjusted Schedule
                  </h4>
                  <span className="text-[11px] text-forest-700 font-semibold">
                    De-conflicted with Rain Window Avoidance
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-forest-100 text-forest-800">
                  Feasible Plan
                </span>
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
                {simulationResult.simulatedTasks.map(t => {
                  const wasModified =
                    t.status === 'Rescheduled' ||
                    t.status === 'Delayed' ||
                    t.resourceRequiredId === 'res-pump-2' ||
                    t.assignedTeam.includes('Reassigned');

                  return (
                    <div
                      key={t.id}
                      className={`p-3 rounded-xl border text-xs ${wasModified
                          ? 'border-emerald-300 bg-emerald-50/80 ring-1 ring-emerald-400'
                          : 'border-agri-border bg-white'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-forest-800">{t.farmName}</span>
                        <div className="flex items-center gap-1.5">
                          {wasModified && (
                            <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-forest-600 text-white">
                              Adjusted
                            </span>
                          )}
                          <span className="font-bold text-forest-900">
                            {t.startTime} - {t.endTime}
                          </span>
                        </div>
                      </div>
                      <p className="font-heading font-semibold text-agri-charcoal mb-1">{t.title}</p>
                      <div className="text-[11px] text-forest-800">
                        Equipment: <strong>{t.resourceName}</strong>
                      </div>
                      {t.notes && (
                        <p className="text-[10px] text-forest-700 italic mt-1 font-medium">
                          ↳ {t.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Engine Explanation Box */}
          <div className="bg-forest-50/90 rounded-2xl border border-forest-200 p-5 text-xs text-forest-900">
            <h4 className="font-heading font-bold text-sm text-forest-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-forest-600" />
              Engine Resolution Explanations:
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc">
              {simulationResult.explanations.map((exp, idx) => (
                <li key={idx} className="leading-relaxed">
                  {exp}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-agri-border">
          <Sliders className="w-10 h-10 text-forest-600 mx-auto mb-3" />
          <h4 className="font-heading font-bold text-base text-agri-charcoal mb-1">
            Ready to Simulate Agricultural Scenarios
          </h4>
          <p className="text-xs text-agri-muted max-w-md mx-auto mb-4">
            Select a contingency scenario above and press &ldquo;Run Multi-Farm Simulation&rdquo; to generate transparent before-and-after schedules.
          </p>
        </div>
      )}
    </div>
  );
};
