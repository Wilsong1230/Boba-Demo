// components/ui/Cup.test.tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Cup from './Cup';

describe('Cup', () => {
  it('renders without toppings (backward compat)', () => {
    const { container } = render(<Cup color="coral" size="md" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with pearls topping', () => {
    const { container } = render(<Cup color="mint" size="lg" toppings={['pearls']} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with cream topping (foam layer)', () => {
    const { container } = render(<Cup color="lav" size="md" toppings={['cream']} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with empty toppings array (no pearls)', () => {
    const { container } = render(<Cup color="sun" size="sm" toppings={[]} />);
    expect(container.firstChild).toBeTruthy();
  });
});
