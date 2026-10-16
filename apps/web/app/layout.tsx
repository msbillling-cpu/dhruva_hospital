import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Dhruva Hospitals – Excellence in Every Specialty | Kadapa',
    template: '%s | Dhruva Hospitals Kadapa',
  },
  description:
    'Dhruva Hospitals in Kadapa offers world-class Infertility, IVF, Gynaecology, Pregnancy, NICU & Paediatric care. 24/7 Emergency. Book appointment today.',
  keywords: [
    'Dhruva Hospitals Kadapa',
    'IVF Kadapa',
    'Fertility specialist Kadapa',
    'NICU Kadapa',
    'Gynaecologist Kadapa',
    'Dr Mounika Reddy',
    'Dr Sudarshan Reddy',
    'hospital Kadapa',
  ],
  openGraph: {
    title: 'Dhruva Hospitals – Excellence in Every Specialty',
    description: 'Premier multispecialty hospital in Kadapa. IVF, NICU, Gynaecology, Pregnancy & Paediatric care.',
    type: 'website',
    locale: 'en_IN',
  },
  icons: {
    icon: '/logo.png',
  },
  robots: { index: true, follow: true },
};

import ClientShell from '@/components/ClientShell';
import { SettingsProvider } from '@/context/SettingsContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import CustomToaster from '@/components/CustomToaster';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <SettingsProvider>
          <GoogleAnalytics />
          <LanguageProvider>
            <ClientShell>{children}</ClientShell>
            <CustomToaster />
          </LanguageProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
