'use client';
 
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);
 
  // Custom message for likely Vercel configuration errors
  const isVercelConfigError = error.message.includes('supabaseUrl is required') || error.message.includes('failed to fetch');

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[oklch(0.985_0.005_265)] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl border border-[oklch(0.93_0.003_265)] animate-fade-in">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[oklch(0.95_0.04_25)]">
          <AlertCircle className="h-8 w-8 text-[oklch(0.58_0.22_25)]" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-[oklch(0.16_0.015_270)]">
          {isVercelConfigError ? 'Configuration Missing' : 'Something went wrong!'}
        </h2>
        <p className="mb-6 text-[oklch(0.50_0.01_265)]">
          {isVercelConfigError 
            ? "Your application is successfully deployed, but it appears your Supabase Vercel Environment Variables haven't been added yet."
            : error.message || "An unexpected issue crashed the page."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} variant="primary">
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
