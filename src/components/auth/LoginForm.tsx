'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: error.message,
      });
      setLoading(false);
      return;
    }

    showToast({
      type: 'success',
      title: 'Welcome back!',
    });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-[oklch(0.16_0.015_270)]">
          Welcome back
        </h1>
        <p className="text-[oklch(0.50_0.01_265)]">
          Enter your email to sign in to your account
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          name="email"
          type="email"
          label="Email address"
          placeholder="name@university.edu"
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />
        <div className="flex flex-col gap-1.5">
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />
          <Link
            href="/forgot-password"
            className="self-end text-xs font-medium text-[oklch(0.58_0.25_285)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="mt-2 w-full" loading={loading} size="lg">
          Sign In
        </Button>
      </form>

      <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[oklch(0.93_0.003_265)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-[oklch(0.60_0.01_265)]">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <p className="text-sm text-[oklch(0.50_0.01_265)]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-[oklch(0.58_0.25_285)] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
