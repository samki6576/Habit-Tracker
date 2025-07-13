"use client"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

const images = [
"https://images.unsplash.com/photo-1750173588233-8cd7ba259c15?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

"https://images.unsplash.com/photo-1717932827502-63ae767e146d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFsY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D",
"https://images.unsplash.com/photo-1689949669147-afce01cef61d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmFsY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D",
"https://images.unsplash.com/photo-1599033512590-62e7a7789715?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",



]

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const [bg, setBg] = useState(images[0])
  const { theme } = useTheme()

  useEffect(() => {
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

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
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