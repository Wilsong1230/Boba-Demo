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
