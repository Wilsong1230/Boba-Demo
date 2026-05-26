// components/order/steps/StepReview.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/lib/store/OrderContext';
import { useCart } from '@/lib/store/CartContext';
import Button from '@/components/ui/Button';
import Cup from '@/components/ui/Cup';
import type { CupColor } from '@/components/ui/Cup';

export default function StepReview() {
  const { current, setStep, resetOrder } = useOrder();
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      drinkId: current.drinkId,
      name: current.drinkName,
      color: current.color as CupColor,
      size: current.size,
      base: current.base,
      toppings: current.toppings,
      sweetness: current.sweetness,
      ice: current.ice,
      qty: 1,
      price: current.basePrice + current.sizeDelta,
    });
    setAdded(true);
  };

  const handleViewCart = () => {
    resetOrder();
    router.push('/cart');
  };

  const handleContinueShopping = () => {
    resetOrder();
    router.push('/menu');
  };

  return (
    <div>
      <h3 className="font-display text-[var(--ink)] mb-1" style={{ fontSize: 28 }}>Your cup</h3>
      <p className="text-sm text-[var(--ink-3)] mb-6">
        {added ? '✓ Added to your cart!' : 'Looks good? Add it to your cart.'}
      </p>

      <div className="flex gap-8 items-start mb-8">
        <div className="flex-shrink-0">
          <Cup
            color={current.color as CupColor}
            size="lg"
            toppings={current.toppings.length > 0 ? current.toppings : undefined}
          />
        </div>
        <div className="flex-1">
          <div className="font-bold text-xl mb-3">{current.drinkName}</div>
          <div className="space-y-1 text-sm text-[var(--ink-2)]">
            <div>· {current.size}</div>
            <div>· {current.base}</div>
            {current.toppings.length > 0 && <div>· {current.toppings.join(', ')}</div>}
            <div>· {current.sweetness}% sweet</div>
            <div>· {current.ice}</div>
          </div>
          <div className="mt-4 text-2xl font-bold tabular-nums">
            ${(current.basePrice + current.sizeDelta).toFixed(2)}
          </div>
        </div>
      </div>

      {added ? (
        <div className="flex gap-3 justify-end flex-wrap">
          <Button variant="ghost" onClick={handleContinueShopping}>← Continue shopping</Button>
          <Button variant="primary" size="lg" onClick={handleViewCart}>View cart →</Button>
        </div>
      ) : (
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setStep(2)}>← Customize</Button>
          <Button variant="primary" size="lg" onClick={handleAddToCart}>Add to cart →</Button>
        </div>
      )}
    </div>
  );
}
