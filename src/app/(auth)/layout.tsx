import { ToastProvider } from '@/components/ui/toast';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex w-full">
        <div className="flex flex-col justify-center items-center flex-1 p-8 bg-white">
          {children}
        </div>
        <div className="hidden lg:flex flex-1 gradient-hero justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://patterns.dev/img/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="z-10 text-center text-white max-w-lg px-8">
            <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-white/20 glass flex items-center justify-center text-3xl font-bold">
              S
            </div>
            <h1 className="text-4xl font-bold mb-4">SwiftSpace</h1>
            <p className="text-lg opacity-90">
              The smartest way to book campus resources. Find classrooms, labs, and studios instantly.
            </p>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
