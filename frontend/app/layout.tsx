import type { Metadata } from "next";
import localFont from "next/font/local";
import { Instrument_Serif, Hanken_Grotesk, Noto_Naskh_Arabic } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";


const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TRENDY AI",
  description: "Arabic-first brand studio for platform-ready visual content",
  icons: {
    icon: '/trendy_logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${arabic.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
