import MultiStepForm from '@/components/daftar/MultiStepForm'

export default function DaftarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Pendaftaran Wisuda PPMI
        </h1>
        <MultiStepForm />
      </div>
    </div>
  )
}
