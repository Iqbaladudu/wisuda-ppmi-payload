import * as z from 'zod'

// Zod schema for validation (simplified based on Registrants.ts)
export const formSchema = z
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

export type FormData = z.infer<typeof formSchema>

export const steps = [
  { title: 'Identitas Dasar', description: 'Informasi pribadi dan kontak' },
  { title: 'Pendidikan', description: 'Detail pendidikan dan akademik' },
  { title: 'Detail Khusus', description: 'Field berdasarkan tipe pendaftar' },
  { title: 'Upload & Persetujuan', description: 'Unggah dokumen dan setujui syarat' },
  { title: 'Ringkasan & Kirim', description: 'Periksa data dan kirim pendaftaran' },
]
