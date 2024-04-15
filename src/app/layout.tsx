import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navigation/navbar";
import Footer from "./components/footer/footer";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./providers";
import firebaseConfig from "./config/firebasecfg";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const inter = Inter({ subsets: ["latin"] });

// Firebase Config
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

export const metadata: Metadata = {
  title: "How Are You?",
  description: "A mental health app for students by students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("relative h-full font-sans antialiased", inter.className)}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <main className="relative flex min-h-screen flex-col">
              <Analytics />
              <SpeedInsights />
              <Navbar />
              {children}
              <Footer />
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
