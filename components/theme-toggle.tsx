"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-10 h-10">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 transition-all duration-300 hover:scale-110 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-all duration-300 rotate-0" />
      ) : (
        <Moon className="h-4 w-4 transition-all duration-300 rotate-0" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 