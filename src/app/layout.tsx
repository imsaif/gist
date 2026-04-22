import type { Metadata } from 'next';
import './globals.css';

const baseUrl = 'https://www.gist.design';

export const metadata: Metadata = {
  title: {
    default: 'gistaudit — See how AI describes your product',
    template: '%s | gistaudit',
  },
  description:
    'Audit what ChatGPT, Claude, and Perplexity say about your product. Fix the gaps. Track drift over time.',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'gistaudit — See how AI describes your product',
    description:
      'Audit what ChatGPT, Claude, and Perplexity say about your product. Fix the gaps. Track drift over time.',
    url: baseUrl,
    siteName: 'gistaudit',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'gistaudit — See how AI describes your product',
    description:
      'Audit what ChatGPT, Claude, and Perplexity say about your product. Fix the gaps. Track drift over time.',
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
