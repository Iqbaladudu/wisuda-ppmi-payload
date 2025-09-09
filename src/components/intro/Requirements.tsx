'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import SectionBG from '@/components/home/SectionBG'

export default function Requirements() {
  const t = useTranslations('Requirements')

  const reRegistrationItems = [
    { key: 'presence', icon: CheckCircle },
    { key: 'qrCode', icon: CheckCircle },
    { key: 'payment', icon: CheckCircle },
  ]

  const specificItems = [
    { key: 'formSchedule', icon: Clock },
    { key: 'representation', icon: CheckCircle },
    { key: 'quota', icon: AlertTriangle },
    { key: 'certificate', icon: CheckCircle },
    { key: 'deadline', icon: Clock },
    { key: 'consequences', icon: AlertTriangle },
    { key: 'graduationConsequences', icon: AlertTriangle },
    { key: 'withdrawalDeadline', icon: Clock },
    { key: 'refund', icon: AlertTriangle },
    { key: 'attributePurchase', icon: CheckCircle },
  ]

  return (
    <SectionBG
      className="min-h-screen"
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

      <div className="mx-auto w-full max-w-6xl px-5 md:px-8 relative py-16">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] tracking-wider uppercase text-white/55 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#E07C45] to-[#B8451A] animate-pulse" />
              {t('title')}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-[#FCEFEA] via-white to-[#FCEFEA]/70 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-[#FCEFEA]/70 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid gap-10 md:gap-14 md:grid-cols-[1fr_380px]">
            {/* Main Content */}
            <div className="space-y-8">
              {/* Re-registration Requirements */}
              <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-[#22140E] via-[#28160F] to-[#140B08] p-8 md:p-12 backdrop-blur-sm ring-1 ring-[#E07C45]/15">
                <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay bg-[radial-gradient(circle_at_68%_24%,rgba(255,255,255,0.07),transparent_65%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgba(224,124,69,0.22),transparent_60%)]" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <CheckCircle className="h-6 w-6 text-[#E07C45]" />
                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight bg-gradient-to-r from-[#FCEFEA] to-white bg-clip-text text-transparent">
                      {t('reRegistration.title')}
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {reRegistrationItems.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <div key={item.key} className="group">
                          <div className="flex items-start gap-4">
                            <span className="relative mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#E07C45] to-[#B8451A] text-[12px] font-semibold text-white shadow ring-1 ring-white/25">
                              <Icon className="h-4 w-4" />
                              <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.4),transparent_70%)]" />
                            </span>
                            <div className="space-y-2 flex-1">
                              <h4 className="text-sm md:text-base font-semibold text-[#FCEFEA]/90">
                                {t(`reRegistration.items.${item.key}.title`)}
                              </h4>
                              <p className="text-xs md:text-sm leading-relaxed text-[#FCEFEA]/60">
                                {t(`reRegistration.items.${item.key}.description`)}
                              </p>
                            </div>
                          </div>
                          {index < reRegistrationItems.length - 1 && (
                            <div className="mt-6 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5 group-hover:ring-[#E07C45]/40 transition" />
              </div>

              {/* Specific Requirements */}
              <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-[#22140E] via-[#28160F] to-[#140B08] p-8 md:p-12 backdrop-blur-sm ring-1 ring-[#E07C45]/15">
                <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay bg-[radial-gradient(circle_at_68%_24%,rgba(255,255,255,0.07),transparent_65%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgba(224,124,69,0.22),transparent_60%)]" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <AlertTriangle className="h-6 w-6 text-[#E07C45]" />
                    <h2 className="text-xl md:text-2xl font-semibold tracking-tight bg-gradient-to-r from-[#FCEFEA] to-white bg-clip-text text-transparent">
                      {t('specific.title')}
                    </h2>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {specificItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <AccordionItem 
                          key={item.key} 
                          value={item.key}
                          className="border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm"
                        >
                          <AccordionTrigger className="text-left hover:no-underline px-4 py-3 rounded-xl hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-3 flex-1">
                              <Icon className="h-4 w-4 text-[#E07C45] flex-shrink-0" />
                              <span className="text-sm md:text-base font-medium text-[#FCEFEA]/90">
                                {t(`specific.items.${item.key}.title`)}
                              </span>
                              {item.key === 'deadline' && (
                                <Badge variant="destructive" className="ml-2 bg-[#E07C45] hover:bg-[#B8451A] text-white text-xs">
                                  {t('specific.items.deadline.badge')}
                                </Badge>
                              )}
                              {item.key === 'withdrawalDeadline' && (
                                <Badge variant="secondary" className="ml-2 bg-white/10 text-white/80 text-xs border-white/20">
                                  {t('specific.items.withdrawalDeadline.badge')}
                                </Badge>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-3 text-[#FCEFEA]/70">
                            <p className="text-sm leading-relaxed mb-3">
                              {t(`specific.items.${item.key}.description`)}
                            </p>
                            
                            {/* Sub-items for certain sections */}
                            {item.key === 'consequences' && (
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                  <span className="text-[#E07C45] mt-1">•</span>
                                  {t('specific.items.consequences.subItems.listOrder')}
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#E07C45] mt-1">•</span>
                                  {t('specific.items.consequences.subItems.scoreDetermination')}
                                </li>
                              </ul>
                            )}
                            
                            {item.key === 'graduationConsequences' && (
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                  <span className="text-red-400 mt-1">•</span>
                                  {t('specific.items.graduationConsequences.subItems.noCeremony')}
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  {t('specific.items.graduationConsequences.subItems.stillGetAttributes')}
                                </li>
                              </ul>
                            )}
                            
                            {item.key === 'refund' && (
                              <div className="space-y-3">
                                <p className="text-sm font-medium text-[#FCEFEA]/90">
                                  {t('specific.items.refund.subtitle')}
                                </p>
                                <ul className="space-y-2 text-sm">
                                  <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    {t('specific.items.refund.items.venue')}
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    {t('specific.items.refund.items.consumption')}
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    {t('specific.items.refund.items.documentation')}
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    {t('specific.items.refund.items.folder')}
                                  </li>
                                </ul>
                                <p className="text-xs text-[#FCEFEA]/50 italic">
                                  {t('specific.items.refund.note')}
                                </p>
                              </div>
                            )}
                            
                            {item.key === 'attributePurchase' && (
                              <div className="space-y-3">
                                <p className="text-sm font-medium text-[#FCEFEA]/90">
                                  {t('specific.items.attributePurchase.subtitle')}
                                </p>
                                <ul className="space-y-2 text-sm">
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-400 mt-1">•</span>
                                    {t('specific.items.attributePurchase.options.complete')}
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-400 mt-1">•</span>
                                    {t('specific.items.attributePurchase.options.sashPinMedal')}
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-purple-400 mt-1">•</span>
                                    {t('specific.items.attributePurchase.options.plaque')}
                                  </li>
                                </ul>
                                <p className="text-sm text-[#FCEFEA]/60">
                                  {t('specific.items.attributePurchase.note')}
                                </p>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5 group-hover:ring-[#E07C45]/40 transition" />
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-8">
              {/* Quick Info */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(224,124,69,0.35),transparent_70%)] opacity-50" />
                
                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-semibold tracking-tight bg-gradient-to-r from-[#FCEFEA] to-white bg-clip-text text-transparent mb-4">
                    Quick Info
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-[#E07C45] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-[#FCEFEA]/90 mb-1">
                          {t('specific.items.deadline.title')}
                        </h4>
                        <p className="text-xs text-[#FCEFEA]/60">
                          10 Oktober 2025
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#E07C45] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-[#FCEFEA]/90 mb-1">
                          Status Pendaftaran
                        </h4>
                        <p className="text-xs text-[#FCEFEA]/60">
                          Sedang Dibuka
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-[#E07C45] mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-[#FCEFEA]/90 mb-1">
                          Kuota Tersedia
                        </h4>
                        <p className="text-xs text-[#FCEFEA]/60">
                          Terbatas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/20 bg-gradient-to-br from-[#28170F] via-[#1C100B] to-[#120905] p-6 md:p-7 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent_65%)]" />
                
                <div className="relative z-10 text-center">
                  <Clock className="h-8 w-8 mx-auto text-[#E07C45] mb-4" />
                  <p className="text-xs md:text-sm leading-relaxed text-[#FCEFEA]/70">
                    {t('footer.note')}
                  </p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </SectionBG>
  )
}