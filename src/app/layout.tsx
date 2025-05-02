// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import LandingAlertManager from "@/components/LandingAlertManager";
import LandingDebugPanel from "@/components/LandingDebugPanel";
import { LANDING_DEBUG_MODE } from "@/constants/polling";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FLYBY SPOTTER",
  description: "FLYBY SPOTTER BANNER-V3 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          {/* Always mount LandingAlertManager regardless of route or auth state */}
          <LandingAlertManager />
          {/* Debug panel will only be shown if debug mode is enabled */}
          {LANDING_DEBUG_MODE && <LandingDebugPanel />}
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
