import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { formSchema, FormData, steps } from '../constants/constants'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

const useMultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isValidating, setIsValidating] = useState(false)

  const t = useTranslations('FormPage')
  const form = useForm<FormData>({
    // resolver: zodResolver(formSchema), // Using manual validation instead
    mode: 'onChange',
    defaultValues: {
      registrant_type: 'SHOFI' as const,
      name: '',
      name_arabic: '',
      gender: 'L' as const,
      email: '',
      nationality: '',
      passport_number: '',
      phone_number: undefined,
      whatsapp: '',
      kekeluargaan: 'KMM' as const,
      university: 'Al Azhar',
      education_level: 'S1' as const,
      first_enrollment_year: 2019,
      graduation_year: 2025,
      faculty: 'SYARIAH_QANUN' as const,
      major: 'SYARIAH_QANUN' as const,
      quran_memorization: 0,
      continuing_study: 'NO' as const,
      kulliyah: 'TIDAK ADA' as const,
      syubah: 'TIDAK ADA' as const,
      shofi_ready_attend: false,
      predicate: 'MUMTAZ' as const,
      cumulative_score: null,
      syahadah_photo: '',
      tashfiyah_ready_attend: false,
      tashfiyah_ready_submit_proof: false,
      tashfiyah_no_graduation_if_failed: false,
      tashfiyah_still_get_attributes: false,
      atribut_ready_attend: false,
      attribute_package: 'SELENDANG_PIN_MEDALI' as const,
      photo: '',
      terms_agreement: false,
    },
  })

  // Validation onChange
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name && type === 'change') {
        // Validate the specific field using Zod
        const fieldSchema = formSchema.shape[name as keyof typeof formSchema.shape]
        if (fieldSchema) {
          const result = fieldSchema.safeParse(value[name])
          if (!result.success) {
            form.setError(name as keyof FormData, { message: result.error.issues[0].message })
          } else {
            form.clearErrors(name as keyof FormData)
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Mutation for submitting the form
  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Submit failed')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: (result) => {
      if (result?.id) {
        toast.success(t('Messages.RegistrationSuccess', { id: result.id }))
      }
      form.reset() // Reset form setelah sukses
      setCurrentStep(0) // Kembali ke step pertama
    },
    onError: (error: any) => {
      console.error('Submit error:', error)
      // Handle different types of errors
      if (error.details) {
        // Payload validation errors
        Object.keys(error.details).forEach((field: string) => {
          form.setError(field as keyof FormData, {
            message: error.details[field].message || t('Errors.ServerError'),
          })
        })
      } else if (error.message) {
        form.setError('root', { message: error.message })
      } else {
        form.setError('root', { message: t('Errors.UnknownError') })
      }
    },
    onSettled: () => {
      // Ensure submitting state is reset
      console.log('Mutation settled, resetting submitting state')
    },
  })

  const getStepFields = (step: number): (keyof FormData)[] => {
    const stepFields: (keyof FormData)[][] = [
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
      ['continuing_study', 'kulliyah', 'syubah'], // Tambahkan field conditional di sini
      ['photo', 'terms_agreement'],
      [], // Step 4: Tidak ada field baru
    ]
    return stepFields[step] || []
  }

  const nextStep = async () => {
    setIsValidating(true)
    const fieldsToValidate = getStepFields(currentStep)
    if (fieldsToValidate.length === 0) {
      // Clear all errors when moving to next step
      form.clearErrors()
      setCurrentStep((prev) => prev + 1)
      setIsValidating(false)
      return
    }

    const currentValues = form.getValues()

    // Clear errors for current step fields first
    fieldsToValidate.forEach((field) => {
      form.clearErrors(field)
    })

    // Manual validation for photo field in step 3
    if (currentStep === 3 && (!currentValues.photo || currentValues.photo === '')) {
      form.setError('photo', { message: t('Errors.PhotoRequired') })
      setIsValidating(false)
      return
    }

    // Manual validation for terms_agreement in step 3
    if (currentStep === 3 && !currentValues.terms_agreement) {
      form.setError('terms_agreement', { message: t('Errors.TermsRequired') })
      setIsValidating(false)
      return
    }

    // Manual validation for syahadah_photo in step 2 if SHOFI
    if (
      currentStep === 2 &&
      currentValues.registrant_type === 'SHOFI' &&
      (!currentValues.syahadah_photo || currentValues.syahadah_photo === '')
    ) {
      form.setError('syahadah_photo', { message: t('Errors.SyahadahPhotoRequired') })
      setIsValidating(false)
      return
    }

    // Create a modified schema that excludes upload fields from validation
    const fieldsToSkip = ['photo', 'syahadah_photo']
    const filteredFields = fieldsToValidate.filter((field) => !fieldsToSkip.includes(field))

    if (filteredFields.length === 0) {
      // Only upload fields, skip schema validation
      setCurrentStep((prev) => prev + 1)
      setIsValidating(false)
      return
    }

    // Validate only non-upload fields
    const partialSchema = formSchema.pick(
      Object.fromEntries(filteredFields.map((field) => [field, true])),
    )
    const result = partialSchema.safeParse(currentValues)

    if (result.success) {
      // Clear errors for current step fields before proceeding
      fieldsToValidate.forEach((field) => {
        form.clearErrors(field)
      })
      setCurrentStep((prev) => prev + 1)
    } else {
      // Set errors only for fields in current step
      result.error.issues.forEach((err: any) => {
        const fieldName = err.path[0] as keyof FormData
        if (filteredFields.includes(fieldName)) {
          form.setError(fieldName, { message: err.message })
        }
      })
      // If no errors in current step fields, proceed
      const hasCurrentStepErrors = result.error.issues.some((err: any) =>
        filteredFields.includes(err.path[0] as keyof FormData),
      )
      if (!hasCurrentStepErrors) {
        setCurrentStep((prev) => prev + 1)
      }
    }
    setIsValidating(false)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const onSubmit = async (data: FormData) => {
    // Clear any existing errors before validation
    form.clearErrors()

    // Validate entire form before submitting
    const result = formSchema.safeParse(data)
    if (!result.success) {
      // Filter out errors for upload fields that are handled separately
      const uploadFields = ['photo', 'syahadah_photo']
      const filteredErrors = result.error.issues.filter(
        (err: any) => !uploadFields.includes(err.path[0]),
      )

      // Set errors for non-upload fields
      filteredErrors.forEach((err: any) => {
        const fieldName = err.path[0] as keyof FormData
        form.setError(fieldName, { message: err.message })
      })

      // Check upload fields manually
      if (!data.photo || data.photo === '') {
        form.setError('photo', { message: t('Errors.PhotoRequired') })
      }
      if (
        data.registrant_type === 'SHOFI' &&
        (!data.syahadah_photo || data.syahadah_photo === '')
      ) {
        form.setError('syahadah_photo', { message: t('Errors.SyahadahPhotoRequired') })
      }

      // If there are any errors, don't submit
      if (
        filteredErrors.length > 0 ||
        !data.photo ||
        data.photo === '' ||
        (data.registrant_type === 'SHOFI' && (!data.syahadah_photo || data.syahadah_photo === ''))
      ) {
        return
      }
    }

    // Trigger mutation
    submitMutation.mutate(data)
  }

  return {
    form,
    currentStep,
    isValidating,
    isSubmitting: submitMutation.isPending,
    nextStep,
    prevStep,
    onSubmit,
  }
}

export default useMultiStepForm
