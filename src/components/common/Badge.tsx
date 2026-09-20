import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'forest' | 'marigold' | 'coral' | 'peach' | 'lavender' | 'paper' | 'ink';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'paper',
  size = 'md',
  className,
  icon,
}) => {
  const variantStyles = {
    forest: 'bg-[#244B3A] text-[#F7F1E3] border-[#171717]',
    marigold: 'bg-[#E4A93A] text-[#171717] border-[#171717]',
    coral: 'bg-[#E9785A] text-[#171717] border-[#171717]',
    peach: 'bg-[#F2C6A8] text-[#171717] border-[#171717]',
    lavender: 'bg-[#D8D2E7] text-[#171717] border-[#171717]',
    paper: 'bg-[#FAF6EE] text-[#171717] border-[#171717]',
    ink: 'bg-[#171717] text-[#F7F1E3] border-[#171717]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-bold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border-1.5 shadow-[1.5px_1.5px_0px_#171717] font-display uppercase tracking-wider select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
