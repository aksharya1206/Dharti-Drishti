import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
  FileText,
  Filter,
  X,
  Sparkles,
  Eye,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { CropObservation } from '../types';

export const CropHealthPage: React.FC = () => {
  const { farms, observations, addObservation, setActivePage } = useApp();

  const [farmFilter, setFarmFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  // Add Observation Modal State
  const [isObsModalOpen, setIsObsModalOpen] = useState(false);
  const [obsFarmId, setObsFarmId] = useState(farms[0]?.id || 'farm-a');
  const [obsCrop, setObsCrop] = useState('Wheat');
  const [obsDate, setObsDate] = useState('2026-10-28');
  const [obsSymptom, setObsSymptom] = useState('');
  const [obsSeverity, setObsSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [obsDesc, setObsDesc] = useState('');
  const [obsAction, setObsAction] = useState('');
  const [sampleImagePreview, setSampleImagePreview] = useState<string | null>(null);

  // Upload Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportFile, setReportFile] = useState<string | null>(null);

  const filteredObs = observations.filter(o => {
    const matchesFarm = farmFilter === 'All' || o.farmId === farmFilter;
    const matchesSeverity = severityFilter === 'All' || o.severity === severityFilter;
    return matchesFarm && matchesSeverity;
  });

  const handleCreateObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obsSymptom.trim() || !obsDesc.trim()) return;

    const selectedFarm = farms.find(f => f.id === obsFarmId);

    addObservation({
      farmId: obsFarmId,
      farmName: selectedFarm ? selectedFarm.name : 'Farm',
      crop: obsCrop,
      date: obsDate,
      symptom: obsSymptom,
      severity: obsSeverity,
      description: obsDesc,
      imageUrl: sampleImagePreview || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
      recommendedAction: obsAction || 'Escalate to operations planner for prioritized treatment scheduling.',
      source: 'Manual Field Scouting',
    });

    setIsObsModalOpen(false);
    setObsSymptom('');
    setObsDesc('');
    setObsAction('');
    setSampleImagePreview(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Crop Health & Agronomic Surveillance"
        subtitle="Track field observations, pest alerts, and foliar disease symptoms feeding directly into operational task prioritization."
        badge="Field Scouting Feed"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-agri-border bg-white hover:bg-agri-cream text-agri-charcoal text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-forest-700" />
              <span>Upload Soil/Lab Report</span>
            </button>
            <button
              onClick={() => setIsObsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-forest-300" />
              <span>Record Field Observation</span>
            </button>
          </div>
        }
      />

      {/* Transparent Disclaimer Banner (Requirement: "Do not claim to have AI-powered crop disease detection unless an actual image-analysis model is integrated...") */}
      <div className="p-3.5 rounded-xl bg-forest-50/80 border border-forest-200/80 text-xs text-forest-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Transparent Demonstration Analytics:</span>
          <p className="text-forest-800/90 leading-relaxed">
            Observations are recorded via manual agronomic scouting and processed through rule-based risk heuristics. No cloud vision AI is pretended to be connected. Severity scores directly calibrate operational urgency in the Operations Planner.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-agri-border p-4.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-agri-muted tracking-wide block mb-1">
            Overall Network Health
          </span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-heading text-2xl font-black text-forest-800">84%</span>
            <span className="text-xs text-forest-600 font-semibold">Good Vitality</span>
          </div>
          <p className="text-xs text-agri-muted">35 total acres under active monitoring</p>
        </div>

        <div className="bg-white rounded-xl border border-agri-border p-4.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-agri-muted tracking-wide block mb-1">
            Critical Pest Concern
          </span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-heading text-2xl font-black text-agri-red">1 Active</span>
            <span className="text-xs text-agri-red font-bold">Aphid Outbreak</span>
          </div>
          <p className="text-xs text-agri-muted">Farm B (Karnal) Mustard Plot</p>
        </div>

        <div className="bg-white rounded-xl border border-agri-border p-4.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-agri-muted tracking-wide block mb-1">
            Foliar Rust Risk
          </span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-heading text-2xl font-black text-agri-amber">Moderate</span>
            <span className="text-xs text-agri-amber font-semibold">Yellow Rust</span>
          </div>
          <p className="text-xs text-agri-muted">Farm A (Sonipat) Flag leaves</p>
        </div>

        <div className="bg-white rounded-xl border border-agri-border p-4.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-agri-muted tracking-wide block mb-1">
            Scouting Logs
          </span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-heading text-2xl font-black text-agri-charcoal">{observations.length}</span>
            <span className="text-xs text-forest-700 font-semibold">Recorded Entries</span>
          </div>
          <p className="text-xs text-agri-muted">Syncing with schedule planner</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-agri-border p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-agri-muted font-semibold">
            <Filter className="w-3.5 h-3.5 text-forest-700" />
            <span>Filter Observations:</span>
          </div>

          <select
            value={farmFilter}
            onChange={e => setFarmFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-agri-border bg-white text-xs text-agri-charcoal focus:outline-none"
          >
            <option value="All">All Farm Plots</option>
            {farms.map(f => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-agri-border bg-white text-xs text-agri-charcoal focus:outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Severe">Severe (Immediate Action)</option>
            <option value="Moderate">Moderate</option>
            <option value="Mild">Mild / Routine</option>
          </select>
        </div>

        <span className="text-xs text-agri-muted">
          Showing <strong>{filteredObs.length}</strong> field records
        </span>
      </div>

      {/* Observations Feed */}
      <div className="space-y-4">
        {filteredObs.map(obs => {
          let severityBadge = 'bg-emerald-50 text-forest-700 border-emerald-200';
          if (obs.severity === 'Severe') severityBadge = 'bg-red-50 text-agri-red border-red-200 font-bold';
          if (obs.severity === 'Moderate') severityBadge = 'bg-amber-50 text-agri-amber border-amber-200 font-semibold';

          return (
            <div
              key={obs.id}
              className="bg-white rounded-2xl border border-agri-border p-5 sm:p-6 shadow-sm flex flex-col md:flex-row gap-5 hover:border-forest-400 transition-all"
            >
              {/* Optional Photo Thumbnail */}
              <div className="md:w-44 h-32 md:h-auto rounded-xl bg-forest-900/10 border border-agri-border overflow-hidden shrink-0 relative flex items-center justify-center">
                {obs.imageUrl ? (
                  <img
                    src={obs.imageUrl}
                    alt={obs.symptom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-agri-muted">
                    <ImageIcon className="w-6 h-6 mb-1 text-forest-600" />
                    <span className="text-[10px]">Field Photo</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-medium backdrop-blur-xs">
                  {obs.crop}
                </div>
              </div>

              {/* Observation Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                      {obs.farmName}
                    </span>
                    <span className="text-[10px] text-agri-muted font-medium">{obs.date}</span>
                    <span className="text-[10px] text-stone-500 font-medium px-2 py-0.5 rounded bg-stone-100">
                      {obs.source}
                    </span>
                  </div>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${severityBadge}`}>
                    {obs.severity} Severity
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-agri-charcoal mb-1.5">
                  {obs.symptom}
                </h3>

                <p className="text-xs text-agri-charcoal/80 leading-relaxed mb-3">
                  {obs.description}
                </p>

                <div className="p-3 rounded-xl bg-forest-50/60 border border-forest-100 text-xs">
                  <span className="font-bold text-forest-900 block mb-0.5">
                    Recommended Agronomic Action:
                  </span>
                  <span className="text-forest-800">{obs.recommendedAction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Record Observation Modal */}
      {isObsModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-agri-border overflow-hidden my-6">
            <div className="bg-forest-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-forest-300" />
                <h3 className="font-heading font-bold text-base text-white">
                  Add Crop Field Observation
                </h3>
              </div>
              <button onClick={() => setIsObsModalOpen(false)} className="text-forest-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateObservation} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-agri-charcoal mb-1">Target Farm</label>
                  <select
                    value={obsFarmId}
                    onChange={e => {
                      setObsFarmId(e.target.value);
                      const f = farms.find(farm => farm.id === e.target.value);
                      if (f) setObsCrop(f.cropType);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal bg-white focus:outline-none"
                  >
                    {farms.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-agri-charcoal mb-1">Observation Date</label>
                  <input
                    type="date"
                    value={obsDate}
                    onChange={e => setObsDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-charcoal mb-1">Symptom / Pest / Disease Concern</label>
                <input
                  type="text"
                  required
                  value={obsSymptom}
                  onChange={e => setObsSymptom(e.target.value)}
                  placeholder="e.g. Aphid cluster formation on terminal flowering shoots"
                  className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-charcoal mb-1">Severity Assessment</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Mild', 'Moderate', 'Severe'] as const).map(sev => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setObsSeverity(sev)}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${obsSeverity === sev
                          ? sev === 'Severe'
                            ? 'bg-red-50 text-agri-red border-red-300 ring-1 ring-red-400'
                            : sev === 'Moderate'
                              ? 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400'
                              : 'bg-forest-50 text-forest-800 border-forest-300 ring-1 ring-forest-400'
                          : 'bg-white text-agri-charcoal border-agri-border hover:bg-agri-cream'
                        }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-charcoal mb-1">Detailed Field Observations</label>
                <textarea
                  rows={3}
                  required
                  value={obsDesc}
                  onChange={e => setObsDesc(e.target.value)}
                  placeholder="Describe leaf symptoms, population density, or spatial spread across the plot..."
                  className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-charcoal mb-1">Recommended Agronomic Countermeasure</label>
                <input
                  type="text"
                  value={obsAction}
                  onChange={e => setObsAction(e.target.value)}
                  placeholder="e.g. Apply systemic bio-fungicide within 24 hours"
                  className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-charcoal mb-1">Field Photo (Simulated Upload)</label>
                <div className="border border-dashed border-agri-border rounded-xl p-3 text-center bg-agri-cream/30">
                  <button
                    type="button"
                    onClick={() =>
                      setSampleImagePreview(
                        'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80'
                      )
                    }
                    className="text-xs text-forest-700 font-semibold hover:underline"
                  >
                    Attach Sample Field Photo
                  </button>
                  {sampleImagePreview && (
                    <p className="text-[11px] text-forest-700 mt-1 font-medium">✓ Sample plot photo attached</p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-agri-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsObsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-agri-border text-xs font-medium text-agri-charcoal hover:bg-agri-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Lab Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-agri-border p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-700 mx-auto flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-agri-charcoal mb-1">
              Upload Soil or Plant Pathology Report
            </h3>
            <p className="text-xs text-agri-muted mb-4 leading-relaxed">
              Accepts PDF or CSV soil chemistry reports (KVK / ICAR lab format). In this frontend prototype, lab inputs are simulated into nutrient balance tasks.
            </p>

            <div className="border-2 border-dashed border-agri-border rounded-xl p-5 mb-4 bg-agri-cream/40">
              <input
                type="file"
                id="reportFileInput"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setReportFile(e.target.files[0].name);
                  }
                }}
                className="hidden"
              />
              <label htmlFor="reportFileInput" className="cursor-pointer">
                <FileText className="w-8 h-8 text-forest-600 mx-auto mb-2" />
                <span className="text-xs font-semibold text-forest-800 block">
                  {reportFile ? reportFile : 'Click to select report document'}
                </span>
                <span className="text-[10px] text-agri-muted block mt-0.5">PDF, CSV, or TXT up to 10MB</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => {
                  setIsReportModalOpen(false);
                  setReportFile(null);
                }}
                className="px-4 py-2 rounded-lg border border-agri-border text-xs font-medium text-agri-charcoal"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsReportModalOpen(false);
                  setReportFile(null);
                }}
                className="px-4 py-2 rounded-lg bg-forest-800 text-white text-xs font-bold"
              >
                Process Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
