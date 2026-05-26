// components/home/MarqueeStrip.tsx
export default function MarqueeStrip() {
  const text = '★  FRESH PEARLS DAILY  ✦  2× BEAN BUCKS THIS WEEK  ♡  NEW SPRING DROPS  ✦  3 SF LOCATIONS  ★  ';
  return (
    <div className="overflow-hidden bg-[var(--ink)] text-[var(--sun)] py-2" style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' }}>
      <div className="marquee-track flex gap-16 whitespace-nowrap" style={{ width: 'max-content' }}>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
