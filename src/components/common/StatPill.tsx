import React from 'react';
import { clsx } from 'clsx';

export interface StatPillProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: 'marigold' | 'forest' | 'coral' | 'peach' | 'lavender' | 'paper';
  subtext?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatPill: React.FC<StatPillProps> = ({
  label,
  value,
  icon,
  variant = 'paper',
  subtext,
  size = 'md',
  className,
}) => {
  const bgStyles = {
    marigold: 'bg-[#E4A93A]/15 border-[#E4A93A]',
    forest: 'bg-[#244B3A]/10 border-[#244B3A]',
    coral: 'bg-[#E9785A]/15 border-[#E9785A]',
    peach: 'bg-[#F2C6A8]/30 border-[#F2C6A8]',
    lavender: 'bg-[#D8D2E7]/30 border-[#D8D2E7]',
    paper: 'bg-[#FAF6EE] border-[#171717]',
  };

  return (
    <div
      className={clsx(
        'flex flex-col p-3 rounded-2xl border-2 shadow-[2.5px_2.5px_0px_#171717] transition-all hover:-translate-y-0.5',
        bgStyles[variant],
        size === 'lg' ? 'p-4 md:p-5' : 'p-3',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[11px] font-bold font-display uppercase tracking-wider text-[#575757]">
          {label}
        </span>
        {icon && <span className="text-base">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={clsx(
            'font-display font-bold text-[#171717] tracking-tight',
            size === 'lg' ? 'text-3xl md:text-4xl' : 'text-2xl'
          )}
        >
          {value}
        </span>
        {subtext && (
          <span className="text-xs font-semibold text-[#575757] font-sans">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
