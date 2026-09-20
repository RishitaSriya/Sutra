import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'forest' | 'secondary' | 'coral' | 'ghost' | 'ink';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-[#E4A93A] text-[#171717] border-[#171717] hover:bg-[#F3C465] shadow-[3px_3px_0px_#171717] active:shadow-[0px_0px_0px_#171717] active:translate-x-[2px] active:translate-y-[2px]',
    forest:
      'bg-[#244B3A] text-[#F7F1E3] border-[#171717] hover:bg-[#31624C] shadow-[3px_3px_0px_#171717] active:shadow-[0px_0px_0px_#171717] active:translate-x-[2px] active:translate-y-[2px]',
    secondary:
      'bg-[#FAF6EE] text-[#171717] border-[#171717] hover:bg-[#ECE4D0] shadow-[3px_3px_0px_#171717] active:shadow-[0px_0px_0px_#171717] active:translate-x-[2px] active:translate-y-[2px]',
    coral:
      'bg-[#E9785A] text-[#171717] border-[#171717] hover:bg-[#F1967E] shadow-[3px_3px_0px_#171717] active:shadow-[0px_0px_0px_#171717] active:translate-x-[2px] active:translate-y-[2px]',
    ink:
      'bg-[#171717] text-[#F7F1E3] border-[#171717] hover:bg-[#333333] shadow-[3px_3px_0px_#171717] active:shadow-[0px_0px_0px_#171717] active:translate-x-[2px] active:translate-y-[2px]',
    ghost:
      'bg-transparent text-[#171717] border-transparent hover:bg-[#ECE4D0]/50 active:translate-y-[1px]',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 font-bold gap-1.5 rounded-lg border-1.5',
    md: 'text-sm px-4 py-2 font-bold gap-2 rounded-xl border-2',
    lg: 'text-base px-5 py-2.5 font-bold gap-2.5 rounded-xl border-2',
    xl: 'text-lg px-7 py-3.5 font-bold gap-3 rounded-2xl border-2.5',
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-display transition-all duration-100 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
