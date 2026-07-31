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
    return null;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}
