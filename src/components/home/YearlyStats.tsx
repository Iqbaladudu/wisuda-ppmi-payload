'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LineChart,
  Line,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TrendingUp, BarChart2 } from 'lucide-react'

interface YearStat {
  year: number
  total: number
}

async function fetchYearly(): Promise<YearStat[]> {
  try {
    const response = await fetch('/api/yearly-stats')
    if (!response.ok) throw new Error('Failed to fetch data')
    return await response.json()
  } catch (error) {
    console.error('Error fetching yearly stats:', error)
    return []
  }
}

type ChartMode = 'bar' | 'line'

export const YearlyStats = () => {
  const { data: statsRaw = [], isLoading: loading } = useQuery({
    queryKey: ['yearly-stats'],
    queryFn: fetchYearly,
    staleTime: 1000 * 60, // 1m
  })

  const [mode, setMode] = React.useState<ChartMode>('bar')

  const stats = React.useMemo(() => {
    const ordered = [...statsRaw].sort((a, b) => a.year - b.year)
    let prev: number | null = null
    return ordered.map((s) => {
      const growth = prev ? ((s.total - prev) / prev) * 100 : null
      prev = s.total
      return { ...s, growth }
    })
  }, [statsRaw])

  const totals = React.useMemo(() => {
    if (!stats.length) return { sum: 0, avg: 0, cagr: 0, last: 0, diff: 0 }
    const sum = stats.reduce((acc, s) => acc + s.total, 0)
    const avg = sum / stats.length
    const first = stats[0].total
    const last = stats[stats.length - 1].total
    const years = Math.max(stats.length - 1, 1)
    const cagr = first > 0 ? (Math.pow(last / first, 1 / years) - 1) * 100 : 0
    const prev = stats.length > 1 ? stats[stats.length - 2].total : last
    const diff = last - prev
    return { sum, avg, cagr, last, diff }
  }, [stats])

  const chartConfig = {
    total: { label: 'Wisudawan', color: 'hsl(var(--primary))' },
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <HeaderSkeleton />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm animate-pulse"
              />
            ))}
          </div>
          <div className="mt-10 h-[360px] w-full rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm animate-pulse" />
        </div>
      </section>
    )
  }

  if (!stats.length) {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#FCEFEA] to-white bg-clip-text text-transparent">
            Statistik Wisudawan per Tahun
          </h2>
          <p className="mt-3 text-sm text-[#FCEFEA]/70 max-w-md mx-auto">
            Belum ada data yang dapat ditampilkan.
          </p>
        </div>
      </section>
    )
  }

  const max = Math.max(...stats.map((s) => s.total), 1)

  return (
    <section className="py-16 md:py-24" aria-labelledby="yearly-stats-heading">
      <div className="mx-auto max-w-6xl px-4">
        <Header />

        {/* KPI Cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Wisudawan" value={totals.sum} hint="Akumulasi" />
          <MetricCard label="Rata-rata / Tahun" value={totals.avg} format="float" hint="Mean" />
          <MetricCard
            label="CAGR"
            value={totals.cagr}
            suffix="%"
            format="float"
            hint="Pertumbuhan rata-rata"
          />
          <MetricCard
            label="Tahun Terakhir"
            value={totals.last}
            diff={totals.diff}
            hint="Perubahan thn"
          />
        </div>

        {/* Chart Card */}
        <div className="mt-12 relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#E07C45]/25 via-[#B8451A]/10 to-transparent blur-2xl opacity-50 pointer-events-none" />
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 md:p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
            <div className="relative flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3
                  id="yearly-stats-heading"
                  className="text-sm font-semibold tracking-wide text-[#FCEFEA]/80 uppercase"
                >
                  Perbandingan Tahunan
                </h3>
                <p className="mt-1 text-[11px] md:text-xs text-[#FCEFEA]/60 max-w-xs">
                  Visualisasi tren wisudawan dan persentase pertumbuhan setiap tahun.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ModeButton
                  active={mode === 'bar'}
                  onClick={() => setMode('bar')}
                  icon={<BarChart2 className="h-3.5 w-3.5" />}
                >
                  Bar
                </ModeButton>
                <ModeButton
                  active={mode === 'line'}
                  onClick={() => setMode('line')}
                  icon={<TrendingUp className="h-3.5 w-3.5" />}
                >
                  Line
                </ModeButton>
              </div>
            </div>
            <div className="relative mt-6 h-[360px]">
              <ChartContainer config={chartConfig} className="aspect-[16/7]">
                {mode === 'bar' ? (
                  <BarChart data={stats} margin={{ left: 8, right: 8, top: 20 }}>
                    <defs>
                      <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FCEFEA" stopOpacity={0.9} />
                        <stop offset="80%" stopColor="#E07C45" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="year"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'rgba(255,255,255,.55)', fontSize: 12 }}
                    />
                    <YAxis hide domain={[0, Math.ceil(max * 1.15)]} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                      content={<ChartTooltipContent />}
                      formatter={(value: any, name: any, item: any) => [value, 'Wisudawan']}
                    />
                    <ReferenceLine
                      y={totals.avg}
                      stroke="#ffffff33"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Rata2',
                        position: 'right',
                        fill: 'rgba(255,255,255,.5)',
                        fontSize: 10,
                      }}
                    />
                    <Bar dataKey="total" fill="url(#barFill)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={stats} margin={{ left: 8, right: 8, top: 20 }}>
                    <defs>
                      <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E07C45" stopOpacity={0.4} />
                        <stop offset="90%" stopColor="#B8451A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="year"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'rgba(255,255,255,.55)', fontSize: 12 }}
                    />
                    <YAxis hide domain={[0, Math.ceil(max * 1.15)]} />
                    <Tooltip
                      cursor={{ stroke: 'rgba(255,255,255,0.4)' }}
                      content={<ChartTooltipContent />}
                      formatter={(value: any) => [value, 'Wisudawan']}
                    />
                    <ReferenceLine
                      y={totals.avg}
                      stroke="#ffffff33"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Rata2',
                        position: 'right',
                        fill: 'rgba(255,255,255,.5)',
                        fontSize: 10,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#E07C45"
                      strokeWidth={2}
                      dot={{ r: 3, stroke: '#fff', strokeWidth: 1 }}
                      activeDot={{ r: 5 }}
                      fill="url(#lineFill)"
                    />
                  </LineChart>
                )}
              </ChartContainer>
            </div>
            {/* Growth Badges overlay */}
            <div className="relative mt-4 flex flex-wrap gap-2 text-[10px] md:text-[11px]">
              {stats.map((s) => (
                <span
                  key={s.year}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-2 py-1 backdrop-blur-md',
                    s.growth && s.growth > 0
                      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                      : s.growth && s.growth < 0
                        ? 'border-rose-400/30 bg-rose-400/10 text-rose-200'
                        : 'border-white/15 bg-white/5 text-white/70',
                  )}
                >
                  <span className="font-semibold tabular-nums">{s.year}</span>
                  {s.growth !== null && (
                    <span className="font-mono">
                      {s.growth > 0 ? '+' : ''}
                      {s.growth.toFixed(1)}%
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricCard({
  label,
  value,
  suffix,
  diff,
  hint,
  format = 'int',
}: {
  label: string
  value: number
  suffix?: string
  diff?: number
  hint?: string
  format?: 'int' | 'float'
}) {
  const isPositive = diff !== undefined && diff > 0
  const isNegative = diff !== undefined && diff < 0
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent p-4 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#FCEFEA]/60">
            {label}
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-semibold tabular-nums text-[#FCEFEA]">
              {format === 'float' ? value.toFixed(1) : Math.round(value).toLocaleString()}
            </span>
            {suffix && <span className="text-xs text-[#FCEFEA]/60">{suffix}</span>}
          </div>
        </div>
        {diff !== undefined && (
          <span
            className={cn(
              'mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium backdrop-blur-md border',
              isPositive && 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
              isNegative && 'bg-rose-400/10 text-rose-300 border-rose-400/30',
              !isPositive && !isNegative && 'bg-white/5 text-white/60 border-white/15',
            )}
          >
            {diff > 0 ? '+' : ''}
            {diff}
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-3 text-[10px] leading-relaxed text-[#FCEFEA]/50 line-clamp-2">{hint}</p>
      )}
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? 'default' : 'outline'}
      onClick={onClick}
      className={cn(
        'h-8 rounded-full border transition-colors',
        active
          ? 'bg-gradient-to-r from-[#E07C45] to-[#B8451A] text-white border-transparent shadow'
          : 'bg-white/5 border-white/15 text-white/70 hover:text-white',
      )}
    >
      <span className="mr-1.5 inline-flex items-center justify-center">{icon}</span>
      <span className="text-[11px] font-medium">{children}</span>
    </Button>
  )
}

function Header() {
  return (
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#FCEFEA] via-white to-[#FCEFEA]/80 bg-clip-text text-transparent">
        Statistik Wisudawan per Tahun
      </h2>
      <p className="mt-3 text-xs md:text-sm text-[#FCEFEA]/70 max-w-2xl mx-auto leading-relaxed">
        Memvisualisasikan dinamika pertumbuhan jumlah wisudawan setiap tahun. Pantau akselerasi,
        konsistensi, dan tren jangka panjang dari awal hingga periode terbaru.
      </p>
    </div>
  )
}

function HeaderSkeleton() {
  return (
    <div className="text-center">
      <div className="mx-auto h-7 w-72 rounded bg-white/10 animate-pulse" />
      <div className="mt-3 mx-auto h-4 w-96 max-w-full rounded bg-white/5 animate-pulse" />
    </div>
  )
}

export default YearlyStats
