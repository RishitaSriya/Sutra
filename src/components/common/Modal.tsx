import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  badge,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-4xl',
    '4xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#171717]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={clsx(
          'relative w-full bg-[#FAF6EE] border-2.5 border-[#171717] rounded-3xl shadow-[8px_8px_0px_#171717] p-6 sm:p-8 z-10 my-8 max-h-[90vh] overflow-y-auto',
          maxWidthStyles[maxWidth]
        )}
      >
        <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b-2 border-[#171717]/15">
          <div className="flex items-center gap-3 flex-wrap">
            {badge}
            {title && (
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#171717]">
                {title}
              </h3>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#171717] bg-[#F7F1E3] hover:bg-[#E9785A] hover:text-white rounded-xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717] active:translate-y-0.5 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
