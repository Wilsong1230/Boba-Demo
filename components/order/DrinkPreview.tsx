// components/order/DrinkPreview.tsx
'use client';
import { useOrder } from '@/lib/store/OrderContext';
import Cup from '@/components/ui/Cup';
import type { CupColor } from '@/components/ui/Cup';
import { motion, AnimatePresence } from 'framer-motion';

export default function DrinkPreview() {
  const { current } = useOrder();

  return (
    <div className="hidden md:block bg-white rounded-2xl p-5 sticky top-24" style={{ boxShadow: 'var(--sh-2)' }}>
      <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--ink-3)] mb-4">Your cup · live</div>
      <div className="flex justify-center mb-4">
        <AnimatePresence mode="wait">
          <motion.div key={current.color}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}>
            <Cup color={(current.color || 'coral') as CupColor} size="lg" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="font-bold text-base">{current.drinkName || '—'}</div>
      <div className="mt-3 space-y-1 text-xs text-[var(--ink-2)]">
        {current.size && <div>· {current.size}</div>}
        {current.base && <div>· {current.base}</div>}
        {current.toppings.length > 0 && <div>· {current.toppings.slice(0, 3).join(', ')}</div>}
        {!current.drinkId && <div className="text-[var(--ink-3)] italic">Pick a drink to start</div>}
      </div>
      <div className="border-t border-[var(--line)] mt-4 pt-4 flex justify-between items-center">
        <span className="text-xs text-[var(--ink-3)]">Running total</span>
        <span className="tabular-nums text-xl font-bold">
          {current.basePrice ? `$${(current.basePrice + current.sizeDelta).toFixed(2)}` : '—'}
        </span>
      </div>
    </div>
  );
}
