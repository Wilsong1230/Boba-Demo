// components/nav/TopNav.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/store/CartContext';

const links = [
  { href: '/',        label: 'Home' },
  { href: '/menu',    label: 'Menu' },
  { href: '/order',   label: 'Order' },
  { href: '/rewards', label: 'Rewards' },
];

export default function TopNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white/60 backdrop-blur-md border-b border-[var(--line)] sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-3 font-display text-2xl text-[var(--ink)]">
        <span style={{ fontSize: 28 }}>☕</span>
        boba bay
      </Link>
      <div className="hidden md:flex gap-8">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              pathname === href
                ? 'text-[var(--ink)] border-[var(--coral)]'
                : 'text-[var(--ink-3)] border-transparent hover:text-[var(--ink)]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
      <Link href="/cart" className="relative">
        <span className="text-2xl">🛍</span>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--coral)] text-white text-[10px] font-bold grid place-items-center">
            {totalItems}
          </span>
        )}
      </Link>
    </nav>
  );
}
