import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navigation/navbar";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
