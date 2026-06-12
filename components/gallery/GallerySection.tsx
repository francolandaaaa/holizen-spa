'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { galleryImages, type GalleryImage } from './galleryData'

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
      whileHover={{ y: -7 }}
      transition={{ duration: 0.50 }}
      className="relative overflow-hidden group cursor-pointer"
      style={{ border: '1px solid rgba(201,168,76,0.10)', aspectRatio: '3/4' }}
    >
      {missing ? (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradient }}>
          <div className="text-center px-6">
            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem', fontWeight: 300, color: 'rgba(201,168,76,0.28)', display: 'block', marginBottom: '0.5rem' }}>◎</span>
            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', color: 'rgba(201,168,76,0.25)', letterSpacing: '0.12em' }}>{image.category}</span>
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
      <div
        className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: 'linear-gradient(to top, rgba(10,24,22,0.94) 0%, rgba(10,24,22,0.12) 55%, transparent 100%)' }}
      >
        <span className="text-xs tracking-widest uppercase mb-1" style={{ color: GOLD, fontFamily: 'var(--font-cormorant)', letterSpacing: '0.28em' }}>
          {image.category}
        </span>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: '#F5EEE0', fontWeight: 300, fontStyle: 'italic' }}>
          {image.alt}
        </p>
      </div>
    </motion.div>
  )
}

export default function GallerySection() {
  const photos = galleryImages.slice(0, 6)

  return (
    <section
      id="galeria"
      className="px-6 md:px-12 lg:px-24"
      style={{ background: 'rgba(10, 24, 22, 0.88)', paddingTop: '5.6rem', paddingBottom: '5.6rem' }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.90 }}
          className="mb-12 text-center"
        >
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
          <div className="w-14 h-px mx-auto mt-5" style={{ background: GOLD }} />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
            >
              <GalleryCard image={img} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
