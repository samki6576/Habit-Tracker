import React, { useState, createContext, useContext } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from "@/components/auth-provider"
import { GrayscaleProvider } from "@/components/grayscale-provider"
import './globals.css';
import BackgroundWrapper from "./BackgroundWrapper";

const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your daily habits and build consistency",
  generator: 'Samra',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
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
            <GrayscaleProvider>
              <BackgroundWrapper>
                {children}
              </BackgroundWrapper>
            </GrayscaleProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
