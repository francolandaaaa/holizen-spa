import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const SLOT_DURATION_MIN = 60
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS_ES   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  return `${Math.floor(total / 60).toString().padStart(2,'0')}:${(total % 60).toString().padStart(2,'0')}`
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { date, time, nombre, telefono, servicio } = body as Record<string, string>

  if (!date || !time || !nombre || !telefono || !servicio) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const svcEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const svcKey   = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  const calId    = process.env.GOOGLE_CALENDAR_ID ?? 'primary'

  // ── Google Calendar event ──────────────────────────────────────────────────
  if (svcEmail && svcKey) {
    try {
      const { google } = await import('googleapis')

      const auth = new google.auth.JWT({
        email: svcEmail,
        key:   svcKey.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/calendar'],
      })

      const cal = google.calendar({ version: 'v3', auth })
      const endTime = addMinutes(time, SLOT_DURATION_MIN)

      await cal.events.insert({
        calendarId: calId,
        requestBody: {
          summary:     `NUDO — ${servicio} · ${nombre}`,
          description: `Cliente: ${nombre}\nTeléfono: ${telefono}\nServicio: ${servicio}`,
          start: { dateTime: `${date}T${time}:00`, timeZone: 'America/Mexico_City' },
          end:   { dateTime: `${date}T${endTime}:00`, timeZone: 'America/Mexico_City' },
          colorId: '5', // banana/gold
        },
      })
    } catch (err) {
      console.error('[calendar/book] Google Calendar:', err)
      // Don't fail — still send the email below
    }
  }

  // ── Email notification ─────────────────────────────────────────────────────
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      })

      const dateObj = new Date(`${date}T12:00:00`)
      const dateStr = `${DAYS_ES[dateObj.getDay()]} ${dateObj.getDate()} de ${MONTHS_ES[dateObj.getMonth()]} ${dateObj.getFullYear()}`

      await transporter.sendMail({
        from:    `"NUDO Salón de Belleza" <${process.env.EMAIL_USER}>`,
        to:      process.env.EMAIL_USER,
        subject: `Nueva cita — ${nombre} · ${time} hrs`,
        html: `
<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:36px;background:#0A0A0A;color:#F5F5F5;border:1px solid rgba(201,168,76,0.25);">
  <h1 style="color:#C9A84C;font-size:26px;font-weight:300;letter-spacing:0.25em;margin:0 0 4px;">NUDO</h1>
  <p style="color:rgba(255,255,255,0.35);font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 32px;">Salón de Belleza — Nueva Cita</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.4);width:120px;letter-spacing:0.1em;font-size:11px;text-transform:uppercase;">Cliente</td><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);">${nombre}</td></tr>
    <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Teléfono</td><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);">${telefono}</td></tr>
    <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Servicio</td><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);">${servicio}</td></tr>
    <tr><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Fecha</td><td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#C9A84C;">${dateStr}</td></tr>
    <tr><td style="padding:12px 0;color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.1em;">Hora</td><td style="padding:12px 0;color:#C9A84C;font-size:18px;font-weight:300;">${time} hrs</td></tr>
  </table>
</div>`,
      })
    } catch (err) {
      console.error('[calendar/book] Email:', err)
    }
  }

  return NextResponse.json({ ok: true })
}
