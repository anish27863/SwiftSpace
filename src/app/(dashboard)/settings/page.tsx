import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/dashboard/SettingsForm';
import { Settings } from 'lucide-react';
 
export const metadata = {
  title: 'Settings',
};
 
export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
 
  if (!user) {
    redirect('/login');
  }
 
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const safeProfile = profile || {
    id: user.id,
    email: user.email,
    created_at: user.created_at || new Date().toISOString(),
    full_name: '',
  };
 
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[oklch(0.58_0.25_285)] to-[oklch(0.44_0.24_285)] flex items-center justify-center shadow-lg shadow-[oklch(0.58_0.25_285)]/20">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[oklch(0.16_0.015_270)] tracking-tight">
              Settings
            </h1>
            <p className="text-[oklch(0.50_0.01_265)] text-sm sm:text-base mt-1">
              Manage your profile and account preferences
            </p>
          </div>
        </div>
      </div>
 
      <SettingsForm profile={safeProfile} />
    </div>
  );
}
