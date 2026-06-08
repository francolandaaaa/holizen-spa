'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── constants ────────────────────────────────────────────────────────────────
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS_ABBR = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
const DAYS_FULL = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
const SERVICIOS = [
  'Corte de Cabello','Tinte','Balayage','Mechas',
  'Peinado','Tratamiento Capilar','Keratina','Otro',
]

// ─── types ────────────────────────────────────────────────────────────────────
interface DayCell { date: Date | null; disabled: boolean }
interface Availability { allSlots: string[]; busySlots: string[] }
type Step = 'date' | 'time' | 'confirm'
interface FormData { nombre: string; telefono: string; servicio: string }

// ─── helpers ─────────────────────────────────────────────────────────────────
function buildCalendar(year: number, month: number): DayCell[] {
  const today = new Date(); today.setHours(0,0,0,0)
  const first = new Date(year, month, 1)
  const last  = new Date(year, month + 1, 0)
  const startOffset = (first.getDay() + 6) % 7 // Mon=0
  const cells: DayCell[] = []
  for (let i = 0; i < startOffset; i++) cells.push({ date: null, disabled: true })
  for (let d = 1; d <= last.getDate(); d++) {
    const date = new Date(year, month, d)
    cells.push({ date, disabled: date < today || date.getDay() === 0 })
  }
  return cells
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`
}

function displayDate(d: Date) {
  return `${DAYS_FULL[d.getDay()]} ${d.getDate()} de ${MONTHS_ES[d.getMonth()]}`
}

// ─── shared styles ────────────────────────────────────────────────────────────
const GOLD = '#C9A84C'
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}
const springTrans = { duration: 0.32, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] }

// ─── StepIndicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: 'date',    label: 'Fecha'     },
    { key: 'time',    label: 'Horario'   },
    { key: 'confirm', label: 'Confirmar' },
  ]
  const idx = { date: 0, time: 1, confirm: 2 }[current]

  return (
    <div className="flex items-center justify-center mb-10 select-none">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{
                background: i < idx ? GOLD : i === idx ? 'rgba(201,168,76,0.14)' : 'transparent',
                borderColor: i <= idx ? GOLD : 'rgba(255,255,255,0.12)',
              }}
              transition={{ duration: 0.4 }}
              style={{
                width: 34, height: 34, borderRadius: '50%',
                border: '1px solid', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 13,
                color: i <= idx ? GOLD : 'rgba(255,255,255,0.22)',
              }}
            >
              {i < idx ? '✓' : i + 1}
            </motion.div>
            <span style={{
              fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: i <= idx ? GOLD : 'rgba(255,255,255,0.22)',
              transition: 'color 0.4s',
            }}>
              {s.label}
            </span>
          </div>
          {i < 2 && (
            <motion.div
              animate={{ background: i < idx ? GOLD : 'rgba(255,255,255,0.1)' }}
              transition={{ duration: 0.4 }}
              style={{ width: 56, height: 1, margin: '0 10px', marginBottom: 22 }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── MonthCalendar ───────────────────────────────────────────────────────────
function MonthCalendar({
  year, month, cells, selected, onPrev, onNext, onSelect,
}: {
  year: number; month: number; cells: DayCell[]
  selected: Date | null
  onPrev: () => void; onNext: () => void; onSelect: (d: Date) => void
}) {
  const today = new Date(); today.setHours(0,0,0,0)
  const [hovered, setHovered] = useState<number | null>(null)

  // Prevent navigating to past months
  const now = new Date()
  const isPastMonth = year < now.getFullYear() || (year === now.getFullYear() && month <= now.getMonth())

  return (
    <div style={{ maxWidth: 440, margin: '0 auto' }}>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onPrev}
          disabled={isPastMonth}
          style={{
            width: 38, height: 38, borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', cursor: isPastMonth ? 'default' : 'pointer',
            color: isPastMonth ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)',
            fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (!isPastMonth) (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)') }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)') }}
        >
          ←
        </button>

        <h3 style={{
          fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem',
          fontWeight: 300, letterSpacing: '0.2em', color: '#F5F5F5',
        }}>
          {MONTHS_ES[month].toUpperCase()} {year}
        </h3>

        <button
          onClick={onNext}
          style={{
            width: 38, height: 38, borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)') }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)') }}
        >
          →
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {DAYS_ABBR.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 11, letterSpacing: '0.12em',
            textTransform: 'uppercase', padding: '4px 0',
            color: d === 'Dom' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.25)',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((cell, i) => {
          if (!cell.date) return <div key={i} />
          const isSelected = selected ? dateKey(cell.date) === dateKey(selected) : false
          const isToday    = cell.date.getTime() === today.getTime()
          const isHovered  = hovered === i && !cell.disabled && !isSelected

          return (
            <motion.button
              key={i}
              whileTap={cell.disabled ? {} : { scale: 0.9 }}
              onClick={() => !cell.disabled && onSelect(cell.date!)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                aspectRatio: '1', borderRadius: 8, fontSize: 14,
                fontWeight: isSelected ? 600 : 300, cursor: cell.disabled ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s ease',
                background: isSelected ? GOLD
                  : isHovered ? 'rgba(201,168,76,0.12)'
                  : 'transparent',
                border: isSelected ? 'none'
                  : isToday ? `1px solid rgba(201,168,76,0.65)`
                  : isHovered ? '1px solid rgba(201,168,76,0.45)'
                  : '1px solid transparent',
                color: isSelected ? '#050505'
                  : cell.disabled ? 'rgba(255,255,255,0.1)'
                  : isToday || isHovered ? GOLD
                  : 'rgba(255,255,255,0.7)',
              }}
            >
              {cell.date.getDate()}
            </motion.button>
          )
        })}
      </div>

      <p style={{ marginTop: 18, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.05em' }}>
        Domingos cerrado · Selecciona un día disponible
      </p>
    </div>
  )
}

// ─── TimeSlotPicker ──────────────────────────────────────────────────────────
function TimeSlotPicker({
  date, availability, loading, selected, onSelect, onBack,
}: {
  date: Date; availability: Availability | null; loading: boolean
  selected: string | null; onSelect: (t: string) => void; onBack: () => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <button onClick={onBack} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'rgba(255,255,255,0.35)', fontSize: 13, letterSpacing: '0.1em',
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20,
        padding: 0, transition: 'color 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.color = GOLD }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
      >
        ← Cambiar fecha
      </button>

      <p style={{
        fontFamily: 'var(--font-cormorant)', fontSize: '1.45rem',
        fontWeight: 300, color: GOLD, letterSpacing: '0.1em', marginBottom: 24,
      }}>
        {displayDate(date)}
      </p>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{
              height: 60, borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              animation: `skeleton-pulse 1.5s ease-in-out ${i * 0.07}s infinite`,
            }} />
          ))}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {(availability?.allSlots ?? []).map(slot => {
              const isBusy     = availability?.busySlots.includes(slot) ?? false
              const isSelected = selected === slot
              const isHov      = hovered === slot && !isBusy && !isSelected

              return (
                <motion.button
                  key={slot}
                  whileTap={isBusy ? {} : { scale: 0.95 }}
                  onClick={() => !isBusy && onSelect(slot)}
                  onMouseEnter={() => !isBusy && setHovered(slot)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    padding: '14px 8px', borderRadius: 8, textAlign: 'center',
                    cursor: isBusy ? 'not-allowed' : 'pointer',
                    transition: 'all 0.18s ease',
                    background: isSelected ? GOLD
                      : isHov ? 'rgba(201,168,76,0.14)'
                      : isBusy ? 'rgba(255,255,255,0.025)'
                      : 'rgba(201,168,76,0.05)',
                    border: isSelected ? 'none'
                      : isHov ? `1px solid ${GOLD}`
                      : isBusy ? '1px solid rgba(255,255,255,0.05)'
                      : '1px solid rgba(201,168,76,0.28)',
                    color: isSelected ? '#050505'
                      : isHov ? GOLD
                      : isBusy ? 'rgba(255,255,255,0.18)'
                      : 'rgba(255,255,255,0.78)',
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: isSelected ? 600 : 300, letterSpacing: '0.05em' }}>
                    {slot}
                  </div>
                  {isBusy && (
                    <div style={{
                      fontSize: 10, letterSpacing: '0.15em', marginTop: 3,
                      textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
                    }}>
                      Ocupado
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6" style={{ fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)' }}>
            <span className="flex items-center gap-1.5">
              <span style={{ width: 10, height: 10, borderRadius: 2, display: 'inline-block', border: '1px solid rgba(201,168,76,0.5)', background: 'rgba(201,168,76,0.05)' }} />
              Disponible
            </span>
            <span className="flex items-center gap-1.5">
              <span style={{ width: 10, height: 10, borderRadius: 2, display: 'inline-block', background: 'rgba(255,255,255,0.05)' }} />
              Ocupado
            </span>
          </div>
        </>
      )}
    </div>
  )
}

// ─── ConfirmForm ─────────────────────────────────────────────────────────────
function ConfirmForm({
  date, time, form, onChange, onBack, onSubmit, status,
}: {
  date: Date; time: string; form: FormData
  onChange: (f: FormData) => void
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
  status: 'idle' | 'loading' | 'error'
}) {
  const [focused, setFocused] = useState<string | null>(null)

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...form, [k]: e.target.value })

  const fieldStyle = (field: string): React.CSSProperties => ({
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: `1px solid ${focused === field ? GOLD : 'rgba(255,255,255,0.14)'}`,
    padding: '10px 0', color: '#F5F5F5', fontSize: 16, outline: 'none',
    transition: 'border-color 0.3s',
  })

  const labelStyle: React.CSSProperties = {
    display: 'block', color: 'rgba(255,255,255,0.38)',
    fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 8,
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <button onClick={onBack} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'rgba(255,255,255,0.35)', fontSize: 13, letterSpacing: '0.1em',
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, padding: 0,
        transition: 'color 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.color = GOLD }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
      >
        ← Cambiar horario
      </button>

      {/* Booking summary */}
      <div style={{
        background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: 10, padding: '20px 24px', marginBottom: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 6 }}>
            Tu cita
          </p>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.2rem', fontWeight: 300, color: '#F5F5F5' }}>
            {displayDate(date)}
          </p>
        </div>
        <div style={{
          fontFamily: 'var(--font-cormorant)', fontSize: '2.2rem',
          fontWeight: 300, color: GOLD, letterSpacing: '0.05em',
        }}>
          {time} <span style={{ fontSize: '1rem', color: 'rgba(201,168,76,0.6)' }}>hrs</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <label style={labelStyle}>Nombre</label>
          <input
            type="text" required value={form.nombre} onChange={set('nombre')}
            onFocus={() => setFocused('nombre')} onBlur={() => setFocused(null)}
            placeholder="Tu nombre completo"
            style={fieldStyle('nombre')}
          />
        </div>

        <div>
          <label style={labelStyle}>Teléfono</label>
          <input
            type="tel" required value={form.telefono} onChange={set('telefono')}
            onFocus={() => setFocused('telefono')} onBlur={() => setFocused(null)}
            placeholder="+52 55 1234 5678"
            style={fieldStyle('telefono')}
          />
        </div>

        <div>
          <label style={labelStyle}>Servicio</label>
          <select
            required value={form.servicio} onChange={set('servicio')}
            onFocus={() => setFocused('servicio')} onBlur={() => setFocused(null)}
            style={{ ...fieldStyle('servicio'), cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}
          >
            <option value="" disabled style={{ background: '#0A0A0A' }}>Selecciona un servicio</option>
            {SERVICIOS.map(s => <option key={s} value={s} style={{ background: '#0A0A0A' }}>{s}</option>)}
          </select>
        </div>

        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', color: 'rgba(255,100,100,0.7)', fontSize: 13 }}
          >
            Hubo un error al agendar. Por favor intenta de nuevo.
          </motion.p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: '14px 48px', border: `1px solid ${GOLD}`, color: GOLD,
              background: 'transparent', fontSize: 14, letterSpacing: '0.3em',
              textTransform: 'uppercase', cursor: status === 'loading' ? 'wait' : 'pointer',
              transition: 'all 0.35s ease', borderRadius: 2,
            }}
            onMouseEnter={e => { if (status !== 'loading') { (e.currentTarget.style.background = GOLD); (e.currentTarget.style.color = '#050505') }}}
            onMouseLeave={e => { (e.currentTarget.style.background = 'transparent'); (e.currentTarget.style.color = GOLD) }}
          >
            {status === 'loading' ? 'Agendando...' : 'Confirmar Cita'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── SuccessView ─────────────────────────────────────────────────────────────
function SuccessView({ date, time, nombre }: { date: Date; time: string; nombre: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ textAlign: 'center', padding: '40px 0' }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 14, stiffness: 120, delay: 0.1 }}
        style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 28px',
          border: `1px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" width="32" height="32" style={{ stroke: GOLD }}>
          <polyline points="20,6 9,17 4,12" />
        </svg>
      </motion.div>

      <h3 style={{
        fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 300,
        color: '#F5F5F5', letterSpacing: '0.1em', marginBottom: 8,
      }}>
        ¡Cita confirmada!
      </h3>
      <p style={{ color: GOLD, fontSize: 14, marginBottom: 24, letterSpacing: '0.05em' }}>
        Te esperamos, {nombre}
      </p>

      <div style={{
        display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: 10, padding: '20px 40px',
      }}>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em' }}>
          {displayDate(date)}
        </p>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem', fontWeight: 300, color: GOLD }}>
          {time} <span style={{ fontSize: '1rem', color: 'rgba(201,168,76,0.55)' }}>hrs</span>
        </p>
      </div>

      <p style={{ marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>
        Te contactaremos para confirmar tu cita
      </p>
    </motion.div>
  )
}

// ─── CalendarBooking (main) ───────────────────────────────────────────────────
export default function CalendarBooking() {
  const now = new Date()

  const [step,         setStep]         = useState<Step>('date')
  const [viewYear,     setViewYear]     = useState(now.getFullYear())
  const [viewMonth,    setViewMonth]    = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [form,         setForm]         = useState<FormData>({ nombre: '', telefono: '', servicio: '' })
  const [status,       setStatus]       = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [direction,    setDirection]    = useState(1)

  const cells = buildCalendar(viewYear, viewMonth)

  useEffect(() => {
    if (!selectedDate) return
    setLoadingSlots(true)
    setAvailability(null)
    fetch(`/api/calendar/availability?date=${dateKey(selectedDate)}`)
      .then(r => r.json())
      .then(data => setAvailability(data))
      .catch(() => setAvailability({ allSlots: [], busySlots: [] }))
      .finally(() => setLoadingSlots(false))
  }, [selectedDate])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function selectDate(date: Date) {
    setSelectedDate(date); setSelectedTime(null)
    setDirection(1); setStep('time')
  }

  function selectTime(time: string) {
    setSelectedTime(time); setDirection(1); setStep('confirm')
  }

  function goBack() {
    setDirection(-1)
    if (step === 'time')    setStep('date')
    if (step === 'confirm') setStep('time')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateKey(selectedDate!), time: selectedTime, ...form }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  if (status === 'success') {
    return <SuccessView date={selectedDate!} time={selectedTime!} nombre={form.nombre} />
  }

  return (
    <div>
      <StepIndicator current={step} />

      <AnimatePresence mode="wait" custom={direction}>
        {step === 'date' && (
          <motion.div key="date" custom={direction}
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={springTrans}
          >
            <MonthCalendar
              year={viewYear} month={viewMonth} cells={cells}
              selected={selectedDate}
              onPrev={prevMonth} onNext={nextMonth} onSelect={selectDate}
            />
          </motion.div>
        )}

        {step === 'time' && (
          <motion.div key="time" custom={direction}
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={springTrans}
          >
            <TimeSlotPicker
              date={selectedDate!} availability={availability}
              loading={loadingSlots} selected={selectedTime}
              onSelect={selectTime} onBack={goBack}
            />
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div key="confirm" custom={direction}
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={springTrans}
          >
            <ConfirmForm
              date={selectedDate!} time={selectedTime!}
              form={form} onChange={setForm}
              onBack={goBack} onSubmit={handleSubmit} status={status}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
