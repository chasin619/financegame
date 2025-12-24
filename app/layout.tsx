import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Financial Wisdom Quiz',
  description: 'Test your money smarts with real-world scenarios',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}