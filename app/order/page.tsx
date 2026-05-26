// app/order/page.tsx
'use client';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOrder } from '@/lib/store/OrderContext';
import { DRINKS } from '@/lib/data/drinks';
import StepperProgress from '@/components/order/StepperProgress';
import StepDrink from '@/components/order/steps/StepDrink';
import StepSize from '@/components/order/steps/StepSize';
import StepCustomize from '@/components/order/steps/StepCustomize';
import StepReview from '@/components/order/steps/StepReview';
import DrinkPreview from '@/components/order/DrinkPreview';
import PageTransition from '@/components/PageTransition';

function OrderBootstrap() {
  const searchParams = useSearchParams();
  const { updateCurrent, setStep, resetOrder } = useOrder();

  useEffect(() => {
    const id = searchParams.get('drink');
    if (!id) return;
    const drink = DRINKS.find(d => d.id === id);
    if (!drink) return;
    resetOrder();
    updateCurrent({ drinkId: drink.id, drinkName: drink.name, color: drink.color, basePrice: drink.price });
    setStep(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

const STEP_COMPONENTS = [StepDrink, StepSize, StepCustomize, StepReview];

export default function OrderPage() {
  const { step } = useOrder();
  const reduced = useReducedMotion();
  const StepComp = STEP_COMPONENTS[step];

  return (
    <PageTransition>
      <Suspense fallback={null}>
        <OrderBootstrap />
      </Suspense>
      <div className="max-w-5xl mx-auto px-4 md:px-10 py-8">
        <StepperProgress current={step} />
        <div className="md:grid md:grid-cols-[1fr_280px] md:gap-8">
          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={reduced ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? {} : { opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}>
              <StepComp />
            </motion.div>
          </AnimatePresence>
          <DrinkPreview />
        </div>
      </div>
    </PageTransition>
  );
}
