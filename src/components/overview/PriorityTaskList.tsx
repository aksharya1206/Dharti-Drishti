import React from 'react';
import { Clock, Wrench, CheckCircle, AlertTriangle, ArrowRight, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriorityBadge } from '../common/PriorityBadge';
import { FarmTask } from '../../types';

interface PriorityTaskListProps {
  onSelectTask?: (task: FarmTask) => void;
}

export const PriorityTaskList: React.FC<PriorityTaskListProps> = ({ onSelectTask }) => {
  const { tasks, markTaskCompleted, setActivePage } = useApp();

  // Show top priority tasks (Critical and High first)
  const sortedTasks = [...tasks].sort((a, b) => {
    const order: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return (order[a.priority] ?? 4) - (order[b.priority] ?? 4);
  });

  return (
    <div className="bg-white rounded-2xl border border-agri-border p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-agri-border mb-4">
        <div>
          <h3 className="font-heading font-bold text-base text-agri-charcoal">
            Today&apos;s High-Priority Operations
          </h3>
          <p className="text-xs text-agri-muted">
            Prioritised by urgency, soil moisture tension, and pest thresholds
          </p>
        </div>
        <button
          onClick={() => setActivePage('operations')}
          className="text-xs text-forest-700 hover:text-forest-900 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>All Operations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {sortedTasks.slice(0, 4).map(task => (
          <div
            key={task.id}
            className={`p-3.5 rounded-xl border transition-all ${
              task.hasConflict
                ? 'border-red-200 bg-red-50/30'
                : task.weatherRiskTag
                ? 'border-amber-200 bg-amber-50/20'
                : 'border-agri-border bg-white hover:border-forest-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-forest-800 uppercase tracking-wide">
                    {task.farmName}
                  </span>
                  <span className="text-[10px] text-agri-muted">•</span>
                  <span className="text-[11px] text-agri-muted font-medium">{task.crop}</span>
                  <PriorityBadge priority={task.priority} size="sm" />
                </div>
                <h4 className="font-heading font-bold text-xs sm:text-sm text-agri-charcoal">
                  {task.title}
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 text-xs text-agri-charcoal font-semibold bg-agri-cream/80 px-2 py-1 rounded-md border border-agri-border">
                  <Clock className="w-3.5 h-3.5 text-forest-700" />
                  <span>{task.startTime} - {task.endTime}</span>
                </div>
              </div>
            </div>

            {/* Rationale and resource */}
            <div className="text-xs text-agri-muted mb-3 space-y-1">
              <p className="line-clamp-1">
                <span className="font-semibold text-agri-charcoal">Reason: </span>
                {task.priorityReason}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1">
                <span className="flex items-center gap-1 text-forest-800 font-medium">
                  <Wrench className="w-3 h-3 text-forest-600" />
                  {task.resourceName}
                </span>
                <span className="text-agri-muted">Assigned: {task.assignedTeam}</span>
              </div>
            </div>

            {/* Warnings if any */}
            {task.hasConflict && (
              <div className="mb-2 text-[11px] text-agri-red font-semibold flex items-center gap-1.5 p-1.5 rounded bg-red-100/60 border border-red-200">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Machinery Overlap: Solar Pump #1 concurrently reserved by another farm.</span>
              </div>
            )}

            {task.weatherRiskTag && (
              <div className="mb-2 text-[11px] text-amber-900 font-medium flex items-center gap-1.5 p-1.5 rounded bg-amber-100/60 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-agri-amber shrink-0" />
                <span>{task.weatherRiskTag}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-agri-border/60 flex items-center justify-between text-xs">
              <span
                className={`text-[11px] font-semibold ${
                  task.status === 'Completed'
                    ? 'text-forest-600'
                    : task.status === 'In Progress'
                    ? 'text-amber-600'
                    : 'text-agri-muted'
                }`}
              >
                Status: {task.status}
              </span>

              <div className="flex items-center gap-2">
                {task.status !== 'Completed' && (
                  <button
                    onClick={() => markTaskCompleted(task.id)}
                    className="px-2.5 py-1 rounded-md bg-forest-50 hover:bg-forest-100 text-forest-800 text-[11px] font-semibold border border-forest-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle className="w-3 h-3 text-forest-600" />
                    <span>Mark Done</span>
                  </button>
                )}
                {onSelectTask && (
                  <button
                    onClick={() => onSelectTask(task)}
                    className="px-2.5 py-1 rounded-md bg-white hover:bg-agri-cream text-agri-charcoal text-[11px] font-medium border border-agri-border transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

