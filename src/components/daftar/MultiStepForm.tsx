'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

// Zod schema for validation (simplified based on Registrants.ts)
const formSchema = z
  .object({
    registrant_type: z.string().min(1, 'Tipe pendaftar wajib dipilih'),
    name: z
      .string()
      .min(1, 'Nama lengkap wajib diisi')
      .refine((val) => val.trim().split(/\s+/).length >= 3, 'Nama Latin harus minimal 3 kata'),
    name_arabic: z
      .string()
      .min(3, 'Nama Arab harus minimal 3 karakter')
      .refine(
        (val) => /^[\u0600-\u06FF\s\ufb50-\ufdff\ufe70-\ufeff]+$/u.test(val),
        'Nama Arab harus hanya mengandung karakter Arab valid',
      ),
    gender: z.string().min(1, 'Jenis kelamin wajib dipilih'),
    email: z.string().email('Email tidak valid'),
    nationality: z.string().min(1, 'Kewarganegaraan wajib diisi'),
    passport_number: z.string().optional(),
    phone_number: z.string().optional(),
    whatsapp: z.string().min(1, 'WhatsApp wajib diisi'),
    kekeluargaan: z.string().optional(),
    university: z.string().min(1, 'Universitas wajib dipilih'),
    education_level: z.string().min(1, 'Jenjang pendidikan wajib dipilih'),
    first_enrollment_year: z.number().min(1900).max(2100),
    graduation_year: z.number().min(1900).max(2100),
    faculty: z.string().min(1, 'Fakultas wajib dipilih'),
    major: z.string().min(1, 'Jurusan wajib dipilih'),
    quran_memorization: z.number().min(0).max(30),
    continuing_study: z.string().optional(),
    kulliyah: z.string().optional(),
    syubah: z.string().optional(),
    // Type-specific fields
    shofi_ready_attend: z.boolean().optional(),
    predicate: z.string().optional(),
    cumulative_score: z.number().optional(),
    syahadah_photo: z.any().optional(),
    tashfiyah_ready_attend: z.boolean().optional(),
    tashfiyah_ready_submit_proof: z.boolean().optional(),
    tashfiyah_no_graduation_if_failed: z.boolean().optional(),
    tashfiyah_still_get_attributes: z.boolean().optional(),
    atribut_ready_attend: z.boolean().optional(),
    attribute_package: z.string().optional(),
    // General
    photo: z.any().optional(),
    terms_agreement: z
      .boolean()
      .refine((val) => val === true, 'Persetujuan syarat & ketentuan wajib dicentang'),
  })
  .refine(
    (data) => {
      if (
        data.nationality &&
        data.nationality.toLowerCase() !== 'indonesia' &&
        data.nationality.toLowerCase() !== 'wni' &&
        !data.passport_number
      ) {
        return false
      }
      return true
    },
    {
      message: 'Nomor paspor wajib diisi jika bukan WNI',
      path: ['passport_number'],
    },
  )
  .refine(
    (data) => {
      if (data.education_level === 'S1') {
        if (!data.continuing_study) return false
        if (data.continuing_study === 'YES') {
          if (!data.kulliyah || data.kulliyah === '') return false
          if (!data.syubah || data.syubah === '') return false
        }
      }
      return true
    },
    {
      message: 'Field melanjutkan studi dan detailnya wajib diisi untuk S1',
      path: ['continuing_study'],
    },
  )
  .refine(
    (data) => {
      if (data.registrant_type === 'SHOFI') {
        if (!data.shofi_ready_attend) return false
        if (!data.predicate) return false
        if (!data.syahadah_photo) return false
        if (
          data.cumulative_score != null &&
          (data.cumulative_score < 0 || data.cumulative_score > 100)
        )
          return false
      }
      return true
    },
    {
      message: 'Field Shofi wajib diisi',
      path: ['shofi_ready_attend'],
    },
  )
  .refine(
    (data) => {
      if (data.registrant_type === 'TASHFIYAH') {
        if (!data.tashfiyah_ready_attend) return false
        if (!data.tashfiyah_ready_submit_proof) return false
        if (!data.tashfiyah_no_graduation_if_failed) return false
        if (!data.tashfiyah_still_get_attributes) return false
      }
      return true
    },
    {
      message: 'Field Tashfiyah wajib diisi',
      path: ['tashfiyah_ready_attend'],
    },
  )
  .refine(
    (data) => {
      if (data.registrant_type === 'ATRIBUT') {
        if (!data.atribut_ready_attend) return false
        if (!data.attribute_package) return false
      }
      return true
    },
    {
      message: 'Field Atribut wajib diisi',
      path: ['atribut_ready_attend'],
    },
  )

type FormData = z.infer<typeof formSchema>

const steps = [
  { title: 'Identitas Dasar', description: 'Informasi pribadi dan kontak' },
  { title: 'Pendidikan', description: 'Detail pendidikan dan akademik' },
  { title: 'Detail Khusus', description: 'Field berdasarkan tipe pendaftar' },
  { title: 'Upload & Persetujuan', description: 'Unggah dokumen dan setujui syarat' },
  { title: 'Ringkasan & Kirim', description: 'Periksa data dan kirim pendaftaran' },
]

export default function MultiStepForm() {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="registrant_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Pendaftar</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe pendaftar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SHOFI">Shofi</SelectItem>
                      <SelectItem value="TASHFIYAH">Tashfiyah</SelectItem>
                      <SelectItem value="ATRIBUT">Pembeli Atribut</SelectItem>
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
                <FormItem>
                  <FormLabel>Nama Lengkap (Latin)</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_arabic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap (Arab)</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama Arab" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
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
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Masukkan email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kewarganegaraan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan kewarganegaraan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passport_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Paspor</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor paspor (jika bukan WNI)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor telepon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor WhatsApp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kekeluargaan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kekeluargaan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kekeluargaan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="KMM">Kesepakatan Mahasiswa Minangkabau</SelectItem>
                      <SelectItem value="KMB">Kesepakatan Mahasiswa Banten</SelectItem>
                      <SelectItem value="KMJ">Keluarga Mahasiswa Jambi</SelectItem>
                      <SelectItem value="KPJ">Keluarga Pelajar Jakarta</SelectItem>
                      <SelectItem value="KMA">Keluarga Mahasiswa Aceh</SelectItem>
                      <SelectItem value="KSW">Kelompok Studi Walisongo</SelectItem>
                      <SelectItem value="KEMASS">Keluarga Masyarakat Sumatera Selatan</SelectItem>
                      <SelectItem value="KKS">Kerukunan Keluarga Sulawesi</SelectItem>
                      <SelectItem value="KSMR">Kelompok Studi Mahasiswa Riau</SelectItem>
                      <SelectItem value="KMNTB">Keluarga Mahasiswa Nusa Tenggara & Bali</SelectItem>
                      <SelectItem value="KMKM">Keluarga Mahasiswa Kalimantan</SelectItem>
                      <SelectItem value="IKMAL">Ikatan Keluarga Mahasiswa Lampung</SelectItem>
                      <SelectItem value="GAMAJATIM">Keluarga Masyarakat Jawa Timur</SelectItem>
                      <SelectItem value="HMMSU">
                        Himpunan Masyarakat dan Mahasiswa Sumatera Utara
                      </SelectItem>
                      <SelectItem value="FOSGAMA">Forum Studi Keluarga Madura</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Universitas</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih universitas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AL_AZHAR">Al Azhar</SelectItem>
                      <SelectItem value="OTHER">Lainnya</SelectItem>
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
                <FormItem>
                  <FormLabel>Jenjang Pendidikan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenjang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="S1">Strata 1/Sarjana</SelectItem>
                      <SelectItem value="S2">Strata 2/Magister</SelectItem>
                      <SelectItem value="S3">Strata 3/Doktor</SelectItem>
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
                <FormItem>
                  <FormLabel>Tahun Pertama Terdaftar</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                <FormItem>
                  <FormLabel>Tahun Menyelesaikan Pendidikan</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                <FormItem>
                  <FormLabel>Fakultas</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih fakultas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USHULUDDIN">Ushuluddin</SelectItem>
                      <SelectItem value="SYARIAH_QANUN">Syariah wal Qonun</SelectItem>
                      <SelectItem value="BAHASA_ARAB">Lughoh Arabiyah</SelectItem>
                      <SelectItem value="DIRASAT_BANIN">
                        Dirasat Islamiyah wal Arabiyah Lil Banin
                      </SelectItem>
                      <SelectItem value="DIRASAT_BANAT">
                        Dirasat Islamiyah wal Arabiyah Lil Banat
                      </SelectItem>
                      <SelectItem value="OTHER">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jurusan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jurusan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TAFSIR_ULUMUL_QURAN">Tafsir wa Ulumul Quran</SelectItem>
                      <SelectItem value="HADITS_ULUM">Hadits wa Ulumul Hadits</SelectItem>
                      <SelectItem value="AQIDAH_FALSAFAH">Aqidah wal Falsafah</SelectItem>
                      <SelectItem value="DAKWAH_TSAQOFAH">Dakwah wa Tsaqofah</SelectItem>
                      <SelectItem value="SYARIAH_ISLAMIYAH">Syariah Islamiyah</SelectItem>
                      <SelectItem value="SYARIAH_QANUN">Syariah wal Qonun</SelectItem>
                      <SelectItem value="BAHASA_ARAB_AMMAH">Lughoh Arabiyah Ammah</SelectItem>
                      <SelectItem value="TARIKH_HADHARAH">Tarikh wal Hadharah</SelectItem>
                      <SelectItem value="OTHER">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quran_memorization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Juz Al Quran yang dihafal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )
      case 2:
        const registrantType = form.watch('registrant_type')
        return (
          <div className="space-y-4">
            {registrantType === 'SHOFI' && (
              <>
                <FormField
                  control={form.control}
                  name="shofi_ready_attend"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Siap hadiri pendaftaran</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="predicate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Predikat</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
                          <SelectItem value="RASIB">Rasib</SelectItem>
                          <SelectItem value="DHAIF">Dhaif</SelectItem>
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
                    <FormItem>
                      <FormLabel>Nilai Akumulatif</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="syahadah_photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foto Syahadah</FormLabel>
                      <FormControl>
                        <Input type="file" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {registrantType === 'TASHFIYAH' && (
              <>
                <FormField
                  control={form.control}
                  name="tashfiyah_ready_attend"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Siap hadiri pendaftaran</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tashfiyah_ready_submit_proof"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Siap serahkan bukti kelulusan</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tashfiyah_no_graduation_if_failed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Tidak lulus = tidak ikut wisuda</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tashfiyah_still_get_attributes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Tidak lulus = tetap dapat atribut</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </>
            )}
            {registrantType === 'ATRIBUT' && (
              <>
                <FormField
                  control={form.control}
                  name="atribut_ready_attend"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Siap hadir</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attribute_package"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paket Atribut</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih paket" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SELENDANG_PIN_MEDALI">
                            Selendang, Pin, dan Medali
                          </SelectItem>
                          <SelectItem value="PLAKAT">Plakat</SelectItem>
                          <SelectItem value="LENGKAP">
                            Selendang, Pin, Medali, dan Plakat
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="continuing_study"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Melanjutkan ke S2?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="YES">Ya</SelectItem>
                      <SelectItem value="NO">Tidak</SelectItem>
                      <SelectItem value="UNDECIDED">Belum Memutuskan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('education_level') === 'S1' && form.watch('continuing_study') === 'YES' && (
              <>
                <FormField
                  control={form.control}
                  name="kulliyah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kulliyah</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kulliyah" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ULUUM_ISLAMIYAH">Kulliyah Uluum Islamiyah</SelectItem>
                          <SelectItem value="DIRASAT_ULYA">Kulliyah Dirasat Ulya</SelectItem>
                          <SelectItem value="DIRASAT_ISLAMIYAH_ARABIAH">
                            Kulliyah Dirasat Islamiah Wa Arabiah
                          </SelectItem>
                          <SelectItem value="OTHER">Lainnya</SelectItem>
                          <SelectItem value="TIDAK ADA">Tidak Ada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="syubah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Syu'bah</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih syu'bah" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TAFSIR_ULUMUL_QURAN">
                            Tafsir wa Ulumul Qur'an
                          </SelectItem>
                          <SelectItem value="HADITS_ULUM">Hadits wa Ulumul Hadits</SelectItem>
                          <SelectItem value="AQIDAH_FALSAFAH">Aqidah wa Falsafah</SelectItem>
                          <SelectItem value="FIQH_AM">Fiqh Am</SelectItem>
                          <SelectItem value="FIQIH_MUQARRAN">Fiqih Muqarran</SelectItem>
                          <SelectItem value="USHUL_FIQH">Ushul Fiqh</SelectItem>
                          <SelectItem value="LUGHAYWIYAT">Lughawiyyat</SelectItem>
                          <SelectItem value="BALAGHAH_NAQD">Balaghah Wa Naqd</SelectItem>
                          <SelectItem value="ADAB_NAQD">Adab Wa Naqd</SelectItem>
                          <SelectItem value="OTHER">Lainnya</SelectItem>
                          <SelectItem value="TIDAK ADA">Tidak Ada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto Diri</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms_agreement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Persetujuan Syarat & Ketentuan</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )
      case 4:
        const formData = form.getValues()
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ringkasan Data</h3>
            <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(formData, null, 2)}</pre>
            <p>Klik "Kirim" untuk menyelesaikan pendaftaran.</p>
          </div>
        )
      default:
        return null
    }
  }

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
              {renderStepContent()}
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
