'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

interface CountItem {
  major: string
  count: number
}

async function fetchCounts(): Promise<CountItem[]> {
  try {
    const response = await fetch('/api/registrants-by-major')
    if (!response.ok) throw new Error('Failed to fetch data')
    return await response.json()
  } catch (error) {
    console.error('Error fetching registrants by major:', error)
    return []
  }
}

export const RegistrantsByMajor = () => {
  const [search, setSearch] = React.useState('')
  const [sort, setSort] = React.useState<
    'COUNT_DESC' | 'COUNT_ASC' | 'ALPHA_ASC' | 'ALPHA_DESC' | 'PERCENT_DESC'
  >('COUNT_DESC')
  const { data: counts = [], isLoading: loading } = useQuery({
    queryKey: ['registrants-by-major'],
    queryFn: fetchCounts,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  })

  const LoadingSkeleton = () => (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md animate-pulse shadow-inner shadow-black/30"
        >
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_45%)]" />
          <div className="relative flex flex-col gap-3">
            <div className="h-3 w-2/3 rounded bg-white/15" />
            <div className="h-6 w-16 rounded bg-white/12" />
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-white/40 to-white/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const max = counts.length ? Math.max(...counts.map((c) => c.count), 1) : 1
  const total = counts.reduce((a, b) => a + b.count, 0)
  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase()
    let list = term
      ? counts.filter((c) => c.major.replace(/_/g, ' ').toLowerCase().includes(term))
      : counts.slice()
    list.sort((a, b) => {
      switch (sort) {
        case 'COUNT_ASC':
          return a.count - b.count
        case 'COUNT_DESC':
          return b.count - a.count
        case 'ALPHA_ASC':
          return a.major.localeCompare(b.major)
        case 'ALPHA_DESC':
          return b.major.localeCompare(a.major)
        case 'PERCENT_DESC':
          return b.count / max - a.count / max
        default:
          return 0
      }
    })
    return list
  }, [counts, search, sort, max])

  const ContentGrid = () => (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filtered.map((c, idx) => {
        const percent = (c.count / max) * 100
        return (
          <div
            key={c.major}
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.08] p-4 backdrop-blur-md shadow-[0_4px_18px_-5px_rgba(0,0,0,0.55)] transition',
              'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition',
            )}
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <div className="relative flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <span className="block truncate text-[11px] font-semibold uppercase tracking-wider text-white/70">
                    {c.major.replace(/_/g, ' ')}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70 ring-1 ring-white/15">
                    Rank {idx + 1}
                  </span>
                </div>
                <span className="text-2xl font-bold tabular-nums tracking-tight text-white drop-shadow">
                  {c.count}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/5 relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E07C45] via-[#D9683A] to-[#B8451A] shadow-[0_0_0_1px_rgba(255,255,255,0.15)_inset] transition-[width] duration-700 ease-out"
                  style={{ width: `${percent}%` }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.4),transparent_60%)]" />
              </div>
              <div className="flex items-center justify-between pt-1 text-[10px] text-white/50 font-medium">
                <span>{percent.toFixed(0)}%</span>
                <span className="tracking-wide">{((c.count / total) * 100).toFixed(1)}% total</span>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#E07C45]/40 to-transparent blur-2xl opacity-30 group-hover:opacity-60 transition" />
          </div>
        )
      })}
    </div>
  )

  const SectionHeader = () => (
    <div className="mb-12 space-y-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium tracking-wide ring-1 ring-white/15 backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Live Enrollment Stats
          <span className="text-white/60">{new Date().getFullYear()}</span>
        </div>
        <h2 className="mx-auto max-w-2xl font-extrabold tracking-tight text-3xl md:text-5xl bg-gradient-to-br from-[#FFE8DE] via-white to-[#F5C5B2] bg-clip-text text-transparent drop-shadow-md">
          Update Pendaftar per Jurusan
        </h2>
        <p className="mx-auto max-w-xl text-xs md:text-sm leading-relaxed text-[#FAD9CC]/90 font-medium">
          Data real-time dari pendaftar yang telah mengisi formulir. Visualisasi membantu panitia
          memonitor distribusi fakultas dan jurusan.
        </p>
      </div>
      <div className="mx-auto flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-white/70">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A]" />
            <span>Proporsi Jurusan</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
            <span className="tabular-nums font-semibold">Total {total}</span>
            <span className="text-white/50">pendaftar</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
            <span className="tabular-nums font-semibold">{filtered.length}</span>
            <span className="text-white/50">jurusan tampil</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-center">
          <div className="relative w-full md:w-72">
            <Input
              placeholder="Cari jurusan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-white/20 bg-white/10 placeholder:text-white/40 text-white focus-visible:ring-white/30"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 text-xs"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <div className="w-full md:w-64">
            <Select value={sort} onValueChange={(v: any) => setSort(v)}>
              <SelectTrigger className="border-white/20 bg-white/10 text-white focus:ring-white/30">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent className="bg-[#2B1816] text-white border-white/10">
                <SelectItem value="COUNT_DESC">Jumlah Terbanyak</SelectItem>
                <SelectItem value="COUNT_ASC">Jumlah Terkecil</SelectItem>
                <SelectItem value="PERCENT_DESC">Persentase Tertinggi</SelectItem>
                <SelectItem value="ALPHA_ASC">A-Z</SelectItem>
                <SelectItem value="ALPHA_DESC">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <section
        className={
          'relative isolate py-20 md:py-28 text-white before:absolute before:inset-0 before:-z-20 before:bg-[radial-gradient(circle_at_60%_35%,#D68A62_0%,#4A2820_45%,#241311_80%)] before:opacity-90 after:absolute after:inset-0 after:-z-10 after:bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.05),transparent_50%),repeating-linear-gradient(45deg,rgba(255,255,255,0.04)_0_10px,transparent_10px_20px)]'
        }
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader />
          <LoadingSkeleton />
        </div>
      </section>
    )
  }

  return (
    <section
      className={
        'relative isolate py-20 md:py-28 text-white before:absolute before:inset-0 before:-z-20 before:bg-[radial-gradient(circle_at_35%_40%,#D68A62_0%,#4A2820_45%,#241311_80%)] before:opacity-95 after:absolute after:inset-0 after:-z-10 after:bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.05),transparent_50%),repeating-linear-gradient(45deg,rgba(255,255,255,0.04)_0_10px,transparent_10px_20px)]'
      }
    >
      <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#F9C6B0]/30 via-[#E89F7C]/25 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-tr from-[#E07C45]/25 to-transparent blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 md:px-8 relative">
        <SectionHeader />
        <ContentGrid />
      </div>
    </section>
  )
}

export default RegistrantsByMajor
