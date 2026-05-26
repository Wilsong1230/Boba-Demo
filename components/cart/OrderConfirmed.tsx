// components/cart/OrderConfirmed.tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Cup from '@/components/ui/Cup';

export default function OrderConfirmed() {
  const reduced = useReducedMotion();

  return (
    <div className="text-center py-16 px-6 relative overflow-hidden">
      {!reduced && Array.from({ length: 12 }).map((_, i) => (
        <motion.div key={i}
          className="absolute text-2xl pointer-events-none"
          style={{ left: `${8 + i * 7.5}%`, top: '0%' }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: '120vh', opacity: [1, 1, 0], rotate: Math.random() * 720 - 360 }}
          transition={{ duration: 2 + Math.random() * 1.5, delay: i * 0.1, ease: 'easeIn' }}>
          {['🧋', '✨', '★', '♡', '🫧'][i % 5]}
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        initial={reduced ? {} : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}>
        <Cup color="coral" size="xl" />
        <h2 className="font-display text-3xl mt-4">Order placed! ♡</h2>
        <p className="text-[var(--ink-2)]">Ready at Mission in ~6 minutes.</p>
        <div className="flex gap-3 mt-4">
          <Link href="/rewards"><Button variant="soft">View rewards</Button></Link>
          <Link href="/menu"><Button variant="primary">Order again</Button></Link>
        </div>
      </motion.div>
    </div>
  );
}
