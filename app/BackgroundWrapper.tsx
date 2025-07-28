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
  const [bgIndex, setBgIndex] = useState(0)
  const [prevBgIndex, setPrevBgIndex] = useState(0)
  const [fade, setFade] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
    setBgIndex(Math.floor(Math.random() * images.length))
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setPrevBgIndex(bgIndex)
      setBgIndex((prev) => {
        let next = Math.floor(Math.random() * images.length)
        while (next === prev) next = Math.floor(Math.random() * images.length)
        return next
      })
      setFade(true)
      setTimeout(() => setFade(false), 1000) // 1s fade duration
    }, 20000)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [mounted, bgIndex])

  const overlayStyle =
    theme === "dark"
      ? "rgba(30, 30, 30, 0.7)"
      : "rgba(255, 255, 255, 0.7)"

  return (
    <div style={{
      minHeight: "100vh",
      minWidth: "100vw",
      width: "100vw",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: -1,
      overflow: "auto",
    }}>
      {/* Previous image */}
      <div
        style={{
          backgroundImage: `url(${images[prevBgIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: fade ? 1 : 0,
          transition: "opacity 1s",
        }}
      />
      {/* Current image */}
      <div
        style={{
          backgroundImage: `url(${images[bgIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: fade ? 0 : 1,
          transition: "opacity 1s",
        }}
      />
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
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  )
}