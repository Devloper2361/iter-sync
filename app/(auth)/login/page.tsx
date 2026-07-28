"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { userService } from '@/services/user.service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: 'password123',
    },
  });

  useEffect(() => {
    if (isClient && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isClient, isAuthenticated, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setError('');
    
    try {
      const user = await userService.authenticateUser(data.email);
      login(user);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Try student@iter.edu');
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg border">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Enter your credentials to access ITER Sync</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="student@iter.edu"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          <p>Demo accounts:</p>
          <p>student@iter.edu | faculty@iter.edu | admin@iter.edu</p>
        </div>
      </div>
    </div>
  );
}
