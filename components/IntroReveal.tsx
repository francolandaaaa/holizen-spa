'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Sequence:
//   0 – 1.5s  : dark screen, lotus blooms closed→open (fully visible, no overlay)
//   1.5s+     : page content fades in over 1.5s
//               hero title animations play during this fade-in window

export default function IntroReveal({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: revealed ? 1 : 0 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
