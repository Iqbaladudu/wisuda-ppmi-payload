'use client'
import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface HeroStat {
  label: string
  value: number
  suffix?: string
}

// Lightweight CountUp again (duplicated minimal to avoid importing whole HeroAlternative logic)
const CountUp: React.FC<{ target: number; suffix?: string; delay?: number; duration?: number }> = ({
  target,
  suffix = '',
  delay = 0.15,
  duration = 1.4,
}) => {
  const ref = React.useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = React.useState(0)
  const started = React.useRef(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const run = (now: number) => {
              const p = Math.min(1, (now - start) / (duration * 1000))
              const eased = 1 - Math.pow(1 - p, 3)
              setDisplay(Math.round(eased * target))
              if (p < 1) requestAnimationFrame(run)
            }
            setTimeout(() => requestAnimationFrame(run), delay * 1000)
          }
        })
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, delay, duration])
  return (
    <span ref={ref} className="tabular-nums font-bold tracking-tight">
      {display}
      {suffix}
    </span>
  )
}

export interface HeroStatsSectionProps {
  stats: HeroStat[]
  progressPercent: number
  currentRegistrants?: number
  targetRegistrants?: number
}

export const HeroStatsSection: React.FC<HeroStatsSectionProps> = ({
  stats,
  progressPercent,
  currentRegistrants,
  targetRegistrants,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-12">
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -6 }}
            className="relative overflow-hidden rounded-xl border border-white/12 bg-white/[0.07] px-5 py-5 md:py-6 backdrop-blur-sm shadow-inner shadow-black/30 text-left group"
          >
            <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.13),transparent_60%)] opacity-80 group-hover:opacity-100 transition" />
            <div className="relative flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/55">
                {stat.label}
              </span>
              <span className="text-2xl md:text-3xl font-bold tracking-tight tabular-nums">
                <CountUp target={stat.value} />
                {stat.suffix}
              </span>
            </div>
            <div className="absolute -bottom-7 -right-6 h-20 w-20 rounded-full bg-gradient-to-tr from-primary/25 to-transparent blur-xl opacity-50" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl overflow-hidden ring-1 ring-white/15 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] w-full p-6 md:p-8 backdrop-blur-md shadow-[0_8px_28px_-6px_rgba(0,0,0,0.55)]"
      >
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_65%_40%,rgba(255,255,255,0.18),transparent_70%)]" />
        <div className="relative flex flex-col gap-7">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <span className="text-[11px] uppercase font-semibold tracking-wider text-white/65">
              Indikator Dinamis
            </span>
            <div className="flex items-center gap-2 text-[10px] font-medium text-white/55">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Update
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between text-[11px] font-medium text-white/60">
              <span>Registrasi Berjalan</span>
              <span>{progressPercent > 0 ? `~${progressPercent}%` : '~0%'}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progressPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
                className="h-full rounded-full bg-gradient-to-r from-[#E07C45] via-[#D66837] to-[#B8451A] shadow-[0_0_0_1px_rgba(0,0,0,0.2)_inset]"
              />
            </div>
          </motion.div>
          <p className="text-[12px] leading-relaxed text-white/65 max-w-3xl">
            {typeof currentRegistrants === 'number' && typeof targetRegistrants === 'number'
              ? `Progres pendaftaran: ${currentRegistrants} dari ${targetRegistrants} target.`
              : 'Angka saat ini bersifat ilustratif. Data real-time akan dimuat tanpa menghalangi tampilan utama.'}
          </p>
        </div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-[1px] rounded-2xl"
          initial={{ opacity: 0.4 }}
          animate={{
            background: [
              'linear-gradient(140deg,rgba(255,255,255,0.35),rgba(255,255,255,0.07),rgba(255,255,255,0.3))',
              'linear-gradient(320deg,rgba(255,255,255,0.2),rgba(255,255,255,0.4),rgba(255,255,255,0.15))',
              'linear-gradient(140deg,rgba(255,255,255,0.35),rgba(255,255,255,0.07),rgba(255,255,255,0.3))',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{
            mask: 'linear-gradient(black,black) content-box, linear-gradient(black, black)',
            WebkitMaskComposite: 'xor' as any,
          }}
        />
      </motion.div>
    </div>
  )
}

export default HeroStatsSection
