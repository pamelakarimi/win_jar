import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Win Jar',
  description: 'Log one win a day. Shake the jar on a bad day.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-amber-50 text-stone-800 antialiased">{children}</body>
    </html>
  );
}
