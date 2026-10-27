import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-dashed border-agri-border">
      <div className="w-12 h-12 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-heading font-bold text-base text-agri-charcoal mb-1.5">{title}</h3>
      <p className="text-xs text-agri-muted max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

