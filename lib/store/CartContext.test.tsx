// lib/store/CartContext.test.tsx
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  it('starts with empty items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
  });

  it('addItem adds an item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({
        drinkId: 'taro-cloud', name: 'Taro Cloud', color: 'lav',
        size: 'M · 16oz', base: 'Oat Milk', toppings: ['pearls'],
        sweetness: 50, ice: 'Regular Ice', qty: 1, price: 7.25,
      });
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Taro Cloud');
  });

  it('removeItem removes by index', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({
        drinkId: 'taro-cloud', name: 'Taro Cloud', color: 'lav',
        size: 'M · 16oz', base: 'Oat Milk', toppings: [], sweetness: 50,
        ice: 'Regular Ice', qty: 1, price: 7.25,
      });
    });
    act(() => result.current.removeItem(0));
    expect(result.current.items).toHaveLength(0);
  });

  it('clearCart empties items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({
        drinkId: 'taro-cloud', name: 'Taro Cloud', color: 'lav',
        size: 'M · 16oz', base: 'Oat Milk', toppings: [], sweetness: 50,
        ice: 'Regular Ice', qty: 1, price: 7.25,
      });
    });
    act(() => result.current.clearCart());
    expect(result.current.items).toHaveLength(0);
  });
});
