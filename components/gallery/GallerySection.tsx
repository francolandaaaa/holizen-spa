'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { galleryImages, type GalleryImage } from './galleryData'

const CATEGORIES = ['Todos', 'Masajes', 'Faciales', 'Rituales', 'Wellness']
const GOLD = '#C9A84C'

const PLACEHOLDERS = [
  'linear-gradient(135deg, rgba(201,168,76,0.18) 0%, rgba(20,14,8,1) 100%)',
  'linear-gradient(135deg, rgba(232,197,184,0.20) 0%, rgba(14,10,6,1) 100%)',
  'linear-gradient(135deg, rgba(143,168,138,0.18) 0%, rgba(12,10,5,1) 100%)',
  'linear-gradient(135deg, rgba(201,168,76,0.10) 0%, rgba(80,60,30,0.30) 100%)',
]

function GalleryCard({ image }: { image: GalleryImage }) {
  const [missing, setMissing] = useState(false)
  const gradient = PLACEHOLDERS[image.id % PLACEHOLDERS.length]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.93 }}
      whileHover={{ y: -7 }}
      transition={{ duration: 0.50 }}
      className="relative overflow-hidden group cursor-pointer"
      style={{
        border: '1px solid rgba(201,168,76,0.10)',
        aspectRatio: '3/4',
      }}
    >
      {missing ? (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradient }}>
          <div className="text-center px-6">
            <span
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '2.5rem',
                fontWeight: 300,
                color: 'rgba(201,168,76,0.28)',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              ◎
            </span>
            <span
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.1rem',
                color: 'rgba(201,168,76,0.25)',
                letterSpacing: '0.12em',
              }}
            >
              {image.category}
            </span>
          </div>
        </div>
      ) : (
        <img
          src={image.src}
          alt={image.alt}
          onError={() => setMissing(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: 'linear-gradient(to top, rgba(13,10,6,0.92) 0%, rgba(13,10,6,0.12) 55%, transparent 100%)' }}
      >
        <span
          className="text-xs tracking-widest uppercase mb-1"
          style={{ color: GOLD, fontFamily: 'var(--font-cormorant)', letterSpacing: '0.28em' }}
        >
          {image.category}
        </span>
        <p
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1rem',
            color: '#F5EEE0',
            fontWeight: 300,
            fontStyle: 'italic',
          }}
        >
          {image.alt}
        </p>
      </div>
    </motion.div>
  )
}

export default function GallerySection() {
  const [active, setActive] = useState('Todos')

  const filtered = active === 'Todos' ? galleryImages : galleryImages.filter(img => img.category === active)

  return (
    <section id="galeria" className="py-28 px-6 md:px-12 lg:px-24" style={{ background: '#0A0805' }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.90 }}
          className="mb-16 text-center"
        >
          <p
            className="text-sm uppercase mb-4"
            style={{ color: GOLD, letterSpacing: '0.38em', fontFamily: 'var(--font-cormorant)' }}
          >
            Momentos de Bienestar
          </p>
          <h2
            className="font-light"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(38px, 5.5vw, 64px)',
              background: `linear-gradient(135deg, ${GOLD} 0%, #F0D890 45%, ${GOLD} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Galería
          </h2>
          <div className="w-14 h-px mx-auto mt-6" style={{ background: GOLD }} />
        </motion.div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="px-6 py-2 text-sm tracking-widest uppercase transition-all duration-350"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '13px',
                letterSpacing: '0.28em',
                ...(active === cat
                  ? { background: GOLD, color: '#0D0A06' }
                  : { background: 'transparent', color: 'rgba(245,238,224,0.35)', border: '1px solid rgba(201,168,76,0.18)' }),
              }}
              onMouseEnter={e => { if (active !== cat) { e.currentTarget.style.color = GOLD; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.38)' } }}
              onMouseLeave={e => { if (active !== cat) { e.currentTarget.style.color = 'rgba(245,238,224,0.35)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)' } }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(img => <GalleryCard key={img.id} image={img} />)}
          </AnimatePresence>
        </motion.div>

        <p
          className="text-center text-xs mt-10 tracking-wider"
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(245,238,224,0.14)',
            letterSpacing: '0.18em',
          }}
        >
          Añade tus fotografías en /public/gallery/ y actualiza components/gallery/galleryData.ts
        </p>
      </div>
    </section>
  )
}
