import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'gist.design — Design decisions readable by AI coding tools',
  description:
    'A structured file that makes your design decisions, product positioning, and interaction rationale readable to AI coding tools.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
