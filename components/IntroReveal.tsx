'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Phase = 'intro' | 'fading' | 'done'

export default function IntroReveal({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>('intro')

  useEffect(() => {
    // Overlay fades out at 4.6s (synchronized with lotus bloom)
    const t1 = setTimeout(() => setPhase('fading'), 4600)
    // Remove overlay from DOM at 6.2s
    const t2 = setTimeout(() => setPhase('done'), 6200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <>
      {/* Page content — fades in as overlay fades out */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'intro' ? 0 : 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      {/* Intro overlay */}
      <AnimatePresence>
        {phase !== 'done' && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === 'fading' ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'radial-gradient(ellipse at 50% 45%, rgba(15,10,5,0.78) 0%, rgba(8,5,2,0.92) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: phase === 'fading' ? 'none' : 'all',
            }}
          >
            {/* Top decorative line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 72, height: 1,
                background: 'linear-gradient(90deg, transparent, #C9A84C 50%, transparent)',
                marginBottom: 32,
                transformOrigin: 'center',
              }}
            />

            {/* Corner ornaments */}
            {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx, sy], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.35, scale: 1 }}
                transition={{ duration: 1.2, delay: 1.2 + i * 0.08 }}
                style={{
                  position: 'absolute',
                  [sy === -1 ? 'top' : 'bottom']: '10%',
                  [sx === -1 ? 'left' : 'right']: '8%',
                  width: 44, height: 44,
                  borderTop:    sy === -1 ? '1px solid rgba(201,168,76,0.5)' : 'none',
                  borderBottom: sy ===  1 ? '1px solid rgba(201,168,76,0.5)' : 'none',
                  borderLeft:   sx === -1 ? '1px solid rgba(201,168,76,0.5)' : 'none',
                  borderRight:  sx ===  1 ? '1px solid rgba(201,168,76,0.5)' : 'none',
                }}
              />
            ))}

            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, letterSpacing: '1.1em', y: 12 }}
              animate={{ opacity: 1, letterSpacing: '0.50em', y: 0 }}
              transition={{ duration: 2.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontSize: 'clamp(28px, 6vw, 72px)',
                fontWeight: 400,
                color: '#F5EEE0',
                letterSpacing: '0.50em',
                textAlign: 'center',
                textShadow: '0 0 60px rgba(201,168,76,0.25)',
              }}
            >
              HOLIZEN SPA
            </motion.h1>

            {/* Gold separator */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 48, height: 1,
                background: '#C9A84C',
                margin: '22px 0',
                transformOrigin: 'center',
              }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 0.72, y: 0 }}
              transition={{ duration: 1.6, delay: 2.2, ease: 'easeOut' }}
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(13px, 1.8vw, 20px)',
                fontStyle: 'italic',
                color: '#E8D8C0',
                letterSpacing: '0.16em',
                textAlign: 'center',
                maxWidth: 480,
                lineHeight: 1.7,
              }}
            >
              Un santuario de bienestar para cuerpo, mente y espíritu
            </motion.p>

            {/* Bottom decorative line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 72, height: 1,
                background: 'linear-gradient(90deg, transparent, #C9A84C 50%, transparent)',
                marginTop: 32,
                transformOrigin: 'center',
              }}
            />

            {/* Subtle discovery text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.45, 0, 0.45] }}
              transition={{ duration: 3.0, delay: 3.0, times: [0, 0.3, 0.7, 1] }}
              style={{
                position: 'absolute',
                bottom: '8%',
                fontSize: '11px',
                letterSpacing: '0.42em',
                color: 'rgba(201,168,76,0.6)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-cormorant)',
              }}
            >
              Descubriendo tu santuario
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
