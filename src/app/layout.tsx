import "@/styles/globals.css";
import "@fontsource/oxanium/700.css";
import { type Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import Toast from "@/components/Toast";
import MetaTags from "@/components/MetaTags";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://monday.xyz'),
  title: "Monday.xyz - Premium Crypto Domain & Trading Platform",
  description: "Trade, convert, and stay updated with crypto prices on Monday.xyz. Premium domain for sale featuring real-time cryptocurrency tracking and conversion tools.",
  keywords: "crypto domain for sale, buy crypto domain, cryptocurrency trading platform, real-time crypto prices, crypto converter, Monday.xyz",
  openGraph: {
    title: 'Monday.xyz - Premium Crypto Domain & Trading Platform',
    description: 'Trade, convert, and stay updated with crypto prices. Premium domain featuring real-time cryptocurrency tracking.',
    url: 'https://monday.xyz',
    siteName: 'Monday.xyz',
    images: [{
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
      alt: 'Monday.xyz - Premium Crypto Domain & Trading Platform'
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
            <MetaTags />
            <Toast />
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>;
}
