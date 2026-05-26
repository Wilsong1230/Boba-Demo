// lib/store/OrderContext.test.tsx
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { OrderProvider, useOrder } from './OrderContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <OrderProvider>{children}</OrderProvider>
);

describe('OrderContext', () => {
  it('starts at step 0', () => {
    const { result } = renderHook(() => useOrder(), { wrapper });
    expect(result.current.step).toBe(0);
  });

  it('setStep updates step', () => {
    const { result } = renderHook(() => useOrder(), { wrapper });
    act(() => result.current.setStep(2));
    expect(result.current.step).toBe(2);
  });

  it('updateCurrent merges fields', () => {
    const { result } = renderHook(() => useOrder(), { wrapper });
    act(() => result.current.updateCurrent({ drinkId: 'taro-cloud', size: 'M · 16oz' }));
    expect(result.current.current.drinkId).toBe('taro-cloud');
    expect(result.current.current.size).toBe('M · 16oz');
  });
});
