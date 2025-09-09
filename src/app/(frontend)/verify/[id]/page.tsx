'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface VerificationData {
  valid: boolean
  data?: {
    reg_id: string
    name: string
    name_arabic: string
    registrant_type: string
    university: string
    education_level: string
    faculty: string
    major: string
    graduation_year: number
    whatsapp: string
    created_at: string
  }
  error?: string
}

export default function VerificationPage() {
  const params = useParams()
  const [data, setData] = useState<VerificationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyRegistration = async () => {
      try {
        const response = await fetch(`/api/verify/${params.id}`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        setData({ valid: false, error: 'Failed to verify' })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      verifyRegistration()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!data || !data.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifikasi Gagal</h2>
            <p className="text-gray-600">
              {data?.error || 'Data registrasi tidak ditemukan'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const registrantData = data.data!

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Verifikasi Berhasil</CardTitle>
            <p className="text-gray-600">Data registrasi telah terverifikasi</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID Registrasi</label>
                <p className="font-mono text-lg">{registrantData.reg_id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                <p className="text-lg">{registrantData.name}</p>
                <p className="text-lg text-right" dir="rtl">{registrantData.name_arabic}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Tipe Pendaftar</label>
                <Badge variant="secondary">{registrantData.registrant_type}</Badge>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Universitas</label>
                <p>{registrantData.university}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Jenjang Pendidikan</label>
                <p>{registrantData.education_level}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Fakultas</label>
                <p>{registrantData.faculty}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Jurusan</label>
                <p>{registrantData.major}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Tahun Wisuda</label>
                <p>{registrantData.graduation_year}</p>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-6">
              <p className="text-sm text-gray-500 text-center">
                Terdaftar pada {new Date(registrantData.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}