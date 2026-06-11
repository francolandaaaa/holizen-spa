'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Sequence:
//  'bloom'  (0 – 1.5s)  → dark screen, lotus blooms, no overlay text
//  'text'   (1.5 – 3.0s) → HOLIZEN SPA overlay fades in over the open lotus
//  'fading' (3.0 – 4.6s) → overlay fades out, page content fades in simultaneously
//  'done'   (4.6s+)      → overlay removed from DOM, page fully visible

type Phase = 'bloom' | 'text' | 'fading' | 'done'

export default function IntroReveal({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>('bloom')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'),   1500)
    const t2 = setTimeout(() => setPhase('fading'), 3000)
    const t3 = setTimeout(() => setPhase('done'),   4700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <>
      {/* Page content — hidden during bloom+text, fades in during fading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'fading' || phase === 'done' ? 1 : 0 }}
        transition={{ duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      {/* Overlay — not rendered during bloom; appears + fades during text/fading */}
      <AnimatePresence>
        {(phase === 'text' || phase === 'fading') && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'fading' ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'radial-gradient(ellipse at 50% 45%, rgba(12,8,3,0.72) 0%, rgba(8,5,2,0.90) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            {/* Top line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 72, height: 1,
                background: 'linear-gradient(90deg, transparent, #C9A84C 50%, transparent)',
                marginBottom: 32, transformOrigin: 'center',
              }}
            />

            {/* Corner ornaments */}
            {([[-1,-1],[1,-1],[-1,1],[1,1]] as const).map(([sx, sy], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 0.32, scale: 1 }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
                style={{
                  position: 'absolute',
                  [sy === -1 ? 'top' : 'bottom']: '10%',
                  [sx === -1 ? 'left' : 'right']: '8%',
                  width: 40, height: 40,
                  borderTop:    sy === -1 ? '1px solid rgba(201,168,76,0.5)' : 'none',
                  borderBottom: sy ===  1 ? '1px solid rgba(201,168,76,0.5)' : 'none',
                  borderLeft:   sx === -1 ? '1px solid rgba(201,168,76,0.5)' : 'none',
                  borderRight:  sx ===  1 ? '1px solid rgba(201,168,76,0.5)' : 'none',
                }}
              />
            ))}

            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, letterSpacing: '1.0em', y: 10 }}
              animate={{ opacity: 1, letterSpacing: '0.50em', y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
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
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 48, height: 1,
                background: '#C9A84C',
                margin: '22px 0', transformOrigin: 'center',
              }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.70, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
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

            {/* Bottom line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 72, height: 1,
                background: 'linear-gradient(90deg, transparent, #C9A84C 50%, transparent)',
                marginTop: 32, transformOrigin: 'center',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
