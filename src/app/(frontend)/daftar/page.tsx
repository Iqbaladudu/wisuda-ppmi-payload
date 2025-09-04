import MultiStepForm from '@/components/daftar/MultiStepForm'

export default function DaftarPage() {
  return (
    <div className="w-full py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 lg:flex-row lg:items-start lg:gap-10">
        <div className="w-full">
          <h1 className="mb-6 bg-gradient-to-r from-[#FCEFEA] via-white to-[#FCEFEA]/70 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent drop-shadow-sm lg:text-4xl">
            Pendaftaran Wisuda PPMI
          </h1>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-[#FCEFEA]/80">
            Silakan lengkapi setiap langkah form. Data Anda aman dan digunakan hanya untuk proses
            administrasi wisuda. Simpan kemajuan dengan menekan tombol selanjutnya.
          </p>
          <MultiStepForm />
        </div>
      </div>
    </div>
  )
}
