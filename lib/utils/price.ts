// lib/utils/price.ts
export function fmt(n: number): string {
  return n.toFixed(2);
}

export function calcTotal(items: { price: number; qty: number }[]): number {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}
