import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FakBok - ฝากบอก",
  description: "แอปพลิเคชันโซเชียลมีเดียสไตล์ TikTok สำหรับนักเรียน",
  keywords: ["โซเชียลมีเดีย", "นักเรียน", "โพสต์", "แชร์", "คอมเม้น"],
  authors: [{ name: "FakBok Team" }],
  creator: "FakBok",
  publisher: "FakBok",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fakbok.vercel.app/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "FakBok - ฝากบอก",
    description: "แอปพลิเคชันโซเชียลมีเดียสไตล์ TikTok สำหรับนักเรียน",
    url: 'https://fakbok.vercel.app',
    siteName: 'FakBok',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'FakBok - ฝากบอก',
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "FakBok - ฝากบอก",
    description: "แอปพลิเคชันโซเชียลมีเดียสไตล์ TikTok สำหรับนักเรียน",
    images: ['/favicon.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#6366f1' },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
