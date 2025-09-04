import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema, FormData, steps } from '../constants/constants'

export const useMultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isValidating, setIsValidating] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registrant_type: '',
      name: '',
      name_arabic: '',
      gender: '',
      email: '',
      nationality: '',
      passport_number: '',
      phone_number: '',
      whatsapp: '',
      kekeluargaan: 'KMM',
      university: 'AL_AZHAR',
      education_level: 'S1',
      first_enrollment_year: 2019,
      graduation_year: 2025,
      faculty: '',
      major: 'SYARIAH_QANUN',
      quran_memorization: 0,
      continuing_study: '',
      kulliyah: 'TIDAK ADA',
      syubah: 'TIDAK ADA',
      shofi_ready_attend: false,
      predicate: '',
      cumulative_score: undefined,
      syahadah_photo: undefined,
      tashfiyah_ready_attend: false,
      tashfiyah_ready_submit_proof: false,
      tashfiyah_no_graduation_if_failed: false,
      tashfiyah_still_get_attributes: false,
      atribut_ready_attend: false,
      attribute_package: '',
      photo: undefined,
      terms_agreement: false,
    },
  })

  const getStepFields = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 0:
        return [
          'registrant_type',
          'name',
          'name_arabic',
          'gender',
          'email',
          'nationality',
          'whatsapp',
        ]
      case 1:
        return [
          'university',
          'education_level',
          'first_enrollment_year',
          'graduation_year',
          'faculty',
          'major',
          'quran_memorization',
        ]
      case 2: {
        const registrantType = form.watch('registrant_type')
        const fields: (keyof FormData)[] = ['continuing_study']
        if (registrantType === 'SHOFI') {
          fields.push('shofi_ready_attend', 'predicate', 'cumulative_score', 'syahadah_photo')
        } else if (registrantType === 'TASHFIYAH') {
          fields.push(
            'tashfiyah_ready_attend',
            'tashfiyah_ready_submit_proof',
            'tashfiyah_no_graduation_if_failed',
            'tashfiyah_still_get_attributes',
          )
        } else if (registrantType === 'ATRIBUT') {
          fields.push('atribut_ready_attend', 'attribute_package')
        }
        if (form.watch('education_level') === 'S1' && form.watch('continuing_study') === 'YES') {
          fields.push('kulliyah', 'syubah')
        }
        return fields
      }
      case 3:
        return ['photo', 'terms_agreement']
      default:
        return []
    }
  }

  const nextStep = async () => {
    if (currentStep >= steps.length - 1) return

    setIsValidating(true)
    const fieldsToValidate = getStepFields(currentStep)
    const isValid = await form.trigger(fieldsToValidate)
    setIsValidating(false)

    if (isValid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsValidating(true)
    const isValid = await form.trigger()
    setIsValidating(false)

    if (isValid) {
      console.log('Form submitted:', data)
      // Here you would submit to Payload API
      alert('Pendaftaran berhasil dikirim!')
    }
  }

  return {
    form,
    currentStep,
    isValidating,
    nextStep,
    prevStep,
    onSubmit,
    getStepFields,
  }
}
