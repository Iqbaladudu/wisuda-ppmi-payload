import { createConfirmationMessage, sendWhatsAppMessage, sendWhatsAppFile } from '@/lib/utils'
import type { CollectionConfig } from 'payload'
import { PDFDocument, StandardFonts, PDFFont } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { drawQRCodeOnPDF, drawImageOnPDF, FIELD_COORDINATES } from '@/lib/pdf-qrcode'

// Reusable enums (mirroring Django TextChoices)
const RegistrantType = [
  { label: 'Shofi', value: 'SHOFI' },
  { label: 'Tashfiyah', value: 'TASHFIYAH' },
  { label: 'Pembeli Atribut', value: 'ATRIBUT' },
]

const AttributePackage = [
  { label: 'Selendang, Pin, dan Medali', value: 'SELENDANG_PIN_MEDALI' },
  { label: 'Plakat', value: 'PLAKAT' },
  { label: 'Selendang, Pin, Medali, dan Plakat', value: 'LENGKAP' },
]

const University = [
  { label: 'Al Azhar', value: 'AL_AZHAR' },
  { label: 'Lainnya', value: 'OTHER' },
]

const EducationLevel = [
  { label: 'Strata 1/Sarjana', value: 'S1' },
  { label: 'Strata 2/Magister', value: 'S2' },
  { label: 'Strata 3/Doktor', value: 'S3' },
]

const Faculty = [
  { label: 'Ushuluddin', value: 'USHULUDDIN' },
  { label: 'Syariah wal Qonun', value: 'SYARIAH_QANUN' },
  { label: 'Lughoh Arabiyah', value: 'BAHASA_ARAB' },
  { label: 'Dirasat Islamiyah wal Arabiyah Lil Banin', value: 'DIRASAT_BANIN' },
  { label: 'Dirasat Islamiyah wal Arabiyah Lil Banat', value: 'DIRASAT_BANAT' },
  { label: 'Lainnya', value: 'OTHER' },
]

const Major = [
  { label: 'Tafsir wa Ulumul Quran', value: 'TAFSIR_ULUMUL_QURAN' },
  { label: 'Hadits wa Ulumul Hadits', value: 'HADITS_ULUM' },
  { label: 'Aqidah wal Falsafah', value: 'AQIDAH_FALSAFAH' },
  { label: 'Dakwah wa Tsaqofah', value: 'DAKWAH_TSAQOFAH' },
  { label: 'Syariah Islamiyah', value: 'SYARIAH_ISLAMIYAH' },
  { label: 'Syariah wal Qonun', value: 'SYARIAH_QANUN' },
  { label: 'Lughoh Arabiyah Ammah', value: 'BAHASA_ARAB_AMMAH' },
  { label: 'Tarikh wal Hadharah', value: 'TARIKH_HADHARAH' },
  { label: 'Lainnya', value: 'OTHER' },
]

const Syubah = [
  { label: 'Tafsir wa Ulumul Qur’an', value: 'TAFSIR_ULUMUL_QURAN' },
  { label: 'Hadits wa Ulumul Hadits', value: 'HADITS_ULUM' },
  { label: 'Aqidah wa Falsafah', value: 'AQIDAH_FALSAFAH' },
  { label: 'Fiqh Am', value: 'FIQH_AM' },
  { label: 'Fiqih Muqarran', value: 'FIQIH_MUQARRAN' },
  { label: 'Ushul Fiqh', value: 'USHUL_FIQH' },
  { label: 'Lughawiyyat', value: 'LUGHAYWIYAT' },
  { label: 'Balaghah Wa Naqd', value: 'BALAGHAH_NAQD' },
  { label: 'Adab Wa Naqd', value: 'ADAB_NAQD' },
  { label: 'Lainnya', value: 'OTHER' },
  { label: 'Tidak Ada', value: 'TIDAK ADA' },
]

const Predicate = [
  { label: 'Mumtaz Ma’a Martabati Syarof', value: 'MUMTAZ_MMS' },
  { label: 'Mumtaz', value: 'MUMTAZ' },
  { label: 'Jayyid Jiddan Ma’a Martabati Syarof', value: 'JAYYID_JIDDAN_MMS' },
  { label: 'Jayyid Jiddan', value: 'JAYYID_JIDDAN' },
  { label: 'Jayyid', value: 'JAYYID' },
  { label: 'Maqbul', value: 'MAQBUL' },
  { label: 'Rasib', value: 'RASIB' },
  { label: 'Dhaif', value: 'DHAIF' },
]

const ContinuingStudy = [
  { label: 'Ya', value: 'YES' },
  { label: 'Tidak', value: 'NO' },
  { label: 'Belum Memutuskan', value: 'UNDECIDED' },
]

const Kulliyah = [
  { label: 'Kulliyah Uluum Islamiyah', value: 'ULUUM_ISLAMIYAH' },
  { label: 'Kulliyah Dirasat Ulya', value: 'DIRASAT_ULYA' },
  { label: 'Kulliyah Dirasat Islamiah Wa Arabiah', value: 'DIRASAT_ISLAMIYAH_ARABIAH' },
  { label: 'Lainnya', value: 'OTHER' },
  { label: 'Tidak Ada', value: 'TIDAK ADA' },
]

const Kekeluargaan = [
  { label: 'Kesepakatan Mahasiswa Banten', value: 'KMB' },
  { label: 'Keluarga Mahasiswa Jambi', value: 'KMJ' },
  { label: 'Keluarga Pelajar Jakarta', value: 'KPJ' },
  { label: 'Keluarga Paguyuban Masyarakat Jawa Barat', value: 'KPMJB' },
  { label: 'Keluarga Mahasiswa Aceh', value: 'KMA' },
  { label: 'Kelompok Studi Walisongo', value: 'KSW' },
  { label: 'Keluarga Masyarakat Sumatera Selatan', value: 'KEMASS' },
  { label: 'Kerukunan Keluarga Sulawesi', value: 'KKS' },
  { label: 'Kelompok Studi Mahasiswa Riau', value: 'KSMR' },
  { label: 'Keluarga Mahasiswa Nusa Tenggara & Bali', value: 'KMNTB' },
  { label: 'Keluarga Mahasiswa Kalimantan', value: 'KMKM' },
  { label: 'Kesepakatan Mahasiswa Minangkabau', value: 'KMM' },
  { label: 'Ikatan Keluarga Mahasiswa Lampung', value: 'IKMAL' },
  { label: 'Keluarga Masyarakat Jawa Timur', value: 'GAMAJATIM' },
  { label: 'Himpunan Masyarakat dan Mahasiswa Sumatera Utara', value: 'HMMSU' },
  { label: 'Forum Studi Keluarga Madura', value: 'FOSGAMA' },
]

// Helper: Arabic-only validation
const isArabic = (s?: string) => !!s?.match(/^[\u0600-\u06FF\s\ufb50-\ufdff\ufe70-\ufeff]+$/)

const safeName = (name: string) =>
  name
    ?.split('')
    .filter((c) => /[A-Za-z0-9 _-]/.test(c))
    .join('')
    .trim()

// Validation functions
const validateName = (name: any) => {
  if (!name || name.trim().split(/\s+/).length < 1) {
    throw new Error('Errors.NameRequired')
  }
}

const validateArabicName = (nameArabic: any) => {
  if (!nameArabic || nameArabic.trim().split(/\s+/).length < 1) {
    throw new Error('Errors.NameArabicMin')
  }
  if (!isArabic(nameArabic)) {
    throw new Error('Errors.NameArabicInvalid')
  }
}

const validatePassport = (nationality: any, passportNumber: any) => {
  if (!passportNumber) {
    throw new Error('Errors.PassportRequired')
  }
}

const validateQuranMemorization = (quranMemorization: any) => {
  if (quranMemorization < 0 || quranMemorization > 30) {
    throw new Error('Errors.QuranMemorizationRange')
  }
}

const validateEducationLevel = (
  educationLevel: any,
  continuingStudy: any,
  kulliyah: any,
  syubah: any,
) => {
  if (educationLevel === 'S1') {
    if (!continuingStudy) {
      throw new Error('Errors.ContinuingStudyRequired')
    }
    if (continuingStudy === 'YES') {
      if (!kulliyah || kulliyah === '') {
        throw new Error('Errors.KulliyahRequired')
      }
      if (!syubah || syubah === '') {
        throw new Error('Errors.SyubahRequired')
      }
    }
  }
}

const validateShofi = (data: any) => {
  if (!data.shofi_ready_attend) throw new Error('Errors.ShofiRequired')
  if (!data.predicate) throw new Error('Errors.PredicateRequired')
  if (!data.syahadah_photo) throw new Error('Errors.SyahadahPhotoRequired')
  if (data.cumulative_score != null) {
    const n = Number(data.cumulative_score)
    if (isNaN(n) || n < 0 || n > 100) throw new Error('Errors.ScoreRange')
  }
}

const validateTashfiyah = (data: any) => {
  if (!data.tashfiyah_ready_attend) throw new Error('Errors.TashfiyahRequired')
  if (!data.tashfiyah_ready_submit_proof) throw new Error('Errors.TashfiyahReadySubmitProof')
  if (!data.tashfiyah_no_graduation_if_failed)
    throw new Error('Errors.TashfiyahNoGraduationIfFailed')
  if (!data.tashfiyah_still_get_attributes) throw new Error('Errors.TashfiyahStillGetAttributes')
}

const validateAtribut = (data: any) => {
  if (!data.atribut_ready_attend) throw new Error('Errors.AtributReadyAttend')
  if (!data.attribute_package) throw new Error('Errors.AttributePackageRequired')
}

const validateGeneral = (data: any) => {
  if (!data.photo) throw new Error('Errors.PhotoRequired')
  if (!data.terms_agreement) throw new Error('Errors.TermsRequired')
}

const validateMaxRegistrants = async (req: any) => {
  try {
    // Get active registration settings
    const settings = await req.payload.find({
      collection: 'registration-settings',
      where: {
        is_active: { equals: true },
      },
      limit: 1,
    })

    if (settings.docs.length > 0) {
      const setting = settings.docs[0]
      const maxRegistrants = setting.max_registrants

      // Skip validation if max_registrants is 0 or negative (unlimited)
      if (maxRegistrants <= 0) {
        console.log('Registration limit validation skipped: unlimited registration allowed')
        return
      }

      // Count current registrants
      const currentRegistrants = await req.payload.count({
        collection: 'registrants',
      })

      console.log(`Registration limit check: ${currentRegistrants.total}/${maxRegistrants}`)

      if (currentRegistrants.total >= maxRegistrants) {
        throw new Error(
          `Pendaftaran telah ditutup. Jumlah maksimal pendaftar (${maxRegistrants}) telah tercapai.`,
        )
      }
    } else {
      console.warn('No active registration settings found - proceeding without limit validation')
    }
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw validation errors
      if (error.message.includes('Pendaftaran telah ditutup')) {
        throw error
      }
      console.error('Error validating max registrants:', error.message)
      throw new Error('Gagal memeriksa batas maksimal pendaftar. Silakan coba lagi.')
    }
    throw new Error('Gagal memeriksa batas maksimal pendaftar')
  }
}

// Konfigurasi koordinat penulisan teks di atas template PDF.
// SESUAIKAN angka x,y berikut dengan posisi sebenarnya pada file PDF template Anda.
// Satuan koordinat pdf-lib: titik (origin kiri-bawah halaman).
// Tips: buka PDF di editor (misal Acrobat / InkScape) untuk mengukur koordinat atau
// pakai trial & error dengan mencetak grid.

export const Registrants: CollectionConfig = {
  slug: 'registrants',
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,
    create: () => true,
    delete: ({ req }) => req.user?.collection == 'users',
  },
  versions: false,
  fields: [
    // Registrant type
    {
      type: 'select',
      name: 'registrant_type',
      label: 'Tipe Pendaftar',
      required: true,
      options: RegistrantType,
      admin: { position: 'sidebar' },
      index: true,
    },

    // Identity fields
    { type: 'text', name: 'name', label: 'Nama Lengkap (Latin)', required: true },
    {
      type: 'text',
      name: 'name_arabic',
      label: 'Nama Lengkap (Arab)',
      required: true,
      validate: (val: any) => {
        if (!val || val.trim().split(/\s+/).length < 1) return 'Errors.NameArabicMin'
        if (!isArabic(val)) return 'Errors.NameArabicInvalid'
        return true
      },
    },
    {
      type: 'ui',
      name: 'sendWa',
      admin: {
        components: {
          Cell: 'src/app/(payload)/admin/components/SendWaCell.tsx',
        },
      },
    },
    {
      type: 'select',
      name: 'gender',
      label: 'Jenis Kelamin',
      required: true,
      options: [
        { label: 'Laki-laki', value: 'L' },
        { label: 'Perempuan', value: 'P' },
      ],
    },
    { type: 'email', name: 'email', label: 'Email', required: true },
    {
      type: 'text',
      name: 'nationality',
      label: 'Kewarganegaraan',
      required: true,
    },
    { type: 'text', name: 'passport_number', label: 'Nomor Paspor', required: true },
    { type: 'text', name: 'phone_number', label: 'Nomor Telepon' },
    { type: 'text', name: 'whatsapp', label: 'Nomor WhatsApp', required: true },
    {
      type: 'select',
      name: 'kekeluargaan',
      label: 'Kekeluargaan (Organisasi Kedaerahan)',
      options: Kekeluargaan,
      defaultValue: 'KMM',
    },

    // Education fields
    {
      type: 'text',
      name: 'university',
      label: 'Universitas',
      defaultValue: 'Al Azhar',
      required: true,
    },
    {
      type: 'select',
      name: 'education_level',
      label: 'Jenjang Pendidikan',
      options: EducationLevel,
      defaultValue: 'S1',
      required: true,
      index: true,
    },
    {
      type: 'number',
      name: 'first_enrollment_year',
      label: 'Tahun Pertama Terdaftar',
      defaultValue: 2019,
      required: true,
      min: 1900,
      max: 2100,
    },
    {
      type: 'number',
      name: 'graduation_year',
      label: 'Tahun Menyelesaikan Pendidikan',
      defaultValue: 2025,
      required: true,
      min: 1900,
      max: 2100,
      index: true,
    },
    {
      type: 'text',
      name: 'faculty',
      label: 'Fakultas',
      required: true,
      index: true,
    },
    {
      type: 'text',
      name: 'major',
      label: 'Jurusan',
      defaultValue: 'SYARIAH_QANUN',
      required: true,
      index: true,
    },
    {
      type: 'number',
      name: 'quran_memorization',
      label: 'Jumlah Juz Al Quran yang dihafal',
      defaultValue: 0,
      required: true,
      min: 0,
      max: 30,
    },
    {
      type: 'number',
      name: 'study_duration',
      label: 'Durasi Studi (Tahun)',
      admin: {
        readOnly: true,
        description: 'Otomatis dihitung dari graduation_year - first_enrollment_year',
      },
      defaultValue: 0,
    },

    // Continuing study fields
    {
      type: 'select',
      name: 'continuing_study',
      label: 'Melanjutkan ke S2?',
      options: ContinuingStudy,
    },
    {
      type: 'text',
      name: 'kulliyah',
      label: 'Kulliyah',
      defaultValue: 'TIDAK ADA',
    },
    {
      type: 'text',
      name: 'syubah',
      label: "Syu'bah",
      defaultValue: 'TIDAK ADA',
    },

    // Type-specific fields - SHOFI
    {
      type: 'checkbox',
      name: 'shofi_ready_attend',
      label: 'Siap hadiri pendaftaran',
      defaultValue: false,
      admin: { condition: (data) => data?.registrant_type === 'SHOFI' },
    },
    {
      type: 'select',
      name: 'predicate',
      label: 'Predikat',
      options: Predicate,
      admin: { condition: (data) => data?.registrant_type === 'SHOFI' },
    },
    {
      type: 'number',
      name: 'cumulative_score',
      label: 'Nilai Akumulatif',
      min: 0,
      max: 100,
      admin: { condition: (data) => data?.registrant_type === 'SHOFI' },
    },
    {
      type: 'upload',
      name: 'syahadah_photo',
      label: 'Foto Bukti Kelulusan (Syahadah/Kasyfu/Nilai Tingkat 4)',
      relationTo: 'syahadah',
      admin: { condition: (data) => data?.registrant_type === 'SHOFI' },
    },

    // Type-specific fields - TASHFIYAH
    {
      type: 'checkbox',
      name: 'tashfiyah_ready_attend',
      label: 'Siap hadiri pendaftaran',
      defaultValue: false,
      admin: { condition: (data) => data?.registrant_type === 'TASHFIYAH' },
    },
    {
      type: 'checkbox',
      name: 'tashfiyah_ready_submit_proof',
      label: 'Siap serahkan bukti kelulusan',
      defaultValue: false,
      admin: { condition: (data) => data?.registrant_type === 'TASHFIYAH' },
    },
    {
      type: 'checkbox',
      name: 'tashfiyah_no_graduation_if_failed',
      label: 'Tidak lulus = tidak ikut wisuda',
      defaultValue: false,
      admin: { condition: (data) => data?.registrant_type === 'TASHFIYAH' },
    },
    {
      type: 'checkbox',
      name: 'tashfiyah_still_get_attributes',
      label: 'Tidak lulus = tetap dapat atribut',
      defaultValue: false,
      admin: { condition: (data) => data?.registrant_type === 'TASHFIYAH' },
    },

    // Type-specific fields - ATRIBUT
    {
      type: 'checkbox',
      name: 'atribut_ready_attend',
      label: 'Siap hadir',
      defaultValue: false,
      admin: { condition: (data) => data?.registrant_type === 'ATRIBUT' },
    },
    {
      type: 'select',
      name: 'attribute_package',
      label: 'Paket Atribut',
      options: AttributePackage,
      admin: { condition: (data) => data?.registrant_type === 'ATRIBUT' },
    },

    // General fields
    {
      type: 'upload',
      name: 'photo',
      label: 'Foto Diri',
      relationTo: 'profile-photo',
      required: true,
    },
    {
      type: 'checkbox',
      name: 'terms_agreement',
      label: 'Persetujuan Syarat & Ketentuan',
      defaultValue: false,
      required: true,
    },
    {
      type: 'text',
      name: 'reg_id',
      label: 'ID Registrasi',
      admin: {
        readOnly: true,
        description:
          'Otomatis di-generate saat pendaftaran, format: 1-{registrant_type}-{name} (tetap/tidak berubah)',
      },
      defaultValue: '',
    },
    {
      type: 'upload',
      name: 'confirmation_pdf',
      label: 'PDF Konfirmasi',
      relationTo: 'confirmation-pdf',
      admin: { readOnly: true, description: 'Otomatis di-generate setelah perubahan data' },
    },
  ],

  // Schema-level guards to mirror Django clean()
  hooks: {
    afterChange: [
      async ({ operation, req, doc, previousDoc }) => {
        // Guard agar tidak loop saat internal update men-set confirmation_pdf
        if (req?.context?.skipPdf) {
          return doc
        }

        if (operation === 'create' || operation === 'update') {
          console.log(`After ${operation} hook for registrant ${doc.name}`)

          // Tentukan apakah perlu regenerate PDF
          const pdfRelevantFields = [
            'registrant_type',
            'name',
            'name_arabic',
            'gender',
            'email',
            'kekeluargaan',
            'passport_number',
            'university',
            'education_level',
            'faculty',
            'major',
            'whatsapp',
          ]

          // Jika update: cek perubahan field relevan
          if (
            operation === 'update' &&
            doc.confirmation_pdf && // sudah ada pdf sebelumnya
            previousDoc &&
            !pdfRelevantFields.some((f) => previousDoc[f] !== doc[f])
          ) {
            console.log('No PDF-relevant changes detected. Skipping PDF regeneration.')
          } else {
            try {
              const payload = req.payload
              // Use existing reg_id or generate fallback
              const regId =
                doc.reg_id ||
                `REG_${doc.id?.toString().replace(/-/g, '').toUpperCase().slice(0, 8) || Date.now().toString().slice(0, 8)}`

              // 1. Ambil template PDF
              const templateUrl =
                'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/confirmation_fix.pdf'
              const response = await fetch(templateUrl)
              if (!response.ok) throw new Error(`Failed to fetch PDF template: ${response.status}`)

              const templateBytes = await response.arrayBuffer()
              const pdfDoc = await PDFDocument.load(templateBytes)

              // 2. Font embedding
              pdfDoc.registerFontkit(fontkit)
              let font: PDFFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
              let hasUnicodeFont = false
              try {
                const fontCandidates = [
                  {
                    label: 'Cairo-Regular',
                    url: 'https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/Cairo-Bold.ttf',
                  },
                ]
                for (const fnt of fontCandidates) {
                  try {
                    const r = await fetch(fnt.url)
                    if (!r.ok) {
                      console.warn(`Font ${fnt.label} HTTP ${r.status}`)
                      continue
                    }
                    const bytes = await r.arrayBuffer()
                    font = await pdfDoc.embedFont(bytes, { subset: true })
                    hasUnicodeFont = true
                    console.log(`Embedded Arabic font: ${fnt.label}`)
                    break
                  } catch (err) {
                    console.warn(
                      `Failed embedding font ${fnt.label}:`,
                      err instanceof Error ? err.message : String(err),
                    )
                  }
                }
                if (!hasUnicodeFont) throw new Error('No Unicode font embedded')
              } catch (err) {
                console.warn(
                  'Falling back to Helvetica (Arabic text will be skipped):',
                  err instanceof Error ? err.message : String(err),
                )
                font = await pdfDoc.embedFont(StandardFonts.Helvetica)
              }

              // 3. Halaman
              const pages = pdfDoc.getPages()
              if (!pages.length) throw new Error('Template PDF tidak memiliki halaman')

              // 4. Fill PDF AcroForm
              const form = pdfDoc.getForm()

              const dataToFill = {
                reg_id: regId,
                registrant_type: doc.registrant_type || '',
                name: doc.name || '',
                name_arabic: doc.name_arabic || '',
                gender: doc.gender === 'L' ? 'Laki-laki' : doc.gender === 'P' ? 'Perempuan' : '',
                email: doc.email || '',
                kekeluargaan: doc.kekeluargaan || '',
                passport_number: doc.passport_number || '-',
                university: doc.university || '',
                education_level: doc.education_level || '',
                faculty: doc.faculty || '',
                major: doc.major || '',
                whatsapp: doc.whatsapp || '',
                phone_number: doc.phone_number || '',
              }

              for (const [fieldName, value] of Object.entries(dataToFill)) {
                try {
                  const field = form.getTextField(fieldName)
                  field.setText(String(value))

                  // If a special font is loaded for unicode and the value contains unicode,
                  // we need to update the field's appearance stream.
                  if (hasUnicodeFont && font && /[^ -]/.test(String(value))) {
                    field.updateAppearances(font)
                  }
                } catch (e) {
                  console.warn(
                    `Could not fill form field "${fieldName}": ${
                      e instanceof Error ? e.message : String(e)
                    }`,
                  )
                }
              }

              // Flatten the form to make it non-editable
              form.flatten()

              // 5. Generate QR code dengan data teks
              const qrText = `${dataToFill.reg_id}`
              let pdfBytes = await drawQRCodeOnPDF(
                await pdfDoc.save(),
                qrText,
                FIELD_COORDINATES.QR,
              )

              console.log('syahadah_photo', doc.syahadah_photo)
              // 6. Tambahkan syahadah photo jika ada
              if (doc.syahadah_photo) {
                try {
                  // Ambil data gambar syahadah dari collection
                  const syahadahDoc = await payload.findByID({
                    collection: 'syahadah',

                    id: doc.syahadah_photo.id || doc.syahadah_photo,
                  })

                  if (syahadahDoc && syahadahDoc.filename) {
                    // Download gambar dari endpoint syahadah
                    const imageUrl = `${process.env.BASE_URL || ''}/api/syahadah/file/${encodeURIComponent(syahadahDoc.filename)}`
                    console.log('Fetching syahadah image from:', imageUrl)
                    const imageResponse = await fetch(imageUrl)
                    if (imageResponse.ok) {
                      const imageData = new Uint8Array(await imageResponse.arrayBuffer())

                      // Tambahkan halaman ketiga untuk syahadah jika belum ada
                      const currentPdfDoc = await PDFDocument.load(pdfBytes)
                      const pages = currentPdfDoc.getPages()

                      if (pages.length < 3) {
                        // Tambahkan halaman baru
                        const newPage = currentPdfDoc.addPage()
                        pdfBytes = await currentPdfDoc.save()
                      }

                      // Draw syahadah photo di halaman 3 (tengah)
                      pdfBytes = await drawImageOnPDF(
                        pdfBytes,
                        imageData,
                        FIELD_COORDINATES.SYAHADAH,
                      )

                      console.log('Syahadah photo added to page 3')
                    }
                  }
                } catch (error) {
                  console.warn('Error adding syahadah photo to PDF:', error)
                }
              }

              // 7. Simpan
              const pdfBuffer = Buffer.from(pdfBytes)
              const fileName = `confirmation_${regId}.pdf`

              console.log(`Generated confirmation PDF for ${doc.name} (${regId})`)

              // 8. Upload file
              const uploadedFile = await payload.create({
                collection: 'confirmation-pdf',
                data: {
                  alt: `Confirmation PDF for ${doc.name || ''}`.trim(),
                },
                file: {
                  data: pdfBuffer,
                  name: fileName,
                  mimetype: 'application/pdf',
                  size: pdfBuffer.length,
                },
                context: { skipPdf: true }, // jangan sampai create file trigger logika lain (aman)
              })

              const pdfId = uploadedFile.id
              console.log(`Confirmation PDF with QR code stored: ${pdfId}`)

              if (pdfId && doc.confirmation_pdf !== pdfId) {
                await req.payload.update({
                  collection: 'registrants',
                  id: doc.id,
                  data: {
                    confirmation_pdf: pdfId,
                    reg_id: regId,
                  },
                  context: { skipPdf: true }, // HINDARI regenerasi
                  depth: 0,
                })

                // Kirim PDF ke WhatsApp setelah upload berhasil
                try {
                  const phoneNumber = doc.whatsapp.replace('+', '') + '@s.whatsapp.net'
                  const pdfCaption = createConfirmationMessage(doc, operation)
                  const whatsappApiUrl = process.env.WHATSAPP_API_URL
                  const whatsappUser = process.env.WHATSAPP_API_USER
                  const whatsappPassword = process.env.WHATSAPP_API_PASSWORD

                  if (whatsappApiUrl && whatsappUser && whatsappPassword) {
                    await sendWhatsAppFile(
                      phoneNumber,
                      pdfBuffer,
                      fileName,
                      pdfCaption,
                      whatsappApiUrl,
                      whatsappUser,
                      whatsappPassword,
                      doc.name,
                    )
                    console.log(`WhatsApp PDF sent to ${doc.name} (${phoneNumber})`)
                  } else {
                    console.warn('WhatsApp API credentials not configured')
                  }
                } catch (pdfError) {
                  console.error('Error sending WhatsApp PDF:', pdfError)
                }
              }
            } catch (error) {
              console.error('Error in PDF generation:', error)
            }
          }

          return doc
        }
      },
    ],
    beforeValidate: [
      async ({ data, originalDoc, operation, req }) => {
        const d = { ...(originalDoc || {}), ...(data || {}) }

        // Check max registrants limit only for create operation
        if (operation === 'create') {
          await validateMaxRegistrants(req)

          // Generate reg_id for new registrants
          if (!d.reg_id && d.registrant_type && d.name) {
            try {
              // Get all registrants with the same type to determine sequence number
              const sameTypeRegistrants = await req.payload.find({
                collection: 'registrants',
                where: {
                  registrant_type: { equals: d.registrant_type },
                },
                sort: '-createdAt',
                limit: 1000,
              })

              // Find the highest sequence number for this registrant type
              let sequenceNumber = 1
              for (const registrant of sameTypeRegistrants.docs) {
                if (
                  registrant.reg_id &&
                  registrant.reg_id.includes(`-${registrant.registrant_type}-`)
                ) {
                  const match = registrant.reg_id.match(/^(\d+)-/)
                  if (match) {
                    const existingSequence = parseInt(match[1])
                    if (existingSequence >= sequenceNumber) {
                      sequenceNumber = existingSequence + 1
                    }
                  }
                }
              }

              // Create safe name format
              const safeName = d.name
                .split('')
                .filter((c) => /[A-Za-z0-9 _-]/.test(c))
                .join('')
                .trim()
                .replace(/\s+/g, '_')
                .toUpperCase()

              d.reg_id = `${sequenceNumber}-${d.registrant_type}-${safeName}`
            } catch (error) {
              // Fallback to original format if there's an error
              const baseId = `${Date.now()}`
              d.reg_id = `REG_${baseId.replace(/-/g, '').toUpperCase().slice(0, 8)}`
            }
          }
        }

        // Compute study_duration
        if (typeof d.graduation_year === 'number' && typeof d.first_enrollment_year === 'number') {
          d.study_duration = d.graduation_year - d.first_enrollment_year
        }

        // Basic validations
        validateName(d.name)
        validateArabicName(d.name_arabic)
        validatePassport(d.nationality, d.passport_number)
        validateQuranMemorization(d.quran_memorization)
        validateEducationLevel(d.education_level, d.continuing_study, d.kulliyah, d.syubah)

        // Type-specific validations
        if (d.registrant_type === 'SHOFI') {
          validateShofi(d)
        } else if (d.registrant_type === 'TASHFIYAH') {
          validateTashfiyah(d)
        } else if (d.registrant_type === 'ATRIBUT') {
          validateAtribut(d)
        }

        // General validations
        validateGeneral(d)

        return d
      },
    ],
    afterRead: [
      async ({ doc }) => {
        // Only generate reg_id if it doesn't exist (for backward compatibility)
        if (!doc.reg_id && doc.registrant_type && doc.name) {
          // Fallback to original format if reg_id is missing
          const id = doc.id?.toString() || `${Date.now()}`
          const compact = id.replace(/-/g, '').toUpperCase()
          doc.reg_id = `REG_${compact.slice(0, 8)}`
        }

        return doc
      },
    ],
  },

  // Example of DB indexes similar to Django Meta.indexes
  // Use migrations to enforce; here as documentation:
  // indexes:
  // - (registrant_type, faculty, major)
  // - (education_level, graduation_year)
} as const
