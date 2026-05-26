// components/cart/CartItemRow.tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { useCart } from '@/lib/store/CartContext';
import type { CartItem } from '@/lib/store/CartContext';
import Cup from '@/components/ui/Cup';

interface CartItemRowProps {
  item: CartItem;
  index: number;
}

export default function CartItemRow({ item, index }: CartItemRowProps) {
  const { updateQty, removeItem } = useCart();
  const reduced = useReducedMotion();

  return (
    <motion.div
      layout={!reduced}
      initial={reduced ? {} : { opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduced ? {} : { opacity: 0, x: 40, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl flex items-center gap-4 p-4"
      style={{ boxShadow: 'var(--sh-1)' }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
           style={{ background: `var(--${item.color}-soft)` }}>
        <Cup color={item.color} size="sm" style={{ transform: 'scale(0.7)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{item.name}</div>
        <div className="text-xs text-[var(--ink-3)] truncate">{item.base} · {item.toppings.join(', ') || 'no toppings'}</div>
      </div>
      <div className="flex items-center gap-0 rounded-full p-1"
           style={{ background: 'var(--bg-2)' }}>
        <button onClick={() => item.qty === 1 ? removeItem(index) : updateQty(index, item.qty - 1)}
          className="w-7 h-7 rounded-full text-sm text-[var(--ink-2)] hover:bg-white transition-colors">
          {item.qty === 1 ? '✕' : '−'}
        </button>
        <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
        <button onClick={() => updateQty(index, item.qty + 1)}
          className="w-7 h-7 rounded-full bg-white text-sm text-[var(--ink)] font-bold"
          style={{ boxShadow: 'var(--sh-1)' }}>
          +
        </button>
      </div>
      <span className="tabular-nums font-bold text-sm w-14 text-right">
        ${(item.price * item.qty).toFixed(2)}
      </span>
    </motion.div>
  );
}
