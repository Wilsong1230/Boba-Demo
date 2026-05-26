// components/ui/Chip.tsx
import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  variant?: 'default' | 'coral' | 'mint' | 'lav' | 'sun';
  onClick?: () => void;
  className?: string;
}

export default function Chip({ children, active, variant = 'default', onClick, className = '' }: ChipProps) {
  const base = 'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border cursor-pointer transition-colors select-none';

  const styles: Record<string, string> = {
    default: active
      ? 'bg-[var(--ink)] text-white border-[var(--ink)]'
      : 'bg-white text-[var(--ink-2)] border-[var(--line-2)] hover:border-[var(--ink)]',
    coral: 'bg-[var(--coral-soft)] text-[var(--coral-deep)] border-transparent',
    mint:  'bg-[var(--mint-soft)] text-[var(--mint-deep)] border-transparent',
    lav:   'bg-[var(--lav-soft)] text-[var(--lav-deep)] border-transparent',
    sun:   'bg-[var(--sun-soft)] text-[#8A6B12] border-transparent',
  };

  return (
    <span className={`${base} ${styles[variant]} ${className}`} onClick={onClick} role={onClick ? 'button' : undefined}>
      {children}
    </span>
  );
}
