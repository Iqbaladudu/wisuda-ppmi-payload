import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import type { FormData } from '../../constants/constants'
import { Button } from '@/components/ui/button'

interface StepContentProps {
  currentStep: number
  form: UseFormReturn<FormData>
}

interface Country {
  code: string
  name: string
  region: string
}

const StepContent: React.FC<StepContentProps> = ({ currentStep, form }) => {
  const t = useTranslations('FormPage')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingSyahadah, setUploadingSyahadah] = useState(false)
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [syahadahUploaded, setSyahadahUploaded] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [universities, setUniversities] = useState<string[]>([])
  const [loadingUniversities, setLoadingUniversities] = useState(false)
  const [otherFaculty, setOtherFaculty] = useState('')
  const [otherMajor, setOtherMajor] = useState('')
  const [otherKulliyah, setOtherKulliyah] = useState('')
  const [otherSyubah, setOtherSyubah] = useState('')
  const [isOtherFaculty, setIsOtherFaculty] = useState(false)
  const [isOtherMajor, setIsOtherMajor] = useState(false)
  const [isOtherKulliyah, setIsOtherKulliyah] = useState(false)
  const [isOtherSyubah, setIsOtherSyubah] = useState(false)

  // Sync upload states with form values
  useEffect(() => {
    const currentPhoto = form.getValues('photo')
    const currentSyahadah = form.getValues('syahadah_photo')

    setPhotoUploaded(!!(currentPhoto && currentPhoto !== ''))
    setSyahadahUploaded(!!(currentSyahadah && currentSyahadah !== ''))
  }, [currentStep, form])

  // Initialize other states based on current form values
  useEffect(() => {
    const faculty = form.getValues('faculty')
    const major = form.getValues('major')
    const kulliyah = form.getValues('kulliyah')
    const syubah = form.getValues('syubah')
    const facultyOptions = [
      'USHULUDDIN',
      'SYARIAH_QANUN',
      'BAHASA_ARAB',
      'DIRASAT_BANIN',
      'DIRASAT_BANAT',
    ]
    const majorOptions = [
      'TAFSIR_ULUMUL_QURAN',
      'HADITS_ULUM',
      'AQIDAH_FALSAFAH',
      'DAKWAH_TSAQOFAH',
      'SYARIAH_ISLAMIYAH',
      'SYARIAH_QANUN',
      'BAHASA_ARAB_AMMAH',
      'TARIKH_HADHARAH',
    ]
    const kulliyahOptions = [
      'ULUUM_ISLAMIYAH',
      'DIRASAT_ULYA',
      'DIRASAT_ISLAMIYAH_ARABIAH',
      'TIDAK ADA',
    ]
    const syubahOptions = [
      'TAFSIR_ULUMUL_QURAN',
      'HADITS_ULUM',
      'AQIDAH_FALSAFAH',
      'FIQH_AM',
      'FIQIH_MUQARRAN',
      'USHUL_FIQH',
      'LUGHAYWIYAT',
      'BALAGHAH_NAQD',
      'ADAB_NAQD',
      'TIDAK ADA',
    ]

    const facultyIsOther = faculty === 'OTHER' || (faculty && !facultyOptions.includes(faculty))
    const majorIsOther = major === 'OTHER' || (major && !majorOptions.includes(major))
    const kulliyahIsOther =
      kulliyah === 'OTHER' || (kulliyah && !kulliyahOptions.includes(kulliyah))
    const syubahIsOther = syubah === 'OTHER' || (syubah && !syubahOptions.includes(syubah))

    setIsOtherFaculty(!!facultyIsOther)
    setIsOtherMajor(!!majorIsOther)
    setIsOtherKulliyah(!!kulliyahIsOther)
    setIsOtherSyubah(!!syubahIsOther)

    if (facultyIsOther && faculty && faculty !== 'OTHER') setOtherFaculty(faculty)
    if (majorIsOther && major && major !== 'OTHER') setOtherMajor(major)
    if (kulliyahIsOther && kulliyah && kulliyah !== 'OTHER') setOtherKulliyah(kulliyah)
    if (syubahIsOther && syubah && syubah !== 'OTHER') setOtherSyubah(syubah)
  }, [currentStep, form])

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true)
      try {
        const response = await fetch('/api/countries')
        if (!response.ok) throw new Error('Failed to fetch countries')
        const data = await response.json()
        setCountries(data)
      } catch (error) {
        console.error('Error fetching countries:', error)
        toast.error(t('Messages.CountriesLoadError'))
      } finally {
        setLoadingCountries(false)
      }
    }

    const loadUniversities = () => {
      setLoadingUniversities(true)
      try {
        const hardcodedUniversities = [
          {
            'state-province': null,
            web_pages: ['http://www.azhar.edu.eg/'],
            domains: ['azhar.edu.eg'],
            country: 'Egypt',
            name: 'Al Azhar University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.aast.edu/'],
            domains: ['aast.edu'],
            country: 'Egypt',
            name: 'Arab Academy for Science & Technology',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.akhbaracademy.edu.eg/'],
            domains: ['akhbaracademy.edu.eg'],
            country: 'Egypt',
            name: 'Akhbar El Yom Academy',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.alex.edu.eg/'],
            domains: ['alex.edu.eg'],
            country: 'Egypt',
            name: 'Alexandria University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.aou.edu.eg/'],
            domains: ['aou.edu.eg'],
            country: 'Egypt',
            name: 'Arab Open University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.aucegypt.edu/'],
            domains: ['aucegypt.edu'],
            country: 'Egypt',
            name: 'American University in Cairo',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.aun.edu.eg/'],
            domains: ['aun.edu.eg'],
            country: 'Egypt',
            name: 'Assiut University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.bsu.edu.eg/'],
            domains: ['bsu.edu.eg'],
            country: 'Egypt',
            name: 'Beni Suef University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.bu.edu.eg/'],
            domains: ['bu.edu.eg'],
            country: 'Egypt',
            name: 'Benha University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.cu.edu.eg/'],
            domains: ['cu.edu.eg'],
            country: 'Egypt',
            name: 'Cairo University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.damanhour.edu.eg/'],
            domains: ['damanhour.edu.eg'],
            country: 'Egypt',
            name: 'Damanhour University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.du.edu.eg/'],
            domains: ['du.edu.eg'],
            country: 'Egypt',
            name: 'Damietta University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.elshoroukacademy.edu.eg/'],
            domains: ['elshoroukacademy.edu.eg'],
            country: 'Egypt',
            name: 'El Shorouk Academy',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.fayoum.edu.eg/'],
            domains: ['fayoum.edu.eg'],
            country: 'Egypt',
            name: 'Fayoum University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.futureuniversity.edu.eg/'],
            domains: ['futureuniversity.edu.eg'],
            country: 'Egypt',
            name: 'Future University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.guc.edu.eg/'],
            domains: ['guc.edu.eg'],
            country: 'Egypt',
            name: 'German University in Cairo',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.helwan.edu.eg/'],
            domains: ['helwan.edu.eg'],
            country: 'Egypt',
            name: 'Helwan University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.hti.edu.eg/'],
            domains: ['hti.edu.eg'],
            country: 'Egypt',
            name: 'Higher Technological Institute',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.kfs.edu.eg/'],
            domains: ['kfs.edu.eg'],
            country: 'Egypt',
            name: 'Kafr El-Sheikh University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.mans.edu.eg/'],
            domains: ['mans.edu.eg'],
            country: 'Egypt',
            name: 'Mansoura University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.menofia.edu.eg/'],
            domains: ['menofia.edu.eg'],
            country: 'Egypt',
            name: 'Menoufia University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.minia.edu.eg/'],
            domains: ['minia.edu.eg'],
            country: 'Egypt',
            name: 'Minia University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.miuegypt.edu.eg/'],
            domains: ['miuegypt.edu.eg'],
            country: 'Egypt',
            name: 'Misr International University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.modern-academy.edu.eg/'],
            domains: ['modern-academy.edu.eg'],
            country: 'Egypt',
            name: 'Modern Acadmy',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.msa.eun.eg/'],
            domains: ['msa.eun.eg'],
            country: 'Egypt',
            name: 'Modern Sciences & Arts University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.mtc.edu.eg/'],
            domains: ['mtc.edu.eg'],
            country: 'Egypt',
            name: 'Military Technical College',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.mti.edu.eg/'],
            domains: ['mti.edu.eg'],
            country: 'Egypt',
            name: 'Modern University For Technology and Information',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.must.edu.eg/'],
            domains: ['must.edu.eg'],
            country: 'Egypt',
            name: 'Misr University for Sience and Technology',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.nileu.edu.eg/'],
            domains: ['nileu.edu.eg', 'nu.edu.eg'],
            country: 'Egypt',
            name: 'Nile University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.o6u.edu.eg/'],
            domains: ['o6u.edu.eg'],
            country: 'Egypt',
            name: 'October 6 university',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.pua.edu.eg/'],
            domains: ['pua.edu.eg'],
            country: 'Egypt',
            name: 'Pharos International University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.sadatacademy.edu.eg/'],
            domains: ['sadatacademy.edu.eg'],
            country: 'Egypt',
            name: 'Sadat Academy for Management Sciences',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['https://www.asu.edu.eg/'],
            domains: ['shams.edu.eg', 'asu.edu.eg', 'eng.asu.edu.eg'],
            country: 'Egypt',
            name: 'Ain Shams University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.sohag-univ.edu.eg/'],
            domains: ['sohag-univ.edu.eg'],
            country: 'Egypt',
            name: 'Sohag University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.su.edu.eg/'],
            domains: ['su.edu.eg'],
            country: 'Egypt',
            name: 'Sinai University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.suez.edu.eg/'],
            domains: ['suez.edu.eg'],
            country: 'Egypt',
            name: 'Suez Canal University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.svu.edu.eg/'],
            domains: ['svu.edu.eg'],
            country: 'Egypt',
            name: 'South Valley University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.tanta.edu.eg/'],
            domains: ['tanta.edu.eg'],
            country: 'Egypt',
            name: 'Tanta University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.ufe.edu.eg/'],
            domains: ['ufe.edu.eg'],
            country: 'Egypt',
            name: "Université Française d'Égypte",
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.usenghor-francophonie.org/'],
            domains: ['usenghor-francophonie.org'],
            country: 'Egypt',
            name: "Université Senghor d'Alexandrie",
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://www.zu.edu.eg/'],
            domains: ['zu.edu.eg'],
            country: 'Egypt',
            name: 'Zagazig University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['http://cic-cairo.com/'],
            domains: ['cic-cairo.com'],
            country: 'Egypt',
            name: 'CIC - Canadian International College',
            alpha_two_code: 'EG',
          },
          {
            'state-province': 'New Minia',
            web_pages: ['https://deraya.edu.eg'],
            domains: ['deraya.edu.eg'],
            country: 'Egypt',
            name: 'Deraya University',
            alpha_two_code: 'EG',
          },
          {
            'state-province': null,
            web_pages: ['https://buc.edu.eg'],
            domains: ['buc.edu.eg'],
            country: 'Egypt',
            name: 'Badr University in Cairo',
            alpha_two_code: 'EG',
          },
        ]
        const names = hardcodedUniversities.map((uni: any) => uni.name)
        setUniversities(names)
      } catch (error) {
        console.error('Error loading universities:', error)
        toast.error('Failed to load universities')
      } finally {
        setLoadingUniversities(false)
      }
    }

    if (currentStep === 0) {
      fetchCountries()
      loadUniversities()
    }
  }, [currentStep])

  const uploadFile = async (file: File, fieldName: 'photo' | 'syahadah_photo') => {
    try {
      if (fieldName === 'photo') setUploadingPhoto(true)
      else setUploadingSyahadah(true)

      // First, upload the file
      const formData = new FormData()
      formData.append('file', file)

      const endpoint = fieldName === 'photo' ? '/api/profile-photo' : '/api/syahadah'

      const uploadResponse = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.message || 'Upload failed')
      }

      const uploadResult = await uploadResponse.json()
      const mediaId = uploadResult.doc.id

      // Then, update the alt field
      const updateEndpoint = fieldName === 'photo' ? '/api/profile-photo' : '/api/syahadah'
      const updateResponse = await fetch(`${updateEndpoint}/${mediaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alt: file.name || 'Uploaded file',
        }),
      })

      if (!updateResponse.ok) {
        console.warn('Failed to update alt field, but file uploaded successfully')
      }

      form.setValue(fieldName, mediaId, { shouldValidate: false }) // Set the ID to the form field without validation
      if (fieldName === 'photo') setPhotoUploaded(true)
      else setSyahadahUploaded(true)
      form.clearErrors(fieldName) // Clear any existing errors for this field
      toast.success(t('Messages.UploadSuccess'))
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(
        t('Messages.UploadError') + (error instanceof Error ? error.message : 'Unknown error'),
      )
    } finally {
      if (fieldName === 'photo') setUploadingPhoto(false)
      else setUploadingSyahadah(false)
    }
  }
  switch (currentStep) {
    case 0:
      return (
        <div className="p-4 md:p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-gradient-to-tr from-white to-white/70 backdrop-blur-sm p-6 md:p-8 rounded-xl ring-1 ring-[#3E2522]/10 shadow-sm">
            <div className="bg-gradient-to-r from-[#3E2522]/10 to-[#5A3A2F]/10 p-4 rounded-lg mb-6 border border-[#3E2522]/10">
              <p className="text-xs md:text-sm text-[#3E2522] font-medium tracking-wide">
                <strong>{t('Page.Badge')}:</strong> {t('Form.Info')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <FormField
                control={form.control}
                name="registrant_type"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.RegistrantType')}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                          <SelectValue placeholder={t('Form.Labels.RegistrantType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SHOFI">
                          {t('Form.Options.RegistrantType.SHOFI')}
                        </SelectItem>
                        <SelectItem value="TASHFIYAH">
                          {t('Form.Options.RegistrantType.TASHFIYAH')}
                        </SelectItem>
                        <SelectItem value="ATRIBUT">
                          {t('Form.Options.RegistrantType.ATRIBUT')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.Name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('Form.Placeholders.Name')}
                        {...field}
                        className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_arabic"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.NameArabic')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('Form.Placeholders.NameArabic')}
                        {...field}
                        className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.Gender')}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                          <SelectValue placeholder={t('Form.Labels.Gender')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="L">{t('Form.Options.Gender.L')}</SelectItem>
                        <SelectItem value="P">{t('Form.Options.Gender.P')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.Email')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('Form.Placeholders.Email')}
                        {...field}
                        className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.Nationality')}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                          <SelectValue
                            placeholder={loadingCountries ? '...' : t('Form.Labels.Nationality')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passport_number"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.PassportNumberRequired')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('Form.Placeholders.PassportNumber')}
                        {...field}
                        className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.PhoneNumber')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('Form.Placeholders.PhoneNumber')}
                        {...field}
                        className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.WhatsApp')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('Form.Placeholders.WhatsApp')}
                        {...field}
                        className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kekeluargaan"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.Kekeluargaan')}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                          <SelectValue placeholder={t('Form.Labels.Kekeluargaan')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="KMM">KMM</SelectItem>
                        <SelectItem value="KMB">KMB</SelectItem>
                        <SelectItem value="KMJ">KMJ</SelectItem>
                        <SelectItem value="KPJ">KPJ</SelectItem>
                        <SelectItem value="KPMJB">KPMJB</SelectItem>
                        <SelectItem value="KMA">KMA</SelectItem>
                        <SelectItem value="KSW">KSW</SelectItem>
                        <SelectItem value="KEMASS">KEMASS</SelectItem>
                        <SelectItem value="KKS">KKS</SelectItem>
                        <SelectItem value="KSMR">KSMR</SelectItem>
                        <SelectItem value="KMNTB">KMNTB</SelectItem>
                        <SelectItem value="KMKM">KMKM</SelectItem>
                        <SelectItem value="IKMAL">IKMAL</SelectItem>
                        <SelectItem value="GAMAJATIM">GAMAJATIM</SelectItem>
                        <SelectItem value="HMMSU">HMMSU</SelectItem>
                        <SelectItem value="FOSGAMA">FOSGAMA</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      )
    case 1:
      return (
        <div className="p-4 md:p-6 animate-in fade-in slide-in-from-right-2 duration-500">
          <div className="bg-gradient-to-tr from-white to-white/70 backdrop-blur-sm p-6 md:p-8 rounded-xl ring-1 ring-[#3E2522]/10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.University')}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                          <SelectValue
                            placeholder={
                              loadingUniversities ? '...' : t('Form.Placeholders.University')
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {universities.map((uni) => (
                          <SelectItem key={uni} value={uni}>
                            {uni}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="education_level"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.EducationLevel')}
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                          <SelectValue placeholder={t('Form.Labels.EducationLevel')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="S1">{t('Form.Options.EducationLevel.S1')}</SelectItem>
                        <SelectItem value="S2">{t('Form.Options.EducationLevel.S2')}</SelectItem>
                        <SelectItem value="S3">{t('Form.Options.EducationLevel.S3')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="first_enrollment_year"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.FirstEnrollmentYear')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          field.onChange(isNaN(val) ? 2019 : val)
                        }}
                        className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="graduation_year"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.GraduationYear')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          field.onChange(isNaN(val) ? 2025 : val)
                        }}
                        className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="faculty"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.Faculty')}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === 'OTHER') {
                          setIsOtherFaculty(true)
                          setOtherFaculty(field.value || '')
                        } else {
                          setIsOtherFaculty(false)
                          setOtherFaculty('')
                        }
                        field.onChange(value)
                        if (value !== 'OTHER') {
                          form.setValue('faculty', value as any)
                        }
                      }}
                      value={isOtherFaculty ? 'OTHER' : field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                          <SelectValue placeholder={t('Form.Labels.Faculty')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USHULUDDIN">
                          {t('Form.Options.Faculty.USHULUDDIN')}
                        </SelectItem>
                        <SelectItem value="SYARIAH_QANUN">
                          {t('Form.Options.Faculty.SYARIAH_QANUN')}
                        </SelectItem>
                        <SelectItem value="BAHASA_ARAB">
                          {t('Form.Options.Faculty.BAHASA_ARAB')}
                        </SelectItem>
                        <SelectItem value="DIRASAT_BANIN">
                          {t('Form.Options.Faculty.DIRASAT_BANIN')}
                        </SelectItem>
                        <SelectItem value="DIRASAT_BANAT">
                          {t('Form.Options.Faculty.DIRASAT_BANAT')}
                        </SelectItem>
                        <SelectItem value="OTHER">{t('Form.Options.Faculty.OTHER')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {isOtherFaculty && (
                      <Input
                        placeholder={t('Form.Options.Faculty.OTHER')}
                        value={otherFaculty}
                        onChange={(e) => {
                          setOtherFaculty(e.target.value)
                          form.setValue('faculty', e.target.value as any)
                        }}
                        className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors mt-2"
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.Major')}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === 'OTHER') {
                          setIsOtherMajor(true)
                          setOtherMajor(field.value || '')
                        } else {
                          setIsOtherMajor(false)
                          setOtherMajor('')
                        }
                        field.onChange(value)
                        if (value !== 'OTHER') {
                          form.setValue('major', value as any)
                        }
                      }}
                      value={isOtherMajor ? 'OTHER' : field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                          <SelectValue placeholder={t('Form.Labels.Major')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TAFSIR_ULUMUL_QURAN">
                          {t('Form.Options.Major.TAFSIR_ULUMUL_QURAN')}
                        </SelectItem>
                        <SelectItem value="HADITS_ULUM">
                          {t('Form.Options.Major.HADITS_ULUM')}
                        </SelectItem>
                        <SelectItem value="AQIDAH_FALSAFAH">
                          {t('Form.Options.Major.AQIDAH_FALSAFAH')}
                        </SelectItem>
                        <SelectItem value="DAKWAH_TSAQOFAH">
                          {t('Form.Options.Major.DAKWAH_TSAQOFAH')}
                        </SelectItem>
                        <SelectItem value="SYARIAH_ISLAMIYAH">
                          {t('Form.Options.Major.SYARIAH_ISLAMIYAH')}
                        </SelectItem>
                        <SelectItem value="SYARIAH_QANUN">
                          {t('Form.Options.Major.SYARIAH_QANUN')}
                        </SelectItem>
                        <SelectItem value="BAHASA_ARAB_AMMAH">
                          {t('Form.Options.Major.BAHASA_ARAB_AMMAH')}
                        </SelectItem>
                        <SelectItem value="TARIKH_HADHARAH">
                          {t('Form.Options.Major.TARIKH_HADHARAH')}
                        </SelectItem>
                        <SelectItem value="OTHER">{t('Form.Options.Major.OTHER')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {isOtherMajor && (
                      <Input
                        placeholder={t('Form.Options.Major.OTHER')}
                        value={otherMajor}
                        onChange={(e) => {
                          setOtherMajor(e.target.value)
                          form.setValue('major', e.target.value as any)
                        }}
                        className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors mt-2"
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quran_memorization"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      {t('Form.Labels.QuranMemorization')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        {...field}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          field.onChange(isNaN(val) ? 0 : val)
                        }}
                        className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      )
    case 2:
      const registrantType = form.watch('registrant_type')
      const educationLevel = form.watch('education_level')
      const continuingStudy = form.watch('continuing_study')
      return (
        <div className="p-4 md:p-6 animate-in fade-in slide-in-from-left-2 duration-500">
          <div className="bg-gradient-to-tr from-white to-white/70 backdrop-blur-sm p-6 md:p-8 rounded-xl ring-1 ring-[#3E2522]/10 shadow-sm">
            <div className="space-y-6">
              {/* Syahadah Photo - Required for all registrant types */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#3E2522]">
                    {t('Form.Labels.SyahadahPhoto')} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        if (!file.type.startsWith('image/')) {
                          toast.error(t('Errors.InvalidFileType'))
                          return
                        }
                        if (file.size > 2 * 1024 * 1024) {
                          // 2MB limit
                          toast.error(t('Errors.FileTooLarge'))
                          return
                        }
                        uploadFile(file, 'syahadah_photo')
                      }
                    }}
                    disabled={uploadingSyahadah}
                    className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                  />
                  {uploadingSyahadah && (
                    <p className="text-sm text-blue-600 animate-pulse">
                      {t('Form.Upload.Uploading')}
                    </p>
                  )}
                  {syahadahUploaded && (
                    <p className="text-sm text-green-600">{t('Messages.UploadSuccess')}</p>
                  )}
                  {!syahadahUploaded && !uploadingSyahadah && (
                    <p className="text-sm text-red-600">Wajib diunggah</p>
                  )}
                </div>
              </div>
              {registrantType === 'SHOFI' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="shofi_ready_attend"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-300 hover:scale-105">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-[#3E2522]/30"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-[#3E2522] font-semibold">
                            {t('Form.Labels.ShofiReadyAttend')}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="predicate"
                    render={({ field }) => (
                      <FormItem className="transition-all duration-300 hover:scale-105">
                        <FormLabel className="text-[#3E2522] font-semibold">
                          {t('Form.Labels.Predicate')}
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                              <SelectValue placeholder="Pilih predikat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MUMTAZ_MMS">Mumtaz Ma'a Martabati Syarof</SelectItem>
                            <SelectItem value="MUMTAZ">Mumtaz</SelectItem>
                            <SelectItem value="JAYYID_JIDDAN_MMS">
                              Jayyid Jiddan Ma'a Martabati Syarof
                            </SelectItem>
                            <SelectItem value="JAYYID_JIDDAN">Jayyid Jiddan</SelectItem>
                            <SelectItem value="JAYYID">Jayyid</SelectItem>
                            <SelectItem value="MAQBUL">Maqbul</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cumulative_score"
                    render={({ field }) => (
                      <FormItem className="transition-all duration-300 hover:scale-105">
                        <FormLabel className="text-[#3E2522] font-semibold">
                          {t('Form.Labels.CumulativeScore')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={
                              field.value === null || field.value === undefined
                                ? ''
                                : String(field.value)
                            }
                            onChange={(e) => {
                              const v = e.target.value
                              if (v === '') {
                                field.onChange(null)
                              } else {
                                const parsed = parseFloat(v)
                                field.onChange(isNaN(parsed) ? null : parsed)
                              }
                            }}
                            className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {registrantType === 'TASHFIYAH' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="tashfiyah_ready_attend"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-300 hover:scale-105">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-[#3E2522]/30"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-[#3E2522] font-semibold">
                            {t('Form.Labels.TashfiyahReadyAttend')}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tashfiyah_ready_submit_proof"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-300 hover:scale-105">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-[#3E2522]/30"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-[#3E2522] font-semibold">
                            {t('Form.Labels.TashfiyahReadySubmitProof')}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tashfiyah_no_graduation_if_failed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-300 hover:scale-105">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-[#3E2522]/30"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-[#3E2522] font-semibold">
                            {t('Form.Labels.TashfiyahNoGraduationIfFailed')}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tashfiyah_still_get_attributes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-300 hover:scale-105">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-[#3E2522]/30"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-[#3E2522] font-semibold">
                            {t('Form.Labels.TashfiyahStillGetAttributes')}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {registrantType === 'ATRIBUT' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="atribut_ready_attend"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-300 hover:scale-105">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-[#3E2522]/30"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-[#3E2522] font-semibold">
                            {t('Form.Labels.AtributReadyAttend')}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="attribute_package"
                    render={({ field }) => (
                      <FormItem className="transition-all duration-300 hover:scale-105">
                        <FormLabel className="text-[#3E2522] font-semibold">
                          {t('Form.Labels.AttributePackage')}
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                              <SelectValue placeholder="Pilih paket" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SELENDANG_PIN_MEDALI">
                              {t('Form.Options.AttributePackage.SELENDANG_PIN_MEDALI')}
                            </SelectItem>
                            <SelectItem value="PLAKAT">
                              {t('Form.Options.AttributePackage.PLAKAT')}
                            </SelectItem>
                            <SelectItem value="LENGKAP">
                              {t('Form.Options.AttributePackage.LENGKAP')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {/*{educationLevel === 'S1' && (
                <FormField
                  control={form.control}
                  name="continuing_study"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-300 hover:scale-105">
                      <FormLabel className="text-[#3E2522] font-semibold">
                        {t('Form.Labels.ContinuingStudy')}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                            <SelectValue placeholder={t('Form.Labels.ContinuingStudy')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="YES">
                            {t('Form.Options.ContinuingStudy.YES')}
                          </SelectItem>
                          <SelectItem value="NO">{t('Form.Options.ContinuingStudy.NO')}</SelectItem>
                          <SelectItem value="UNDECIDED">
                            {t('Form.Options.ContinuingStudy.UNDECIDED')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {educationLevel === 'S1' && continuingStudy === 'YES' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="kulliyah"
                    render={({ field }) => (
                      <FormItem className="transition-all duration-300 hover:scale-105">
                        <FormLabel className="text-[#3E2522] font-semibold">
                          {t('Form.Labels.Kulliyah')}
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            if (value === 'OTHER') {
                              setIsOtherKulliyah(true)
                              setOtherKulliyah(field.value || '')
                            } else {
                              setIsOtherKulliyah(false)
                              setOtherKulliyah('')
                              form.setValue('kulliyah', value as any)
                            }
                            field.onChange(value)
                          }}
                          value={isOtherKulliyah ? 'OTHER' : field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                              <SelectValue placeholder={t('Form.Labels.Kulliyah')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ULUUM_ISLAMIYAH">
                              {t('Form.Options.Kulliyah.ULUUM_ISLAMIYAH')}
                            </SelectItem>
                            <SelectItem value="DIRASAT_ULYA">
                              {t('Form.Options.Kulliyah.DIRASAT_ULYA')}
                            </SelectItem>
                            <SelectItem value="DIRASAT_ISLAMIYAH_ARABIAH">
                              {t('Form.Options.Kulliyah.DIRASAT_ISLAMIYAH_ARABIAH')}
                            </SelectItem>
                            <SelectItem value="OTHER">
                              {t('Form.Options.Kulliyah.OTHER')}
                            </SelectItem>
                            <SelectItem value="TIDAK ADA">
                              {t('Form.Options.Kulliyah.TIDAK_ADA') ||
                                t('Form.Options.Kulliyah.TIDAK ADA')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {isOtherKulliyah && (
                          <Input
                            placeholder={t('Form.Options.Kulliyah.OTHER')}
                            value={otherKulliyah}
                            onChange={(e) => {
                              setOtherKulliyah(e.target.value)
                              form.setValue('kulliyah', e.target.value as any)
                            }}
                            className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors mt-2"
                          />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="syubah"
                    render={({ field }) => (
                      <FormItem className="transition-all duration-300 hover:scale-105">
                        <FormLabel className="text-[#3E2522] font-semibold">
                          {t('Form.Labels.Syubah')}
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            if (value === 'OTHER') {
                              setIsOtherSyubah(true)
                              setOtherSyubah(field.value || '')
                            } else {
                              setIsOtherSyubah(false)
                              setOtherSyubah('')
                              form.setValue('syubah', value as any)
                            }
                            field.onChange(value)
                          }}
                          value={isOtherSyubah ? 'OTHER' : field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                              <SelectValue placeholder={t('Form.Labels.Syubah')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TAFSIR_ULUMUL_QURAN">
                              {t('Form.Options.Syubah.TAFSIR_ULUMUL_QURAN')}
                            </SelectItem>
                            <SelectItem value="HADITS_ULUM">
                              {t('Form.Options.Syubah.HADITS_ULUM')}
                            </SelectItem>
                            <SelectItem value="AQIDAH_FALSAFAH">
                              {t('Form.Options.Syubah.AQIDAH_FALSAFAH')}
                            </SelectItem>
                            <SelectItem value="FIQH_AM">
                              {t('Form.Options.Syubah.FIQH_AM')}
                            </SelectItem>
                            <SelectItem value="FIQIH_MUQARRAN">
                              {t('Form.Options.Syubah.FIQIH_MUQARRAN')}
                            </SelectItem>
                            <SelectItem value="USHUL_FIQH">
                              {t('Form.Options.Syubah.USHUL_FIQH')}
                            </SelectItem>
                            <SelectItem value="LUGHAYWIYAT">
                              {t('Form.Options.Syubah.LUGHAYWIYAT')}
                            </SelectItem>
                            <SelectItem value="BALAGHAH_NAQD">
                              {t('Form.Options.Syubah.BALAGHAH_NAQD')}
                            </SelectItem>
                            <SelectItem value="ADAB_NAQD">
                              {t('Form.Options.Syubah.ADOB_NAQD') ||
                                t('Form.Options.Syubah.ADAB_NAQD')}
                            </SelectItem>
                            <SelectItem value="OTHER">{t('Form.Options.Syubah.OTHER')}</SelectItem>
                            <SelectItem value="TIDAK ADA">
                              {t('Form.Options.Syubah.TIDAK_ADA') ||
                                t('Form.Options.Syubah.TIDAK ADA')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {isOtherSyubah && (
                          <Input
                            placeholder={t('Form.Options.Syubah.OTHER')}
                            value={otherSyubah}
                            onChange={(e) => {
                              setOtherSyubah(e.target.value)
                              form.setValue('syubah', e.target.value as any)
                            }}
                            className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors mt-2"
                          />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}*/}
            </div>
          </div>
        </div>
      )
    case 3:
      return (
        <div className="p-4 md:p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-gradient-to-tr from-white to-white/70 backdrop-blur-sm p-6 md:p-8 rounded-xl ring-1 ring-[#3E2522]/10 shadow-sm">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#3E2522]/10 to-[#5A3A2F]/10 p-4 rounded-lg">
                <p className="text-sm text-[#3E2522] font-medium">
                  <strong>{t('Page.Badge')}:</strong> {t('Form.Upload.Info')}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#3E2522]">
                  {t('Form.Labels.Photo')}
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      if (!file.type.startsWith('image/')) {
                        toast.error(t('Errors.InvalidFileType'))
                        return
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        // 2MB limit
                        toast.error(t('Errors.FileTooLarge'))
                        return
                      }
                      uploadFile(file, 'photo')
                    }
                  }}
                  disabled={uploadingPhoto}
                  className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                />
                {uploadingPhoto && (
                  <p className="text-sm text-blue-600 animate-pulse">
                    {t('Form.Upload.Uploading')}
                  </p>
                )}
                {photoUploaded && !uploadingPhoto && (
                  <p className="text-sm text-green-600">{t('Form.Upload.Success')}</p>
                )}
                {!photoUploaded && !uploadingPhoto && (
                  <p className="text-sm text-red-600">{t('Form.Upload.NotUploaded')}</p>
                )}
              </div>
              <FormField
                control={form.control}
                name="terms_agreement"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-300 hover:scale-105">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-[#3E2522]/30"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-[#3E2522] font-semibold">
                        {t('Form.Labels.TermsAgreement')}
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      )
    case 4: {
      const data = form.getValues()
      const genderLabel: Record<string, string> = {
        L: t('Form.Options.Gender.L'),
        P: t('Form.Options.Gender.P'),
      }
      const registrantTypeLabel: Record<string, string> = {
        SHOFI: t('Form.Options.RegistrantType.SHOFI'),
        TASHFIYAH: t('Form.Options.RegistrantType.TASHFIYAH'),
        ATRIBUT: t('Form.Options.RegistrantType.ATRIBUT'),
      }
      const continuingStudyLabel: Record<string, string> = {
        YES: t('Common.Yes'),
        NO: t('Common.No'),
        UNDECIDED: t('Form.Options.ContinuingStudy.UNDECIDED'),
      }
      const predicateLabel: Record<string, string> = {
        MUMTAZ_MMS: t('Form.Options.Predicate.MUMTAZ_MMS'),
        MUMTAZ: t('Form.Options.Predicate.MUMTAZ'),
        JAYYID_JIDDAN_MMS: t('Form.Options.Predicate.JAYYID_JIDDAN_MMS'),
        JAYYID_JIDDAN: t('Form.Options.Predicate.JAYYID_JIDDAN'),
        JAYYID: t('Form.Options.Predicate.JAYYID'),
        MAQBUL: t('Form.Options.Predicate.MAQBUL'),
        RASIB: t('Form.Options.Predicate.RASIB'),
        DHAIF: t('Form.Options.Predicate.DHAIF'),
      }
      const attributePackageLabel: Record<string, string> = {
        SELENDANG_PIN_MEDALI: t('Form.Options.AttributePackage.SELENDANG_PIN_MEDALI'),
        PLAKAT: t('Form.Options.AttributePackage.PLAKAT'),
        LENGKAP: t('Form.Options.AttributePackage.LENGKAP'),
      }
      const boolIcon = (v?: boolean) => (
        <span
          className={
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ' +
            (v
              ? 'bg-emerald-50 text-emerald-700 ring-emerald-400/50'
              : 'bg-red-50 text-red-600 ring-red-400/40')
          }
        >
          {v ? '✓ ' + t('Common.Yes') : '✗ ' + t('Common.No')}
        </span>
      )

      const chip = (value: React.ReactNode) => (
        <span className="inline-flex max-w-full items-center truncate rounded-md bg-[#3E2522]/10 px-2 py-0.5 text-[11px] font-medium text-[#3E2522] ring-1 ring-[#3E2522]/15">
          {value || <span className="opacity-50">—</span>}
        </span>
      )

      interface Row {
        label: string
        value: React.ReactNode
      }

      const section = (title: string, rows: Row[]) => (
        <div className="group rounded-xl border border-[#3E2522]/15 bg-white/60 p-4 md:p-5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/75">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-[#3E2522] to-[#5A3A2F]" />
            <h4 className="text-sm font-semibold tracking-wide text-[#3E2522]">{title}</h4>
          </div>
          <dl className="grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
            {rows.map((r) => (
              <div key={r.label} className="space-y-1 min-w-0">
                <dt className="text-[10px] uppercase tracking-wide text-[#3E2522]/60 font-semibold">
                  {r.label}
                </dt>
                <dd className="text-sm font-medium text-[#3E2522] flex flex-wrap items-center gap-1">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )

      const basicRows: Row[] = [
        {
          label: t('Form.Labels.RegistrantType'),
          value: chip(registrantTypeLabel[data.registrant_type]),
        },
        { label: t('Form.Labels.Name'), value: chip(data.name) },
        { label: t('Form.Labels.NameArabic'), value: chip(data.name_arabic) },
        { label: t('Form.Labels.Gender'), value: chip(genderLabel[data.gender]) },
        { label: t('Form.Labels.Email'), value: chip(data.email) },
        { label: t('Form.Labels.Nationality'), value: chip(data.nationality) },
        {
          label: t('Form.Labels.PassportNumber'),
          value: chip(
            data.passport_number && data.passport_number.trim() !== '' ? data.passport_number : '—',
          ),
        },
        { label: t('Form.Labels.WhatsApp'), value: chip(data.whatsapp) },
        { label: t('Form.Labels.PhoneNumber'), value: chip(data.phone_number || '—') },
        { label: t('Form.Labels.Kekeluargaan'), value: chip(data.kekeluargaan) },
      ]

      const educationRows: Row[] = [
        { label: t('Form.Labels.University'), value: chip(data.university) },
        { label: t('Form.Labels.EducationLevel'), value: chip(data.education_level) },
        { label: t('Form.Labels.FirstEnrollmentYear'), value: chip(data.first_enrollment_year) },
        { label: t('Form.Labels.GraduationYear'), value: chip(data.graduation_year) },
        { label: t('Form.Labels.Faculty'), value: chip(data.faculty) },
        { label: t('Form.Labels.Major'), value: chip(data.major) },
        { label: t('Form.Labels.QuranMemorization'), value: chip(data.quran_memorization) },
        {
          label: t('Form.Labels.ContinuingStudy'),
          value: chip(continuingStudyLabel[data.continuing_study]),
        },
      ]

      if (data.education_level === 'S1' && data.continuing_study === 'YES') {
        educationRows.push(
          { label: t('Form.Labels.Kulliyah'), value: chip(data.kulliyah) },
          { label: t('Form.Labels.Syubah'), value: chip(data.syubah) },
        )
      }

      const specialRows: Row[] = []
      // Add syahadah photo for all registrant types
      specialRows.push(
        { label: t('Form.Labels.SyahadahPhoto'), value: boolIcon(!!data.syahadah_photo) },
      )
      
      if (data.registrant_type === 'SHOFI') {
        specialRows.push(
          { label: t('Form.Labels.ShofiReadyAttend'), value: boolIcon(data.shofi_ready_attend) },
          { label: t('Form.Labels.Predicate'), value: chip(predicateLabel[data.predicate]) },
          { label: t('Form.Labels.CumulativeScore'), value: chip(data.cumulative_score) },
        )
      }
      if (data.registrant_type === 'TASHFIYAH') {
        specialRows.push(
          {
            label: t('Form.Labels.TashfiyahReadyAttend'),
            value: boolIcon(data.tashfiyah_ready_attend),
          },
          {
            label: t('Form.Labels.TashfiyahReadySubmitProof'),
            value: boolIcon(data.tashfiyah_ready_submit_proof),
          },
          {
            label: t('Form.Labels.TashfiyahNoGraduationIfFailed'),
            value: boolIcon(data.tashfiyah_no_graduation_if_failed),
          },
          {
            label: t('Form.Labels.TashfiyahStillGetAttributes'),
            value: boolIcon(data.tashfiyah_still_get_attributes),
          },
        )
      }
      if (data.registrant_type === 'ATRIBUT') {
        specialRows.push(
          {
            label: t('Form.Labels.AtributReadyAttend'),
            value: boolIcon(data.atribut_ready_attend),
          },
          {
            label: t('Form.Labels.AttributePackage'),
            value: chip(attributePackageLabel[data.attribute_package]),
          },
        )
      }

      const uploadRows: Row[] = [
        { label: t('Form.Labels.Photo'), value: boolIcon(!!data.photo) },
        { label: t('Form.Labels.TermsAgreement'), value: boolIcon(data.terms_agreement) },
      ]

      const sections = [
        { title: t('Steps.1.Title'), rows: basicRows },
        { title: t('Steps.2.Title'), rows: educationRows },
        ...(specialRows.length > 0 ? [{ title: t('Steps.3.Title'), rows: specialRows }] : []),
        { title: t('Steps.4.Title'), rows: uploadRows },
      ]

      return (
        <div className="p-4 md:p-6 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="bg-gradient-to-tr from-white to-white/70 backdrop-blur-sm p-6 md:p-8 rounded-xl ring-1 ring-[#3E2522]/10 shadow-sm">
            <div className="mb-6 flex flex-col items-center gap-3 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-[#3E2522]">
                {t('Form.Summary.Title')}
              </h3>
              <p className="max-w-2xl text-sm text-[#3E2522]/70">{t('Form.Summary.Description')}</p>
              <div className="flex items-center gap-2 rounded-full bg-[#3E2522]/10 px-3 py-1 text-[11px] font-medium text-[#3E2522] ring-1 ring-[#3E2522]/20">
                <span>{t('Form.Summary.LastStep')}</span>
                <span className="h-1 w-1 rounded-full bg-[#3E2522]/40" />
                <span>{t('Form.Summary.Review')}</span>
              </div>
            </div>
            <div className="space-y-6">
              {sections.map((s) => (
                <React.Fragment key={s.title}>{section(s.title, s.rows)}</React.Fragment>
              ))}
            </div>
            {/*<div className="mt-8 flex flex-col items-center gap-4">
              <details className="w-full">
                <summary className="cursor-pointer select-none text-xs font-semibold tracking-wide text-[#3E2522]/70 underline-offset-4 hover:underline">
                  {t('Form.Summary.RawJSON')}
                </summary>
                <pre className="mt-3 max-h-72 overflow-auto rounded-lg border border-[#3E2522]/15 bg-[#3E2522]/5 p-4 text-[11px] leading-snug text-[#3E2522]">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
                    toast.success(t('Messages.CopySuccess'))
                  } catch {
                    toast.error(t('Messages.CopyError'))
                  }
                }}
                className="border-[#3E2522]/30 text-[#3E2522] hover:bg-[#3E2522]/10"
              >
                {t('Form.Summary.CopyJSON')}
              </Button>
              <p className="text-center text-[#3E2522] text-sm font-medium">
                {t('Form.Summary.FinalNote')}
              </p>
            </div>*/}
          </div>
        </div>
      )
    }
    default:
      return null
  }
}

export default React.memo(StepContent)
