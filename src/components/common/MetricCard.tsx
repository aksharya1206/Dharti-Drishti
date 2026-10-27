import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  badgeText?: string;
  badgeType?: 'neutral' | 'warning' | 'alert' | 'success';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = 'neutral',
  onClick,
}) => {
  let badgeClasses = 'bg-stone-100 text-stone-600 border-stone-200';
  if (badgeType === 'warning') badgeClasses = 'bg-amber-50 text-agri-amber border-amber-200 font-semibold';
  if (badgeType === 'alert') badgeClasses = 'bg-red-50 text-agri-red border-red-200 font-bold';
  if (badgeType === 'success') badgeClasses = 'bg-emerald-50 text-forest-700 border-emerald-200';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-agri-border p-5 shadow-sm transition-all hover:shadow-md hover:border-forest-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-agri-muted">
          {title}
        </span>
        <div className="w-9 h-9 rounded-lg bg-forest-50 text-forest-800 flex items-center justify-center border border-forest-100/80">
          <Icon className="w-4 h-4 text-forest-700" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="font-heading text-2xl sm:text-3xl font-extrabold text-agri-charcoal">
          {value}
        </span>
        {badgeText && (
          <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border ${badgeClasses}`}>
            {badgeText}
          </span>
        )}
      </div>

      <p className="text-xs text-agri-muted line-clamp-1">{subtitle}</p>

      <div className="mt-3 pt-2.5 border-t border-agri-border/60 flex items-center justify-between text-[11px] text-agri-muted/80">
        <span>Demonstration Dataset</span>
        <span className="text-[10px] text-forest-600 font-medium">Haryana Node</span>
      </div>
    </div>
  );
};

