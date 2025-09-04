'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useMultiStepForm } from '../../hooks/useMultiStepForm'
import { steps } from '../../constants/constants'
import StepContent from './StepContent'

const MultiStepForm: React.FC = () => {
  const { form, currentStep, isValidating, nextStep, prevStep, onSubmit } = useMultiStepForm()

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <StepContent currentStep={currentStep} form={form} />
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isValidating}
                >
                  Sebelumnya
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep} disabled={isValidating}>
                    {isValidating ? 'Memvalidasi...' : 'Selanjutnya'}
                  </Button>
                ) : (
                  <Button type="submit" disabled={isValidating}>
                    {isValidating ? 'Mengirim...' : 'Kirim'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default MultiStepForm
