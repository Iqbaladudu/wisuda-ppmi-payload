'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import useMultiStepForm from '../../hooks/useMultiStepForm'
import { steps } from '../../constants/constants'
import StepContent from './StepContent'

const MultiStepForm: React.FC = () => {
  const { form, currentStep, isValidating, isSubmitting, nextStep, prevStep, onSubmit } =
    useMultiStepForm()

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
            <form className="space-y-6">
              <StepContent currentStep={currentStep} form={form} />
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isValidating || isSubmitting}
                >
                  Sebelumnya
                </Button>
                {currentStep < steps.length - 1 ? (
                  <div className="flex flex-col space-y-2">
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        isValidating ||
                        isSubmitting ||
                        Object.keys(form.formState.errors).length > 0
                      }
                    >
                      {isValidating ? 'Memvalidasi...' : 'Selanjutnya'}
                    </Button>
                    <p className="text-xs text-gray-500">
                      Step: {currentStep + 1}/{steps.length} | Validating:{' '}
                      {isValidating ? 'Yes' : 'No'} | Submitting: {isSubmitting ? 'Yes' : 'No'} |
                      Form Errors: {Object.keys(form.formState.errors).length > 0 ? 'Yes' : 'No'}
                      {currentStep === 3 && (
                        <> | Photo: {form.getValues('photo') ? 'Uploaded' : 'Not uploaded'}</>
                      )}
                    </p>
                    {Object.keys(form.formState.errors).length > 0 && (
                      <div className="text-xs text-red-500 mt-1">
                        Errors: {Object.keys(form.formState.errors).join(', ')}
                        <div className="mt-1">
                          {Object.entries(form.formState.errors).map(([field, error]) => (
                            <div key={field} className="text-xs">
                              • {field}: {error?.message || 'Invalid'}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button
                      type="button"
                      onClick={async () => {
                        const data = form.getValues()
                        await onSubmit(data)
                      }}
                      disabled={
                        isValidating ||
                        isSubmitting ||
                        Object.keys(form.formState.errors).length > 0
                      }
                    >
                      {isSubmitting ? 'Mengirim...' : 'Kirim'}
                    </Button>
                    <p className="text-xs text-gray-500">
                      Step: {currentStep + 1}/{steps.length} | Validating:{' '}
                      {isValidating ? 'Yes' : 'No'} | Submitting: {isSubmitting ? 'Yes' : 'No'} |
                      Form Errors: {Object.keys(form.formState.errors).length > 0 ? 'Yes' : 'No'}
                    </p>
                    {Object.keys(form.formState.errors).length > 0 && (
                      <div className="text-xs text-red-500 mt-1">
                        Errors: {Object.keys(form.formState.errors).join(', ')}
                        <div className="mt-1">
                          {Object.entries(form.formState.errors).map(([field, error]) => (
                            <div key={field} className="text-xs">
                              • {field}: {error?.message || 'Invalid'}
                            </div>
                          ))}
                        </div>
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
  )
}

export default MultiStepForm
