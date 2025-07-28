"use client"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

const images = [
  "https://images.unsplash.com/photo-1750173588233-8cd7ba259c15",
  "https://images.unsplash.com/photo-1717932827502-63ae767e146d",
  "https://images.unsplash.com/photo-1689949669147-afce01cef61d",
  "https://images.unsplash.com/photo-1599033512590-62e7a7789715",
  "https://images.unsplash.com/photo-1682687220363-35e4621ed990 ",
  "https://images.unsplash.com/photo-1735657090736-0c8484323c90",
  "https://images.unsplash.com/photo-1753347135400-37c139c6e3cc",
  "https://images.unsplash.com/photo-1750665645109-6b2b84bf5abd",
  "https://images.unsplash.com/photo-1752658801043-bb7ee69073f7",
  "https://images.unsplash.com/photo-1752035381246-4ebf0c0fffea",
]

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const [bg, setBg] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
    setBg(images[Math.floor(Math.random() * images.length)])
    const interval = setInterval(() => {
      setBg(images[Math.floor(Math.random() * images.length)])
    }, 20000)
    return () => clearInterval(interval)
  }, [])

  // Choose overlay color based on theme
  const overlayStyle =
    theme === "dark"
      ? "rgba(30, 30, 30, 0.7)"   // light black for dark mode
      : "rgba(255, 255, 255, 0.7)" // light white for light mode

  // Only render background image after mount to avoid hydration mismatch
  return (
    <div
      style={{
        backgroundImage: mounted && bg ? `url(${bg})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        minWidth: "100vw",
        width: "100vw",
        height: "100vh",
        position: "fixed", // <-- makes the background fixed to the viewport
        top: 0,
        left: 0,
        zIndex: -1, // <-- ensures the background stays behind your content
        overflow: "auto",
      }}
    >
      <div
        style={{
          background: overlayStyle,
          borderRadius: "16px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
          padding: "2rem",
          minHeight: "80vh",
          marginTop: "3vh",
          marginBottom: "3vh",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  )
}