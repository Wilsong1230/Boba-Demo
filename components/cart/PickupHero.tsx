// components/cart/PickupHero.tsx
'use client';
import { useCart } from '@/lib/store/CartContext';
import { STORES } from '@/lib/data/drinks';
import { getTimeSlots, getReadyTime } from '@/lib/utils/time';
import Chip from '@/components/ui/Chip';
import Cup from '@/components/ui/Cup';

export default function PickupHero() {
  const { pickupTime, pickupLocation, setPickupTime, setPickupLocation } = useCart();
  const slots = getTimeSlots();
  const readyTime = getReadyTime();

  return (
    <div className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
         style={{ background: 'linear-gradient(135deg, var(--coral-soft) 0%, var(--sun-soft) 100%)' }}>
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none translate-x-8 -translate-y-8">
        <Cup color="coral" size="xl" />
      </div>

      <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--coral-deep)] mb-1">Pickup at</div>
          <select
            value={pickupLocation}
            onChange={e => setPickupLocation(e.target.value)}
            className="font-display text-2xl md:text-3xl text-[var(--ink)] bg-transparent border-none cursor-pointer focus:outline-none">
            {STORES.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="text-sm text-[var(--ink-3)] mt-1">Open till 9pm · pearls cooked fresh</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--coral-deep)] mb-1">Ready in</div>
          <div className="font-hand text-5xl md:text-6xl text-[var(--coral-deep)] leading-none">~6m</div>
          <div className="text-xs text-[var(--ink-3)] mt-1">by {readyTime} today</div>
        </div>
      </div>

      <div className="relative border-t border-dashed border-[rgba(42,31,24,0.2)] mt-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {slots.map((slot) => (
            <div
              key={slot.label}
              className={`flex-shrink-0 text-center ${slot.disabled ? 'opacity-40 pointer-events-none' : ''}`}
            >
              <Chip active={pickupTime === slot.label} onClick={() => setPickupTime(slot.label)}>
                {slot.label}
              </Chip>
              <div className="text-[10px] text-[var(--ink-3)] mt-1">{slot.clockTime}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
