// components/ui/ActivityRow.tsx
import type { ActivityItem } from '@/lib/data/rewards';

const colorMap: Record<string, string> = {
  'coral-deep': 'var(--coral-deep)',
  'sun':        'var(--sun)',
  'ink-3':      'var(--ink-3)',
  'mint-deep':  'var(--mint-deep)',
};

export default function ActivityRow({ item }: { item: ActivityItem }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[var(--line)]">
      <div className="w-9 h-9 rounded-full bg-[var(--bg-2)] flex items-center justify-center text-base flex-shrink-0">
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{item.title}</div>
        <div className="text-xs text-[var(--ink-3)]">{item.sub}</div>
      </div>
      <span className="tabular-nums font-bold text-sm" style={{ color: colorMap[item.color] }}>
        {item.value}
      </span>
    </div>
  );
}
