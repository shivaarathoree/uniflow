import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UNIFLOW – Honest Tracking for Your Daily Flow',
  description:
    'Track habits, chat with your AI Coach Aura, and build real consistency. No noise, no guilt — just your honest daily flow.',
  keywords: 'habit tracker, AI coach, productivity, consistency, daily routine',
  openGraph: {
    title: 'UNIFLOW',
    description: 'Honest tracking for your daily flow',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-yellow-200 selection:text-black">
        {children}
      </body>
    </html>
  );
}
