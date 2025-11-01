import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth-provider";
import { GrayscaleProvider } from "@/components/grayscale-provider";
import "./globals.css";
import BackgroundWrapper from "./BackgroundWrapper";
import RegisterServiceWorker from "./registerServiceWorker"; // 👈 add this

// ✅ App metadata
export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your daily habits and build consistency",
  generator: "Samra",
  icons: {
    icon: [
      { url: "/placeholder.png", sizes: "32x32" },
      { url: "/placeholder.png", type: "image/png", sizes: "192x192" },
      { url: "/placeholder.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/placeholder.png", type: "image/png", sizes: "180x180" }],
  },
};

// ✅ Viewport (Next.js 15 requirement)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 👇 Required for installable PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00bfa6" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <GrayscaleProvider>
              <BackgroundWrapper>{children}</BackgroundWrapper>
            </GrayscaleProvider>
          </AuthProvider>
        </ThemeProvider>

        {/* 👇 Register PWA service worker */}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
