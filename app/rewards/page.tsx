// app/rewards/page.tsx
'use client';
import { useRewards } from '@/lib/store/RewardsContext';
import StampGrid from '@/components/ui/StampGrid';
import BucksBar from '@/components/ui/BucksBar';
import ActivityRow from '@/components/ui/ActivityRow';
import Button from '@/components/ui/Button';
import { motion, useReducedMotion } from 'framer-motion';
import Cup from '@/components/ui/Cup';

export default function RewardsPage() {
  const { stamps, stampGoal, beanBucks, bucksGoal, activity, addStamp, spendBucks } = useRewards();
  const reduced = useReducedMotion();

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-10 py-8">
      {/* Hero numbers — desktop: side by side; mobile: stacked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        {/* Bean Bucks card */}
        <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'var(--coral-soft)' }}>
          <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
            <Cup color="coral" size="xl" />
          </div>
          <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--coral-deep)] mb-2">
            Bean Bucks · spend any time
          </div>
          <motion.div
            className="font-hand leading-none text-[var(--coral-deep)] mb-4"
            style={{ fontSize: 'clamp(64px,10vw,88px)' }}
            key={beanBucks}
            initial={reduced ? {} : { scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}>
            {beanBucks}
          </motion.div>
          <BucksBar current={beanBucks} target={bucksGoal} label="to free drink" />
        </div>

        {/* Pearl Stamps card */}
        <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'var(--sun-soft)' }}>
          <div className="text-[10px] font-medium tracking-widest uppercase text-[#8A6B12] mb-2">
            Pearl Stamps · earn a free drink
          </div>
          <div className="font-hand leading-none text-[#8A6B12] mb-2" style={{ fontSize: 'clamp(64px,10vw,88px)' }}>
            {stamps}<span className="text-[#8A6B12]/40 text-3xl">/{stampGoal}</span>
          </div>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: stampGoal }).map((_, i) => (
              <div key={i} className="flex-1 h-2 rounded-full transition-all"
                   style={{ background: i < stamps ? '#8A6B12' : 'rgba(138,107,18,0.18)' }} />
            ))}
          </div>
          <p className="text-xs" style={{ color: '#8A6B12' }}>{stampGoal - stamps} more visits → free regular drink + 50 BB</p>
        </div>
      </div>

      {/* Stamp grid + activity — desktop: side by side; mobile: stacked */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4 mb-6">

        {/* Activity feed */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: 'var(--sh-1)' }}>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-display text-lg">Recent activity</h4>
            <span className="text-xs text-[var(--ink-3)]">View all</span>
          </div>
          <div>
            {activity.slice(0, 5).map(item => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Stamp grid card */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: 'var(--sh-1)' }}>
          <div className="text-[10px] font-medium tracking-widest uppercase text-[var(--coral-deep)] mb-3">Pearl stamps</div>
          <StampGrid filled={stamps} total={stampGoal} size={40} />
          <div className="mt-3 p-3 rounded-xl text-sm" style={{ background: 'var(--bg-2)' }}>
            ✨ <strong>Double stamps</strong> on matcha drinks all weekend
          </div>
        </div>
      </div>

      {/* Demo controls */}
      <div className="rounded-2xl p-5 border-2 border-dashed border-[var(--line-2)]">
        <div className="text-xs font-medium tracking-widest uppercase text-[var(--ink-3)] mb-3">Demo interactions</div>
        <div className="flex flex-wrap gap-3">
          <Button variant="soft" onClick={addStamp}>Earn a stamp</Button>
          <Button variant="soft" onClick={() => spendBucks(75)}>Spend 75 BB (size upgrade)</Button>
          <Button variant="soft" onClick={() => spendBucks(50)}>Spend 50 BB (topping)</Button>
        </div>
      </div>
    </div>
  );
}
