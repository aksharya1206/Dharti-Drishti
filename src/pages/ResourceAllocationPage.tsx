import React, { useState } from 'react';
import {
  Wrench,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Filter,
  ShieldCheck,
  RefreshCw,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { ConflictResolverModal } from '../components/resources/ConflictResolverModal';
import { FarmResource } from '../types';

export const ResourceAllocationPage: React.FC = () => {
  const { resources, tasks, resolveConflict } = useApp();

  const [typeFilter, setTypeFilter] = useState('All');
  const [isResolverModalOpen, setIsResolverModalOpen] = useState(false);

  const filteredResources = resources.filter(
    r => typeFilter === 'All' || r.type === typeFilter
  );

  const pumpConflict = resources.find(r => r.id === 'res-pump-1' && r.status === 'Conflict');

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Shared Equipment & Crew Allocation"
        subtitle="Manage pooled farm machinery, mobile irrigation pumps, and skilled agronomy teams across multi-farm plots."
        badge={`${resources.length} Managed Assets`}
        action={
          pumpConflict ? (
            <button
              onClick={() => setIsResolverModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-agri-red hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer animate-pulse-subtle"
            >
              <AlertCircle className="w-4 h-4 text-white" />
              <span>Resolve Active Pump Conflict</span>
            </button>
          ) : (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-forest-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-forest-600" />
              <span>All Machinery De-conflicted</span>
            </div>
          )
        }
      />

      {/* Resource Conflict Spotlight Card */}
      {pumpConflict ? (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50/70 p-6 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-agri-red text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-agri-red text-white">
                    Active Resource Conflict
                  </span>
                  <span className="text-xs text-agri-red font-semibold">
                    Geographical Double-Booking
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-lg text-agri-charcoal">
                  {pumpConflict.name} Overlap: Farm A vs Farm B
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsResolverModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-agri-red hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer self-start lg:self-auto"
            >
              <Wrench className="w-4 h-4" />
              <span>Resolve Conflict Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-red-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-forest-800 uppercase text-[10px]">Farm A (Sonipat)</span>
                <span className="font-bold text-agri-red">10:00 - 13:00</span>
              </div>
              <p className="font-medium text-agri-charcoal mb-1">Canal & Borewell Irrigation (task-a1)</p>
              <p className="text-[11px] text-agri-muted">
                Requires Solar Booster Pump #1 to pressurize 12 acres of wheat plot.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-red-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-forest-800 uppercase text-[10px]">Farm B (Karnal)</span>
                <span className="font-bold text-agri-red">11:00 - 14:00</span>
              </div>
              <p className="font-medium text-agri-charcoal mb-1">Mustard Fertigation Drip Delivery (task-b2)</p>
              <p className="text-[11px] text-agri-muted">
                Also booked Solar Booster Pump #1. Overlaps by 2 hours across a 52 km transit distance.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4.5 flex items-center justify-between text-xs text-forest-900">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-forest-600 shrink-0" />
            <div>
              <span className="font-bold block">Resource Allocation Balanced</span>
              <span className="text-forest-700">
                Diesel Auxiliary Pump #2 active at Farm B; Solar Pump #1 dedicated to Farm A. Zero transit bottlenecks.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-forest-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
            Optimal Schedule
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-agri-border p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-agri-muted">Category:</span>
          {(['All', 'Water Pump', 'Tractor', 'Sprayer', 'Field Team'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setTypeFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${typeFilter === cat
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'bg-agri-cream text-agri-charcoal hover:bg-forest-50 border border-agri-border'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-agri-muted">
          Showing <strong>{filteredResources.length}</strong> equipment & labor units
        </span>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map(res => {
          let statusBadge = 'bg-slate-100 text-slate-700 border-slate-200';
          if (res.status === 'Conflict') statusBadge = 'bg-red-50 text-agri-red border-red-300 font-bold';
          if (res.status === 'In Use') statusBadge = 'bg-forest-50 text-forest-700 border-forest-200 font-semibold';
          if (res.status === 'Reserved') statusBadge = 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
          if (res.status === 'Available') statusBadge = 'bg-emerald-50 text-forest-700 border-emerald-200';

          return (
            <div
              key={res.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition-all ${res.status === 'Conflict'
                  ? 'border-red-300 ring-2 ring-red-400/20'
                  : 'border-agri-border hover:border-forest-300 hover:shadow-md'
                }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold text-forest-800 uppercase px-2 py-0.5 rounded bg-forest-100">
                    {res.type}
                  </span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${statusBadge}`}>
                    {res.status}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-agri-charcoal mb-1">
                  {res.name}
                </h3>
                <p className="text-xs text-agri-muted mb-3">{res.model}</p>

                <div className="p-3 rounded-xl bg-agri-cream/60 border border-agri-border text-xs space-y-1.5 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-agri-muted">Current Assignment:</span>
                    <span className="font-bold text-agri-charcoal truncate max-w-[140px]">
                      {res.assignedFarmName || 'None (In Depot)'}
                    </span>
                  </div>
                  {res.currentAssignmentTime && (
                    <div className="flex items-center justify-between">
                      <span className="text-agri-muted">Operating Window:</span>
                      <span className="font-semibold text-forest-800">{res.currentAssignmentTime}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-agri-muted">Current Location:</span>
                    <span className="text-agri-charcoal truncate max-w-[140px]">{res.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="pt-2 border-t border-agri-border/60 text-[11px] text-agri-muted flex items-center justify-between">
                  <span>Shared Across:</span>
                  <span className="font-medium text-forest-800">{res.sharedAcross.join(', ')}</span>
                </div>

                {res.status === 'Conflict' && (
                  <button
                    onClick={() => setIsResolverModalOpen(true)}
                    className="w-full mt-3 py-2 rounded-xl bg-agri-red text-white text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Resolve Conflict
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Conflict Resolver Modal */}
      <ConflictResolverModal
        isOpen={isResolverModalOpen}
        onClose={() => setIsResolverModalOpen(false)}
      />
    </div>
  );
};
