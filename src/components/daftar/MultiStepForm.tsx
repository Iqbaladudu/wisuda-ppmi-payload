// @ts-nocheck
'use client'

import React, { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

import useMultiStepForm from '@/hooks/useMultiStepForm'
import StepContent from './StepContent'
import StepSidebar from './StepSidebar'
const AnyForm: React.FC<any> = (props) => <Form {...props} />

/**
 * MultiStepForm
 * Success screen brightened & made more celebratory.
 */
const MultiStepForm: React.FC = () => {
  const t = useTranslations('FormPage')
  const tSuccess = useTranslations('SuccessPage')
  const locale = useLocale()

  const {
    form,
    currentStep,
    isValidating,
    isSubmitting,
    isSuccess,
    nextStep,
    prevStep,
    onSubmit,
    lastRegId,
    resetSuccess,
  } = useMultiStepForm()

  // Build steps from translations so titles/descriptions are localized
  const stepsData = useMemo(
    () =>
      ['1', '2', '3', '4', '5'].map((id) => ({
        id,
        title: t(`Steps.${id}.Title` as any),
        description: t(`Steps.${id}.Description` as any),
      })),
    [t],
  )

  // Fields per step
  const getCurrentStepFields = (step: number): string[] => {
    const stepFields: string[][] = [
      [
        'registrant_type',
        'name',
        'name_arabic',
        'gender',
        'email',
        'nationality',
        'passport_number',
        'phone_number',
        'whatsapp',
        'kekeluargaan',
      ],
      [
        'university',
        'education_level',
        'first_enrollment_year',
        'graduation_year',
        'faculty',
        'major',
        'quran_memorization',
      ],
      ['continuing_study', 'kulliyah', 'syubah', 'syahadah_photo'],
      ['photo', 'terms_agreement'],
      [],
    ]
    return stepFields[step] || []
  }

  const hasCurrentStepErrors = () => {
    const currentFields = getCurrentStepFields(currentStep)
    return currentFields.some(
      (field) => form.formState.errors[field as keyof typeof form.formState.errors],
    )
  }

  const restartLabel = locale === 'id' ? 'Daftar Lagi' : 'Register Again'

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-10 w-full">
        {/* Brightened Success Container */}
        <div className="relative w-full overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-emerald-100/70 via-white/80 to-emerald-50/60 dark:from-emerald-300/15 dark:via-white/10 dark:to-emerald-200/5 px-7 py-14 md:px-14 md:py-18 text-center backdrop-blur-xl shadow-[0_8px_60px_-10px_rgba(0,0,0,0.55)] ring-1 ring-white/40 dark:ring-white/10">
          {/* Layered Glow & Confetti Accents */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_25%,rgba(255,255,255,0.9),transparent_70%)] mix-blend-overlay" />
          <div className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_120deg_at_50%_50%,rgba(255,255,255,0.35),transparent_55%)] opacity-70" />
          <div className="pointer-events-none absolute -inset-px rounded-[inherit] ring-1 ring-white/60 dark:ring-white/10" />
          <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_50%_40%,black,transparent_75%)]">
            <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.35),transparent_70%)]" />
          </div>

          {/* Checkmark Emblem */}
          <div className="mx-auto mb-10 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400/25 via-emerald-300/30 to-emerald-500/25 ring-4 ring-emerald-400/50 shadow-xl shadow-emerald-500/20 backdrop-blur-sm relative">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--tw-gradient-stops))] from-emerald-300/40 via-emerald-200/20 to-emerald-300/40 blur-xl opacity-70 animate-spin-slow" />
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-5xl font-extrabold shadow-lg shadow-emerald-600/40 relative">
              ✓
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 dark:from-emerald-200 dark:via-emerald-300 dark:to-teal-200 bg-clip-text text-transparent mb-6 drop-shadow-sm">
            {tSuccess('Heading')}
          </h2>

          {lastRegId && (
            <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/10 px-6 py-2.5 text-sm font-semibold text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-500/30 dark:ring-emerald-300/30 shadow-sm">
              <span className="opacity-70">Nomor Registrasi</span>
              <span className="font-mono tracking-tight text-emerald-700 dark:text-emerald-200">
                {lastRegId}
              </span>
            </div>
          )}

          <p className="mx-auto max-w-2xl text-[15px] md:text-base leading-relaxed text-emerald-900/80 dark:text-emerald-50/70 mb-10 font-medium">
            {tSuccess('Description')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                resetSuccess()
              }}
              className="min-w-[170px] h-11 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:via-emerald-500 hover:to-teal-400 text-white font-semibold shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 transition-all"
            >
              {restartLabel}
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-w-[170px] h-11 border-emerald-300/60 bg-white/60 dark:bg-white/10 text-emerald-800 dark:text-emerald-100 hover:bg-white/80 dark:hover:bg-white/20 hover:border-emerald-400"
            >
              <Link href="/">{tSuccess('HomeButton')}</Link>
            </Button>
          </div>

          <div className="mt-12 space-y-4">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-emerald-700/70 dark:text-emerald-200/40">
              Pendaftaran selesai
            </p>
            <div className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
          </div>

          {/* Decorative confetti dots (subtle) */}
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="absolute size-1.5 rounded-full bg-emerald-400/70 animate-pulse"
                style={{
                  top: `${Math.random() * 95}%`,
                  left: `${Math.random() * 95}%`,
                  animationDelay: `${(i % 5) * 0.6}s`,
                  opacity: 0.35 + (i % 4) * 0.12,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full">
      <StepSidebar currentStep={currentStep} steps={stepsData} />
      <div className="flex-1 w-full">
        <div className="w-full border border-white/10 bg-white/90 backdrop-blur-xl relative overflow-hidden shadow-2xl rounded-lg">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#F5D3CA_0%,transparent_60%)] opacity-70" />
          <div className="relative p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#3E2522] to-[#5A3A2F] text-[#FCEFEA] text-sm font-semibold shadow flex-shrink-0">
                {currentStep + 1}
              </span>
              <h3 className="text-[#3E2522] text-lg md:text-xl font-bold tracking-wide flex-1">
                {stepsData[currentStep].title}
              </h3>
            </div>
            <p className="text-xs md:text-sm text-[#3E2522]/70 max-w-prose leading-relaxed mb-4">
              {stepsData[currentStep].description}
            </p>
            <Progress
              value={((currentStep + 1) / stepsData.length) * 100}
              className="w-full h-2 overflow-hidden bg-gradient-to-r from-[#3E2522]/15 to-[#5A3A2F]/15 mb-6"
            />
            {/* @ts-ignore - suppress generic variance mismatch */}
            <AnyForm {...form}>
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="bg-white/70 rounded-lg p-2 sm:p-3">
                  <StepContent currentStep={currentStep} form={form} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (currentStep === 0) return
                        prevStep()
                        toast.info(t('Messages.PreviousStep'))
                      }}
                      disabled={currentStep === 0 || isValidating || isSubmitting}
                      className="min-w-[120px] sm:min-w-[130px] w-full sm:w-auto"
                    >
                      {t('Buttons.Previous')}
                    </Button>
                  </div>
                  {currentStep < stepsData.length - 1 ? (
                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        onClick={() => {
                          if (hasCurrentStepErrors()) {
                            toast.error(t('Messages.CheckFields'))
                            return
                          }
                          nextStep()
                          toast.success(t('Messages.NextStep'))
                        }}
                        disabled={isValidating || isSubmitting || hasCurrentStepErrors()}
                        className="min-w-[140px] sm:min-w-[150px] w-full sm:w-auto bg-gradient-to-r from-[#3E2522] to-[#5A3A2F] hover:from-[#472D2A] hover:to-[#6B463C] text-[#FCEFEA] shadow-lg shadow-[#3E2522]/20"
                      >
                        {isValidating ? t('Buttons.Validating') : t('Buttons.Next')}
                      </Button>
                      <p className="text-[11px] text-[#3E2522]/70">
                        {t('Messages.StepOf', {
                          current: currentStep + 1,
                          total: stepsData.length,
                        })}
                      </p>
                      {hasCurrentStepErrors() && (
                        <div className="text-[11px] text-red-600">
                          {Object.entries(form.formState.errors)
                            .filter(([field]) => getCurrentStepFields(currentStep).includes(field))
                            .slice(0, 4)
                            .map(([field, error]) => (
                              <div key={field}>• {t(error?.message as any) || 'Invalid'}</div>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        onClick={async () => {
                          if (hasCurrentStepErrors()) {
                            toast.error(t('Messages.CheckFields'))
                            return
                          }
                          const data = form.getValues()
                          toast.message(t('Messages.SendingData'), {
                            description: t('Messages.WaitSubmit'),
                          })
                          await onSubmit(data)
                        }}
                        disabled={isValidating || isSubmitting || hasCurrentStepErrors()}
                        className="min-w-[150px] sm:min-w-[160px] w-full sm:w-auto bg-gradient-to-r from-[#3E2522] to-[#5A3A2F] hover:from-[#472D2A] hover:to-[#6B463C] text-[#FCEFEA] shadow-lg shadow-[#3E2522]/20"
                      >
                        {isSubmitting ? t('Buttons.Submitting') : t('Buttons.Submit')}
                      </Button>
                      <p className="text-[11px] text-[#3E2522]/70">
                        {t('Messages.StepOf', {
                          current: currentStep + 1,
                          total: stepsData.length,
                        })}
                      </p>
                      {hasCurrentStepErrors() && (
                        <div className="text-[11px] text-red-600">
                          {Object.entries(form.formState.errors)
                            .filter(([field]) => getCurrentStepFields(currentStep).includes(field))
                            .slice(0, 4)
                            .map(([field, error]) => (
                              <div key={field}>• {t(error?.message as any) || 'Invalid'}</div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </AnyForm>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiStepForm
