'use client'

import React, { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import useMultiStepForm from '../../hooks/useMultiStepForm'
import StepContent from './StepContent'
import StepSidebar from './StepSidebar'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

const MultiStepForm: React.FC = () => {
  const { form, currentStep, isValidating, isSubmitting, nextStep, prevStep, onSubmit } =
    useMultiStepForm()
  const t = useTranslations('FormPage')

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

  // Get current step fields
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
      ['continuing_study', 'kulliyah', 'syubah', 'syahadah_photo'], // Include syahadah_photo for SHOFI validation
      ['photo', 'terms_agreement'],
      [], // Step 4: No fields
    ]
    return stepFields[step] || []
  }

  // Check if current step has errors
  const hasCurrentStepErrors = () => {
    const currentFields = getCurrentStepFields(currentStep)
    return currentFields.some(
      (field) => form.formState.errors[field as keyof typeof form.formState.errors],
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <StepSidebar currentStep={currentStep} steps={stepsData} />
      <div className="flex-1">
        <Card className="border-white/10 bg-white/90 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#F5D3CA_0%,transparent_60%)] opacity-70" />
          <CardHeader className="relative">
            <CardTitle className="text-[#3E2522] text-xl font-bold tracking-wide flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#3E2522] to-[#5A3A2F] text-[#FCEFEA] text-sm font-semibold shadow">
                {currentStep + 1}
              </span>
              {stepsData[currentStep].title}
            </CardTitle>
            <p className="text-xs md:text-sm text-[#3E2522]/70 max-w-prose leading-relaxed">
              {stepsData[currentStep].description}
            </p>
            <Progress
              value={((currentStep + 1) / stepsData.length) * 100}
              className="w-full h-2 overflow-hidden bg-gradient-to-r from-[#3E2522]/15 to-[#5A3A2F]/15"
            />
          </CardHeader>
          <CardContent className="relative">
            <Form {...form}>
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="rounded-lg ring-1 ring-[#3E2522]/10 bg-white/60 shadow-inner p-1">
                  <div className="rounded-md overflow-hidden">
                    <StepContent currentStep={currentStep} form={form} />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
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
                      className="min-w-[130px]"
                    >
                      {t('Buttons.Previous')}
                    </Button>
                  </div>
                  {currentStep < stepsData.length - 1 ? (
                    <div className="flex flex-col items-end gap-2">
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
                        className="min-w-[150px] bg-gradient-to-r from-[#3E2522] to-[#5A3A2F] hover:from-[#472D2A] hover:to-[#6B463C] text-[#FCEFEA] shadow-lg shadow-[#3E2522]/20"
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
                    <div className="flex flex-col items-end gap-2">
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
                        className="min-w-[160px] bg-gradient-to-r from-[#3E2522] to-[#5A3A2F] hover:from-[#472D2A] hover:to-[#6B463C] text-[#FCEFEA] shadow-lg shadow-[#3E2522]/20"
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
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MultiStepForm
