// components/home/DriftCup.tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';
import Cup, { CupColor, CupSize } from '@/components/ui/Cup';

interface DriftCupProps {
  color: CupColor;
  size?: CupSize;
  style?: React.CSSProperties;
  rotate?: number;
}

export default function DriftCup({ color, size = 'md', style, rotate = 0 }: DriftCupProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      style={{ position: 'absolute', rotate, ...style }}
      animate={reduced ? {} : {
        y: [0, -10, 0],
        rotate: [rotate - 2, rotate + 2, rotate - 2],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Cup color={color} size={size} />
    </motion.div>
  );
}
