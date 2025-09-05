import MultiStepForm from '@/components/daftar/MultiStepForm'
import { getTranslations } from 'next-intl/server'

export default async function DaftarPage() {
  const t = await getTranslations('FormPage')
  return (
    <div className="relative isolate w-full min-h-screen overflow-hidden pt-36 pb-24 text-white before:absolute before:inset-0 before:-z-30 before:bg-[#140A08] after:absolute after:inset-0 after:-z-20 after:bg-[radial-gradient(circle_at_40%_30%,rgba(230,140,90,0.18),transparent_70%)]">
      {/* Enhanced SVG Grid (matching intro style) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-25 [mask-image:radial-gradient(circle_at_45%_30%,white,transparent_78%)]"
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="denseGridMinorDaftar" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </pattern>
            <pattern
              id="denseGridMajorDaftar"
              width="160"
              height="160"
              patternUnits="userSpaceOnUse"
            >
              <rect
                width="160"
                height="160"
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="1.1"
              />
            </pattern>
            <mask id="gridFadeMaskDaftar">
              <rect width="100%" height="100%" fill="url(#gradMaskDaftar)" />
            </mask>
            <radialGradient id="gradMaskDaftar" cx="45%" cy="30%" r="75%">
              <stop offset="0%" stopColor="white" />
              <stop offset="85%" stopColor="black" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#denseGridMinorDaftar)" />
          <rect width="100%" height="100%" fill="url(#denseGridMajorDaftar)" />
          <rect
            width="100%"
            height="100%"
            fill="url(#denseGridMinorDaftar)"
            className="opacity-40 [filter:blur(1px)]"
            mask="url(#gridFadeMaskDaftar)"
          />
        </svg>
      </div>
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 md:px-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="w-full">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] tracking-wider uppercase text-white/55 backdrop-blur-sm mb-6">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse" />
            {t('Page.Badge')}
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-[#FCEFEA] via-white to-[#FCEFEA]/70 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent drop-shadow-sm md:text-5xl">
            {t('Page.Heading')}
          </h1>
          <p className="mb-10 max-w-2xl text-sm md:text-base leading-relaxed text-[#FCEFEA]/75">
            {t('Page.Description')}
          </p>
          <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-md shadow-[0_4px_30px_-5px_rgba(0,0,0,0.45)] ring-1 ring-white/5">
            <MultiStepForm />
          </div>
        </div>
      </div>
    </div>
  )
}
