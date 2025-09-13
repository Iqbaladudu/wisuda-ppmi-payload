'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CountdownSettings {
  targetDate: string
  eventName: string
  isActive: boolean
}

function getTimeRemaining(target: Date) {
  const total = target.getTime() - Date.now()
  const seconds = Math.max(0, Math.floor((total / 1000) % 60))
  const minutes = Math.max(0, Math.floor((total / 1000 / 60) % 60))
  const hours = Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24))
  const days = Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24)))
  return { total, days, hours, minutes, seconds }
}

interface HeroCountdownProps {
  className?: string
}

export const HeroCountdown: React.FC<HeroCountdownProps> = ({ className }) => {
  const [countdownSettings, setCountdownSettings] = React.useState<CountdownSettings | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchCountdownSettings = async () => {
      try {
        const response = await fetch('/api/countdown-settings')
        const data = await response.json()
        setCountdownSettings(data)
      } catch (error) {
        console.error('Error fetching countdown settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountdownSettings()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!countdownSettings || !countdownSettings.isActive) {
    return null
  }

  const target = new Date(countdownSettings.targetDate)
  const [time, setTime] = React.useState(getTimeRemaining(target))

  React.useEffect(() => {
    const id = setInterval(() => setTime(getTimeRemaining(target)), 1000)
    return () => clearInterval(id)
  }, [countdownSettings?.targetDate])

  const blocks = [
    { label: 'Hari', value: time.days },
    { label: 'Jam', value: time.hours },
    { label: 'Menit', value: time.minutes },
    { label: 'Detik', value: time.seconds },
  ]

  return (
    <section
      aria-labelledby="hero-heading"
      className={cn(
        'relative isolate overflow-hidden py-28 md:py-40 text-white',
        'before:absolute before:inset-0 before:-z-20 before:bg-[radial-gradient(circle_at_35%_25%,#D68A62_0%,#5A3325_35%,#2B1816_75%)] before:opacity-100',
        'after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.08),transparent_40%),repeating-linear-gradient(45deg,rgba(255,255,255,0.06)_0_12px,transparent_12px_24px)]',
        className,
      )}
    >
      {/* Decorative foreground elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 mix-blend-overlay opacity-70" />
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-[#F9C6B0]/40 via-[#E89F7C]/30 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[90%] -translate-x-1/2 rounded-t-[50%] bg-gradient-to-t from-[#120908] to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center text-center gap-10">
          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium tracking-wide ring-1 ring-white/15 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Registration Open
              <span className="text-white/60">2025</span>
            </div>
            <h1
              id="hero-heading"
              className="font-extrabold tracking-tight text-4xl leading-[1.05] md:text-6xl lg:text-7xl bg-gradient-to-br from-[#FFE8DE] via-white to-[#F5C5B2] bg-clip-text text-transparent drop-shadow-md"
            >
              {countdownSettings.eventName}
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-lg leading-relaxed text-[#FAD9CC] font-medium">
              Merayakan pencapaian akademik, dedikasi, dan perjalanan spiritual para wisudawan. \n
              Bergabunglah dalam momen penuh makna dan kebanggaan komunitas kita.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-5">
              {blocks.map((b) => (
                <div
                  key={b.label}
                  className="group relative rounded-2xl px-5 py-4 md:px-7 md:py-6 backdrop-blur-sm ring-1 ring-white/15 bg-white/7.5 shadow-[0_4px_18px_-4px_rgba(0,0,0,0.45)] overflow-hidden min-w-[90px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/12 to-white/3 opacity-80 group-hover:opacity-100 transition" />
                  <div className="relative space-y-1">
                    <div className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight">
                      {b.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-[10px] md:text-[11px] uppercase tracking-wider font-semibold text-white/70">
                      {b.label}
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -right-4 h-20 w-20 rounded-full bg-gradient-to-tr from-primary/30 to-primary/0 blur-xl opacity-40" />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button className="group relative overflow-hidden rounded-xl px-7 py-5 text-sm font-semibold tracking-wide shadow-lg shadow-black/30">
                <span className="absolute inset-0 -z-10 bg-gradient-to-r from-[#E07C45] via-[#D66837] to-[#B8451A]" />
                <span className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition backdrop-blur-[2px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_60%)]" />
                Daftar Sekarang
              </Button>
              <Button
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white rounded-xl backdrop-blur shadow-lg shadow-black/20"
              >
                Lihat Panduan
              </Button>
            </div>
          </div>

          <div className="grid w-full max-w-4xl grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {[
              { label: 'Wisudawan Terdaftar', value: '—' },
              { label: 'Fakultas', value: '5+' },
              { label: 'Negara', value: '10+' },
              { label: 'Tahun', value: '2025' },
            ].map((s) => (
              <div
                key={s.label}
                className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] px-4 py-4 backdrop-blur-sm shadow-inner shadow-black/30"
              >
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_40%)]" />
                <div className="relative flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    {s.label}
                  </span>
                  <span className="text-xl font-bold text-white/95 tracking-tight">{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroCountdown
