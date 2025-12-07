// Jirai - Root Layout
// Main app layout with metadata and providers

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Jirai - AI-Powered Mind Map & Workflow",
  description: "Transform your ideas into visual mind maps and workflows with AI. Analyze, plan, and organize with node-based visualization.",
  keywords: ["mind map", "workflow", "AI", "productivity", "planning", "visualization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
