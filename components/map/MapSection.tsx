'use client'

const GOLD = '#C9A84C'

const MAPS_EMBED = 'https://maps.google.com/maps?q=Av.+35+Pte.+2907,+El+Vergel,+72400+Heroica+Puebla+de+Zaragoza,+Puebla,+M%C3%A9xico&output=embed&hl=es&z=16'
const MAPS_LINK  = 'https://maps.google.com/maps?q=Av.+35+Pte.+2907,+El+Vergel,+72400+Heroica+Puebla+de+Zaragoza,+Puebla,+M%C3%A9xico'

export default function MapSection() {
  return (
    <section
      id="ubicacion"
      className="py-24 px-6 md:px-12 lg:px-24"
      style={{ background: '#0A0805' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-14 text-center">
          <p
            className="text-sm uppercase mb-4"
            style={{ color: GOLD, letterSpacing: '0.38em', fontFamily: 'var(--font-cormorant)' }}
          >
            Visítanos
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
            Nuestra Ubicación
          </h2>
          <div className="w-14 h-px mx-auto mt-6" style={{ background: GOLD }} />
        </div>

        {/* Map */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '460px',
            border: '1px solid rgba(201,168,76,0.18)',
            overflow: 'hidden',
          }}
        >
          <iframe
            title="Ubicación Holizen Spa — Puebla"
            src={MAPS_EMBED}
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block', filter: 'grayscale(15%) contrast(1.05) saturate(0.9)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Address strip */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 mt-5 px-6 py-5"
          style={{
            background: 'rgba(201,168,76,0.04)',
            border: '1px solid rgba(201,168,76,0.12)',
          }}
        >
          <div className="flex items-start gap-4">
            <div
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: GOLD, flexShrink: 0, marginTop: 6,
              }}
            />
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '15px',
                  color: '#F5EEE0',
                  fontWeight: 300,
                }}
              >
                Holizen Spa
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '14px',
                  color: 'rgba(245,238,224,0.48)',
                  fontStyle: 'italic',
                  marginTop: 2,
                }}
              >
                Av. 35 Pte. 2907, El Vergel, 72400 Heroica Puebla de Zaragoza, Puebla, México
              </p>
            </div>
          </div>

          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '13px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: GOLD,
              border: '1px solid rgba(201,168,76,0.38)',
              padding: '10px 24px',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = GOLD
              e.currentTarget.style.color = '#0D0A06'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(201,168,76,0.35)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = GOLD
              e.currentTarget.style.boxShadow = ''
            }}
          >
            Cómo llegar ↗
          </a>
        </div>
      </div>
    </section>
  )
}
