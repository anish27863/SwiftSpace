import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SwiftSpace — Campus Resource Optimizer',
    template: '%s | SwiftSpace',
  },
  description:
    'Book classrooms, labs, and studios on campus instantly. Real-time availability, smart scheduling, and seamless management.',
  keywords: ['campus', 'booking', 'classroom', 'lab', 'studio', 'resource management'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'SwiftSpace',
    title: 'SwiftSpace — Campus Resource Optimizer',
    description: 'Book campus resources instantly with real-time availability.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
