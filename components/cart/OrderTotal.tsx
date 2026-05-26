// components/cart/OrderTotal.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/lib/store/CartContext';
import { calcTotal } from '@/lib/utils/price';

function useCountUp(target: number, duration = 600) {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);

  useEffect(() => {
    const start = prev.current;
    const diff = target - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      setDisplay(start + diff * progress);
      if (progress < 1) requestAnimationFrame(tick);
      else prev.current = target;
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return display;
}

export default function OrderTotal() {
  const { items } = useCart();
  const subtotal = calcTotal(items.map(it => ({ price: it.price, qty: it.qty })));
  const tax = subtotal * 0.0835;
  const total = subtotal + tax;

  const displayTotal = useCountUp(total);

  return (
    <div className="bg-[var(--ink)] text-white rounded-2xl p-5 space-y-3">
      <div className="flex justify-between text-sm opacity-70">
        <span>Subtotal</span><span className="tabular-nums">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm opacity-70">
        <span>Tax</span><span className="tabular-nums">${tax.toFixed(2)}</span>
      </div>
      <div className="border-t border-white/10 pt-3 flex justify-between">
        <span className="font-semibold">Total</span>
        <span className="tabular-nums text-2xl font-bold text-[var(--sun)]">
          ${displayTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
