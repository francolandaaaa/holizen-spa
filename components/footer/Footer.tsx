'use client'

const GOLD = '#C9A84C'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="px-6 md:px-12 lg:px-24 py-16"
      style={{
        background: '#080502',
        borderTop: '1px solid rgba(201,168,76,0.10)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
          {/* Brand */}
          <div>
            <h3
              className="font-light mb-1 tracking-[0.35em]"
              style={{ fontFamily: 'var(--font-cinzel)', fontSize: '1.5rem', color: GOLD, fontWeight: 400 }}
            >
              HOLIZEN SPA
            </h3>
            <p
              className="text-xs tracking-widest uppercase mb-5"
              style={{ color: 'rgba(245,238,224,0.22)', fontFamily: 'var(--font-cormorant)', letterSpacing: '0.28em' }}
            >
              Santuario de Bienestar
            </p>
            <p
              className="leading-relaxed"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '15px',
                fontStyle: 'italic',
                color: 'rgba(245,238,224,0.32)',
                maxWidth: 240,
              }}
            >
              Un santuario de bienestar para cuerpo, mente y espíritu en Puebla.
            </p>

            {/* Lotus divider */}
            <div className="flex items-center gap-2 mt-6">
              <div style={{ width: 28, height: '1px', background: 'rgba(201,168,76,0.25)' }} />
              <span style={{ color: 'rgba(201,168,76,0.35)', fontSize: '14px' }}>◎</span>
              <div style={{ width: 28, height: '1px', background: 'rgba(201,168,76,0.25)' }} />
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-xs tracking-widest uppercase mb-6"
              style={{ color: 'rgba(201,168,76,0.60)', fontFamily: 'var(--font-cormorant)', letterSpacing: '0.28em' }}
            >
              Contacto
            </h4>
            <ul className="space-y-3" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '15px', color: 'rgba(245,238,224,0.35)' }}>
              <li>
                <a
                  href="mailto:franco.landac@gmail.com"
                  className="transition-colors duration-300"
                  onMouseEnter={e => { e.currentTarget.style.color = GOLD }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,238,224,0.35)' }}
                >
                  franco.landac@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+525512345678"
                  className="transition-colors duration-300"
                  onMouseEnter={e => { e.currentTarget.style.color = GOLD }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,238,224,0.35)' }}
                >
                  +52 55 1234 5678
                </a>
              </li>
              <li style={{ color: 'rgba(245,238,224,0.22)' }}>Lun – Sáb: 9:00 – 19:00</li>
              <li style={{ color: 'rgba(245,238,224,0.22)', fontSize: '14px' }}>
                Av. 35 Pte. 2907, El Vergel
                <br />72400 Puebla, México
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-xs tracking-widest uppercase mb-6"
              style={{ color: 'rgba(201,168,76,0.60)', fontFamily: 'var(--font-cormorant)', letterSpacing: '0.28em' }}
            >
              Navegación
            </h4>
            <ul className="space-y-3" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '15px', color: 'rgba(245,238,224,0.35)' }}>
              {[
                { label: 'Servicios',            href: '#servicios' },
                { label: 'Galería',              href: '#galeria'   },
                { label: 'Testimonios',          href: '#resenas'   },
                { label: 'Reservar Experiencia', href: '#agendar'   },
                { label: 'Ubicación',            href: '#ubicacion' },
              ].map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors duration-300"
                    onMouseEnter={e => { e.currentTarget.style.color = GOLD }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,238,224,0.35)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p
            className="text-xs tracking-wider"
            style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(245,238,224,0.16)', letterSpacing: '0.14em' }}
          >
            © {year} Holizen Spa. Todos los derechos reservados.
          </p>
          <div className="flex gap-7">
            {['Instagram', 'Facebook', 'TikTok'].map(social => (
              <a
                key={social}
                href="#"
                className="text-xs tracking-wider transition-colors duration-300"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(245,238,224,0.20)', letterSpacing: '0.18em' }}
                onMouseEnter={e => { e.currentTarget.style.color = GOLD }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,238,224,0.20)' }}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
