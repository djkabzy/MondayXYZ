import "@/styles/globals.css";
import "@fontsource/oxanium/700.css";
import { type Metadata } from "next";
import { NextSeo } from 'next-seo';
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import Toast from "@/components/Toast";
export const metadata: Metadata = {
  metadataBase: new URL('https://monday.xyz'),
  title: "Buy Monday.xyz – Premium Crypto Domain & Real-Time Trading Platform",
  description: "Premium crypto domain Monday.xyz for sale. Features real-time cryptocurrency price tracking, conversion tools, and market analytics. Make an offer in crypto or fiat.",
  keywords: "crypto domain for sale, buy crypto domain, cryptocurrency trading platform, real-time crypto prices, crypto converter, Monday.xyz",
  openGraph: {
    title: 'Buy Monday.xyz – Premium Crypto Domain & Trading Platform',
    description: 'Premium crypto domain Monday.xyz for sale. Features real-time cryptocurrency price tracking and conversion tools.',
    url: 'https://monday.xyz',
    siteName: 'Monday.xyz',
    images: [{
      url: "https://picsum.photos/200",
      width: 1200,
      height: 630,
      alt: 'Monday.xyz - Premium Crypto Domain'
    }],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Monday.xyz – Premium Crypto Domain',
    description: 'Premium crypto domain Monday.xyz for sale. Real-time crypto tracking platform included.',
    images: ["https://picsum.photos/200"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code'
  },
  icons: [{
    rel: "icon",
    url: "/favicon.ico"
  }, {
    rel: "apple-touch-icon",
    url: "/apple-touch-icon.png"
  }]
};
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <html lang="en">
      <body>
        <ErrorBoundary>
          <ThemeProvider>
            <Toast />
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>;
}
