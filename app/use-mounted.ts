'use client'
import { useEffect, useState } from 'react'

// True only after the component mounted in the browser. Gate anything that
// differs between server HTML (no wallet) and the hydrated client
// (auto-reconnected wallet) behind this, or hydration mismatches.
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
