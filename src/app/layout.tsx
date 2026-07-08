import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MBG Distribution Management System",
  description: "Sistem manajemen distribusi Makan Bergizi Gratis (MBG)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased text-slate-800`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
