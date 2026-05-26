// components/nav/TabBar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/store/CartContext';

const items = [
  { href: '/',        icon: '⌂', label: 'Home' },
  { href: '/menu',    icon: '◍', label: 'Menu' },
  { href: '/order',   icon: '+', label: 'Order', center: true },
  { href: '/rewards', icon: '☆', label: 'Rewards' },
  { href: '/cart',    icon: '🛍', label: 'Cart' },
];

export default function TabBar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white rounded-3xl flex justify-around items-center py-2 px-1 z-50"
         style={{ boxShadow: 'var(--sh-3)' }}>
      {items.map(({ href, icon, label, center }) => {
        const active = pathname === href;
        if (center) {
          return (
            <Link key={href} href={href}
              className="w-12 h-12 rounded-full bg-[var(--coral)] text-white grid place-items-center text-2xl -mt-4"
              style={{ boxShadow: '0 6px 14px rgba(229,95,43,0.4)' }}>
              {icon}
            </Link>
          );
        }
        return (
          <Link key={href} href={href}
            className={`flex flex-col items-center gap-0.5 text-[9px] font-medium relative ${active ? 'text-[var(--coral)]' : 'text-[var(--ink-3)]'}`}>
            <span className="text-lg leading-none">{icon}</span>
            {label}
            {href === '/cart' && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--coral)] text-white text-[8px] font-bold grid place-items-center">
                {totalItems}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
