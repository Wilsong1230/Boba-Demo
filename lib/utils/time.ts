export interface TimeSlot {
  label: string;
  clockTime: string;
  disabled: boolean;
}

const OPEN_HOUR = 9;   // 9am
const CLOSE_HOUR = 21; // 9pm

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function fmt12(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 || 12;
  const mm = String(m).padStart(2, '0');
  return `${h12}:${mm} ${ampm}`;
}

function isAfterClose(date: Date): boolean {
  const h = date.getHours();
  return h >= CLOSE_HOUR || h < OPEN_HOUR;
}

const SLOT_OFFSETS = [
  { label: 'ASAP',   minutes: 6 },
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '1 hr',   minutes: 60 },
];

export function getTimeSlots(now = new Date()): TimeSlot[] {
  return SLOT_OFFSETS.map(({ label, minutes }) => {
    const ready = addMinutes(now, minutes);
    return { label, clockTime: fmt12(ready), disabled: isAfterClose(ready) };
  });
}

export function getReadyTime(now = new Date()): string {
  return fmt12(addMinutes(now, 6));
}
