import { getPayload } from 'payload'
import config from '@/payload.config'
import { FormData } from '@/constants/constants'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data: FormData = await request.json()

    const payload = await getPayload({ config })

    // Map data untuk Payload
    const payloadData: any = {
      ...data,
      first_enrollment_year: Number(data.first_enrollment_year),
      graduation_year: Number(data.graduation_year),
      quran_memorization: Number(data.quran_memorization),
      cumulative_score: data.cumulative_score ? Number(data.cumulative_score) : null,
    }

    // Handle file uploads - asumsikan data.photo adalah ID dari media collection
    if (data.photo && typeof data.photo === 'string' && !data.photo.startsWith('http')) {
      payloadData.photo = data.photo
    } else {
      payloadData.photo = null // Skip jika URL atau tidak valid
    }

    if (
      data.syahadah_photo &&
      typeof data.syahadah_photo === 'string' &&
      !data.syahadah_photo.startsWith('http')
    ) {
      payloadData.syahadah_photo = data.syahadah_photo
    } else {
      payloadData.syahadah_photo = null
    }

    console.log('Payload data:', payloadData)

    const result = await payload.create({
      collection: 'registrants',
      data: payloadData,
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error('Submit registrant error:', error)
    // Return detailed error
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create registrant',
        details: error.errors || null,
      },
      { status: 500 },
    )
  }
}
