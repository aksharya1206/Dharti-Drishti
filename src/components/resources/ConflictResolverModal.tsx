import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ArrowRight, Wrench, X, ShieldAlert, Clock, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ConflictResolverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConflictResolverModal: React.FC<ConflictResolverModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { resolveConflict, tasks } = useApp();
  const [resolutionType, setResolutionType] = useState<'auxiliary' | 'reschedule'>('auxiliary');

  if (!isOpen) return null;

  const handleResolve = () => {
    resolveConflict('res-pump-1', resolutionType);
    onClose();
  };

  const taskA = tasks.find(t => t.id === 'task-a1');
  const taskB = tasks.find(t => t.id === 'task-b2');

  return (
    <div className="fixed inset-0 z-50 bg-forest-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-agri-border overflow-hidden my-6 animate-scale-up">
        {/* Header */}
        <div className="bg-agri-red text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/25">
                  Critical Contention Detected
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
                Solar Booster Pump #1 (10 HP) Overlap Conflict
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Why it Matters Explanation */}
          <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 text-xs text-agri-charcoal space-y-1.5">
            <div className="font-bold text-agri-red flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Geographical Infeasibility</span>
            </div>
            <p className="text-agri-muted leading-relaxed">
              Solar Booster Pump #1 is reserved concurrently at two separate farm sites situated 52 km apart. A water pump cannot operate simultaneously at Farm A (Sonipat) and Farm B (Karnal) without physical transit and re-piping time.
            </p>
          </div>

          {/* Overlapping Assignments Cards */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-agri-muted mb-2">
              Conflicting Bookings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-forest-800 uppercase px-1.5 py-0.5 rounded bg-forest-100">
                    Farm A (Sonipat)
                  </span>
                  <span className="text-xs font-bold text-agri-red flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    10:00 - 13:00
                  </span>
                </div>
                <h5 className="font-heading font-bold text-xs text-agri-charcoal mb-1">
                  {taskA?.title || 'Canal & Borewell Irrigation'}
                </h5>
                <p className="text-[11px] text-agri-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-forest-700" />
                  Murthal Road, Sonipat (12 acres Wheat)
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-forest-800 uppercase px-1.5 py-0.5 rounded bg-forest-100">
                    Farm B (Karnal)
                  </span>
                  <span className="text-xs font-bold text-agri-red flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    11:00 - 14:00
                  </span>
                </div>
                <h5 className="font-heading font-bold text-xs text-agri-charcoal mb-1">
                  {taskB?.title || 'Mustard Fertigation Drip Delivery'}
                </h5>
                <p className="text-[11px] text-agri-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-forest-700" />
                  Taraori Belt, Karnal (8 acres Mustard)
                </p>
              </div>
            </div>
          </div>

          {/* Solution Selector */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-agri-muted mb-2">
              Select Recommended Solution
            </h4>
            <div className="space-y-2.5">
              <label
                onClick={() => setResolutionType('auxiliary')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  resolutionType === 'auxiliary'
                    ? 'border-forest-600 bg-forest-50/80 ring-1 ring-forest-600'
                    : 'border-agri-border bg-white hover:bg-agri-cream/60'
                }`}
              >
                <input
                  type="radio"
                  name="resolutionOption"
                  checked={resolutionType === 'auxiliary'}
                  onChange={() => setResolutionType('auxiliary')}
                  className="mt-1 text-forest-700 focus:ring-forest-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-agri-charcoal">
                      Option A: Substitute Diesel Auxiliary Pump #2 for Farm B (Recommended)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-forest-200 text-forest-800 font-bold">
                      Zero Delay
                    </span>
                  </div>
                  <p className="text-xs text-agri-muted mt-1 leading-relaxed">
                    Mobilizes idle 7.5 HP Diesel Auxiliary Pump from Depot Warehouse B. Farm B drip fertigation proceeds on schedule at 11:00 while Farm A retains Solar Pump #1.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setResolutionType('reschedule')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  resolutionType === 'reschedule'
                    ? 'border-forest-600 bg-forest-50/80 ring-1 ring-forest-600'
                    : 'border-agri-border bg-white hover:bg-agri-cream/60'
                }`}
              >
                <input
                  type="radio"
                  name="resolutionOption"
                  checked={resolutionType === 'reschedule'}
                  onChange={() => setResolutionType('reschedule')}
                  className="mt-1 text-forest-700 focus:ring-forest-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-agri-charcoal">
                      Option B: Reschedule Farm B Fertigation to 14:30
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                      +3.5h Delay
                    </span>
                  </div>
                  <p className="text-xs text-agri-muted mt-1 leading-relaxed">
                    Waits for Farm A to finish at 13:00, allocates 1.5h transit time along NH-44, and starts Farm B fertigation at 14:30.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-agri-border p-4 sm:p-5 flex items-center justify-between">
          <span className="text-[11px] text-agri-muted">
            Will not make silent modifications; requires operator approval.
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-agri-border text-xs font-semibold text-agri-charcoal hover:bg-agri-cream"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              className="px-5 py-2 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-forest-300" />
              <span>Confirm & Resolve Conflict</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

