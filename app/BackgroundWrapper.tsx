"use client"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

const images = [
  "https://images.unsplash.com/photo-1762882555456-ac0494bf1477?q=80&w=387&auto=format&fit=crop&w=1920&q=80",
   "https://images.unsplash.com/photo-1750173588233-8cd7ba259c15?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1717932827502-63ae767e146d?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1689949669147-afce01cef61d?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1599033512590-62e7a7789715?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1682687220363-35e4621ed990?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1735657090736-0c8484323c90?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1753347135400-37c139c6e3cc?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1750665645109-6b2b84bf5abd?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1752658801043-bb7ee69073f7?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1752035381246-4ebf0c0fffea?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1750173588233-8cd7ba259c15?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1717932827502-63ae767e146d?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1689949669147-afce01cef61d?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1599033512590-62e7a7789715?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1682687220363-35e4621ed990?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1735657090736-0c8484323c90?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1753347135400-37c139c6e3cc?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1750665645109-6b2b84bf5abd?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1752658801043-bb7ee69073f7?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1752035381246-4ebf0c0fffea?auto=format&fit=crop&w=1920&q=80",
]

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState(0)
  const [previous, setPrevious] = useState(0)
  const [fading, setFading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const fadeDuration = 1000 // ms

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    intervalRef.current = setInterval(() => {
      setPrevious(current)
      setFading(true)
      setTimeout(() => {
        let next = Math.floor(Math.random() * images.length)
        while (next === current) next = Math.floor(Math.random() * images.length)
        setCurrent(next)
        setFading(false)
      }, fadeDuration)
    }, 20000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [current, mounted])

  // Preload images
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    images.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [mounted])

  const overlayStyle =
    theme === "dark"
      ? "rgba(30, 30, 30, 0.7)"
      : "rgba(255, 255, 255, 0.7)"

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        backgroundColor: "#111",
      }}
    >
      {/* Previous image (fades out) */}
      <div
        style={{
          backgroundImage: `url(${images[previous]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: fading ? 1 : 0,
          transition: `opacity ${fadeDuration}ms`,
          zIndex: 0,
          backgroundColor: "#111",
        }}
      />
      {/* Current image (fades in) */}
      <div
        style={{
          backgroundImage: `url(${images[current]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: fading ? 0 : 1,
          transition: `opacity ${fadeDuration}ms`,
          zIndex: 1,
          backgroundColor: "#111",
        }}
      />
      {/* Overlay and content */}
      {mounted && (
        <div
          style={{
            background: overlayStyle,
            width: "100%",
            minHeight: "100vh",
            position: "relative",
            zIndex: 2,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}