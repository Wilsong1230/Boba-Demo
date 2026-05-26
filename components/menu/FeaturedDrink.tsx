// components/menu/FeaturedDrink.tsx
'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import Cup from '@/components/ui/Cup';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import type { Drink } from '@/lib/data/drinks';

export default function FeaturedDrink({ drink }: { drink: Drink }) {
  const reduced = useReducedMotion();

  return (
    <div className="rounded-2xl overflow-hidden relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-10"
         style={{ background: 'linear-gradient(135deg, var(--sun-soft) 0%, var(--coral-soft) 100%)' }}>
      <div className="flex-1">
        <Chip variant="coral" className="mb-4">✦ Featured drink</Chip>
        <h2 className="font-display text-[var(--ink)]" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>{drink.name}</h2>
        <p className="text-[var(--ink-2)] mt-2 text-sm">{drink.description}</p>
        <div className="flex items-center gap-3 mt-5">
          <span className="tabular-nums font-bold text-2xl">${drink.price.toFixed(2)}</span>
          <Link href={`/order?drink=${drink.id}`}>
            <Button variant="primary">Order now →</Button>
          </Link>
        </div>
      </div>
      <motion.div
        animate={reduced ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cup color={drink.color} size="xl" />
      </motion.div>
    </div>
  );
}
