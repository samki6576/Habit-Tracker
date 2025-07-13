import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from "@/components/auth-provider"
import { BackgroundWrapper } from "@/components/background-wrapper"
import './globals.css';

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your daily habits and build consistency",
  generator: 'Samra',
  icons: {
    icon: [
      { url: '/placeholder.svg', type: 'image/svg+xml' },
      { url: '/placeholder.png' },
    ],
    apple: [
      { url: '/placeholder.png', type: 'image/svg+xml' },
    ],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <BackgroundWrapper>
              {children}
            </BackgroundWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
