// components/order/steps/StepSize.tsx
'use client';
import { SIZES } from '@/lib/data/drinks';
import { useOrder } from '@/lib/store/OrderContext';
import Button from '@/components/ui/Button';

export default function StepSize() {
  const { current, updateCurrent, setStep } = useOrder();

  return (
    <div>
      <h3 className="font-display text-[var(--ink)] mb-1" style={{ fontSize: 28 }}>Choose your size</h3>
      <p className="text-sm text-[var(--ink-3)] mb-6">Price shown for base drink. Toppings and upgrades add on.</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {SIZES.map(({ label, delta }) => {
          const active = current.size === label;
          return (
            <button key={label}
              onClick={() => updateCurrent({ size: label, sizeDelta: delta })}
              className={`p-5 rounded-2xl border-2 text-center transition-all ${active ? 'border-[var(--coral)] bg-[var(--coral-soft)]' : 'border-[var(--line-2)] bg-white hover:border-[var(--coral)]'}`}>
              <div className="font-bold text-lg">{label.split(' · ')[0]}</div>
              <div className="text-xs text-[var(--ink-3)] mt-1">{label.split(' · ')[1]}</div>
              <div className="font-bold mt-2 text-[var(--coral-deep)]">
                ${(current.basePrice + delta).toFixed(2)}
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setStep(0)}>← Drink</Button>
        <Button variant="primary" size="lg" onClick={() => setStep(2)}>Customize →</Button>
      </div>
    </div>
  );
}
