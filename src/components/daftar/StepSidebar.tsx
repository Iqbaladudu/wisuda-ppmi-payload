import React from 'react'
import { useTranslations } from 'next-intl'

interface StepSidebarProps {
  currentStep: number
  steps: { id: string; title: string; description: string }[]
}

// Purely presentational sidebar showing steps with a subtle gradient + animation.
const StepSidebar: React.FC<StepSidebarProps> = ({ currentStep, steps }) => {
  const t = useTranslations('FormPage')
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 rounded-xl bg-gradient-to-b from-[#3E2522] via-[#56332F] to-[#3E2522] p-6 text-[#FCEFEA] shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_30%_20%,white,transparent_70%)]" />
      <h2 className="text-xl font-bold mb-6 tracking-wide">{t('Page.Heading')}</h2>
      <ul className="space-y-4">
        {steps.map((s, idx) => {
          const active = idx === currentStep
          const completed = idx < currentStep
          return (
            <li key={s.title} className="group relative">
              <div
                className={
                  'flex items-start gap-3 rounded-lg border border-white/10 px-4 py-3 backdrop-blur-sm transition-all duration-300 ' +
                  (active
                    ? 'bg-white/15 shadow-md scale-[1.02]'
                    : completed
                      ? 'bg-white/10 hover:bg-white/15'
                      : 'bg-white/5 hover:bg-white/10')
                }
              >
                <div
                  className={
                    'mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ring-2 ring-inset transition-all ' +
                    (active
                      ? 'bg-[#FCEFEA] text-[#3E2522] ring-[#FCEFEA]/70'
                      : completed
                        ? 'bg-[#FCEFEA]/80 text-[#3E2522] ring-[#FCEFEA]/40'
                        : 'bg-transparent text-[#FCEFEA] ring-white/40')
                  }
                >
                  {completed ? '✓' : idx + 1}
                </div>
                <div className="flex-1 space-y-0.5">
                  <p
                    className={
                      'text-sm font-semibold tracking-wide ' +
                      (active ? 'text-[#FCEFEA]' : 'text-[#FCEFEA]/80')
                    }
                  >
                    {s.title}
                  </p>
                  <p className="text-[11px] leading-snug text-[#FCEFEA]/60 line-clamp-2">
                    {s.description}
                  </p>
                </div>
                {active && (
                  <span className="absolute -left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#FCEFEA]/30 blur-xl animate-pulse" />
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default StepSidebar
