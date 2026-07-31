import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md w-full">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">ITER Sync</h1>
          <p className="text-muted-foreground">The best university student platform for academics, community, and marketplace.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg">Login</Button>
          </Link>
          <Link href="/dashboard" className="w-full">
            <Button variant="outline" className="w-full" size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
