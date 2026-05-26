'use client';
import React, { createContext, useContext, useState } from 'react';

export interface OrderBuild {
  drinkId: string;
  drinkName: string;
  color: string;
  basePrice: number;
  size: string;
  sizeDelta: number;
  base: string;
  toppings: string[];
  sweetness: number;
  ice: string;
}

const EMPTY_BUILD: OrderBuild = {
  drinkId: '', drinkName: '', color: 'coral', basePrice: 0,
  size: 'M · 16oz', sizeDelta: 0.50, base: 'Oat Milk',
  toppings: [], sweetness: 50, ice: 'Regular Ice',
};

interface OrderContextValue {
  current: OrderBuild;
  step: number;
  setStep: (s: number) => void;
  updateCurrent: (fields: Partial<OrderBuild>) => void;
  resetOrder: () => void;
  totalPrice: number;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<OrderBuild>(EMPTY_BUILD);
  const [step, setStep] = useState(0);

  const value: OrderContextValue = {
    current, step, setStep,
    updateCurrent: (fields) => setCurrent(prev => ({ ...prev, ...fields })),
    resetOrder: () => { setCurrent(EMPTY_BUILD); setStep(0); },
    totalPrice: current.basePrice + current.sizeDelta,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be inside OrderProvider');
  return ctx;
}
