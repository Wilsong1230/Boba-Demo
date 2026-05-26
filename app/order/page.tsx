// app/order/page.tsx
'use client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useOrder } from '@/lib/store/OrderContext';
import StepperProgress from '@/components/order/StepperProgress';
import StepDrink from '@/components/order/steps/StepDrink';
import StepSize from '@/components/order/steps/StepSize';
import StepCustomize from '@/components/order/steps/StepCustomize';
import StepReview from '@/components/order/steps/StepReview';
import DrinkPreview from '@/components/order/DrinkPreview';
import PageTransition from '@/components/PageTransition';

const STEP_COMPONENTS = [StepDrink, StepSize, StepCustomize, StepReview];

export default function OrderPage() {
  const { step } = useOrder();
  const reduced = useReducedMotion();
  const StepComp = STEP_COMPONENTS[step];

  return (
    <PageTransition>
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
