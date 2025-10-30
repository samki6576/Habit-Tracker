import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth-provider";
import { GrayscaleProvider } from "@/components/grayscale-provider";
import "./globals.css";
import BackgroundWrapper from "./BackgroundWrapper";
import RegisterServiceWorker from "./registerServiceWorker"; // 👈 add this

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your daily habits and build consistency",
  generator: "Samra",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  icons: {
    icon: [
      { url: "/placeholder.png", sizes: "32x32" },
      { url: "/placeholder.png", type: "image/png", sizes: "192x192" },
      { url: "/placeholder.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/placeholder.png", type: "image/png", sizes: "180x180" },
    ],
  },
};

