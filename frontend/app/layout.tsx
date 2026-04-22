import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Opportunity Inbox Copilot",
  description: "AI-powered email ranking for students — SOFTEC'26",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-[#0A0F1E] text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
