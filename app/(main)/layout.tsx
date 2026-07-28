import Link from 'next/link';
import { Home, BookOpen, Users, ShoppingBag, Bot, Map, User, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Academics', href: '/academics', icon: BookOpen },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Bot },
  { name: 'Campus', href: '/campus', icon: Map },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r bg-card p-6 flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight mb-8">ITER Sync</h1>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
