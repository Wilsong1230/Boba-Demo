// components/menu/FilterChips.tsx
'use client';
import Chip from '@/components/ui/Chip';
import { CATEGORIES } from '@/lib/data/drinks';
import type { DrinkCategory } from '@/lib/data/drinks';

type FilterId = DrinkCategory | 'all';

interface FilterChipsProps {
  active: FilterId;
  onChange: (id: FilterId) => void;
}

export default function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ id, label }) => (
        <Chip
          key={id}
          active={active === id}
          variant={id === 'seasonal' ? 'coral' : 'default'}
          onClick={() => onChange(id as FilterId)}
        >
          {label}
        </Chip>
      ))}
    </div>
  );
}
