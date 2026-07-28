"use client"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push('/login');
    }
  }, [isClient, isAuthenticated, router, pathname]);

  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p>Loading...</p></div>;
  }

  if (!isAuthenticated || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p>Redirecting...</p></div>;
  }

  return <>{children}</>;
}
