// components/order/steps/StepCustomize.tsx
'use client';
import { TOPPINGS, BASES, ICE_LEVELS } from '@/lib/data/drinks';
import { useOrder } from '@/lib/store/OrderContext';
import Button from '@/components/ui/Button';

export default function StepCustomize() {
  const { current, updateCurrent, setStep } = useOrder();

  const toggleTopping = (id: string) => {
    const next = current.toppings.includes(id)
      ? current.toppings.filter(t => t !== id)
      : [...current.toppings, id];
    updateCurrent({ toppings: next });
  };

  return (
    <div>
      <h3 className="font-display text-[var(--ink)] mb-1" style={{ fontSize: 28 }}>Customize your cup</h3>
      <p className="text-sm text-[var(--ink-3)] mb-6">Up to 3 toppings included · extras +$0.75 each</p>

      <div className="mb-6">
        <div className="text-xs font-medium tracking-widest uppercase text-[var(--ink-3)] mb-3">Milk base</div>
        <div className="flex flex-wrap gap-2">
          {BASES.map(base => (
            <button key={base}
              onClick={() => updateCurrent({ base })}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${current.base === base ? 'border-[var(--coral)] bg-[var(--coral-soft)] text-[var(--coral-deep)]' : 'border-[var(--line-2)] bg-white text-[var(--ink-2)]'}`}>
              {base}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs font-medium tracking-widest uppercase text-[var(--ink-3)] mb-3">Toppings</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {TOPPINGS.map(t => {
            const selected = current.toppings.includes(t.id);
            return (
              <button key={t.id}
                onClick={() => toggleTopping(t.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${selected ? 'border-[var(--coral)] bg-[var(--coral-soft)]' : 'border-transparent bg-white'}`}
                style={{ boxShadow: selected ? 'none' : 'var(--sh-1)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs">{t.name}</div>
                    <div className="text-[10px] text-[var(--ink-3)]">{t.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold border ${selected ? 'bg-[var(--coral)] text-white border-[var(--coral)]' : 'border-[var(--line-2)]'}`}>
                    {selected ? '✓' : ''}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs font-medium tracking-widest uppercase text-[var(--ink-3)] mb-3">
          Sweetness · {current.sweetness}%
        </div>
        <input type="range" min={0} max={100} step={25} value={current.sweetness}
          onChange={e => updateCurrent({ sweetness: Number(e.target.value) })}
          className="w-full accent-[var(--coral)]" />
        <div className="flex justify-between text-xs text-[var(--ink-3)] mt-1">
          <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-xs font-medium tracking-widest uppercase text-[var(--ink-3)] mb-3">Ice level</div>
        <div className="flex flex-wrap gap-2">
          {ICE_LEVELS.map(level => (
            <button key={level}
              onClick={() => updateCurrent({ ice: level })}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${current.ice === level ? 'border-[var(--coral)] bg-[var(--coral-soft)] text-[var(--coral-deep)]' : 'border-[var(--line-2)] bg-white text-[var(--ink-2)]'}`}>
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setStep(1)}>← Size</Button>
        <Button variant="primary" size="lg" onClick={() => setStep(3)}>Review →</Button>
      </div>
    </div>
  );
}
