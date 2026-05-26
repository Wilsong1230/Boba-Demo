// components/ui/Button.tsx
import React from 'react';

type Variant = 'primary' | 'ghost' | 'soft' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 rounded-full font-semibold cursor-pointer transition-transform hover:-translate-y-px active:translate-y-0 border-none';

  const variants: Record<Variant, string> = {
    primary: 'bg-[var(--coral)] text-white hover:bg-[var(--coral-deep)]',
    ghost:   'bg-transparent text-[var(--ink)] border border-[var(--line-2)] hover:bg-[var(--ink)] hover:text-white',
    soft:    'bg-[var(--coral-soft)] text-[var(--coral-deep)] hover:bg-[var(--coral)] hover:text-white',
    dark:    'bg-[var(--ink)] text-white',
  };

  const sizes: Record<Size, string> = {
    sm: 'px-3.5 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-7 py-4 text-base',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
