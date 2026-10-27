import React from 'react';
import { TaskPriority, FarmHealthStatus, FarmOperationalStatus } from '../../types';

export const PriorityBadge: React.FC<{ priority: TaskPriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  let colorClasses = 'bg-stone-100 text-stone-700 border-stone-200';
  if (priority === 'Critical') {
    colorClasses = 'bg-red-50 text-agri-red border-red-200 font-bold animate-pulse-subtle';
  } else if (priority === 'High') {
    colorClasses = 'bg-amber-50 text-agri-amber border-amber-200 font-semibold';
  } else if (priority === 'Medium') {
    colorClasses = 'bg-emerald-50 text-forest-700 border-emerald-200';
  } else if (priority === 'Low') {
    colorClasses = 'bg-slate-50 text-slate-600 border-slate-200';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-medium uppercase tracking-wider ${sizeClasses} ${colorClasses}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          priority === 'Critical'
            ? 'bg-agri-red'
            : priority === 'High'
            ? 'bg-agri-amber'
            : priority === 'Medium'
            ? 'bg-forest-600'
            : 'bg-slate-400'
        }`}
      />
      {priority}
    </span>
  );
};

export const HealthStatusBadge: React.FC<{ status: FarmHealthStatus }> = ({ status }) => {
  let color = 'bg-emerald-50 text-forest-700 border-emerald-200';
  if (status === 'Needs Attention') {
    color = 'bg-amber-50 text-agri-amber border-amber-200';
  } else if (status === 'At Risk') {
    color = 'bg-red-50 text-agri-red border-red-200';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'Healthy'
            ? 'bg-forest-500'
            : status === 'Needs Attention'
            ? 'bg-agri-amber'
            : 'bg-agri-red'
        }`}
      />
      {status}
    </span>
  );
};

export const OperationalStatusBadge: React.FC<{ status: FarmOperationalStatus }> = ({ status }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-200';
  if (status === 'Active') color = 'bg-forest-50 text-forest-700 border-forest-200';
  if (status === 'Scheduled') color = 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'Idle') color = 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${color}`}>
      {status}
    </span>
  );
};

