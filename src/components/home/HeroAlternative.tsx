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


export const HeroAlternative: React.FC<HeroAlternativeProps> = ({
  date,
  onGuideClick,
  onRegisterClick,
  className,
}) => {
  const ceremonyDate = date ? new Date(date) : null
  const dayFormatted = ceremonyDate?.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden text-white',
        'py-32 md:py-48 lg:py-56 min-h-screen',
        // solid base color
        'before:absolute before:inset-0 before:-z-30 before:bg-[#140A08]',
        // centered radial warmth
        'after:absolute after:inset-0 after:-z-20 after:bg-[radial-gradient(circle_at_50%_50%,rgba(230,140,90,0.15),transparent_65%)]',
        className,
      )}
      aria-labelledby="hero-alt-heading"
    >
      {/* Glows & shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Symmetric radial glows */}
        <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-white via-[#D97A47]/25 to-transparent blur-3xl opacity-80" />
        <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-gradient-to-bl from-white via-[#D97A47]/25 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/3 -left-20 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-[#E07C45]/40 via-[#B8451A]/25 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-gradient-to-tl from-[#E07C45]/40 via-[#B8451A]/25 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[110%] -translate-x-1/2 rounded-t-[55%] bg-gradient-to-t from-[#0E0605] to-transparent" />
        {/* Symmetric grid pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.18]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="heroGrid" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="translate(0,0)">
              <rect
                x="0"
                y="0"
                width="120"
                height="120"
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="0.8"
              />
              <path
                d="M60 0 L60 120 M0 60 L120 60"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.5"
              />
              <path
                d="M30 0 L30 120 M90 0 L90 120 M0 30 L120 30 M0 90 L120 90"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="0.4"
              />
            </pattern>
            <radialGradient id="gridFade" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="white" stopOpacity="0.8" />
              <stop offset="50%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="black" stopOpacity="0.9" />
            </radialGradient>
            <mask id="gridMask">
              <rect width="100%" height="100%" fill="url(#gridFade)" />
            </mask>
            <linearGradient id="gridSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.04)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" mask="url(#gridMask)" />
          <rect width="100%" height="100%" fill="url(#gridSheen)" mask="url(#gridMask)" />
        </svg>
        {/* Centered spotlight overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,195,150,0.22),transparent_60%)] mix-blend-screen" />
        {/* Bottom connector gradient */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent via-[#140A08]/70 to-[#0A0605]" />
      </div>

      {/* Symmetric floating decorative motion shapes */}
      <FloatingShape
        className="top-24 left-16 h-20 w-20 bg-gradient-to-br from-[#FFCDB8]/60 to-[#955437]/45 blur-xl"
        delay={0.3}
        duration={14}
        scale={1.3}
      />
      <FloatingShape
        className="top-24 right-16 h-20 w-20 bg-gradient-to-bl from-[#FFCDB8]/60 to-[#955437]/45 blur-xl"
        delay={0.3}
        duration={14}
        scale={1.3}
      />
      <FloatingShape
        className="bottom-32 left-20 h-24 w-24 bg-gradient-to-tr from-[#E07C45]/60 to-[#F5B296]/40 blur-2xl"
        delay={0.8}
        duration={18}
        scale={1.4}
      />
      <FloatingShape
        className="bottom-32 right-20 h-24 w-24 bg-gradient-to-tl from-[#E07C45]/60 to-[#F5B296]/40 blur-2xl"
        delay={0.8}
        duration={18}
        scale={1.4}
      />
      <FloatingShape
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 bg-gradient-to-br from-white/40 to-transparent blur-lg"
        delay={0.5}
        duration={16}
        scale={1.2}
      />

      <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12 relative">
        <div className="flex flex-col items-center text-center gap-24 min-h-[80vh] justify-center">
          {/* Headline Block */}
          <motion.div
            className="space-y-12 max-w-5xl mx-auto"
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
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-3 rounded-full bg-white/10 px-8 py-3 text-[13px] font-medium tracking-wide ring-1 ring-white/15 backdrop-blur-sm border border-white/10 shadow-lg"
            >
              <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
              Pendaftaran Wisuda <span className="text-white/70 font-semibold">2025</span>
            </motion.div>

            {/* Main Title with Enhanced Animation */}
            <motion.h1
              id="hero-alt-heading"
              className="font-extrabold tracking-tight text-5xl leading-[1.05] md:text-7xl lg:text-8xl drop-shadow-lg"
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

            {/* Enhanced Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-normal px-4"
            >
              Bergabunglah dalam momen bersejarah perayaan prestasi akademik di tanah suci Mesir
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full max-w-2xl mx-auto"
            >
              <CountdownTimer targetDate={ceremonyDate} />
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 pt-4 w-full max-w-2xl mx-auto"
            >
              <Button
                onClick={onRegisterClick}
                className="group relative overflow-hidden rounded-xl px-10 py-5 text-base font-semibold tracking-wide shadow-xl shadow-black/40 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <span className="absolute inset-0 -z-10 bg-gradient-to-r from-[#E07C45] via-[#D66837] to-[#B8451A]" />
                <span className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition backdrop-blur-[2px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_60%)]" />
                <span className="flex items-center gap-3">
                  Gabung Sekarang{' '}
                  <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={onGuideClick}
                className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white rounded-xl backdrop-blur shadow-xl shadow-black/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 px-10 py-5 text-base"
              >
                <Play size={16} className="mr-2" /> Panduan
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroAlternative
