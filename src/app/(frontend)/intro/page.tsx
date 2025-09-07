import Link from 'next/link'
import SectionBG from '@/components/home/SectionBG'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

// Next.js build error: expecting default PageProps, so drop custom param typing & let next-intl infer locale.
export async function generateMetadata() {
  const t = await getTranslations('IntroPage.Metadata')
  return {
    title: t('Title'),
    description: t('Description'),
  }
}

export default function IntroPage() {
  const t = useTranslations('IntroPage')

  return (
    <div className="w-full overflow-x-hidden">
      <SectionBG
        className="min-h-[75vh] flex items-center pt-28 md:pt-32 pb-24 md:pb-32"
        radialPos="40%_25%"
        variant="withGrid"
      >
        {/* Enhanced custom grid overlay (stronger & denser) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-25 [mask-image:radial-gradient(circle_at_45%_30%,white,transparent_78%)]"
        >
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="denseGridMinor" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
              <pattern id="denseGridMajor" width="160" height="160" patternUnits="userSpaceOnUse">
                <rect
                  width="160"
                  height="160"
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1.1"
                />
              </pattern>
              <mask id="gridFadeMask">
                <rect width="100%" height="100%" fill="url(#gradMask)" />
              </mask>
              <radialGradient id="gradMask" cx="45%" cy="30%" r="75%">
                <stop offset="0%" stopColor="white" />
                <stop offset="85%" stopColor="black" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#denseGridMinor)" />
            <rect width="100%" height="100%" fill="url(#denseGridMajor)" />
            <rect
              width="100%"
              height="100%"
              fill="url(#denseGridMinor)"
              className="[filter:blur(1px)] opacity-40"
              mask="url(#gridFadeMask)"
            />
          </svg>
        </div>
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8 relative">
          {/* Heading + Intro */}
          <div className="mb-14 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] tracking-wider uppercase text-white/55 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse" />
              {t('Badge')}
            </div>
            <h1 className="mt-5 text-3xl md:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-[#FCEFEA] via-white to-[#FCEFEA]/70 bg-clip-text text-transparent">
              {t('Heading')}
            </h1>
            <p className="mt-6 text-sm md:text-base leading-relaxed text-[#FCEFEA]/70 max-w-2xl">
              {t('Subheading')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 px-7 text-sm font-semibold bg-gradient-to-r from-[#E07C45] to-[#B8451A] hover:from-[#E07C45]/90 hover:to-[#B8451A]/90 shadow-lg shadow-[#E07C45]/25"
              >
                <Link href="/daftar">{t('StartButton')}</Link>
              </Button>
              <div className="flex items-center gap-2 text-[11px] text-white/40">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] font-medium text-white/60">
                  i
                </span>
                {t('Info')}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid gap-10 md:gap-14 md:grid-cols-[1fr_380px]">
            {/* Requirements Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-[#22140E] via-[#28160F] to-[#140B08] p-8 md:p-12 backdrop-blur-sm ring-1 ring-[#E07C45]/15">
              <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay bg-[radial-gradient(circle_at_68%_24%,rgba(255,255,255,0.07),transparent_65%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgba(224,124,69,0.22),transparent_60%)]" />
              <ol className="relative z-10 space-y-7 md:space-y-9 counter-reset list-none">
                {[
                  t('Requirements.1'),
                  t('Requirements.2'),
                  t('Requirements.3'),
                  t('Requirements.4'),
                ].map((item, i) => (
                  <li key={i} className="group">
                    <div className="flex items-start gap-5">
                      <span className="relative mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#E07C45] to-[#B8451A] text-[13px] font-semibold text-white shadow ring-1 ring-white/25">
                        {i + 1}
                        <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.4),transparent_70%)]" />
                      </span>
                      <p className="text-sm md:text-base leading-relaxed text-[#FCEFEA]/80">
                        {item}
                      </p>
                    </div>
                    {i < 3 && (
                      <div className="mt-7 md:mt-9 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                    )}
                  </li>
                ))}
              </ol>
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5 group-hover:ring-[#E07C45]/40 transition" />
            </div>

            {/* Side Panel */}
            <div className="space-y-8 md:space-y-10">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(224,124,69,0.35),transparent_70%)] opacity-50" />
                <h2 className="text-lg md:text-xl font-semibold tracking-tight bg-gradient-to-r from-[#FCEFEA] to-white bg-clip-text text-transparent">
                  {t('SidePanel.Title')}
                </h2>
                <p className="mt-4 text-[13px] md:text-sm leading-relaxed text-[#FCEFEA]/70">
                  {t('SidePanel.Description')}
                </p>
                <div className="mt-6">
                  <Button
                    asChild
                    size="lg"
                    className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-[#E07C45] to-[#B8451A] hover:from-[#E07C45]/90 hover:to-[#B8451A]/90 shadow shadow-[#E07C45]/25"
                  >
                    <Link href="/daftar">{t('SidePanel.Button')}</Link>
                  </Button>
                  <p className="mt-4 text-[11px] text-white/40 tracking-wide uppercase text-center">
                    {t('SidePanel.Note')}
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#28170F] via-[#1C100B] to-[#120905] p-6 md:p-7 backdrop-blur-sm ring-1 ring-[#E07C45]/10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent_65%)]" />
                <h3 className="text-sm font-semibold tracking-wide text-[#EAB195] uppercase mb-4">
                  {t('ImportantNotes.Title')}
                </h3>
                <ul className="space-y-3 text-[12px] md:text-[13px] leading-relaxed text-[#FCEFEA]/70">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A]" />
                    {t('ImportantNotes.1')}
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A]" />
                    {t('ImportantNotes.2')}
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A]" />
                    {t('ImportantNotes.3')}
                  </li>
                </ul>
                <div className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] text-white/50 leading-relaxed">
                  {t('Warning')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionBG>
    </div>
  )
}
