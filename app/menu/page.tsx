// app/menu/page.tsx
'use client';
import { useState } from 'react';
import { DRINKS, FEATURED_DRINK } from '@/lib/data/drinks';
import type { DrinkCategory } from '@/lib/data/drinks';
import { useCart } from '@/lib/store/CartContext';
import FeaturedDrink from '@/components/menu/FeaturedDrink';
import FilterChips from '@/components/menu/FilterChips';
import DrinkGrid from '@/components/menu/DrinkGrid';
import PageTransition from '@/components/PageTransition';

type FilterId = DrinkCategory | 'all';

export default function MenuPage() {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const { addItem } = useCart();

  const filtered = activeFilter === 'all'
    ? DRINKS
    : DRINKS.filter(d => d.category === activeFilter);

  const handleQuickAdd = (drink: { id: string; name: string; color: any; price: number }) => {
    addItem({
      drinkId: drink.id, name: drink.name, color: drink.color,
      size: 'M · 16oz', base: 'Oat Milk', toppings: ['pearls'],
      sweetness: 50, ice: 'Regular Ice', qty: 1, price: drink.price + 0.50,
    });
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
          <DrinkGrid drinks={filtered} onQuickAdd={handleQuickAdd} />
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
