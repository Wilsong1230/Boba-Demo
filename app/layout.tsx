// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/store/CartContext';
import { OrderProvider } from '@/lib/store/OrderContext';
import { RewardsProvider } from '@/lib/store/RewardsContext';
import TopNav from '@/components/nav/TopNav';
import TabBar from '@/components/nav/TabBar';

export const metadata: Metadata = {
  title: 'Boba Bay',
  description: 'Craft boba tea · 3 SF locations · fresh pearls daily',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <OrderProvider>
            <RewardsProvider>
              <TopNav />
              <main className="min-h-screen pb-24 md:pb-0">
                {children}
              </main>
              <TabBar />
            </RewardsProvider>
          </OrderProvider>
        </CartProvider>
      </body>
    </html>
  );
}
