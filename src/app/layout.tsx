import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gist - Get clarity before you open Figma',
  description: 'A thinking partner for designers. Get the gist before you design.',
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
