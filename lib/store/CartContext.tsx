'use client';
import React, { createContext, useContext, useReducer } from 'react';
import type { DrinkColor } from '../data/drinks';

export interface CartItem {
  drinkId: string;
  name: string;
  color: DrinkColor;
  size: string;
  base: string;
  toppings: string[];
  sweetness: number;
  ice: string;
  qty: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  pickupTime: string;
  pickupLocation: string;
}

type Action =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; index: number }
  | { type: 'UPDATE_QTY'; index: number; qty: number }
  | { type: 'SET_PICKUP_TIME'; time: string }
  | { type: 'SET_PICKUP_LOCATION'; location: string }
  | { type: 'CLEAR' };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((_, i) => i !== action.index) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((it, i) =>
          i === action.index ? { ...it, qty: Math.max(1, action.qty) } : it
        ),
      };
    case 'SET_PICKUP_TIME':
      return { ...state, pickupTime: action.time };
    case 'SET_PICKUP_LOCATION':
      return { ...state, pickupLocation: action.location };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

const initial: CartState = { items: [], pickupTime: 'ASAP', pickupLocation: 'Mission Street' };

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  setPickupTime: (time: string) => void;
  setPickupLocation: (location: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const value: CartContextValue = {
    ...state,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (index) => dispatch({ type: 'REMOVE_ITEM', index }),
    updateQty: (index, qty) => dispatch({ type: 'UPDATE_QTY', index, qty }),
    setPickupTime: (time) => dispatch({ type: 'SET_PICKUP_TIME', time }),
    setPickupLocation: (location) => dispatch({ type: 'SET_PICKUP_LOCATION', location }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    totalItems: state.items.reduce((sum, it) => sum + it.qty, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
