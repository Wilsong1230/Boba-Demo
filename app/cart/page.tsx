// app/cart/page.tsx
'use client';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/store/CartContext';
import PickupHero from '@/components/cart/PickupHero';
import CartItemRow from '@/components/cart/CartItemRow';
import OrderTotal from '@/components/cart/OrderTotal';
import OrderConfirmed from '@/components/cart/OrderConfirmed';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';

export default function CartPage() {
  const { items, clearCart } = useCart();
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) return <PageTransition><OrderConfirmed /></PageTransition>;

  if (items.length === 0) {
    return (
      <PageTransition>
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🧋</div>
        <h2 className="font-display text-2xl mb-2">Your cart is empty</h2>
        <p className="text-[var(--ink-3)] mb-6">Add a drink to get started.</p>
        <Link href="/menu"><Button variant="primary">Browse menu</Button></Link>
      </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="max-w-4xl mx-auto px-4 md:px-10 py-8 space-y-6">
      <PickupHero />

      <div>
        <h2 className="font-display text-2xl mb-4">
          Your cart <span className="text-[var(--ink-3)] text-lg font-normal">· {items.length} drink{items.length !== 1 ? 's' : ''}</span>
        </h2>
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((item, i) => (
              <CartItemRow key={`${item.drinkId}-${i}`} item={item} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <OrderTotal />

      <Button
        variant="primary"
        size="lg"
        className="w-full justify-center"
        onClick={() => { clearCart(); setConfirmed(true); }}>
        Place order →
      </Button>
    </div>
    </PageTransition>
  );
}
