'use client'

import React from 'react'
import SectionBG from './SectionBG'
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

// Add custom animations using React state for better compatibility

interface CountItem {
  major: string
  count: number
  label?: string
  percentage?: number
  percentageOfLimit?: number
}

// Mapping untuk nama jurusan yang lebih readable
const majorNameMap: Record<string, string> = {
  'SYARIAH_ISLAMIYAH': 'Syariah Islamiyah',
  'USHULUDDIN': 'Ushuluddin',
  'LUGHAH_ARABIYAH': 'Lughah Arabiyah',
  'DAKWAH_WA_USHULUDDIN': 'Dakwah wa Ushuluddin',
  'TARBIYAH_WA_TA_LIM': 'Tarbiyah wa Ta\'lim',
  'ALQURAN_WAL_ULUM': 'Al-Quran wal Ulum',
  'FIQH_WA_USULUHI': 'Fiqh wa Usuluh',
  'TARIKH_WA_TAMADDUN': 'Tarikh wa Tamaddun',
  'IQTISAD_WA_IDARAH': 'Iqtisad wa Idarah',
  'JAMIAT_WA_MUAMALAH': 'Jami\'at wa Mu\'amalah',
}

function getReadableMajorName(item: CountItem): string {
  // Use label from API if available, otherwise fallback to mapping
  if (item.label) {
    return item.label
  }
  return majorNameMap[item.major] || item.major.replace(/_/g, ' ')
}

interface EduItem {
  level: string
  count: number
}

interface ApiResponse {
  data: CountItem[]
  summary: {
    totalRegistrants: number
    maxRegistrants: number | null
    registrationOpen: boolean
    remainingSlots: number | null
    utilizationRate: number | null
  }
}

async function fetchCounts(): Promise<{ data: CountItem[]; summary: ApiResponse['summary'] }> {
  try {
    const response = await fetch('/api/registrants-by-major')
    if (!response.ok) throw new Error('Failed to fetch data')
    const result: ApiResponse = await response.json()
    return { data: result.data, summary: result.summary }
  } catch (error) {
    console.error('Error fetching registrants by major:', error)
    return { data: [], summary: { totalRegistrants: 0, maxRegistrants: null, registrationOpen: true, remainingSlots: null, utilizationRate: null } }
  }
}

async function fetchEdu(): Promise<EduItem[]> {
  try {
    // Coba ambil dari real-time stats API dulu untuk data yang lebih lengkap
    const response = await fetch('/api/stats/real-time')
    if (response.ok) {
      const data = await response.json()
      if (data.breakdowns?.byEducation) {
        return data.breakdowns.byEducation.map((item: any) => ({
          level: item.key,
          count: item.count
        }))
      }
    }
    
    // Fallback ke API lama
    const fallbackResponse = await fetch('/api/registrants-by-education')
    if (fallbackResponse.ok) {
      return await fallbackResponse.json()
    }
    
    return []
  } catch (e) {
    console.error('Error fetching education stats:', e)
    return []
  }
}

export const RegistrantsByMajor = () => {
  const [search, setSearch] = React.useState('')
  const [sort, setSort] = React.useState<
    'COUNT_DESC' | 'COUNT_ASC' | 'ALPHA_ASC' | 'ALPHA_DESC' | 'PERCENT_DESC'
  >('COUNT_DESC')
  const { data: countsData = { data: [], summary: { totalRegistrants: 0, maxRegistrants: null, registrationOpen: true, remainingSlots: null, utilizationRate: null } }, isLoading: loadingMajors } = useQuery({
    queryKey: ['registrants-by-major'],
    queryFn: fetchCounts,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  })
  
  const counts = countsData.data
  const maxRegistrants = countsData.summary.maxRegistrants
  const { data: edu = [], isLoading: loadingEdu } = useQuery({
    queryKey: ['registrants-by-education'],
    queryFn: fetchEdu,
    refetchInterval: 45000,
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
      ? counts.filter((c) => getReadableMajorName(c).toLowerCase().includes(term))
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
    <div className="space-y-12">
      {/* Central Dynamic Hero Element */}
      <div className="relative flex justify-center items-center">
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Main hero card with advanced styling */}
          <div className="relative group">
            {/* Animated background orbs */}
            <div className="absolute -inset-4">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-[#E07C45]/30 to-[#B8451A]/20 rounded-full blur-3xl animate-pulse transition-all duration-1000" />
              <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-r from-[#FCEFEA]/20 to-[#E07C45]/15 rounded-full blur-2xl animate-ping transition-all duration-1000" />
              <div className="absolute top-1/2 left-0 w-20 h-20 bg-gradient-to-r from-[#E89F7C]/25 to-transparent rounded-full blur-xl animate-pulse" />
            </div>
            
            {/* Main card */}
            <div className="relative rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-[#2B1816]/90 via-[#20140F]/80 to-[#150C07]/70 backdrop-blur-xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_30px_60px_-15px_rgba(224,124,69,0.3)]">
              {/* Background effects */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,124,69,0.15)_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.05)_50%,transparent_70%)]" />
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGRkIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC12NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMGgwdjRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
                </div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-medium tracking-wide ring-1 ring-white/15 backdrop-blur mb-6">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse" />
                      <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse delay-100" />
                      <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse delay-200" />
                    </div>
                    Live Update • {new Date().toLocaleDateString('id-ID', { weekday: 'long' })}
                  </div>
                  
                  <div className="relative mb-6">
                    <div className="text-7xl md:text-8xl font-bold tabular-nums bg-gradient-to-br from-[#FFE8DE] via-white to-[#F5C5B2] bg-clip-text text-transparent drop-shadow-2xl transform transition-all duration-500 hover:scale-105">
                      {total.toLocaleString('id-ID')}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#E07C45] to-[#B8451A] rounded-full shadow-lg" />
                  </div>
                  
                  <div className="text-xl md:text-2xl font-semibold text-[#FCEFEA]/90 mb-2">
                    Total Pendaftar Aktif
                  </div>
                  <div className="text-sm md:text-base text-[#FCEFEA]/60 font-light">
                    {new Date().toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {maxRegistrants && (
                      <span className="block mt-1 text-xs text-[#FCEFEA]/50">
                        Kuota tersedia: {maxRegistrants.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Enhanced stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {[
                    {
                      label: 'Program Studi',
                      value: filtered.length,
                      icon: '📚',
                      color: 'from-blue-500/20 to-blue-600/10',
                      borderColor: 'border-blue-400/30'
                    },
                    {
                      label: 'Pendaftar Tertinggi',
                      value: counts.length > 0 ? Math.max(...counts.map(c => c.count)) : 0,
                      icon: '📈',
                      color: 'from-emerald-500/20 to-emerald-600/10',
                      borderColor: 'border-emerald-400/30'
                    },
                    {
                      label: maxRegistrants ? 'Kuota Terisi' : 'Jenjang Pendidikan',
                      value: maxRegistrants ? ((total / maxRegistrants) * 100) : edu.length,
                      suffix: maxRegistrants ? '%' : '',
                      icon: maxRegistrants ? '📊' : '🎓',
                      color: maxRegistrants ? 'from-orange-500/20 to-orange-600/10' : 'from-purple-500/20 to-purple-600/10',
                      borderColor: maxRegistrants ? 'border-orange-400/30' : 'border-purple-400/30'
                    }
                  ].map((stat, index) => (
                    <div 
                      key={index}
                      className="group relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-sm p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color}`} />
                      </div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="text-3xl mb-3 transform transition-transform duration-300 group-hover:scale-110">
                          {stat.icon}
                        </div>
                        <div className="text-3xl md:text-4xl font-bold tabular-nums text-white mb-2">
                          {typeof stat.value === 'number' && stat.suffix === '%' ? stat.value.toFixed(1) : stat.value}
                          {stat.suffix}
                        </div>
                        <div className="text-xs md:text-sm font-medium text-white/70 uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </div>
                      <div className={`absolute inset-0 rounded-2xl border ${stat.borderColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    </div>
                  ))}
                </div>
                
                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
                    style={{
                      left: `${10 + (i * 15)}%`,
                      top: `${20 + (i * 10)}%`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-[#E07C45]/20 via-[#B8451A]/10 to-[#E07C45]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-2 rounded-[2rem] border border-white/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced grid content */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((c, idx) => {
          // Hitung persentase berdasarkan batas maksimal pendaftar
          const percent = maxRegistrants ? (c.count / maxRegistrants) * 100 : (c.count / total) * 100
          const rank = idx + 1
          const isTopThree = rank <= 3
          
          return (
            <div
              key={c.major}
              className={cn(
                'group relative overflow-hidden rounded-2xl border bg-gradient-to-br backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl',
                isTopThree 
                  ? 'border-yellow-400/30 from-yellow-400/10 via-white/10 to-transparent shadow-[0_8px_32px_-8px_rgba(255,215,0,0.2)]' 
                  : 'border-white/12 from-white/[0.08] to-transparent shadow-[0_4px_18px_-5px_rgba(0,0,0,0.55)]'
              )}
              style={{ 
                animationDelay: `${idx * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              {/* Background effects */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className={`absolute inset-0 bg-gradient-to-br ${isTopThree ? 'from-yellow-400/5 to-transparent' : 'from-[#E07C45]/5 to-transparent'}`} />
              </div>
              
              {/* Rank badge */}
              <div className={cn(
                'absolute top-4 right-4 z-20',
                isTopThree && 'animate-pulse'
              )}>
                <div className={cn(
                  'relative flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold backdrop-blur-sm border',
                  isTopThree 
                    ? rank === 1 
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-yellow-300/50 shadow-lg'
                      : rank === 2
                      ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white border-gray-200/50'
                      : 'bg-gradient-to-br from-amber-600 to-amber-800 text-white border-amber-500/50 shadow-lg'
                    : 'bg-white/10 text-white/70 border-white/20'
                )}>
                  {rank}
                  {isTopThree && (
                    <div className="absolute -top-1 -right-1">
                      <span className="text-lg">🏆</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative p-6">
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <span className={cn(
                      'block text-sm font-bold uppercase tracking-wider truncate transition-colors duration-300',
                      isTopThree 
                        ? 'text-yellow-300 group-hover:text-yellow-200' 
                        : 'text-white/80 group-hover:text-white'
                    )}>
                      {getReadableMajorName(c)}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        'text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm border',
                        isTopThree 
                          ? 'bg-yellow-400/20 text-yellow-200 border-yellow-400/30' 
                          : 'bg-white/10 text-white/70 border-white/15'
                      )}>
                        {isTopThree ? 'Top ' + rank : `Rank ${rank}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-right">
                      <span className={cn(
                        'text-3xl font-bold tabular-nums tracking-tight drop-shadow transition-all duration-300 group-hover:scale-110',
                        isTopThree 
                          ? 'text-yellow-300' 
                          : 'text-white'
                      )}>
                        {c.count}
                      </span>
                    </div>
                    
                    <div className="relative">
                      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/5">
                        <div
                          className={cn(
                            'h-full rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.18)_inset] transition-all duration-1000 ease-out',
                            isTopThree 
                              ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600' 
                              : 'bg-gradient-to-r from-[#E07C45] via-[#D9683A] to-[#B8451A]'
                          )}
                          style={{ 
                            width: `${percent}%`,
                            boxShadow: isTopThree ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.3),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className={cn(
                        'font-medium',
                        isTopThree 
                          ? 'text-yellow-300/80' 
                          : 'text-white/60'
                      )}>
                        {percent.toFixed(1)}%
                      </span>
                      <span className="text-white/40 font-medium tracking-wide">
                        {maxRegistrants ? 'dari kuota' : 'dari total'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover effects */}
              <div className={cn(
                'absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                isTopThree 
                  ? 'border-yellow-400/50 shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
                  : 'border-[#E07C45]/50 shadow-[0_0_20px_rgba(224,124,69,0.3)]'
              )} />
              
              {/* Floating particles on hover */}
              {isTopThree && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-yellow-400/60 rounded-full animate-ping"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  const SectionHeader = () => {
    const eduTotal = edu.reduce((a, b) => a + b.count, 0)
    return (
      <div className="mb-14 space-y-10 text-center">
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
        <div className="mx-auto flex flex-col gap-8">
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
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">
              <span className="tabular-nums font-semibold">Jenjang {eduTotal}</span>
              <span className="text-white/50">total</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5 md:items-center md:justify-center">
            <div className="relative w-full md:w-72">
              <Input
                placeholder="Cari jurusan (Syariah, Ushuluddin, Lughah...)"
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

          {/* Education level mini cards */}
          <div className="flex flex-wrap justify-center gap-4">
            {loadingEdu ? (
              // Loading skeleton untuk education cards
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-xl border border-white/12 bg-white/[0.08] px-5 py-4 backdrop-blur-md shadow-inner shadow-black/40 min-w-[120px] text-left animate-pulse"
                >
                  <div className="relative flex flex-col gap-1">
                    <div className="h-3 w-8 rounded bg-white/15" />
                    <div className="h-6 w-12 rounded bg-white/12" />
                    <div className="h-1.5 w-full rounded-full bg-white/10" />
                    <div className="h-3 w-6 rounded bg-white/10" />
                  </div>
                </div>
              ))
            ) : (
              edu.map((e) => {
                const pct = eduTotal ? Math.round((e.count / eduTotal) * 100) : 0
                return (
                  <div
                    key={e.level}
                    className="relative overflow-hidden rounded-xl border border-white/12 bg-white/[0.08] px-5 py-4 backdrop-blur-md shadow-inner shadow-black/40 min-w-[120px] text-left"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.15),transparent_55%)]" />
                    <div className="relative flex flex-col gap-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                        {e.level}
                      </span>
                      <span className="text-xl font-bold tabular-nums tracking-tight">
                        {e.count}
                      </span>
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E07C45] via-[#D9683A] to-[#B8451A]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-white/50 font-medium">{pct}%</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loadingMajors) {
    return (
      <SectionBG className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8 relative">
          <SectionHeader />
          <LoadingSkeleton />
        </div>
      </SectionBG>
    )
  }

  return (
    <SectionBG className="py-24 md:py-32">
      <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#F9C6B0]/30 via-[#E89F7C]/25 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-tr from-[#E07C45]/25 to-transparent blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 md:px-8 relative">
        <SectionHeader />
        <ContentGrid />
      </div>
    </SectionBG>
  )
}

export default RegistrantsByMajor
