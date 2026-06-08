import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SLOT_DURATION_MIN = 60 // Each appointment lasts 60 minutes

function generateSlots(): string[] {
  const slots: string[] = []
  for (let h = 9; h <= 17; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`)
    slots.push(`${h.toString().padStart(2, '0')}:30`)
  }
  // 9:00 … 17:30 → 18 slots (last appt 17:30 ends at 18:30)
  return slots
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const allSlots = generateSlots()

  const svcEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const svcKey   = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  const calId    = process.env.GOOGLE_CALENDAR_ID ?? 'primary'

  if (!svcEmail || !svcKey) {
    // Google Calendar not configured yet — all slots available
    return NextResponse.json({ allSlots, busySlots: [] })
  }

  try {
    const { google } = await import('googleapis')

    const auth = new google.auth.JWT({
      email: svcEmail,
      key:   svcKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    })

    const cal = google.calendar({ version: 'v3', auth })

    const timeMin = new Date(`${date}T00:00:00-06:00`).toISOString()
    const timeMax = new Date(`${date}T23:59:59-06:00`).toISOString()

    const res = await cal.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: 'America/Mexico_City',
        items: [{ id: calId }],
      },
    })

    const busy = res.data.calendars?.[calId]?.busy ?? []

    const busySlots = allSlots.filter(slot => {
      const slotStart = new Date(`${date}T${slot}:00-06:00`)
      const slotEnd   = new Date(slotStart.getTime() + SLOT_DURATION_MIN * 60_000)
      return busy.some(p => {
        const s = new Date(p.start!)
        const e = new Date(p.end!)
        return slotStart < e && slotEnd > s
      })
    })

    return NextResponse.json({ allSlots, busySlots })
  } catch (err) {
    console.error('[calendar/availability]', err)
    return NextResponse.json({ allSlots, busySlots: [] })
  }
}
