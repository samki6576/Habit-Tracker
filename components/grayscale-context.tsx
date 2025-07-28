import React, { createContext, useContext, useState } from "react"

type GrayscaleContextType = {
  grayscale: boolean
  setGrayscale: (value: boolean) => void
}

const GrayscaleContext = createContext<GrayscaleContextType | undefined>(undefined)

export function GrayscaleProvider({ children }: { children: React.ReactNode }) {
  const [grayscale, setGrayscale] = useState(false)
  return (
    <GrayscaleContext.Provider value={{ grayscale, setGrayscale }}>
      <div style={{ filter: grayscale ? "grayscale(1)" : "none" }}>
        {children}
      </div>
    </GrayscaleContext.Provider>
  )
}

export function useGrayscale() {
  const context = useContext(GrayscaleContext)
  if (!context) throw new Error("useGrayscale must be used within GrayscaleProvider")
  return context
}