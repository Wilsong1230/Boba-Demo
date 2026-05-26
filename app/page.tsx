// app/page.tsx
'use client';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import MarqueeStrip from '@/components/home/MarqueeStrip';
import DriftCup from '@/components/home/DriftCup';
import StickerLabel from '@/components/home/StickerLabel';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import PageTransition from '@/components/PageTransition';

export default function Home() {
  const reduced = useReducedMotion();

  return (
    <PageTransition>
      <div>
      <MarqueeStrip />
      <div className="relative min-h-[560px] flex items-center justify-center overflow-hidden px-6 py-16">
        {/* Background gradient blob */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full"
               style={{ background: 'radial-gradient(circle, var(--coral-soft) 0%, transparent 65%)' }} />
        </div>

        {/* Drift cups */}
        <DriftCup color="mint" size="md" style={{ top: 40, left: '8%' }} rotate={-8} />
        <DriftCup color="lav"  size="md" style={{ top: 60, right: '10%' }} rotate={6} />
        <DriftCup color="sun"  size="sm" style={{ bottom: 80, left: '14%' }} rotate={0} />
        <DriftCup color="berry" size="md" style={{ bottom: 40, right: '8%' }} rotate={-4} />

        {/* Stickers */}
        <StickerLabel variant="mint" rotate={-12} style={{ top: '22%', left: '5%' }}>TRY THE TARO</StickerLabel>
        <StickerLabel variant="coral" rotate={8}  style={{ bottom: '22%', left: '28%' }}>2× POINTS TODAY</StickerLabel>
        <StickerLabel variant="lav"  rotate={6}  style={{ top: '20%', right: '5%' }}>NEW SPRING ✦</StickerLabel>

        {/* Hero content */}
        <div className="relative z-10 text-center flex flex-col items-center gap-5">
          <Chip variant="coral" className="text-sm px-4 py-2">Open 7 days · fresh boba 'til 10pm</Chip>

          <motion.h1
            className="font-display leading-[0.9]"
            style={{ fontSize: 'clamp(56px, 10vw, 96px)' }}
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            hi, we're<br />boba bay <span style={{ color: 'var(--coral)' }}>♡</span>
          </motion.h1>

          <p className="text-[var(--ink-2)] max-w-sm text-lg">
            Tea, pearls, and three SF corners that smell like spring.
          </p>

          <div className="flex gap-3 mt-2">
            <motion.div
              animate={reduced ? {} : { y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Link href="/order">
                <Button variant="primary" size="lg">Tap to order →</Button>
              </Link>
            </motion.div>
            <Link href="/menu">
              <Button variant="ghost" size="lg">Menu</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="bg-[var(--ink)] text-white flex items-center justify-around py-4 px-6 flex-wrap gap-4"
           style={{ fontSize: 13 }}>
        {[
          ['3', 'locations'],
          ['0', 'powders, ever'],
          ['20m', 'pickup time'],
          ['9', 'drops a year'],
        ].map(([num, label]) => (
          <span key={label}>
            <span className="font-hand text-[var(--sun)] text-xl mr-1">{num}</span>
            {label}
          </span>
        ))}
      </div>
      </div>
    </PageTransition>
  );
}
