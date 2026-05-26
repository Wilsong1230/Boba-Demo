// components/ui/DrinkCard.tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';
import Cup from './Cup';
import type { Drink } from '@/lib/data/drinks';

interface DrinkCardProps {
  drink: Drink;
  onQuickAdd?: (drink: Drink) => void;
  onSelect?: (drink: Drink) => void;
}

export default function DrinkCard({ drink, onQuickAdd, onSelect }: DrinkCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="bg-white rounded-2xl cursor-pointer"
      style={{ padding: 14, boxShadow: 'var(--sh-2)' }}
      whileHover={reduced ? {} : { y: -2, boxShadow: 'var(--sh-3)' }}
      onClick={() => onSelect?.(drink)}
    >
      <div className="relative h-32 rounded-xl mb-3 flex items-center justify-center overflow-hidden"
           style={{ background: `var(--${drink.color}-soft)` }}>
        <Cup color={drink.color} size="md" />
        {drink.tag && (
          <span className="absolute top-2 left-2 bg-white rounded-full px-2 py-1 text-[10px] font-bold text-[var(--coral-deep)]">
            {drink.tag}
          </span>
        )}
        {onQuickAdd && (
          <motion.button
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white grid place-items-center text-lg font-bold text-[var(--ink)] border border-[var(--line)]"
            whileTap={reduced ? {} : { scale: [1, 1.3, 1] }}
            transition={{ duration: 0.25 }}
            onClick={(e) => { e.stopPropagation(); onQuickAdd(drink); }}
          >
            +
          </motion.button>
        )}
      </div>
      <div className="font-semibold text-sm mb-0.5 text-[var(--ink)]">{drink.name}</div>
      <div className="text-xs text-[var(--ink-3)] mb-2">{drink.base}</div>
      <div className="flex items-center justify-between">
        <span className="tabular-nums font-bold text-sm">${drink.price.toFixed(2)}</span>
        <span className="text-[11px] text-[var(--ink-3)]">4 sizes</span>
      </div>
    </motion.div>
  );
}
