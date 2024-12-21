import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeShare',
  description: 'CodeShare - a platform to share code',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased dark'>{children}</body>
    </html>
  );
}
