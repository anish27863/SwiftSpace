'use client';
 
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { User, Mail, Calendar } from 'lucide-react';
 
export function SettingsForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
 
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
 
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
 
    const supabase = createClient();
 
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: profile.id, 
        email: profile.email,
        full_name: fullName, 
        updated_at: new Date().toISOString() 
      });
 
    setLoading(false);
 
    if (error) {
      showToast({
        type: 'error',
        title: 'Error updating profile',
        message: error.message,
      });
      return;
    }
 
    showToast({
      type: 'success',
      title: 'Profile updated!',
      message: 'Your settings have been saved.',
    });
 
    // Refresh the current route and data
    router.refresh();
  }
 
  // Format creation date beautifully
  const joinedDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
 
  return (
    <div className="rounded-2xl border border-[oklch(0.93_0.003_265)] bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 text-xl font-semibold text-[oklch(0.16_0.015_270)]">Profile Information</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <Input
          name="fullName"
          label="Full Name"
          defaultValue={profile.full_name || ''}
          placeholder="Enter your full name"
          leftIcon={<User className="w-4 h-4" />}
          required
        />
        
        <div className="flex flex-col gap-1.5 opacity-60">
          <Input
            name="email"
            label="Email Address (Cannot be changed)"
            defaultValue={profile.email}
            leftIcon={<Mail className="w-4 h-4" />}
            disabled
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-[oklch(0.50_0.01_265)] mt-2">
          <Calendar className="w-4 h-4" />
          <span>Member since {joinedDate}</span>
        </div>
 
        <div className="mt-4 flex justify-end gap-3 border-t border-[oklch(0.93_0.003_265)] pt-6">
          <Button type="submit" loading={loading} variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
