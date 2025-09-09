import * as z from 'zod'

// Helper untuk validasi Arabic (mirror dari Registrants.ts) - lebih permisif
const isArabic = (s?: string) => {
  if (!s || s.trim() === '') return true // Allow empty for now
  // Check if string contains at least one Arabic character
  return !!s?.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/)
}

// Mapping negara ke kode telepon
const countryPhoneCodes: Record<string, string> = {
  Indonesia: '+62',
  Egypt: '+20',
  'Saudi Arabia': '+966',
  'United Arab Emirates': '+971',
  Jordan: '+962',
  Morocco: '+212',
  Tunisia: '+216',
  Algeria: '+213',
  Malaysia: '+60',
  Singapore: '+65',
  Pakistan: '+92',
  Bangladesh: '+880',
  Turkey: '+90',
  Iran: '+98',
  Iraq: '+964',
  Syria: '+963',
  Yemen: '+967',
  Oman: '+968',
  Kuwait: '+965',
  Qatar: '+974',
  Bahrain: '+973',
  Lebanon: '+961',
  Palestine: '+970',
  // Tambah lebih jika perlu
}

// Schema Zod yang disinkronkan dengan Registrants.ts
export const formSchema = z
  .object({
    registrant_type: z.enum(['SHOFI', 'TASHFIYAH', 'ATRIBUT']),
    name: z
      .string()
      .trim()
      // i18n key: FormPage.Errors.NameRequired
      .min(1, 'Errors.NameRequired'),
    name_arabic: z
      .string()
      .trim()
      // i18n key: FormPage.Errors.NameArabicMin
      .min(1, 'Errors.NameArabicMin')
      // i18n key: FormPage.Errors.NameArabicInvalid
      .refine(isArabic, 'Errors.NameArabicInvalid'),
    gender: z.enum(['L', 'P']),
    email: z.string().trim().email('Errors.EmailInvalid'),
    nationality: z.string().trim().min(1, 'Errors.NationalityRequired'),
    passport_number: z.string().trim().default(''),
    phone_number: z
      .string()
      .optional()
      .transform((val) => (val ? val.trim() : val)),
    whatsapp: z
      .string()
      .trim()
      .min(1, 'Errors.WhatsAppRequired')
      .transform((val) => {
        // Remove all non-digit characters except +
        let cleaned = val.replace(/[^\d+]/g, '')
        // Ensure it starts with +
        if (!cleaned.startsWith('+')) {
          cleaned = '+' + cleaned
        }
        return cleaned
      })
      .refine((val) => {
        // Must start with + followed by digits
        return /^\+\d{7,15}$/.test(val)
      }, 'Errors.WhatsAppInvalid'),
    kekeluargaan: z
      .enum([
        'KMM',
        'KMB',
        'KMJ',
        'KPJ',
        'KPMJB',
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
    university: z.string().trim().min(1, 'Errors.UniversityRequired'),
    education_level: z.enum(['S1', 'S2', 'S3']),
    first_enrollment_year: z.number().min(1900).max(2100, 'Errors.YearInvalid'),
    graduation_year: z.number().min(1900).max(2100, 'Errors.YearInvalid'),
    faculty: z.string().trim().min(1, 'Errors.FacultyRequired'),
    major: z.string().trim().min(1, 'Errors.MajorRequired'),
    quran_memorization: z.number().min(0).max(30, 'Errors.QuranMemorizationRange'),
    continuing_study: z.enum(['YES', 'NO', 'UNDECIDED']).default('NO'),
    kulliyah: z.string().trim().default('TIDAK ADA'),
    syubah: z.string().trim().default('TIDAK ADA'),
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
    cumulative_score: z.number().min(0).max(100, 'Errors.ScoreRange').nullable().default(null),
    syahadah_photo: z.string().trim().default(''),
    tashfiyah_ready_attend: z.boolean().default(false),
    tashfiyah_ready_submit_proof: z.boolean().default(false),
    tashfiyah_no_graduation_if_failed: z.boolean().default(false),
    tashfiyah_still_get_attributes: z.boolean().default(false),
    atribut_ready_attend: z.boolean().default(false),
    attribute_package: z
      .enum(['SELENDANG_PIN_MEDALI', 'PLAKAT', 'LENGKAP'])
      .default('SELENDANG_PIN_MEDALI'),
    // General
    photo: z.string().trim().default(''), // ID file setelah upload
    terms_agreement: z
      .boolean()
      // i18n key: FormPage.Errors.TermsRequired
      .refine((val) => val === true, 'Errors.TermsRequired'),
  })
  .refine(
    (data) => {
      // Passport required for all nationalities
      return !!data.passport_number && data.passport_number.trim() !== ''
    },
    { message: 'Errors.PassportRequired', path: ['passport_number'] },
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
    { message: 'Errors.ContinuingStudyRequired', path: ['continuing_study'] },
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
    { message: 'Errors.ShofiRequired', path: ['shofi_ready_attend'] },
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
    { message: 'Errors.TashfiyahRequired', path: ['tashfiyah_ready_attend'] },
  )

export type FormData = z.infer<typeof formSchema>

export const steps = [
  { title: 'Identitas Dasar', description: 'Informasi pribadi dan kontak' },
  { title: 'Pendidikan', description: 'Detail pendidikan dan akademik' },
  { title: 'Detail Khusus', description: 'Field berdasarkan tipe pendaftar' },
  { title: 'Upload & Persetujuan', description: 'Unggah dokumen dan setujui syarat' },
  { title: 'Ringkasan & Kirim', description: 'Periksa data dan kirim pendaftaran' },
]
