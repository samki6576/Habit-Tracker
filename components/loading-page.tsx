"use client"

import { Loader2 } from "lucide-react"

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = "Loading..." }: LoadingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Animated GIF-like loading animation */}
      <div className="relative mb-6">
        <div className="w-24 h-24 border-4 border- black-200 dark:border- black-800 border-t- black-600 dark:border-t- black-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t- black-400 dark:border-t- black-300 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
        <div className="absolute inset-2 w-20 h-20 border-4 border-transparent border-t- black-300 dark:border-t- black-200 rounded-full animate-spin" style={{ animationDelay: '-1s' }}></div>
      </div>
      
      {/* Loading text with pulse animation */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 animate-pulse text-shadow">
          Habit Tracker
        </h2>
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">
          {message}
        </p>
      </div>
      
      {/* Dots animation */}
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg- black-600 dark:bg- black-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg- black-600 dark:bg- black-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg- black-600 dark:bg- black-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
} 