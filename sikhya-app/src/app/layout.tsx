import type { Metadata, Viewport } from 'next';
import { Inter, Sora, JetBrains_Mono, Noto_Sans_Gurmukhi, Noto_Sans_Devanagari } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from '@/components/providers';
import { ServiceWorkerRegistrar } from '@/components/sw-registrar';
import './globals.css';

const inter   = Inter({         subsets: ['latin'], variable: '--font-inter',   display: 'swap' });
const sora    = Sora({          subsets: ['latin'], variable: '--font-sora',    display: 'swap', weight: ['400','500','600','700','800'] });
const jbmono  = JetBrains_Mono({subsets: ['latin'], variable: '--font-jb-mono', display: 'swap' });
const gurmukhi = Noto_Sans_Gurmukhi({ subsets: ['gurmukhi'],   variable: '--font-gurmukhi',   display: 'swap', weight: ['400','500','600','700'] });
const devanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-devanagari', display: 'swap', weight: ['400','500','600','700'] });

export const metadata: Metadata = {
  title:       'Sikhya — Learning without limits',
  description: 'Free AI teacher for Class 6–12 students. English, Hindi, Punjabi.',
  manifest:    '/manifest.json',
  icons: {
    icon:       [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut:   '/icon.svg',
    apple:      '/icon.svg',
  },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Sikhya' },
};

export const viewport: Viewport = {
  themeColor: '#b46707',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable} ${jbmono.variable} ${gurmukhi.variable} ${devanagari.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>{children}</Providers>
          <ServiceWorkerRegistrar />
        </ThemeProvider>
      </body>
    </html>
  );
}
