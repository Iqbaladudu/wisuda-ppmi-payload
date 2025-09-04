import * as z from 'zod'

// Helper untuk validasi Arabic (mirror dari Registrants.ts) - lebih permisif
const isArabic = (s?: string) => {
  if (!s || s.trim() === '') return true // Allow empty for now
  // Check if string contains at least one Arabic character
  return !!s?.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/)
}

// Schema Zod yang disinkronkan dengan Registrants.ts
export const formSchema = z
  .object({
    registrant_type: z.enum(['SHOFI', 'TASHFIYAH', 'ATRIBUT']),
    name: z
      .string()
      .min(1, 'Nama lengkap wajib diisi')
      .refine((val) => val.trim().split(/\s+/).length >= 2, 'Nama Latin harus minimal 2 kata'),
    name_arabic: z
      .string()
      .min(3, 'Nama Arab minimal 3 karakter')
      .refine(isArabic, 'Nama Arab harus hanya mengandung karakter Arab valid'),
    gender: z.enum(['L', 'P']),
    email: z.string().email('Email tidak valid'),
    nationality: z.string().min(1, 'Kewarganegaraan wajib diisi'),
    passport_number: z.string().default(''),
    phone_number: z.string().optional(),
    whatsapp: z.string().min(1, 'WhatsApp wajib diisi'),
    kekeluargaan: z
      .enum([
        'KMM',
        'KMB',
        'KMJ',
        'KPJ',
        'KMA',
        'KSW',
        'KEMASS',
        'KKS',
        'KSMR',
        'KMNTB',
        'KMKM',
        'IKMAL',
        'GAMAJATIM',
        'HMMSU',
        'FOSGAMA',
      ])
      .default('KMM'),
    university: z.enum(['AL_AZHAR', 'OTHER']),
    education_level: z.enum(['S1', 'S2', 'S3']),
    first_enrollment_year: z.number().min(1900).max(2100, 'Tahun tidak valid'),
    graduation_year: z.number().min(1900).max(2100, 'Tahun tidak valid'),
    faculty: z.enum([
      'USHULUDDIN',
      'SYARIAH_QANUN',
      'BAHASA_ARAB',
      'DIRASAT_BANIN',
      'DIRASAT_BANAT',
      'OTHER',
    ]),
    major: z.enum([
      'TAFSIR_ULUMUL_QURAN',
      'HADITS_ULUM',
      'AQIDAH_FALSAFAH',
      'DAKWAH_TSAQOFAH',
      'SYARIAH_ISLAMIYAH',
      'SYARIAH_QANUN',
      'BAHASA_ARAB_AMMAH',
      'TARIKH_HADHARAH',
      'OTHER',
    ]),
    quran_memorization: z.number().min(0).max(30, 'Hafalan Quran 0-30 juz'),
    continuing_study: z.enum(['YES', 'NO', 'UNDECIDED']).default('NO'),
    kulliyah: z
      .enum(['ULUUM_ISLAMIYAH', 'DIRASAT_ULYA', 'DIRASAT_ISLAMIYAH_ARABIAH', 'OTHER', 'TIDAK ADA'])
      .default('TIDAK ADA'),
    syubah: z
      .enum([
        'TAFSIR_ULUMUL_QURAN',
        'HADITS_ULUM',
        'AQIDAH_FALSAFAH',
        'FIQH_AM',
        'FIQIH_MUQARRAN',
        'USHUL_FIQH',
        'LUGHAYWIYAT',
        'BALAGHAH_NAQD',
        'ADAB_NAQD',
        'OTHER',
        'TIDAK ADA',
      ])
      .default('TIDAK ADA'),
    // Type-specific fields
    shofi_ready_attend: z.boolean().default(false),
    predicate: z
      .enum([
        'MUMTAZ_MMS',
        'MUMTAZ',
        'JAYYID_JIDDAN_MMS',
        'JAYYID_JIDDAN',
        'JAYYID',
        'MAQBUL',
        'RASIB',
        'DHAIF',
      ])
      .default('MUMTAZ'),
    cumulative_score: z.number().min(0).max(100, 'Nilai 0-100').default(0),
    syahadah_photo: z.string().default(''),
    tashfiyah_ready_attend: z.boolean().default(false),
    tashfiyah_ready_submit_proof: z.boolean().default(false),
    tashfiyah_no_graduation_if_failed: z.boolean().default(false),
    tashfiyah_still_get_attributes: z.boolean().default(false),
    atribut_ready_attend: z.boolean().default(false),
    attribute_package: z
      .enum(['SELENDANG_PIN_MEDALI', 'PLAKAT', 'LENGKAP'])
      .default('SELENDANG_PIN_MEDALI'),
    // General
    photo: z.string().default(''), // ID file setelah upload
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
    { message: 'Nomor paspor wajib jika bukan WNI', path: ['passport_number'] },
  )
  .refine(
    (data) => {
      if (data.education_level === 'S1') {
        if (!data.continuing_study) return false
        if (data.continuing_study === 'YES') {
          if (!data.kulliyah || data.kulliyah === 'TIDAK ADA') return false
          if (!data.syubah || data.syubah === 'TIDAK ADA') return false
        }
      }
      return true
    },
    { message: 'Field melanjutkan studi dan detailnya wajib untuk S1', path: ['continuing_study'] },
  )
  .refine(
    (data) => {
      if (data.registrant_type === 'SHOFI') {
        if (!data.shofi_ready_attend) return false
        if (!data.predicate) return false
        if (!data.syahadah_photo || data.syahadah_photo === '') return false
      }
      return true
    },
    { message: 'Field Shofi wajib diisi', path: ['shofi_ready_attend'] },
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
    { message: 'Field Tashfiyah wajib diisi', path: ['tashfiyah_ready_attend'] },
  )

export type FormData = z.infer<typeof formSchema>

export const steps = [
  { title: 'Identitas Dasar', description: 'Informasi pribadi dan kontak' },
  { title: 'Pendidikan', description: 'Detail pendidikan dan akademik' },
  { title: 'Detail Khusus', description: 'Field berdasarkan tipe pendaftar' },
  { title: 'Upload & Persetujuan', description: 'Unggah dokumen dan setujui syarat' },
  { title: 'Ringkasan & Kirim', description: 'Periksa data dan kirim pendaftaran' },
]
