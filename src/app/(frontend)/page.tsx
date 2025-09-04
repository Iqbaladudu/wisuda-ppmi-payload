'use client'

import dynamic from 'next/dynamic'
import HeroCountdown from '@/components/home/HeroCountdown'
import RegistrantsByMajor from '@/components/home/RegistrantsByMajor'
import YearlyStats from '@/components/home/YearlyStats'

const SimpleSlider = dynamic(
  () => import('@/components/home/SimpleSlider').then((mod) => ({ default: mod.SimpleSlider })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ),
  },
)

const VENUE_IMAGES = [
  { src: '/images/venue1.jpg', alt: 'Venue 1' },
  { src: '/images/venue2.jpg', alt: 'Venue 2' },
  { src: '/images/venue3.jpg', alt: 'Venue 3' },
]

const DOCUMENTATION = [
  { year: 2021, img: '/images/doc2021.jpg' },
  { year: 2022, img: '/images/doc2022.jpg' },
  { year: 2023, img: '/images/doc2023.jpg' },
]

const AFTER_MOVIES = [
  { year: 2022, youtube: 'https://www.youtube.com/watch?v=xxxxx', thumb: '/images/am2022.jpg' },
  { year: 2023, youtube: 'https://www.youtube.com/watch?v=yyyyy', thumb: '/images/am2023.jpg' },
  { year: 2024, youtube: 'https://www.youtube.com/watch?v=zzzzz', thumb: '/images/am2024.jpg' },
]

const DUMMY_TESTIMONI = [
  {
    name: 'Ahmad',
    major: 'Syariah',
    text: 'Pengalaman wisuda yang sangat berkesan! Panitia sangat profesional.',
  },
  {
    name: 'Fatimah',
    major: 'Tafsir',
    text: 'Momen penuh haru dan kebanggaan. Semua terasa hangat dan khidmat.',
  },
  {
    name: 'Ali',
    major: 'Hadits',
    text: 'Organisasi acaranya luar biasa, alur acara tertib dan berkesan.',
  },
  {
    name: 'Siti',
    major: 'Dakwah',
    text: 'Kenangan seumur hidup—tidak akan saya lupakan suasana harunya.',
  },
  {
    name: 'Hasan',
    major: 'Aqidah',
    text: 'Bangga jadi bagian wisuda ini. Semoga tahun depan lebih megah.',
  },
  {
    name: 'Zahra',
    major: 'Syariah',
    text: 'Atmosfernya hangat dan meriah, semua saling mendukung.',
  },
  {
    name: 'Ridwan',
    major: 'Lughah',
    text: 'Dekorasi panggung memukau, detailnya sangat diperhatikan.',
  },
  { name: 'Nurul', major: 'Tafsir', text: 'Sesi prosesi berjalan lancar tanpa hambatan berarti.' },
  {
    name: 'Salma',
    major: 'Hadits',
    text: 'Senang bertemu kembali dengan sahabat seperjuangan di momen ini.',
  },
  {
    name: 'Husain',
    major: 'Syariah',
    text: 'Pelayanan panitia ramah dan solutif setiap kali dibutuhkan.',
  },
  {
    name: 'Maryam',
    major: 'Dakwah',
    text: 'Rangkaian acara kreatif dan penuh nilai—sangat inspiratif.',
  },
  {
    name: 'Bilal',
    major: 'Aqidah',
    text: 'Sistem registrasi cepat dan tertata, tidak perlu antre panjang.',
  },
  {
    name: 'Iman',
    major: 'Syariah',
    text: 'Audio visualnya jernih, membuat suasana semakin hidup.',
  },
  { name: 'Farah', major: 'Tafsir', text: 'Momen pemanggilan nama sangat emosional dan bermakna.' },
  { name: 'Yusuf', major: 'Hadits', text: 'Dokumentasi sigap mengabadikan momen penting kami.' },
  { name: 'Latifah', major: 'Lughah', text: 'Tata panggung elegan tanpa berlebihan—pas sekali.' },
  { name: 'Raihan', major: 'Syariah', text: 'Koordinasi antar tim berjalan sangat solid.' },
  { name: 'Sabrina', major: 'Dakwah', text: 'Narasi pembawa acara menyentuh dan mendalam.' },
  { name: 'Jamal', major: 'Aqidah', text: 'Jeda antar segmen tidak membosankan, alur terjaga.' },
  { name: 'Luqman', major: 'Hadits', text: 'Pengaturan tempat duduk nyaman dan mudah diakses.' },
]

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <HeroCountdown date={new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString()} />

      {/* Registrants per major (client) */}
      <RegistrantsByMajor />

      {/* Venue slider */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FCEFEA] to-white bg-clip-text text-transparent">
              Venue Wisuda
            </h2>
          </div>
          <SimpleSlider
            items={VENUE_IMAGES}
            renderItem={(item: any) => (
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-primary/20 bg-primary/5">
                <div className="absolute inset-0 flex items-center justify-center text-primary/50 text-xs">
                  {item.alt} (Placeholder)
                </div>
              </div>
            )}
          />
        </div>
      </section>

      {/* Documentation slider */}
      <section className="relative py-16 md:py-24">
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(232,122,69,0.18),transparent_65%)]" />
        <div className="mx-auto max-w-6xl px-4 relative">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FCEFEA] via-white to-[#FCEFEA]/80 bg-clip-text text-transparent">
                Dokumentasi Tahun ke Tahun
              </h2>
              <p className="mt-2 text-[11px] md:text-xs text-[#FCEFEA]/60 max-w-md leading-relaxed">
                Jejak visual perjalanan wisuda. Setiap tahun menyimpan cerita dan kebanggaan
                tersendiri.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/60">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse" />
                Arsip Terkurasi
              </span>
            </div>
          </div>
          <SimpleSlider
            ariaLabel="Dokumentasi Wisuda per Tahun"
            variant="fade"
            interval={6000}
            pauseOnHover
            showArrows
            showDots
            items={DOCUMENTATION}
            renderItem={(item: any) => (
              <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#22140E] via-[#2B1810] to-[#150C07] ring-1 ring-[#E07C45]/10">
                {/* decorative layers */}
                <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0%,transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,rgba(232,122,69,0.22),transparent_70%)]" />
                {/* image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-wide text-white/35">
                  Gambar {item.year}
                </div>
                {/* top bar */}
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium text-white/70 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A]" />
                    {item.year}
                  </span>
                  <span className="rounded-full bg-gradient-to-r from-[#E07C45]/20 to-[#B8451A]/20 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#EAB195] border border-[#E07C45]/30 backdrop-blur-sm">
                    Arsip
                  </span>
                </div>
                {/* bottom overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(224,124,69,0.25),transparent_60%)] opacity-70" />
                    <p className="relative z-10 text-[11px] leading-snug text-[#FCEFEA]/80">
                      Dokumentasi resmi wisuda {item.year}. Menangkap momen kebersamaan &
                      pencapaian.
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="relative inline-flex items-center rounded-md bg-gradient-to-r from-[#E07C45] to-[#B8451A] px-3 py-1.5 text-[10px] font-medium text-white shadow/30 shadow-[#E07C45]/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07C45]/40 group"
                      >
                        <span className="relative z-10">Lihat Album</span>
                        <span className="pointer-events-none absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_70%)]" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-white/70 backdrop-blur-sm transition hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
                {/* focus ring overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-[#E07C45]/50 transition" />
              </div>
            )}
          />
        </div>
      </section>

      {/* After movie slider */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl md:tex-2xl font-bold tracking-tight bg-gradient-to-r from-[#FCEFEA] to-white bg-clip-text text-transparent">
              After Movie
            </h2>
          </div>
          <SimpleSlider
            items={AFTER_MOVIES}
            renderItem={(item: any) => (
              <a
                href={item.youtube}
                target="_blank"
                className="group relative block aspect-video overflow-hidden rounded-xl border border-primary/20 bg-primary/5"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-primary/70">
                  <span className="text-xs font-semibold">After Movie {item.year}</span>
                  <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-wide group-hover:bg-primary/20 transition">
                    Tonton di YouTube
                  </span>
                </div>
              </a>
            )}
          />
        </div>
      </section>

      {/* Yearly stats (client) */}
      <YearlyStats />

      {/* Testimonials */}
      <section className="relative py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(224,124,69,0.22),transparent_65%)]" />
        <div className="mx-auto max-w-6xl px-4 relative">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FCEFEA] via-white to-[#FCEFEA]/70 bg-clip-text text-transparent">
                Testimoni Alumni
              </h2>
              <p className="mt-3 text-[11px] md:text-xs text-[#FCEFEA]/60 max-w-lg leading-relaxed">
                Suara mereka yang telah merasakan momen puncak perjalanan akademik. Cerita singkat
                yang merekam rasa syukur, haru, dan kebanggaan.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/65 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse" />
                Kurasi Otentik
              </span>
            </div>
          </div>
          <SimpleSlider
            ariaLabel="Testimoni Alumni"
            variant="scale"
            interval={7000}
            pauseOnHover
            showArrows
            showDots
            items={Array.from({ length: Math.ceil(DUMMY_TESTIMONI.length / 3) }, (_, i) =>
              DUMMY_TESTIMONI.slice(i * 3, i * 3 + 3),
            )}
            renderItem={(group: any) => (
              <div className="grid gap-5 md:grid-cols-3">
                {group.map((t: any, idx: number) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-xl border border-white/12 bg-gradient-to-br from-[#20140F] via-[#261711] to-[#140B07] p-5 backdrop-blur-sm ring-1 ring-[#E07C45]/10"
                  >
                    {/* subtle overlays */}
                    <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.07),transparent_60%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(224,124,69,0.18),transparent_55%)]" />
                    {/* quote icon */}
                    <div className="mb-3 flex items-center gap-2 text-[10px] font-medium tracking-wide text-[#EAB195]/70">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#E07C45]/30 to-[#B8451A]/20 text-[#FCEFEA] text-xs font-bold">
                        “
                      </span>
                      <span className="uppercase">Testimoni</span>
                    </div>
                    <p className="relative z-10 text-[12px] leading-relaxed text-[#FCEFEA]/80">
                      <span className="italic">"{t.text}"</span>
                    </p>
                    <div className="mt-5 flex items-center justify-between text-[11px] font-medium text-[#EAB195]/70">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#E07C45] to-[#B8451A] text-[10px] font-semibold text-white flex items-center justify-center shadow ring-1 ring-white/20">
                          {t.name.charAt(0)}
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="text-[11px] text-[#FCEFEA]/85 font-semibold">
                            {t.name}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-white/40">
                            {t.major}
                          </span>
                        </div>
                      </div>
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[9px] tracking-wide text-white/55 backdrop-blur-sm">
                        Alumni
                      </span>
                    </div>
                    {/* hover ring */}
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 group-hover:ring-[#E07C45]/50 transition" />
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      </section>
    </div>
  )
}
