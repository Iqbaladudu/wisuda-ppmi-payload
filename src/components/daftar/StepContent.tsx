import React, { useState, useEffect } from 'react'
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

const StepContent: React.FC<StepContentProps> = ({ currentStep, form }) => {
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingSyahadah, setUploadingSyahadah] = useState(false)
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [syahadahUploaded, setSyahadahUploaded] = useState(false)

  // Sync upload states with form values
  useEffect(() => {
    const currentPhoto = form.getValues('photo')
    const currentSyahadah = form.getValues('syahadah_photo')

    setPhotoUploaded(!!(currentPhoto && currentPhoto !== ''))
    setSyahadahUploaded(!!(currentSyahadah && currentSyahadah !== ''))
  }, [currentStep, form])

  const uploadFile = async (file: File, fieldName: 'photo' | 'syahadah_photo') => {
    try {
      if (fieldName === 'photo') setUploadingPhoto(true)
      else setUploadingSyahadah(true)

      // First, upload the file
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/media', {
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
      const updateResponse = await fetch(`/api/media/${mediaId}`, {
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
      toast.success('File berhasil diupload!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload gagal: ' + (error instanceof Error ? error.message : 'Unknown error'))
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
                <strong>Informasi:</strong> Field bertanda * wajib diisi. Periksa kembali sebelum
                melanjutkan.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <FormField
                control={form.control}
                name="registrant_type"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">Tipe Pendaftar *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
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
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      Nama Lengkap (Latin) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Ahmad Abdullah Rahman"
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
                      Nama Lengkap (Arab) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: أحمد عبدالله الرحمن"
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
                    <FormLabel className="text-[#3E2522] font-semibold">Jenis Kelamin *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
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
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Contoh: ahmad@example.com"
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
                      Kewarganegaraan *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: Indonesia, Malaysia, dll"
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
                name="passport_number"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      Nomor Paspor{' '}
                      {form.watch('nationality')?.toLowerCase() !== 'indonesia' &&
                      form.watch('nationality')?.toLowerCase() !== 'wni'
                        ? '*'
                        : '(jika bukan WNI)'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: A12345678"
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
                    <FormLabel className="text-[#3E2522] font-semibold">Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: 08123456789"
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
                    <FormLabel className="text-[#3E2522] font-semibold">Nomor WhatsApp *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: 08123456789"
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
                    <FormLabel className="text-[#3E2522] font-semibold">Kekeluargaan *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
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
                        <SelectItem value="KMNTB">
                          Keluarga Mahasiswa Nusa Tenggara & Bali
                        </SelectItem>
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
                    <FormLabel className="text-[#3E2522] font-semibold">Universitas</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
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
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      Jenjang Pendidikan
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
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
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      Tahun Pertama Terdaftar
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                      Tahun Menyelesaikan Pendidikan
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                    <FormLabel className="text-[#3E2522] font-semibold">Fakultas</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
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
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">Jurusan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
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
                  <FormItem className="md:col-span-2 transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      Jumlah Juz Al Quran yang dihafal
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                            Siap hadiri pendaftaran
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
                        <FormLabel className="text-[#3E2522] font-semibold">Predikat</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          Nilai Akumulatif
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-[#3E2522]">Foto Syahadah</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          uploadFile(file, 'syahadah_photo')
                        }
                      }}
                      disabled={uploadingSyahadah}
                      className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                    />
                    {uploadingSyahadah && (
                      <p className="text-sm text-blue-600 animate-pulse">Mengupload...</p>
                    )}
                    {syahadahUploaded && (
                      <p className="text-sm text-green-600">Foto berhasil diupload</p>
                    )}
                  </div>
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
                            Siap hadiri pendaftaran
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
                            Siap serahkan bukti kelulusan
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
                            Tidak lulus = tidak ikut wisuda
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
                            Tidak lulus = tetap dapat atribut
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
                          <FormLabel className="text-[#3E2522] font-semibold">Siap hadir</FormLabel>
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
                          Paket Atribut
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
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
                </div>
              )}
              <FormField
                control={form.control}
                name="continuing_study"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-105">
                    <FormLabel className="text-[#3E2522] font-semibold">
                      Melanjutkan ke S2?
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
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
              {educationLevel === 'S1' && continuingStudy === 'YES' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="kulliyah"
                    render={({ field }) => (
                      <FormItem className="transition-all duration-300 hover:scale-105">
                        <FormLabel className="text-[#3E2522] font-semibold">Kulliyah</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
                              <SelectValue placeholder="Pilih kulliyah" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ULUUM_ISLAMIYAH">
                              Kulliyah Uluum Islamiyah
                            </SelectItem>
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
                      <FormItem className="transition-all duration-300 hover:scale-105">
                        <FormLabel className="text-[#3E2522] font-semibold">Syu'bah</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors">
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
                </div>
              )}
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
                  <strong>Informasi:</strong> Upload foto diri Anda dan setujui syarat & ketentuan
                  untuk melanjutkan.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#3E2522]">Foto Diri *</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      uploadFile(file, 'photo')
                    }
                  }}
                  disabled={uploadingPhoto}
                  className="border-[#3E2522]/30 focus:border-[#3E2522] transition-colors"
                />
                {uploadingPhoto && (
                  <p className="text-sm text-blue-600 animate-pulse">Mengupload foto...</p>
                )}
                {photoUploaded && !uploadingPhoto && (
                  <p className="text-sm text-green-600">✓ Foto berhasil diupload</p>
                )}
                {!photoUploaded && !uploadingPhoto && (
                  <p className="text-sm text-red-600">Foto belum diupload</p>
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
                        Persetujuan Syarat & Ketentuan *
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

      const genderLabel: Record<string, string> = { L: 'Laki-laki', P: 'Perempuan' }
      const registrantTypeLabel: Record<string, string> = {
        SHOFI: 'Shofi',
        TASHFIYAH: 'Tashfiyah',
        ATRIBUT: 'Pembeli Atribut',
      }
      const continuingStudyLabel: Record<string, string> = {
        YES: 'Ya',
        NO: 'Tidak',
        UNDECIDED: 'Belum Memutuskan',
      }

      const predicateLabel: Record<string, string> = {
        MUMTAZ_MMS: "Mumtaz Ma'a Martabati Syarof",
        MUMTAZ: 'Mumtaz',
        JAYYID_JIDDAN_MMS: "Jayyid Jiddan Ma'a Martabati Syarof",
        JAYYID_JIDDAN: 'Jayyid Jiddan',
        JAYYID: 'Jayyid',
        MAQBUL: 'Maqbul',
        RASIB: 'Rasib',
        DHAIF: 'Dhaif',
      }

      const attributePackageLabel: Record<string, string> = {
        SELENDANG_PIN_MEDALI: 'Selendang + Pin + Medali',
        PLAKAT: 'Plakat',
        LENGKAP: 'Paket Lengkap',
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
          {v ? '✓ Ya' : '✗ Tidak'}
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
        { label: 'Tipe Pendaftar', value: chip(registrantTypeLabel[data.registrant_type]) },
        { label: 'Nama Latin', value: chip(data.name) },
        { label: 'Nama Arab', value: chip(data.name_arabic) },
        { label: 'Jenis Kelamin', value: chip(genderLabel[data.gender]) },
        { label: 'Email', value: chip(data.email) },
        { label: 'Kewarganegaraan', value: chip(data.nationality) },
        {
          label: 'Nomor Paspor',
          value: chip(
            data.passport_number && data.passport_number.trim() !== '' ? data.passport_number : '—',
          ),
        },
        { label: 'WhatsApp', value: chip(data.whatsapp) },
        { label: 'Telepon', value: chip(data.phone_number || '—') },
        { label: 'Kekeluargaan', value: chip(data.kekeluargaan) },
      ]

      const educationRows: Row[] = [
        { label: 'Universitas', value: chip(data.university) },
        { label: 'Jenjang', value: chip(data.education_level) },
        { label: 'Tahun Masuk', value: chip(data.first_enrollment_year) },
        { label: 'Tahun Selesai', value: chip(data.graduation_year) },
        { label: 'Fakultas', value: chip(data.faculty) },
        { label: 'Jurusan', value: chip(data.major) },
        { label: 'Hafalan Juz', value: chip(data.quran_memorization) },
        { label: 'Melanjutkan S2', value: chip(continuingStudyLabel[data.continuing_study]) },
      ]

      if (data.education_level === 'S1' && data.continuing_study === 'YES') {
        educationRows.push(
          { label: 'Kulliyah', value: chip(data.kulliyah) },
          { label: "Syu'bah", value: chip(data.syubah) },
        )
      }

      const specialRows: Row[] = []
      if (data.registrant_type === 'SHOFI') {
        specialRows.push(
          { label: 'Siap Hadir', value: boolIcon(data.shofi_ready_attend) },
          { label: 'Predikat', value: chip(predicateLabel[data.predicate]) },
          { label: 'Nilai Akumulatif', value: chip(data.cumulative_score) },
          { label: 'Foto Syahadah', value: boolIcon(!!data.syahadah_photo) },
        )
      }
      if (data.registrant_type === 'TASHFIYAH') {
        specialRows.push(
          { label: 'Siap Hadir', value: boolIcon(data.tashfiyah_ready_attend) },
          { label: 'Serah Bukti Kelulusan', value: boolIcon(data.tashfiyah_ready_submit_proof) },
          {
            label: 'Gagal = Tidak Wisuda',
            value: boolIcon(data.tashfiyah_no_graduation_if_failed),
          },
          {
            label: 'Gagal Tetap Dapat Atribut',
            value: boolIcon(data.tashfiyah_still_get_attributes),
          },
        )
      }
      if (data.registrant_type === 'ATRIBUT') {
        specialRows.push(
          { label: 'Siap Hadir', value: boolIcon(data.atribut_ready_attend) },
          { label: 'Paket Atribut', value: chip(attributePackageLabel[data.attribute_package]) },
        )
      }

      const uploadRows: Row[] = [
        { label: 'Foto Diri', value: boolIcon(!!data.photo) },
        { label: 'Setuju S&K', value: boolIcon(data.terms_agreement) },
      ]

      const sections = [
        { title: 'Identitas Dasar', rows: basicRows },
        { title: 'Pendidikan', rows: educationRows },
        ...(specialRows.length > 0 ? [{ title: 'Detail Khusus', rows: specialRows }] : []),
        { title: 'Upload & Persetujuan', rows: uploadRows },
      ]

      return (
        <div className="p-4 md:p-6 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="bg-gradient-to-tr from-white to-white/70 backdrop-blur-sm p-6 md:p-8 rounded-xl ring-1 ring-[#3E2522]/10 shadow-sm">
            <div className="mb-6 flex flex-col items-center gap-3 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-[#3E2522]">Ringkasan Data</h3>
              <p className="max-w-2xl text-sm text-[#3E2522]/70">
                Pastikan seluruh data sudah benar. Anda dapat kembali untuk mengubah jika masih ada
                yang perlu diperbaiki sebelum mengirim.
              </p>
              <div className="flex items-center gap-2 rounded-full bg-[#3E2522]/10 px-3 py-1 text-[11px] font-medium text-[#3E2522] ring-1 ring-[#3E2522]/20">
                <span>Langkah Terakhir</span>
                <span className="h-1 w-1 rounded-full bg-[#3E2522]/40" />
                <span>Review</span>
              </div>
            </div>
            <div className="space-y-6">
              {sections.map((s) => (
                <React.Fragment key={s.title}>{section(s.title, s.rows)}</React.Fragment>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-center gap-4">
              <details className="w-full">
                <summary className="cursor-pointer select-none text-xs font-semibold tracking-wide text-[#3E2522]/70 underline-offset-4 hover:underline">
                  Lihat JSON Mentah (Opsional)
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
                    toast.success('Disalin ke clipboard')
                  } catch {
                    toast.error('Gagal menyalin')
                  }
                }}
                className="border-[#3E2522]/30 text-[#3E2522] hover:bg-[#3E2522]/10"
              >
                Salin JSON
              </Button>
              <p className="text-center text-[#3E2522] text-sm font-medium">
                Tekan tombol Kirim untuk menyelesaikan pendaftaran.
              </p>
            </div>
          </div>
        </div>
      )
    }
    default:
      return null
  }
}

export default React.memo(StepContent)
