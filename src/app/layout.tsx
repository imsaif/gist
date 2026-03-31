import type { Metadata } from 'next';
import './globals.css';

const baseUrl = 'https://www.gist.design';

export const metadata: Metadata = {
  title: {
    default: 'gist.design — Design decisions readable by AI coding tools and LLMs',
    template: '%s | gist.design',
  },
  description:
    'A structured file that makes your design decisions, product positioning, and interaction rationale readable to AI coding tools and LLMs.',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'gist.design — Design decisions readable by AI coding tools',
    description:
      'A structured file that makes your design decisions, product positioning, and interaction rationale readable to AI coding tools and LLMs.',
    url: baseUrl,
    siteName: 'gist.design',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'gist.design — Design decisions readable by AI coding tools',
    description:
      'A structured file that makes your design decisions, product positioning, and interaction rationale readable to AI coding tools and LLMs.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
