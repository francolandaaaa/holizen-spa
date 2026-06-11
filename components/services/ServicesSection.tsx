'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const GOLD = '#C9A84C'

const SERVICES = [
  {
    number: '01',
    icon: '◌',
    title: 'Masajes Terapéuticos',
    description: 'Masajes especializados que liberan tensiones profundas y restauran el equilibrio natural del cuerpo. Desde el relajante clásico hasta la profunda terapia con piedras calientes.',
    tags: 'Relajante · Descontracturante · Piedras Calientes · Aromaterapéutico',
    accent: 'rgba(201,168,76,0.08)',
    borderColor: 'rgba(201,168,76,0.22)',
  },
  {
    number: '02',
    icon: '◎',
    title: 'Faciales Premium',
    description: 'Tratamientos de última generación para revelar una piel radiante. Hidratación profunda, rejuvenecimiento celular y limpieza purificadora con ingredientes naturales de lujo.',
    tags: 'Hidratación Profunda · Rejuvenecimiento · Limpieza Profunda',
    accent: 'rgba(232,197,184,0.10)',
    borderColor: 'rgba(232,197,184,0.28)',
  },
  {
    number: '03',
    icon: '◉',
    title: 'Rituales Holísticos',
    description: 'Ceremonias ancestrales que integran cuerpo, mente y espíritu en una experiencia transformadora. El Ritual Luna, el Ritual Equilibrio y el Ritual Energía Vital.',
    tags: 'Ritual Luna · Ritual Equilibrio · Energía Vital',
    accent: 'rgba(143,168,138,0.10)',
    borderColor: 'rgba(143,168,138,0.28)',
  },
  {
    number: '04',
    icon: '◈',
    title: 'Experiencias en Pareja',
    description: 'Momentos únicos compartidos en cabina privada con té de cortesía, aromaterapia personalizada y una experiencia sensorial romántica diseñada para dos almas.',
    tags: 'Cabina Privada · Aromaterapia · Experiencia Romántica',
    accent: 'rgba(201,168,76,0.07)',
    borderColor: 'rgba(201,168,76,0.20)',
  },
  {
    number: '05',
    icon: '◇',
    title: 'Wellness Integral',
    description: 'Programas completos de bienestar que combinan meditación guiada, terapias de relajación profunda y experiencias sensoriales para una renovación total.',
    tags: 'Meditación Guiada · Terapias · Experiencias Sensoriales',
    accent: 'rgba(232,197,184,0.08)',
    borderColor: 'rgba(232,197,184,0.22)',
  },
  {
    number: '06',
    icon: '◌',
    title: 'Cuidado Corporal',
    description: 'Exfoliaciones, envolturas corporales y tratamientos regeneradores que nutren profundamente la piel, dejándola suave, luminosa y revitalizada.',
    tags: 'Exfoliación · Envolturas · Tratamientos Nutritivos',
    accent: 'rgba(143,168,138,0.08)',
    borderColor: 'rgba(143,168,138,0.22)',
  },
]

const glassStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.02)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef    = useRef<HTMLDivElement>(null)
  const [flipped, setFlipped] = useState<number | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        y: 44, opacity: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="py-28 px-6 md:px-12 lg:px-24"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div ref={headRef} className="mb-20 text-center">
          <p
            className="text-sm uppercase mb-4"
            style={{ color: GOLD, letterSpacing: '0.38em', fontFamily: 'var(--font-cormorant)' }}
          >
            Experiencias de Bienestar
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
            Nuestros Servicios
          </h2>
          <div className="w-14 h-px mx-auto mt-6" style={{ background: GOLD }} />
          <p
            className="mt-6 max-w-lg mx-auto leading-relaxed"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              fontStyle: 'italic',
              color: 'rgba(245,238,224,0.45)',
            }}
          >
            Cada tratamiento es una invitación a la profunda relajación
          </p>
        </div>

        {/* Flip Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.88, delay: i * 0.09 }}
              style={{ perspective: '1200px', height: '280px', cursor: 'pointer' }}
              onMouseEnter={() => setFlipped(i)}
              onMouseLeave={() => setFlipped(null)}
            >
              <div
                style={{
                  width: '100%', height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d',
                  transition: 'transform 0.70s cubic-bezier(0.4, 0.2, 0.2, 1)',
                  transform: flipped === i ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front face */}
                <div
                  style={{
                    ...glassStyle,
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    border: `1px solid ${svc.borderColor}`,
                    background: svc.accent,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    gap: '0.3rem',
                  }}
                >
                  <span style={{ fontSize: '1.8rem', color: 'rgba(201,168,76,0.35)', marginBottom: '0.3rem' }}>
                    {svc.icon}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '2.8rem',
                    fontWeight: 300,
                    lineHeight: 1,
                    color: 'rgba(201,168,76,0.18)',
                  }}>
                    {svc.number}
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: 'clamp(1.4rem, 2.4vw, 1.85rem)',
                    fontWeight: 300,
                    color: '#F5EEE0',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    marginTop: '0.5rem',
                  }}>
                    {svc.title}
                  </h3>
                  <div style={{ width: '36px', height: '1px', background: 'rgba(201,168,76,0.48)', margin: '0.8rem 0' }} />
                  <span style={{
                    fontSize: '12px',
                    letterSpacing: '0.12em',
                    color: 'rgba(201,168,76,0.55)',
                    textAlign: 'center',
                    lineHeight: 1.6,
                    fontFamily: 'var(--font-cormorant)',
                  }}>
                    {svc.tags.split(' · ')[0]} · {svc.tags.split(' · ')[1]}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    color: 'rgba(245,238,224,0.16)',
                    textTransform: 'uppercase',
                    marginTop: '1.1rem',
                    fontFamily: 'var(--font-cormorant)',
                  }}>
                    Conocer más →
                  </span>
                </div>

                {/* Back face */}
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: svc.accent,
                    border: `1px solid ${svc.borderColor}`,
                    backdropFilter: 'blur(24px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    textAlign: 'center',
                  }}
                >
                  <h3 style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.65rem',
                    fontWeight: 300,
                    color: '#F5EEE0',
                    marginBottom: '1rem',
                  }}>
                    {svc.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '15px',
                    lineHeight: 1.72,
                    color: 'rgba(245,238,224,0.58)',
                    maxWidth: '300px',
                  }}>
                    {svc.description}
                  </p>
                  <div style={{ marginTop: '1.2rem', fontSize: '11px', letterSpacing: '0.14em', color: 'rgba(201,168,76,0.65)', textTransform: 'uppercase', fontFamily: 'var(--font-cormorant)' }}>
                    {svc.tags.split(' · ')[0]}
                  </div>
                  <a
                    href="#agendar"
                    className="pointer-events-auto"
                    style={{
                      marginTop: '1.2rem',
                      fontSize: '11px',
                      letterSpacing: '0.28em',
                      color: GOLD,
                      textTransform: 'uppercase',
                      border: `1px solid rgba(201,168,76,0.35)`,
                      padding: '8px 20px',
                      fontFamily: 'var(--font-cormorant)',
                    }}
                  >
                    Reservar
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
