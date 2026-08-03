import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const satoshi = localFont({
  src: [
    { path: '../../public/fonts/satoshi-300.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/satoshi-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/satoshi-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/satoshi-700.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/satoshi-900.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
});

const baseUrl = 'https://llmsgist.org';

export const metadata: Metadata = {
  title: 'llms.gist: product context your coding agent actually reads',
  description:
    'Audit how AI tools describe your product, write an llms.gist spec, and wire it into the config files your coding agent loads.',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'llms.gist: product context your coding agent actually reads',
    description:
      'Audit how AI tools describe your product, write an llms.gist spec, and wire it into the config files your coding agent loads.',
    url: baseUrl,
    siteName: 'llms.gist',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'llms.gist: product context your coding agent actually reads',
    description:
      'Audit how AI tools describe your product, write an llms.gist spec, and wire it into the config files your coding agent loads.',
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
    <html lang="en" className={satoshi.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
