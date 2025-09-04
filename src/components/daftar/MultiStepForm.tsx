'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import useMultiStepForm from '../../hooks/useMultiStepForm'
import { steps } from '../../constants/constants'
import StepContent from './StepContent'
import StepSidebar from './StepSidebar'
import { toast } from 'sonner'

const MultiStepForm: React.FC = () => {
  const { form, currentStep, isValidating, isSubmitting, nextStep, prevStep, onSubmit } =
    useMultiStepForm()

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <StepSidebar currentStep={currentStep} />
      <div className="flex-1">
        <Card className="border-white/10 bg-white/90 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#F5D3CA_0%,transparent_60%)] opacity-70" />
          <CardHeader className="relative">
            <CardTitle className="text-[#3E2522] text-xl font-bold tracking-wide flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#3E2522] to-[#5A3A2F] text-[#FCEFEA] text-sm font-semibold shadow">
                {currentStep + 1}
              </span>
              {steps[currentStep].title}
            </CardTitle>
            <p className="text-xs md:text-sm text-[#3E2522]/70 max-w-prose leading-relaxed">
              {steps[currentStep].description}
            </p>
            <Progress
              value={((currentStep + 1) / steps.length) * 100}
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
                        toast.info('Kembali ke langkah sebelumnya')
                      }}
                      disabled={currentStep === 0 || isValidating || isSubmitting}
                      className="min-w-[130px]"
                    >
                      Sebelumnya
                    </Button>
                  </div>
                  {currentStep < steps.length - 1 ? (
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        type="button"
                        onClick={() => {
                          if (Object.keys(form.formState.errors).length > 0) {
                            toast.error('Periksa kembali field yang belum valid')
                            return
                          }
                          nextStep()
                          toast.success('Berhasil ke langkah berikutnya')
                        }}
                        disabled={
                          isValidating ||
                          isSubmitting ||
                          Object.keys(form.formState.errors).length > 0
                        }
                        className="min-w-[150px] bg-gradient-to-r from-[#3E2522] to-[#5A3A2F] hover:from-[#472D2A] hover:to-[#6B463C] text-[#FCEFEA] shadow-lg shadow-[#3E2522]/20"
                      >
                        {isValidating ? 'Memvalidasi...' : 'Selanjutnya'}
                      </Button>
                      <p className="text-[11px] text-[#3E2522]/70">
                        Langkah {currentStep + 1} dari {steps.length}
                      </p>
                      {Object.keys(form.formState.errors).length > 0 && (
                        <div className="text-[11px] text-red-600">
                          {Object.entries(form.formState.errors)
                            .slice(0, 4)
                            .map(([field, error]) => (
                              <div key={field}>
                                • {field}: {error?.message || 'Invalid'}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        type="button"
                        onClick={async () => {
                          if (Object.keys(form.formState.errors).length > 0) {
                            toast.error('Periksa kembali field yang belum valid')
                            return
                          }
                          const data = form.getValues()
                          toast.message('Mengirim data...', {
                            description: 'Mohon tunggu proses submit',
                          })
                          await onSubmit(data)
                        }}
                        disabled={
                          isValidating ||
                          isSubmitting ||
                          Object.keys(form.formState.errors).length > 0
                        }
                        className="min-w-[160px] bg-gradient-to-r from-[#3E2522] to-[#5A3A2F] hover:from-[#472D2A] hover:to-[#6B463C] text-[#FCEFEA] shadow-lg shadow-[#3E2522]/20"
                      >
                        {isSubmitting ? 'Mengirim...' : 'Kirim'}
                      </Button>
                      <p className="text-[11px] text-[#3E2522]/70">
                        Langkah {currentStep + 1} dari {steps.length}
                      </p>
                      {Object.keys(form.formState.errors).length > 0 && (
                        <div className="text-[11px] text-red-600">
                          {Object.entries(form.formState.errors)
                            .slice(0, 4)
                            .map(([field, error]) => (
                              <div key={field}>
                                • {field}: {error?.message || 'Invalid'}
                              </div>
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
