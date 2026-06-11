'use client'

import { motion } from 'framer-motion'

const GOLD = '#C9A84C'

const REVIEWS = [
  {
    stars: 5,
    text: 'Mi experiencia fue verdaderamente fenomenal. Fui con mi novio y desde el momento en que entramos nos recibieron de manera excepcional.',
    name: 'Sofía M.',
    detail: 'Experiencia en Pareja',
  },
  {
    stars: 5,
    text: 'Durante mi visita al spa me sentí muy cómoda y completamente satisfecha con la atención que recibí. Un equipo maravilloso.',
    name: 'Valentina R.',
    detail: 'Facial Rejuvenecedor',
  },
  {
    stars: 5,
    text: 'Mi spa favorito de Puebla. Si quieren vivir una experiencia de relajación total, lo recomiendo ampliamente. Simplemente perfecto.',
    name: 'Daniela L.',
    detail: 'Ritual Equilibrio',
  },
  {
    stars: 5,
    text: '10 de 10. La atención desde el primer contacto fue muy cálida. Desde que llegas te reciben con té y cuidan cada detalle.',
    name: 'Andrea P.',
    detail: 'Masaje Relajante',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={GOLD}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  )
}

const glassCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.025)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(201,168,76,0.14)',
}

export default function TestimonialsSection() {
  return (
    <section
      id="resenas"
      className="py-28 px-6 md:px-12 lg:px-24"
      style={{ background: 'rgba(12, 8, 4, 0.82)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.88 }}
          className="mb-20 text-center"
        >
          <p
            className="text-sm uppercase mb-4"
            style={{ color: GOLD, letterSpacing: '0.38em', fontFamily: 'var(--font-cormorant)' }}
          >
            Voces de Nuestros Huéspedes
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
            Testimonios
          </h2>
          <div className="w-14 h-px mx-auto mt-6" style={{ background: GOLD }} />
        </motion.div>

        {/* Review cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.85, delay: i * 0.10 }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              style={{
                ...glassCard,
                padding: '2.2rem 2.4rem',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative quote mark */}
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '20px',
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '7rem',
                  fontWeight: 300,
                  color: 'rgba(201,168,76,0.07)',
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                "
              </span>

              {/* Subtle top gradient border */}
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                  opacity: 0.35,
                }}
              />

              <Stars count={review.stars} />

              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(15px, 1.5vw, 17px)',
                  fontStyle: 'italic',
                  lineHeight: 1.78,
                  color: 'rgba(245,238,224,0.72)',
                  marginBottom: '1.8rem',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                "{review.text}"
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  borderTop: '1px solid rgba(201,168,76,0.10)',
                  paddingTop: '1.2rem',
                }}
              >
                {/* Avatar placeholder */}
                <div
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    border: `1px solid rgba(201,168,76,0.30)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(201,168,76,0.08)',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', color: GOLD }}>
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '15px', color: '#F5EEE0', letterSpacing: '0.06em' }}>
                    {review.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '12px', color: 'rgba(201,168,76,0.60)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
                    {review.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              fontStyle: 'italic',
              color: 'rgba(245,238,224,0.38)',
              marginBottom: '1.4rem',
            }}
          >
            Únete a quienes ya descubrieron su santuario
          </p>
          <a
            href="#agendar"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-cormorant)',
              fontSize: '13px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: GOLD,
              border: `1px solid rgba(201,168,76,0.45)`,
              padding: '12px 36px',
              transition: 'all 0.40s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = GOLD
              e.currentTarget.style.color = '#0D0A06'
              e.currentTarget.style.boxShadow = `0 0 40px rgba(201,168,76,0.40)`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = GOLD
              e.currentTarget.style.boxShadow = ''
            }}
          >
            Reservar Mi Experiencia
          </a>
        </motion.div>
      </div>
    </section>
  )
}
