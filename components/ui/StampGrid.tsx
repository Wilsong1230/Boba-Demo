// components/ui/StampGrid.tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';
import Cup from './Cup';

interface StampGridProps {
  filled: number;
  total: number;
  size?: number;
}

export default function StampGrid({ filled, total, size = 48 }: StampGridProps) {
  const reduced = useReducedMotion();

  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const isFilled = i < filled;
        const isNext = i === filled;
        const isFree = i === total - 1;

        return (
          <motion.div key={i}
            className="rounded-xl flex items-center justify-center aspect-square"
            style={{
              minHeight: size,
              border: isFilled ? 'none' : `1.5px dashed ${isNext ? 'var(--coral)' : 'var(--line-2)'}`,
              background: isFilled ? 'var(--coral-soft)' : isFree ? 'var(--sun-soft)' : 'transparent',
            }}
            initial={reduced ? {} : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}>
            {isFilled && <Cup color="coral" size="sm" style={{ transform: 'scale(0.5)' }} />}
            {isFree && !isFilled && <span className="font-hand text-lg text-[#8A6B12]">FREE!</span>}
          </motion.div>
        );
      })}
    </div>
  );
}
