'use client';
import React, { createContext, useContext, useReducer } from 'react';
import { MOCK_ACTIVITY, ActivityItem } from '../data/rewards';

interface RewardsState {
  stamps: number;
  stampGoal: number;
  beanBucks: number;
  bucksGoal: number;
  activity: ActivityItem[];
}

type Action =
  | { type: 'ADD_STAMP' }
  | { type: 'EARN_BUCKS'; amount: number }
  | { type: 'SPEND_BUCKS'; amount: number };

function reducer(state: RewardsState, action: Action): RewardsState {
  switch (action.type) {
    case 'ADD_STAMP':
      return {
        ...state,
        stamps: Math.min(state.stampGoal, state.stamps + 1),
        activity: [
          { id: Date.now().toString(), icon: '☕', title: 'New stamp earned!', sub: 'Just now', value: '+1 stamp', color: 'coral-deep' },
          ...state.activity,
        ],
      };
    case 'EARN_BUCKS':
      return {
        ...state,
        beanBucks: state.beanBucks + action.amount,
        activity: [
          { id: Date.now().toString(), icon: '✨', title: `Earned ${action.amount} Bean Bucks`, sub: 'Just now', value: `+${action.amount} BB`, color: 'coral-deep' },
          ...state.activity,
        ],
      };
    case 'SPEND_BUCKS':
      return {
        ...state,
        beanBucks: Math.max(0, state.beanBucks - action.amount),
        activity: [
          { id: Date.now().toString(), icon: '🎁', title: 'Redeemed reward', sub: 'Just now', value: `−${action.amount} BB`, color: 'ink-3' },
          ...state.activity,
        ],
      };
    default:
      return state;
  }
}

const initial: RewardsState = {
  stamps: 7, stampGoal: 10, beanBucks: 340, bucksGoal: 500, activity: MOCK_ACTIVITY,
};

interface RewardsContextValue extends RewardsState {
  addStamp: () => void;
  earnBucks: (amount: number) => void;
  spendBucks: (amount: number) => void;
}

const RewardsContext = createContext<RewardsContextValue | null>(null);

export function RewardsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const value: RewardsContextValue = {
    ...state,
    addStamp: () => dispatch({ type: 'ADD_STAMP' }),
    earnBucks: (amount) => dispatch({ type: 'EARN_BUCKS', amount }),
    spendBucks: (amount) => dispatch({ type: 'SPEND_BUCKS', amount }),
  };

  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>;
}

export function useRewards() {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error('useRewards must be inside RewardsProvider');
  return ctx;
}
