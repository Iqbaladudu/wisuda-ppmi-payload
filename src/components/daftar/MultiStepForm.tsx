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
      <div className="relative isolate w-full min-h-screen overflow-hidden pt-36 pb-24 text-white before:absolute before:inset-0 before:-z-30 before:bg-[#140A08] after:absolute after:inset-0 after:-z-20 after:bg-[radial-gradient(circle_at_40%_30%,rgba(230,140,90,0.18),transparent_70%)]">
        {/* Enhanced SVG Grid (matching daftar page style) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-25 [mask-image:radial-gradient(circle_at_45%_30%,white,transparent_78%)]"
        >
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="denseGridMinorSuccess"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
              <pattern
                id="denseGridMajorSuccess"
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
              <mask id="gridFadeMaskSuccess">
                <rect width="100%" height="100%" fill="url(#gradMaskSuccess)" />
              </mask>
              <radialGradient id="gradMaskSuccess" cx="45%" cy="30%" r="75%">
                <stop offset="0%" stopColor="white" />
                <stop offset="85%" stopColor="black" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#denseGridMinorSuccess)" />
            <rect width="100%" height="100%" fill="url(#denseGridMajorSuccess)" />
            <rect
              width="100%"
              height="100%"
              fill="url(#denseGridMinorSuccess)"
              className="opacity-40 [filter:blur(1px)]"
              mask="url(#gridFadeMaskSuccess)"
            />
          </svg>
        </div>

        <div className="flex flex-col items-center justify-center gap-10 w-full">
          {/* Success Container matching daftar page style */}
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl px-8 py-12 md:px-12 md:py-16 text-center shadow-xl">
            {/* Simple elegant checkmark */}
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-400 backdrop-blur-sm">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {tSuccess('Heading')}
            </h2>

            {lastRegId && (
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm">
                <span className="opacity-70">Nomor Registrasi</span>
                <span className="font-mono font-semibold text-white">{lastRegId}</span>
              </div>
            )}

            <p className="mx-auto max-w-lg text-white/70 leading-relaxed mb-8">
              {tSuccess('Description')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  resetSuccess()
                }}
                className="min-w-[140px] h-10 bg-gradient-to-r from-[#E07C45] to-[#B8451A] hover:from-[#D66837] hover:to-[#A53E17] text-white font-medium transition-all"
              >
                {restartLabel}
              </Button>
              <Button
                asChild
                variant="outline"
                className="min-w-[140px] h-10 border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                <Link href="/">{tSuccess('HomeButton')}</Link>
              </Button>
            </div>
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
                  {/* Display root error if exists */}
                  {form.formState.errors.root && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">
                        {t(form.formState.errors.root.message as any) ||
                          form.formState.errors.root.message}
                      </p>
                    </div>
                  )}
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
                      className="min-w-[120px] sm:min-w-[130px] text-gray-700 w-full sm:w-auto"
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
                          // Check for root error after submit attempt
                          if (form.formState.errors.root) {
                            const errorMsg = form.formState.errors.root.message?.startsWith(
                              'Errors.',
                            )
                              ? t(form.formState.errors.root.message as any) ||
                                form.formState.errors.root.message
                              : form.formState.errors.root.message
                            toast.error(errorMsg)
                          }
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
