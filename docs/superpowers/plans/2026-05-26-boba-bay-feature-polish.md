# Boba Bay Feature Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish six UX features — real-time pickup slots, visual cup customization, menu-to-order flow, continue-shopping after add-to-cart, and rewards cleanup.

**Architecture:** All changes are contained to existing React components and a new `lib/utils/time.ts` utility. No new routes, no context schema changes, no new dependencies. The trickiest integration is the `?drink=<id>` URL param that the order page reads to pre-select a drink — handled with a Suspense-wrapped bootstrap component required by Next.js App Router's `useSearchParams()`.

**Tech Stack:** Next.js 16 App Router, TypeScript, Framer Motion, React Context, Vitest + React Testing Library, Tailwind v4

---

## File Map

| File | Change |
|---|---|
| `boba-bay/lib/utils/time.ts` | **CREATE** — `getTimeSlots()`, `getReadyTime()` |
| `boba-bay/lib/utils/time.test.ts` | **CREATE** — unit tests for time utils |
| `boba-bay/components/cart/PickupHero.tsx` | **MODIFY** — use `getTimeSlots()`, real ready time, disable post-9pm slots |
| `boba-bay/components/ui/Cup.tsx` | **MODIFY** — add optional `toppings?: string[]` prop, visual topping layer |
| `boba-bay/components/order/DrinkPreview.tsx` | **MODIFY** — pass `current.toppings` to Cup, extend animation key |
| `boba-bay/components/order/steps/StepReview.tsx` | **MODIFY** — "added" state with continue-shopping + view-cart buttons, pass toppings to Cup |
| `boba-bay/app/order/page.tsx` | **MODIFY** — add `OrderBootstrap` child that reads `?drink=` param and pre-selects |
| `boba-bay/app/menu/page.tsx` | **MODIFY** — replace `handleQuickAdd` with `handleSelectDrink` that navigates to `/order?drink=<id>` |
| `boba-bay/components/menu/DrinkGrid.tsx` | **MODIFY** — add optional `onSelect` prop, pass through to DrinkCard |
| `boba-bay/app/rewards/page.tsx` | **MODIFY** — remove "View all" span |

---

## Task 1: Time slot utilities

**Files:**
- Create: `boba-bay/lib/utils/time.ts`
- Create: `boba-bay/lib/utils/time.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// boba-bay/lib/utils/time.test.ts
import { describe, it, expect } from 'vitest';
import { getTimeSlots, getReadyTime } from './time';

describe('getTimeSlots', () => {
  it('returns 5 slots', () => {
    const slots = getTimeSlots(new Date('2024-01-15T14:00:00'));
    expect(slots).toHaveLength(5);
  });

  it('ASAP slot is +6 minutes', () => {
    const now = new Date('2024-01-15T14:00:00');
    const slots = getTimeSlots(now);
    expect(slots[0].label).toBe('ASAP');
    expect(slots[0].clockTime).toBe('2:06 pm');
    expect(slots[0].disabled).toBe(false);
  });

  it('1hr slot is +60 minutes', () => {
    const now = new Date('2024-01-15T14:00:00');
    const slots = getTimeSlots(now);
    expect(slots[4].label).toBe('1 hr');
    expect(slots[4].clockTime).toBe('3:00 pm');
  });

  it('disables slots at or after 9pm', () => {
    // 8:45pm — ASAP (8:51) enabled, 15min (9:00pm) disabled
    const now = new Date('2024-01-15T20:45:00');
    const slots = getTimeSlots(now);
    expect(slots[0].disabled).toBe(false); // 8:51pm ok
    expect(slots[1].disabled).toBe(true);  // 9:00pm closed
  });

  it('handles noon crossover correctly', () => {
    const now = new Date('2024-01-15T11:55:00'); // 11:55am
    const slots = getTimeSlots(now);
    expect(slots[0].clockTime).toBe('12:01 pm');
  });
});

describe('getReadyTime', () => {
  it('returns now + 6 min formatted as 12h', () => {
    const now = new Date('2024-01-15T16:19:00');
    expect(getReadyTime(now)).toBe('4:25 pm');
  });

  it('handles midnight crossover', () => {
    const now = new Date('2024-01-15T23:56:00');
    expect(getReadyTime(now)).toBe('12:02 am');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd boba-bay && npx vitest run lib/utils/time.test.ts
```

Expected: error — cannot find module `./time`

- [ ] **Step 3: Implement the utility**

```typescript
// boba-bay/lib/utils/time.ts
export interface TimeSlot {
  label: string;
  clockTime: string;
  disabled: boolean;
}

const CLOSE_HOUR = 21; // 9pm

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function fmt12(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 || 12;
  const mm = String(m).padStart(2, '0');
  return `${h12}:${mm} ${ampm}`;
}

function isAfterClose(date: Date): boolean {
  return date.getHours() >= CLOSE_HOUR;
}

const SLOT_OFFSETS = [
  { label: 'ASAP',   minutes: 6 },
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '1 hr',   minutes: 60 },
];

export function getTimeSlots(now = new Date()): TimeSlot[] {
  return SLOT_OFFSETS.map(({ label, minutes }) => {
    const ready = addMinutes(now, minutes);
    return { label, clockTime: fmt12(ready), disabled: isAfterClose(ready) };
  });
}

export function getReadyTime(now = new Date()): string {
  return fmt12(addMinutes(now, 6));
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd boba-bay && npx vitest run lib/utils/time.test.ts
```

Expected: 7 tests pass

- [ ] **Step 5: Commit**

```bash
cd boba-bay && git add lib/utils/time.ts lib/utils/time.test.ts
git commit -m "feat: add time slot utilities for real-time pickup display"
```

---

## Task 2: PickupHero with real-time slots

**Files:**
- Modify: `boba-bay/components/cart/PickupHero.tsx`

The current PickupHero imports static `TIME_SLOTS` from `lib/data/drinks` and renders them as Chip components. Replace with `getTimeSlots()` from the new utility. Each slot gets a clock time displayed below its Chip. Slots after 9pm are wrapped in a `pointer-events-none opacity-40` div. The hardcoded `~6m` and `by 4:25 today` also become dynamic via `getReadyTime()`.

The `CartContext` stores `pickupTime` as a label string (e.g. `'ASAP'`, `'15 min'`). The new slot labels match the old ones except `'1 hour'` becomes `'1 hr'` — update CartContext's initial value to match.

- [ ] **Step 1: Check CartContext initial pickupTime value**

Open `boba-bay/lib/store/CartContext.tsx`. Find the initial state. It will be:
```typescript
pickupTime: 'ASAP',
```
This matches — no change needed for ASAP. The old `'1 hour'` slot label is now `'1 hr'` — this only matters if the user had `'1 hour'` selected (they won't since state resets on refresh).

- [ ] **Step 2: Replace PickupHero with real-time version**

Full file replacement for `boba-bay/components/cart/PickupHero.tsx`:

```tsx
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
```

- [ ] **Step 3: Verify no TS errors**

```bash
cd boba-bay && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
cd boba-bay && git add components/cart/PickupHero.tsx
git commit -m "feat: real-time pickup slots with clock times and 9pm close cutoff"
```

---

## Task 3: Cup component — visual toppings

**Files:**
- Modify: `boba-bay/components/ui/Cup.tsx`

Add optional `toppings?: string[]` prop. When provided, the pearl layer changes color based on the first selected topping. If `cream` is selected, a white foam stripe appears in the upper liquid area. If `toppings` is undefined (all existing callers), the cup renders exactly as before — dark pearl dots.

- [ ] **Step 1: Write a render test**

```typescript
// boba-bay/components/ui/Cup.test.tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Cup from './Cup';

describe('Cup', () => {
  it('renders without toppings (backward compat)', () => {
    const { container } = render(<Cup color="coral" size="md" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with pearls topping', () => {
    const { container } = render(<Cup color="mint" size="lg" toppings={['pearls']} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with cream topping (foam layer)', () => {
    const { container } = render(<Cup color="lav" size="md" toppings={['cream']} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with empty toppings array (no pearls)', () => {
    const { container } = render(<Cup color="sun" size="sm" toppings={[]} />);
    expect(container.firstChild).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
cd boba-bay && npx vitest run components/ui/Cup.test.tsx
```

Expected: FAIL — Cup does not accept `toppings` prop (TS error or prop ignored)

- [ ] **Step 3: Update Cup.tsx with toppings support**

Full file replacement for `boba-bay/components/ui/Cup.tsx`:

```tsx
// components/ui/Cup.tsx
import React from 'react';

export type CupColor = 'coral' | 'mint' | 'lav' | 'sun' | 'berry';
export type CupSize = 'sm' | 'md' | 'lg' | 'xl';

interface CupProps {
  color?: CupColor;
  size?: CupSize;
  className?: string;
  style?: React.CSSProperties;
  toppings?: string[];
}

const sizes: Record<CupSize, { w: number; h: number }> = {
  sm: { w: 44,  h: 62 },
  md: { w: 70,  h: 100 },
  lg: { w: 120, h: 170 },
  xl: { w: 180, h: 260 },
};

const bgVars: Record<CupColor, string> = {
  coral: 'var(--coral-soft)',
  mint:  'var(--mint-soft)',
  lav:   'var(--lav-soft)',
  sun:   'var(--sun-soft)',
  berry: 'var(--berry-soft)',
};

const TOPPING_DOT_COLOR: Record<string, string> = {
  pearls:     'var(--ink)',
  grass:      '#4a5c4a',
  aloe:       'rgba(160,210,185,0.75)',
  popping:    'var(--coral)',
  'lychee-j': 'var(--lav)',
  redbean:    '#7a2d2d',
  pudding:    '#c8863a',
  aiyu:       '#c9c060',
};

function getPearlColor(toppings: string[]): string {
  const first = toppings.find(t => t in TOPPING_DOT_COLOR);
  return first ? TOPPING_DOT_COLOR[first] : 'var(--ink)';
}

export default function Cup({ color = 'coral', size = 'md', className = '', style, toppings }: CupProps) {
  const { w, h } = sizes[size];
  const bg = bgVars[color];

  // When toppings is undefined: classic look (dark pearls always shown)
  // When toppings is []: no pearls
  // When toppings has entries: colored pearls, optional foam
  const showPearls = toppings === undefined || toppings.some(t => t !== 'cream' && t in TOPPING_DOT_COLOR) || (toppings.length > 0 && !toppings.includes('cream'));
  const dotColor   = toppings === undefined ? 'var(--ink)' : getPearlColor(toppings.filter(t => t !== 'cream'));
  const showFoam   = toppings?.includes('cream') ?? false;
  const hasDots    = toppings === undefined || (toppings.length > 0 && toppings.some(t => t !== 'cream'));

  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block', width: w, height: h, flexShrink: 0, ...style }}>
      {/* straw */}
      <div style={{
        position: 'absolute', top: '-22%', left: '56%',
        width: '7%', height: '38%',
        background: 'linear-gradient(to right, var(--coral) 50%, var(--coral-deep) 50%)',
        borderRadius: 4, transform: 'rotate(10deg)', transformOrigin: 'bottom', zIndex: 2,
      }} />
      {/* body */}
      <div style={{
        position: 'absolute', inset: '8% 4% 0 4%',
        background: bg,
        borderRadius: '8% 8% 18% 18% / 4% 4% 12% 12%',
        boxShadow: 'inset -8% 0 0 -4% rgba(0,0,0,0.06), inset 12% 0 0 -8% rgba(255,255,255,0.35)',
        overflow: 'hidden',
      }}>
        {/* highlight */}
        <div style={{
          position: 'absolute', top: '6%', left: '8%', right: '8%', height: '8%',
          background: 'rgba(255,255,255,0.3)', borderRadius: '50%',
        }} />
        {/* cream foam layer */}
        {showFoam && (
          <div style={{
            position: 'absolute', top: '14%', left: 0, right: 0, height: '16%',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: '0 0 50% 50%',
          }} />
        )}
        {/* pearls / topping dots */}
        {hasDots && (
          <div style={{
            position: 'absolute', bottom: '4%', left: '8%', right: '8%', height: '32%',
            borderRadius: '0 0 14px 14px',
            backgroundImage: `
              radial-gradient(circle at 18% 70%, ${dotColor} 11%, transparent 12%),
              radial-gradient(circle at 38% 88%, ${dotColor} 11%, transparent 12%),
              radial-gradient(circle at 58% 70%, ${dotColor} 11%, transparent 12%),
              radial-gradient(circle at 78% 88%, ${dotColor} 11%, transparent 12%),
              radial-gradient(circle at 28% 88%, ${dotColor} 9%, transparent 10%),
              radial-gradient(circle at 68% 88%, ${dotColor} 9%, transparent 10%)
            `,
          }} />
        )}
      </div>
      {/* lid */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '12%',
        background: 'var(--bg-2)', borderRadius: '50% / 60%',
        boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.06)',
      }} />
    </div>
  );
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd boba-bay && npx vitest run components/ui/Cup.test.tsx
```

Expected: 4 tests pass

- [ ] **Step 5: Confirm all existing tests still pass**

```bash
cd boba-bay && npx vitest run
```

Expected: all tests pass (no regressions)

- [ ] **Step 6: Commit**

```bash
cd boba-bay && git add components/ui/Cup.tsx components/ui/Cup.test.tsx
git commit -m "feat: Cup component accepts toppings prop for visual customization"
```

---

## Task 4: DrinkPreview — pass toppings to Cup, extend animation key

**Files:**
- Modify: `boba-bay/components/order/DrinkPreview.tsx`

Currently the AnimatePresence key is `current.color`. When the user changes toppings the cup re-animates only if the color changed. Extend the key to include toppings so any topping change triggers the swap animation.

- [ ] **Step 1: Update DrinkPreview.tsx**

Full file replacement for `boba-bay/components/order/DrinkPreview.tsx`:

```tsx
// components/order/DrinkPreview.tsx
'use client';
import { useOrder } from '@/lib/store/OrderContext';
import Cup from '@/components/ui/Cup';
import type { CupColor } from '@/components/ui/Cup';
import { motion, AnimatePresence } from 'framer-motion';

export default function DrinkPreview() {
  const { current } = useOrder();
  const cupKey = `${current.color}-${current.toppings.join(',')}`;

  return (
    <div className="hidden md:block bg-white rounded-2xl p-5 sticky top-24" style={{ boxShadow: 'var(--sh-2)' }}>
      <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--ink-3)] mb-4">Your cup · live</div>
      <div className="flex justify-center mb-4">
        <AnimatePresence mode="wait">
          <motion.div key={cupKey}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}>
            <Cup
              color={(current.color || 'coral') as CupColor}
              size="lg"
              toppings={current.toppings.length > 0 ? current.toppings : undefined}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="font-bold text-base">{current.drinkName || '—'}</div>
      <div className="mt-3 space-y-1 text-xs text-[var(--ink-2)]">
        {current.size && <div>· {current.size}</div>}
        {current.base && <div>· {current.base}</div>}
        {current.toppings.length > 0 && <div>· {current.toppings.slice(0, 3).join(', ')}</div>}
        {!current.drinkId && <div className="text-[var(--ink-3)] italic">Pick a drink to start</div>}
      </div>
      <div className="border-t border-[var(--line)] mt-4 pt-4 flex justify-between items-center">
        <span className="text-xs text-[var(--ink-3)]">Running total</span>
        <span className="tabular-nums text-xl font-bold">
          {current.basePrice ? `$${(current.basePrice + current.sizeDelta).toFixed(2)}` : '—'}
        </span>
      </div>
    </div>
  );
}
```

Note: We pass `toppings={current.toppings.length > 0 ? current.toppings : undefined}` — when no toppings are selected, `undefined` falls back to the default dark-pearl look.

- [ ] **Step 2: Verify TS**

```bash
cd boba-bay && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd boba-bay && git add components/order/DrinkPreview.tsx
git commit -m "feat: order preview cup reflects selected toppings visually"
```

---

## Task 5: StepReview — continue shopping + toppings on cup

**Files:**
- Modify: `boba-bay/components/order/steps/StepReview.tsx`

After the user clicks "Add to cart", instead of immediately navigating to `/cart`, show two buttons:
- **"← Continue shopping"** → `resetOrder()` then `router.push('/menu')`
- **"View cart →"** → `resetOrder()` then `router.push('/cart')`

Also pass `toppings` to the Cup preview in this step.

A local `added` boolean controls which button row shows.

- [ ] **Step 1: Update StepReview.tsx**

Full file replacement for `boba-bay/components/order/steps/StepReview.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify TS**

```bash
cd boba-bay && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd boba-bay && git add components/order/steps/StepReview.tsx
git commit -m "feat: StepReview shows continue-shopping and view-cart after add, toppings on cup"
```

---

## Task 6: Order page — pre-select drink from URL param

**Files:**
- Modify: `boba-bay/app/order/page.tsx`

When navigating from the menu with `?drink=<id>`, the order page should pre-select that drink and jump to Step 1 (Size), skipping the drink picker.

In Next.js 16 App Router, `useSearchParams()` must live inside a component wrapped in `<Suspense>`. The pattern: add a small `OrderBootstrap` client component that reads the param, calls `updateCurrent` + `setStep(1)` in a `useEffect`, and renders nothing. Wrap it in `<Suspense fallback={null}>` inside the page.

- [ ] **Step 1: Update app/order/page.tsx**

Full file replacement for `boba-bay/app/order/page.tsx`:

```tsx
// app/order/page.tsx
'use client';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOrder } from '@/lib/store/OrderContext';
import { DRINKS } from '@/lib/data/drinks';
import StepperProgress from '@/components/order/StepperProgress';
import StepDrink from '@/components/order/steps/StepDrink';
import StepSize from '@/components/order/steps/StepSize';
import StepCustomize from '@/components/order/steps/StepCustomize';
import StepReview from '@/components/order/steps/StepReview';
import DrinkPreview from '@/components/order/DrinkPreview';
import PageTransition from '@/components/PageTransition';

function OrderBootstrap() {
  const searchParams = useSearchParams();
  const { updateCurrent, setStep } = useOrder();

  useEffect(() => {
    const id = searchParams.get('drink');
    if (!id) return;
    const drink = DRINKS.find(d => d.id === id);
    if (!drink) return;
    updateCurrent({ drinkId: drink.id, drinkName: drink.name, color: drink.color, basePrice: drink.price });
    setStep(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

const STEP_COMPONENTS = [StepDrink, StepSize, StepCustomize, StepReview];

export default function OrderPage() {
  const { step } = useOrder();
  const reduced = useReducedMotion();
  const StepComp = STEP_COMPONENTS[step];

  return (
    <PageTransition>
      <Suspense fallback={null}>
        <OrderBootstrap />
      </Suspense>
      <div className="max-w-5xl mx-auto px-4 md:px-10 py-8">
        <StepperProgress current={step} />
        <div className="md:grid md:grid-cols-[1fr_280px] md:gap-8">
          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={reduced ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? {} : { opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}>
              <StepComp />
            </motion.div>
          </AnimatePresence>
          <DrinkPreview />
        </div>
      </div>
    </PageTransition>
  );
}
```

- [ ] **Step 2: Verify TS and build**

```bash
cd boba-bay && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd boba-bay && git add app/order/page.tsx
git commit -m "feat: order page pre-selects drink from ?drink= URL param"
```

---

## Task 7: Menu page — navigate to order instead of quick-add

**Files:**
- Modify: `boba-bay/app/menu/page.tsx`
- Modify: `boba-bay/components/menu/DrinkGrid.tsx`

Currently the `+` button on each DrinkCard silently adds a drink with default options. Replace this with navigation to `/order?drink=<id>`. Both the card body click and the `+` button should navigate.

**DrinkGrid change:** add optional `onSelect` prop and pass it to DrinkCard. This lets menu page wire both the card-body click and the `+` button to the same navigate handler.

**Menu page change:** remove `handleQuickAdd`, remove `useCart` import, add `useRouter`. Pass `handleSelectDrink` as both `onQuickAdd` (for the `+` button) and `onSelect` (for card body click).

- [ ] **Step 1: Update DrinkGrid.tsx to accept onSelect**

Full file replacement for `boba-bay/components/menu/DrinkGrid.tsx`:

```tsx
// components/menu/DrinkGrid.tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';
import DrinkCard from '@/components/ui/DrinkCard';
import type { Drink } from '@/lib/data/drinks';

interface DrinkGridProps {
  drinks: Drink[];
  onQuickAdd: (drink: Drink) => void;
  onSelect?: (drink: Drink) => void;
}

const containerVariants = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DrinkGrid({ drinks, onQuickAdd, onSelect }: DrinkGridProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
      variants={reduced ? {} : containerVariants}
      initial="hidden"
      animate="visible"
    >
      {drinks.map(drink => (
        <motion.div key={drink.id} variants={reduced ? {} : itemVariants}>
          <DrinkCard drink={drink} onQuickAdd={onQuickAdd} onSelect={onSelect} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 2: Update menu/page.tsx to navigate on select**

Full file replacement for `boba-bay/app/menu/page.tsx`:

```tsx
// app/menu/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DRINKS, FEATURED_DRINK } from '@/lib/data/drinks';
import type { DrinkCategory, Drink } from '@/lib/data/drinks';
import FeaturedDrink from '@/components/menu/FeaturedDrink';
import FilterChips from '@/components/menu/FilterChips';
import DrinkGrid from '@/components/menu/DrinkGrid';
import PageTransition from '@/components/PageTransition';

type FilterId = DrinkCategory | 'all';

export default function MenuPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const router = useRouter();

  const filtered = activeFilter === 'all'
    ? DRINKS
    : DRINKS.filter(d => d.category === activeFilter);

  const handleSelectDrink = (drink: Drink) => {
    router.push(`/order?drink=${drink.id}`);
  };

  return (
    <PageTransition>
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-8">
      <FeaturedDrink drink={FEATURED_DRINK} />

      <div className="mt-10">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-[11px] font-medium tracking-widest uppercase text-[var(--ink-3)]">
              All drinks · {filtered.length} today
            </span>
            <h2 className="font-display text-[var(--ink)] mt-1" style={{ fontSize: 32 }}>The full menu.</h2>
          </div>
        </div>

        <FilterChips active={activeFilter} onChange={setActiveFilter} />

        <div className="mt-6">
          <DrinkGrid
            drinks={filtered}
            onQuickAdd={handleSelectDrink}
            onSelect={handleSelectDrink}
          />
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
```

- [ ] **Step 3: Verify TS**

```bash
cd boba-bay && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Run all tests**

```bash
cd boba-bay && npx vitest run
```

Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
cd boba-bay && git add app/menu/page.tsx components/menu/DrinkGrid.tsx
git commit -m "feat: menu drink cards navigate to order builder instead of quick-adding"
```

---

## Task 8: Remove "View all" from rewards page

**Files:**
- Modify: `boba-bay/app/rewards/page.tsx`

One surgical removal. The "Recent activity" section header currently has a `View all` span next to the title. Remove it.

- [ ] **Step 1: Remove the View all span**

In `boba-bay/app/rewards/page.tsx`, find and replace this block at line 65–68:

```tsx
// BEFORE
<div className="flex justify-between items-center mb-2">
  <h4 className="font-display text-lg">Recent activity</h4>
  <span className="text-xs text-[var(--ink-3)]">View all</span>
</div>
```

Replace with:

```tsx
// AFTER
<div className="mb-2">
  <h4 className="font-display text-lg">Recent activity</h4>
</div>
```

- [ ] **Step 2: Verify TS and run all tests**

```bash
cd boba-bay && npx tsc --noEmit && npx vitest run
```

Expected: no errors, all tests pass

- [ ] **Step 3: Commit**

```bash
cd boba-bay && git add app/rewards/page.tsx
git commit -m "fix: remove View all button from rewards activity feed"
```

---

## Self-Review

**Spec coverage check:**
1. ✅ "Continue shopping button when adding to cart" → Task 5 (StepReview `added` state + two buttons)
2. ✅ "Adding to cart from menu prompts customization" → Tasks 6+7 (menu navigates to `/order?drink=<id>`, order pre-selects)
3. ✅ "Change all time things to say open till 9pm" → Already present in PickupHero; Task 2 preserves it
4. ✅ "Add real time so that ASAP, 15 min, etc reflect real time" → Tasks 1+2 (`getTimeSlots()`, clock times below chips, ready time computed)
5. ✅ "When building drinks make it show customizations on the drink itself" → Tasks 3+4+5 (Cup toppings prop, DrinkPreview passes toppings, StepReview passes toppings)
6. ✅ "Remove the view all button on the rewards page" → Task 8

**Placeholder scan:** None found.

**Type consistency:**
- `TimeSlot` defined in Task 1, used in Task 2 ✅
- `Cup toppings?: string[]` defined in Task 3, used in Tasks 4 and 5 ✅
- `DrinkGrid onSelect?` defined in Task 7, passed from menu page in Task 7 ✅
- `OrderBootstrap` reads `useSearchParams` in Task 6, `updateCurrent` signature matches OrderContext ✅
