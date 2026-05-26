import { describe, it, expect } from 'vitest';
import { getTimeSlots, getReadyTime } from './time';

describe('getTimeSlots', () => {
  it('returns 5 slots', () => {
    const slots = getTimeSlots(new Date('2024-01-15T14:00:00'));
    expect(slots).toHaveLength(5);
  });

  it('ASAP slot is +6 minutes', () => {
    const now = new Date('2024-01-15T14:00:00');
    const slots = getTimeSlots(now);
    expect(slots[0].label).toBe('ASAP');
    expect(slots[0].clockTime).toBe('2:06 pm');
    expect(slots[0].disabled).toBe(false);
  });

  it('1hr slot is +60 minutes', () => {
    const now = new Date('2024-01-15T14:00:00');
    const slots = getTimeSlots(now);
    expect(slots[4].label).toBe('1 hr');
    expect(slots[4].clockTime).toBe('3:00 pm');
  });

  it('disables slots at or after 9pm', () => {
    // 8:45pm — ASAP (8:51) enabled, 15min (9:00pm) disabled
    const now = new Date('2024-01-15T20:45:00');
    const slots = getTimeSlots(now);
    expect(slots[0].disabled).toBe(false); // 8:51pm ok
    expect(slots[1].disabled).toBe(true);  // 9:00pm closed
  });

  it('handles noon crossover correctly', () => {
    const now = new Date('2024-01-15T11:55:00'); // 11:55am
    const slots = getTimeSlots(now);
    expect(slots[0].clockTime).toBe('12:01 pm');
  });

  it('disables slots that cross midnight', () => {
    const now = new Date('2024-01-15T23:30:00'); // 11:30pm
    const slots = getTimeSlots(now);
    expect(slots[4].disabled).toBe(true); // 1hr slot = 12:30am, store closed
  });
});

describe('getReadyTime', () => {
  it('returns now + 6 min formatted as 12h', () => {
    const now = new Date('2024-01-15T16:19:00');
    expect(getReadyTime(now)).toBe('4:25 pm');
  });

  it('handles midnight crossover', () => {
    const now = new Date('2024-01-15T23:56:00');
    expect(getReadyTime(now)).toBe('12:02 am');
  });
});
