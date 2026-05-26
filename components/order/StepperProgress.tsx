// components/order/StepperProgress.tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';

const STEPS = ['Drink', 'Size', 'Customize', 'Review'];

export default function StepperProgress({ current }: { current: number }) {
  const reduced = useReducedMotion();

  return (
    <div className="flex items-center gap-1 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-1 flex-shrink-0">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold"
              style={{
                background: i < current ? 'var(--coral)' : i === current ? 'var(--coral-soft)' : 'var(--bg-2)',
                color: i < current ? '#fff' : i === current ? 'var(--coral-deep)' : 'var(--ink-3)',
                boxShadow: (!reduced && i === current) ? '0 0 0 4px rgba(255,129,85,0.15)' : 'none',
              }}
              animate={(!reduced && i === current) ? { boxShadow: ['0 0 0 0px rgba(255,129,85,0.35)', '0 0 0 6px rgba(255,129,85,0)'] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {i < current ? '✓' : i + 1}
            </motion.div>
            <span className={`text-sm hidden md:block ${i <= current ? 'font-semibold text-[var(--ink)]' : 'text-[var(--ink-3)]'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex-1 h-0.5 rounded-full mx-2 min-w-4 md:min-w-8"
                 style={{ background: i < current ? 'var(--coral)' : 'var(--line)' }} />
          )}
        </div>
      ))}
    </div>
  );
}
