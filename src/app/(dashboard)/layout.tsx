import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
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
    <ToastProvider>
      <div className="flex min-h-screen bg-[oklch(0.985_0.005_265)]">
        <Sidebar profile={safeProfile} />
        <div className="flex flex-1 flex-col md:pl-64">
          <Header profile={safeProfile} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
