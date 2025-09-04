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
import type { FormData } from '../../constants/constants'

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
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload gagal: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      if (fieldName === 'photo') setUploadingPhoto(false)
      else setUploadingSyahadah(false)
    }
  }
  switch (currentStep) {
    case 0:
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Informasi:</strong> Field dengan tanda * wajib diisi. Pastikan semua data
              terisi dengan benar sebelum melanjutkan ke step berikutnya.
            </p>
          </div>
          <FormField
            control={form.control}
            name="registrant_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Pendaftar *</FormLabel>
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
                <FormLabel>Nama Lengkap (Latin) *</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Ahmad Abdullah Rahman" {...field} />
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
                <FormLabel>Nama Lengkap (Arab) *</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: أحمد عبدالله الرحمن" {...field} />
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
                <FormLabel>Jenis Kelamin *</FormLabel>
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
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Contoh: ahmad@example.com" {...field} />
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
                <FormLabel>Kewarganegaraan *</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Indonesia, Malaysia, dll" {...field} />
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
                <FormLabel>
                  Nomor Paspor{' '}
                  {form.watch('nationality')?.toLowerCase() !== 'indonesia' &&
                  form.watch('nationality')?.toLowerCase() !== 'wni'
                    ? '*'
                    : '(jika bukan WNI)'}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: A12345678" {...field} />
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
                  <Input placeholder="Contoh: 08123456789" {...field} />
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
                <FormLabel>Nomor WhatsApp *</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: 08123456789" {...field} />
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
                <FormLabel>Kekeluargaan *</FormLabel>
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
      const educationLevel = form.watch('education_level')
      const continuingStudy = form.watch('continuing_study')
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
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Foto Syahadah</label>
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
                />
                {uploadingSyahadah && <p className="text-sm text-blue-600">Mengupload...</p>}
                {syahadahUploaded && (
                  <p className="text-sm text-green-600">Foto berhasil diupload</p>
                )}
              </div>
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
                        <SelectItem value="LENGKAP">Selendang, Pin, Medali, dan Plakat</SelectItem>
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
          {educationLevel === 'S1' && continuingStudy === 'YES' && (
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
                        <SelectItem value="TAFSIR_ULUMUL_QURAN">Tafsir wa Ulumul Qur'an</SelectItem>
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
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Informasi:</strong> Upload foto diri Anda dan setujui syarat & ketentuan untuk melanjutkan.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Foto Diri *</label>
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
            />
            {uploadingPhoto && <p className="text-sm text-blue-600">Mengupload foto...</p>}
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
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Persetujuan Syarat & Ketentuan *</FormLabel>
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

export default React.memo(StepContent)
