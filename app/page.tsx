// app/page.tsx (temporary smoke test)
import Cup from '@/components/ui/Cup';
export default function Home() {
  return (
    <div className="p-8 flex gap-4">
      <Cup color="coral" size="lg" />
      <Cup color="mint" size="md" />
      <Cup color="lav" size="sm" />
    </div>
  );
}
