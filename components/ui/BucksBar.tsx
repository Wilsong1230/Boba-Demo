// components/ui/BucksBar.tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';

interface BucksBarProps {
  current: number;
  target: number;
  label?: string;
}

export default function BucksBar({ current, target, label = 'to next reward' }: BucksBarProps) {
  const reduced = useReducedMotion();
  const pct = Math.min(100, (current / target) * 100);

  return (
    <div>
      <div className="flex justify-between text-xs text-[var(--ink-3)] mb-1.5">
        <span>{current} BB</span>
        <span>{label} · {target - current} to go</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-2)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--coral) 0%, var(--coral-deep) 100%)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={reduced ? { duration: 0 } : { duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
