'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, useMotionValue, useTransform, useSpring, useInView } from 'motion/react'
import dynamic from 'next/dynamic'
import ReactDOM from 'react-dom'
import { ArrowRight, Play } from 'lucide-react'

interface HeroStat {
  label: string
  value: number
  suffix?: string
}

interface HeroAlternativeProps {
  date?: string
  onRegisterClick?: () => void
  onGuideClick?: () => void
  className?: string
  currentRegistrants?: number
  targetRegistrants?: number
  extraStats?: HeroStat[]
}

// CountUp component (restored)
const CountUp: React.FC<{ target: number; suffix?: string; delay?: number; duration?: number }> = ({
  target,
  suffix = '',
  delay = 0.15,
  duration = 1.4,
}) => {
  const ref = React.useRef<HTMLSpanElement | null>(null)
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 120, damping: 20 })
  const rounded = useTransform(spring, (latest) => Math.round(latest))
  const isInView = useInView(ref, { once: true, amount: 0.6 })

  React.useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        motionValue.stop()
        motionValue.set(0)
        const start = performance.now()
        const run = (now: number) => {
          const progress = Math.min(1, (now - start) / (duration * 1000))
          const eased = 1 - Math.pow(1 - progress, 3)
          motionValue.set(eased * target)
          if (progress < 1) requestAnimationFrame(run)
        }
        requestAnimationFrame(run)
      }, delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [isInView, target, delay, duration, motionValue])

  const [display, setDisplay] = React.useState('0')
  React.useEffect(() => {
    const unsub = rounded.on('change', (v) => setDisplay(v.toString()))
    return () => unsub()
  }, [rounded])

  return (
    <span ref={ref} className="tabular-nums font-semibold tracking-tight">
      {display}
      {suffix}
    </span>
  )
}

// Base stats configuration (bisa dikembangkan nanti dari data real)
const BASE_STATS: HeroStat[] = [
  { label: 'Wisudawan Target', value: 120, suffix: '+' },
  { label: 'Fakultas', value: 5, suffix: '+' },
  { label: 'Negara Hadir', value: 10, suffix: '+' },
  { label: 'Dokumentasi', value: 1000, suffix: '+' },
  { label: 'Sesi Utama', value: 3 },
  { label: 'Panel Diskusi', value: 2 },
  { label: 'Tahun Penyelenggaraan', value: 2025 },
]

// Decorative shape component
const FloatingShape: React.FC<{
  className?: string
  delay?: number
  duration?: number
  scale?: number
}> = ({ className, delay = 0, duration = 10, scale = 1 }) => {
  return (
    <motion.div
      aria-hidden
      className={cn('absolute rounded-full mix-blend-screen pointer-events-none', className)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.5, scale, scale * 1.05, scale],
        rotate: [0, 25, -10, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      }}
    />
  )
}

// Countdown Timer
const CountdownTimer: React.FC<{ targetDate: Date | null }> = ({ targetDate }) => {
  const [remaining, setRemaining] = React.useState<number>(() =>
    targetDate ? targetDate.getTime() - Date.now() : 0,
  )

  React.useEffect(() => {
    if (!targetDate) return
    const id = setInterval(() => {
      setRemaining(targetDate.getTime() - Date.now())
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (!targetDate) {
    return (
      <div className="text-white/70 text-sm font-medium">Tanggal resmi akan diumumkan segera.</div>
    )
  }

  if (remaining <= 0) {
    return (
      <div className="flex flex-col items-center gap-3" aria-live="polite">
        <span className="text-xs tracking-wider font-semibold text-white/60 uppercase">
          Hitung Mundur
        </span>
        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-[#FFE8DE] via-white to-[#F5C5B2] bg-clip-text text-transparent">
          Sedang Berlangsung
        </div>
      </div>
    )
  }

  const totalSeconds = Math.floor(remaining / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const segment = (value: number, label: string) => (
    <div className="flex flex-col items-center gap-1 px-2 md:px-3">
      <span className="text-2xl md:text-4xl font-bold tabular-nums tracking-tight bg-gradient-to-br from-[#FFE8DE] via-white to-[#F5C5B2] bg-clip-text text-transparent">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-[11px] font-semibold tracking-wider uppercase text-white/60">
        {label}
      </span>
    </div>
  )

  return (
    <div
      className="flex flex-col items-center gap-4"
      aria-live="polite"
      aria-label="Hitung mundur menuju hari wisuda"
    >
      <span className="text-[11px] md:text-xs font-semibold tracking-widest text-white/55 uppercase">
        Menuju Hari Wisuda
      </span>
      <div className="relative rounded-2xl ring-1 ring-white/15 bg-white/[0.06] backdrop-blur-sm px-3 py-3 md:px-5 md:py-4 shadow-inner shadow-black/30 flex items-stretch gap-1 md:gap-2">
        {segment(days, 'Hari')}
        <div className="w-px bg-white/15 mx-1" />
        {segment(hours, 'Jam')}
        <div className="w-px bg-white/15 mx-1" />
        {segment(minutes, 'Menit')}
        <div className="w-px bg-white/15 mx-1" />
        {segment(seconds, 'Detik')}
        <div className="absolute inset-0 rounded-2xl pointer-events-none bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.18),transparent_70%)]" />
      </div>
    </div>
  )
}

// Lazy load stats heavy section (no SSR) so hero paints instantly
const LazyHeroStatsSection = dynamic(() => import('./HeroStatsSection').then(m => m.HeroStatsSection), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-12" aria-label="Memuat statistik">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full animate-pulse opacity-70">
        {Array.from({length:8}).map((_,i) => (
          <div key={i} className="h-28 rounded-xl border border-white/10 bg-white/[0.06]" />
        ))}
      </div>
      <div className="w-full h-40 rounded-2xl border border-white/10 bg-white/[0.04] animate-pulse" />
    </div>
  )
})

export const HeroAlternative: React.FC<HeroAlternativeProps> = ({
  date,
  onGuideClick,
  onRegisterClick,
  className,
  currentRegistrants,
  targetRegistrants,
  extraStats = [],
}) => {
  const ceremonyDate = date ? new Date(date) : null
  const dayFormatted = ceremonyDate?.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  // Derive dynamic stats
  const derived: HeroStat[] = []
  if (typeof currentRegistrants === 'number' && typeof targetRegistrants === 'number') {
    derived.push({ label: 'Pendaftar Saat Ini', value: currentRegistrants })
    const remaining = Math.max(0, targetRegistrants - currentRegistrants)
    derived.push({ label: 'Kuota Tersisa', value: remaining })
  }

  const allStats: HeroStat[] = [...BASE_STATS, ...derived, ...extraStats]
  // Ensure uniqueness by label (last wins)
  const statMap = new Map<string, HeroStat>()
  allStats.forEach((s) => statMap.set(s.label, s))
  const finalStats = Array.from(statMap.values())

  const totalTarget =
    targetRegistrants ?? BASE_STATS.find((s) => s.label === 'Wisudawan Target')?.value ?? 0
  const progressPercent = totalTarget
    ? Math.min(100, Math.round(((currentRegistrants ?? 0) / totalTarget) * 100))
    : 0

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden text-white',
        'py-28 md:py-40',
        // solid base color
        'before:absolute before:inset-0 before:-z-30 before:bg-[#140A08]',
        // subtle top-left radial warmth
        'after:absolute after:inset-0 after:-z-20 after:bg-[radial-gradient(circle_at_28%_30%,rgba(230,140,90,0.18),transparent_70%)]',
        className,
      )}
      aria-labelledby="hero-alt-heading"
    >
      {/* Glows & shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Radial glows */}
        <div className="absolute -top-40 -left-36 h-[540px] w-[540px] rounded-full bg-gradient-to-br from-white via-[#D97A47]/25 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/4 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-[#E07C45]/40 via-[#B8451A]/25 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[110%] -translate-x-1/2 rounded-t-[55%] bg-gradient-to-t from-[#0E0605] to-transparent" />
        {/* Large grid (big cells) + mask + sheen */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.22]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="heroGrid" width="160" height="160" patternUnits="userSpaceOnUse">
              <rect
                x="0"
                y="0"
                width="160"
                height="160"
                fill="none"
                stroke="rgba(255,255,255,0.085)"
                strokeWidth="1"
              />
              <path
                d="M80 0 L80 160 M0 80 L160 80"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.6"
              />
              <path
                d="M40 0 L40 160 M120 0 L120 160 M0 40 L160 40 M0 120 L160 120"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
            </pattern>
            <radialGradient id="gridFade" cx="35%" cy="30%" r="90%">
              <stop offset="0%" stopColor="white" />
              <stop offset="60%" stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </radialGradient>
            <mask id="gridMask">
              <rect width="100%" height="100%" fill="url(#gridFade)" />
            </mask>
            <linearGradient id="gridSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
              <stop offset="35%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" mask="url(#gridMask)" />
          <rect width="100%" height="100%" fill="url(#gridSheen)" mask="url(#gridMask)" />
        </svg>
        {/* Spotlight overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_32%,rgba(255,195,150,0.25),transparent_70%)] mix-blend-screen" />
        {/* Bottom connector gradient */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent via-[#140A08]/70 to-[#0A0605]" />
      </div>

      {/* Floating decorative motion shapes */}
      <FloatingShape
        className="top-24 left-10 h-20 w-20 bg-gradient-to-br from-[#FFCDB8]/50 to-[#955437]/40 blur-xl"
        delay={0.3}
        duration={14}
        scale={1.4}
      />
      <FloatingShape
        className="bottom-32 right-16 h-24 w-24 bg-gradient-to-tr from-[#E07C45]/55 to-[#F5B296]/35 blur-2xl"
        delay={1}
        duration={18}
        scale={1.5}
      />
      <FloatingShape
        className="top-1/2 left-1/3 h-10 w-10 bg-gradient-to-tr from-white/30 to-transparent"
        delay={0.6}
        duration={12}
        scale={1.2}
      />

      <div className="mx-auto max-w-7xl px-5 md:px-8 relative">
        <div className="flex flex-col items-center text-center gap-16">
          {/* Headline Block */}
          <motion.div
            className="space-y-7 max-w-4xl"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium tracking-wide ring-1 ring-white/15 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Pendaftaran Wisuda <span className="text-white/65">2025</span>
            </div>
            <motion.h1
              id="hero-alt-heading"
              className="font-extrabold tracking-tight text-4xl leading-[1.05] md:text-6xl lg:text-7xl drop-shadow-md"
            >
              {'Convocation Ceremony PPMI Mesir 2025'.split(' ').map((w, i) => (
                <motion.span
                  key={w + i}
                  className={cn(
                    'inline-block bg-gradient-to-br from-[#FFE8DE] via-white to-[#F5C5B2] bg-clip-text text-transparent',
                    i === 0 ? 'pr-2' : 'px-1',
                  )}
                  initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.65,
                    delay: 0.25 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </motion.h1>
            <CountdownTimer targetDate={ceremonyDate} />
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button
                onClick={onRegisterClick}
                className="group relative overflow-hidden rounded-xl px-7 py-5 text-sm font-semibold tracking-wide shadow-lg shadow-black/30"
              >
                <span className="absolute inset-0 -z-10 bg-gradient-to-r from-[#E07C45] via-[#D66837] to-[#B8451A]" />
                <span className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition backdrop-blur-[2px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_60%)]" />
                <span className="flex items-center gap-2">
                  Gabung Sekarang{' '}
                  <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={onGuideClick}
                className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white rounded-xl backdrop-blur shadow-lg shadow-black/20"
              >
                <Play size={15} className="mr-1" /> Panduan
              </Button>
            </div>
          </motion.div>

          {/* Stats Section (lazy) */}
          <LazyHeroStatsSection
            stats={finalStats}
            progressPercent={progressPercent}
            currentRegistrants={currentRegistrants}
            targetRegistrants={targetRegistrants}
          />
        </div>
      </div>
    </section>
  )
}

export default HeroAlternative
