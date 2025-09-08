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
    resolver: zodResolver(formSchema),
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

  // Per-field validation now handled automatically by zodResolver (manual watcher removed)

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
            message: error.details[field].message || 'Errors.ServerError',
          })
        })
      } else if (error.message) {
        form.setError('root', { message: error.message })
      } else {
        form.setError('root', { message: 'Errors.UnknownError' })
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
      form.clearErrors()
      setCurrentStep((prev) => prev + 1)
      setIsValidating(false)
      return
    }

    // Exclude upload-only fields from resolver trigger
    const schemaFields = fieldsToValidate.filter((f) => !['photo', 'syahadah_photo'].includes(f))

    // Trigger validation via resolver (focus first invalid field automatically)
    const valid = await form.trigger(schemaFields as any, { shouldFocus: true })

    const values = form.getValues()

    // Manual validations (not covered by schema)
    if (currentStep === 3 && (!values.photo || values.photo === '')) {
      form.setError('photo', { message: 'Errors.PhotoRequired' })
    }
    if (currentStep === 3 && !values.terms_agreement) {
      form.setError('terms_agreement', { message: 'Errors.TermsRequired' })
    }
    if (
      currentStep === 2 &&
      values.registrant_type === 'SHOFI' &&
      (!values.syahadah_photo || values.syahadah_photo === '')
    ) {
      form.setError('syahadah_photo', { message: 'Errors.SyahadahPhotoRequired' })
    }

    const hasSchemaErrors = schemaFields.some((f) => form.formState.errors[f as keyof FormData])
    const hasManualErrors =
      (currentStep === 3 && (!values.photo || values.photo === '' || !values.terms_agreement)) ||
      (currentStep === 2 &&
        values.registrant_type === 'SHOFI' &&
        (!values.syahadah_photo || values.syahadah_photo === ''))

    if (!hasSchemaErrors && !hasManualErrors && valid) {
      setCurrentStep((prev) => prev + 1)
    }

    setIsValidating(false)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const onSubmit = async (data: FormData) => {
    // Bersihkan error sebelumnya
    form.clearErrors()

    // Jalankan validasi penuh via zodResolver
    const valid = await form.trigger(undefined, { shouldFocus: true })
    if (!valid) return

    // Validasi manual untuk field upload (tidak di-handle oleh schema)
    if (!data.photo || data.photo === '') {
      form.setError('photo', { message: 'Errors.PhotoRequired' })
    }
    if (data.registrant_type === 'SHOFI' && (!data.syahadah_photo || data.syahadah_photo === '')) {
      form.setError('syahadah_photo', { message: 'Errors.SyahadahPhotoRequired' })
    }

    // Kalau masih ada error upload, hentikan
    if (form.formState.errors.photo || form.formState.errors.syahadah_photo) return

    // Submit
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
