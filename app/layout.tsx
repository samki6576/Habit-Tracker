import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from "@/components/auth-provider"
import './globals.css';
import BackgroundWrapper from "./BackgroundWrapper";

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your daily habits and build consistency",
    generator: 'Samra'
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
          defaultTheme="light" 
          enableSystem={false}
          disableTransitionOnChange
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
