'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const supabase = createClient();
    
    // Auth Signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      showToast({
        type: 'error',
        title: 'Signup Failed',
        message: authError.message,
      });
      setLoading(false);
      return;
    }

    // Insert into profiles if trigger didn't catch it / manually handled here if desired,
    // though Supabase can use an auth.users trigger to sync the public.profiles table.
    // For now we assume the DB trigger handles profile generation as requested.

    showToast({
      type: 'success',
      title: 'Account created!',
      message: 'Welcome to SwiftSpace.',
    });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-[oklch(0.16_0.015_270)]">
          Create an account
        </h1>
        <p className="text-[oklch(0.50_0.01_265)]">
          Enter your details below to create your account
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          name="fullName"
          label="Full Name"
          placeholder="Jane Doe"
          leftIcon={<User className="w-4 h-4" />}
          required
        />
        <Input
          name="email"
          type="email"
          label="Email address"
          placeholder="name@university.edu"
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          leftIcon={<Lock className="w-4 h-4" />}
          required
          hint="Must be at least 6 characters long."
        />

        <Button type="submit" className="mt-2 w-full" loading={loading} size="lg">
          Sign up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[oklch(0.50_0.01_265)]">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[oklch(0.58_0.25_285)] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
