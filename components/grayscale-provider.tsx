"use client"

import React, { createContext, useContext, useState } from "react"

type GrayscaleContextType = {
  grayscale: boolean
  setGrayscale: (value: boolean) => void
}

const GrayscaleContext = createContext<GrayscaleContextType>({
  grayscale: false,
  setGrayscale: () => {},
})

export function useGrayscale() {
  return useContext(GrayscaleContext)
}

export function GrayscaleProvider({ children }: { children: React.ReactNode }) {
  const [grayscale, setGrayscale] = useState(false)
  return (
    <GrayscaleContext.Provider value={{ grayscale, setGrayscale }}>
      {children}
    </GrayscaleContext.Provider>
  )
}