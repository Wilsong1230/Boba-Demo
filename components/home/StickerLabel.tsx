// components/home/StickerLabel.tsx
interface StickerLabelProps {
  children: React.ReactNode;
  variant?: 'default' | 'mint' | 'lav' | 'coral';
  rotate?: number;
  style?: React.CSSProperties;
}

export default function StickerLabel({ children, variant = 'default', rotate = -3, style }: StickerLabelProps) {
  const variantClass: Record<string, string> = {
    default: 'sticker',
    mint:    'sticker sticker-mint',
    lav:     'sticker sticker-lav',
    coral:   'sticker sticker-coral',
  };
  return (
    <div className={variantClass[variant]} style={{ position: 'absolute', transform: `rotate(${rotate}deg)`, ...style }}>
      {children}
    </div>
  );
}
