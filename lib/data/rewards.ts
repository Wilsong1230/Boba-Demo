// lib/data/rewards.ts
export interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  sub: string;
  value: string;
  color: 'coral-deep' | 'sun' | 'ink-3' | 'mint-deep';
}

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', icon: '☕', title: 'Taro Cloud + mochi',          sub: 'Mission · 2 hours ago',       value: '+11 BB · 1 stamp', color: 'coral-deep' },
  { id: '2', icon: '✨', title: 'Weekend 2× bonus applied',    sub: 'Yesterday',                   value: '+6 BB',            color: 'sun' },
  { id: '3', icon: '🎁', title: 'Redeemed: free size upgrade', sub: 'Hayes Valley · 3 days ago',   value: '−75 BB',           color: 'ink-3' },
  { id: '4', icon: '☕', title: 'Strawberry Matcha',           sub: 'Mission · 5 days ago',        value: '+8 BB · 1 stamp',  color: 'coral-deep' },
  { id: '5', icon: '🤍', title: 'Birthday gift drink unlocked',sub: 'April 4',                     value: 'GIFT',             color: 'mint-deep' },
];

export const MOCK_QUESTS = [
  { id: 'matcha', title: 'Try a matcha drink this week', reward: '50 BB + double stamp', progress: 0, goal: 1, expires: 'Sunday', color: 'mint' as const },
  { id: 'refer',  title: 'Refer a friend',               reward: 'Both get 50 BB',       progress: 0, goal: 1, expires: null,     color: 'lav' as const },
];
