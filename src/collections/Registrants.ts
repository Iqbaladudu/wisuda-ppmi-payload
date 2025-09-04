import type { CollectionConfig } from 'payload'

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
const validateName = (name: string) => {
  if (!name || name.trim().split(/\s+/).length < 3) {
    throw new Error('Nama Latin harus minimal 3 kata')
  }
}

const validateArabicName = (nameArabic: string) => {
  if (!nameArabic || nameArabic.length < 3) {
    throw new Error('Nama Arab harus minimal 3 karakter')
  }
  if (!isArabic(nameArabic)) {
    throw new Error('Nama Arab harus hanya mengandung karakter Arab valid')
  }
}

const validatePassport = (nationality: string, passportNumber?: string) => {
  if (nationality && !passportNumber) {
    throw new Error('Nomor paspor wajib diisi jika bukan WNI')
  }
}

const validateQuranMemorization = (quranMemorization: number) => {
  if (typeof quranMemorization === 'number') {
    if (quranMemorization < 0 || quranMemorization > 30) {
      throw new Error('Jumlah hafalan Quran harus antara 0-30 juz')
    }
  }
}

const validateEducationLevel = (
  educationLevel: string,
  continuingStudy?: string,
  kulliyah?: string,
  syubah?: string,
) => {
  if (educationLevel === 'S1') {
    if (!continuingStudy) {
      throw new Error('Field melanjutkan studi wajib diisi untuk S1')
    }
    if (continuingStudy === 'YES') {
      if (!kulliyah || kulliyah === '') {
        throw new Error('Kulliyah wajib dipilih jika melanjutkan studi')
      }
      if (!syubah || syubah === '') {
        throw new Error("Syu'bah wajib dipilih jika melanjutkan studi")
      }
    }
  }
}

const validateShofi = (data: any) => {
  if (!data.shofi_ready_attend) throw new Error('Shofi harus siap hadiri pendaftaran')
  if (!data.predicate) throw new Error('Predikat wajib diisi untuk Shofi')
  if (!data.syahadah_photo) throw new Error('Foto syahadah wajib diunggah untuk Shofi')
  if (data.cumulative_score != null) {
    const n = Number(data.cumulative_score)
    if (isNaN(n) || n < 0 || n > 100) throw new Error('Nilai akumulatif harus antara 0 dan 100')
  }
}

const validateTashfiyah = (data: any) => {
  if (!data.tashfiyah_ready_attend)
    throw new Error('Siap hadiri pendaftaran harus dicentang untuk Tashfiyah')
  if (!data.tashfiyah_ready_submit_proof)
    throw new Error('Siap serahkan bukti kelulusan harus dicentang untuk Tashfiyah')
  if (!data.tashfiyah_no_graduation_if_failed)
    throw new Error('Tidak lulus = tidak ikut wisuda harus dicentang untuk Tashfiyah')
  if (!data.tashfiyah_still_get_attributes)
    throw new Error('Tidak lulus = tetap dapat atribut harus dicentang untuk Tashfiyah')
}

const validateAtribut = (data: any) => {
  if (!data.atribut_ready_attend) throw new Error('Pembeli atribut harus siap hadir')
  if (!data.attribute_package) throw new Error('Paket atribut wajib dipilih')
}

const validateGeneral = (data: any) => {
  if (!data.photo) throw new Error('Foto diri wajib diunggah')
  if (!data.terms_agreement) throw new Error('Persetujuan syarat & ketentuan wajib dicentang')
}

export const Registrants: CollectionConfig = {
  slug: 'registrants',
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,
    create: () => true,
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
        if (!val || val.length < 3) return 'Nama Arab harus minimal 3 karakter'
        if (!isArabic(val)) return 'Nama Arab harus hanya mengandung karakter Arab valid'
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
    { type: 'text', name: 'passport_number', label: 'Nomor Paspor' },
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
      type: 'select',
      name: 'university',
      label: 'Universitas',
      options: University,
      defaultValue: 'AL_AZHAR',
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
      type: 'select',
      name: 'faculty',
      label: 'Fakultas',
      options: Faculty,
      required: true,
      index: true,
    },
    {
      type: 'select',
      name: 'major',
      label: 'Jurusan',
      options: Major,
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
      type: 'select',
      name: 'kulliyah',
      label: 'Kulliyah',
      options: Kulliyah,
      defaultValue: 'TIDAK ADA',
    },
    {
      type: 'select',
      name: 'syubah',
      label: "Syu'bah",
      options: Syubah,
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
      label: 'Foto Syahadah',
      relationTo: 'media',
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
      relationTo: 'media',
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
      admin: { readOnly: true, description: 'Otomatis di-generate berdasarkan ID database' },
      defaultValue: '',
    },
  ],

  // Schema-level guards to mirror Django clean()
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc }) => {
        const d = { ...(originalDoc || {}), ...(data || {}) }

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
        // Generate reg_id dynamically when reading the document
        if (doc.id) {
          const id = doc.id.toString()
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
