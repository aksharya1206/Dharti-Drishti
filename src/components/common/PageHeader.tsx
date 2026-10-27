import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, badge, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-agri-border">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-agri-charcoal tracking-tight">
            {title}
          </h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-100/70 text-forest-800 border border-forest-200">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-agri-muted max-w-2xl">{subtitle}</p>
      </div>

      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
};

