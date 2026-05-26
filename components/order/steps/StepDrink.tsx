// components/order/steps/StepDrink.tsx
'use client';
import { DRINKS } from '@/lib/data/drinks';
import { useOrder } from '@/lib/store/OrderContext';
import DrinkCard from '@/components/ui/DrinkCard';
import Button from '@/components/ui/Button';

export default function StepDrink() {
  const { current, updateCurrent, setStep } = useOrder();

  const handleSelect = (drink: { id: string; name: string; color: any; price: number }) => {
    updateCurrent({ drinkId: drink.id, drinkName: drink.name, color: drink.color, basePrice: drink.price });
  };

  return (
    <div>
      <h3 className="font-display text-[var(--ink)] mb-1" style={{ fontSize: 28 }}>Pick your drink</h3>
      <p className="text-sm text-[var(--ink-3)] mb-6">Choose a base drink to start building your cup.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {DRINKS.map(drink => (
          <div key={drink.id}
               onClick={() => handleSelect(drink)}
               className={`rounded-2xl overflow-hidden cursor-pointer transition-all ${current.drinkId === drink.id ? 'ring-2 ring-[var(--coral)]' : ''}`}>
            <DrinkCard drink={drink} />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button variant="primary" size="lg" disabled={!current.drinkId} onClick={() => setStep(1)}>
          Size →
        </Button>
      </div>
    </div>
  );
}
