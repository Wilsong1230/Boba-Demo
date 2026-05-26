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

  // toppings undefined → classic look (dark pearls always shown, backward compat)
  // toppings [] → no pearls shown
  // toppings with entries → colored pearls (and optional foam for cream)
  const showFoam  = toppings?.includes('cream') ?? false;
  const hasDots   = toppings === undefined || (toppings.length > 0 && toppings.some(t => t !== 'cream'));
  const dotColor  = toppings === undefined
    ? 'var(--ink)'
    : getPearlColor(toppings.filter(t => t !== 'cream'));

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
