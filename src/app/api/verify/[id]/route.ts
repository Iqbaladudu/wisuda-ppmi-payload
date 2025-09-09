import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await getPayload({ config })
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Verification ID is required' }, { status: 400 })
    }

    // Cari registrant berdasarkan reg_id
    const registrant = await payload.find({
      collection: 'registrants',
      where: {
        reg_id: {
          equals: id.toUpperCase(),
        },
      },
      limit: 1,
    })

    if (!registrant.docs.length) {
      return NextResponse.json(
        {
          error: 'Registration not found',
          valid: false,
        },
        { status: 404 },
      )
    }

    const data = registrant.docs[0]

    return NextResponse.json({
      valid: true,
      data: {
        reg_id: data.reg_id,
        name: data.name,
        name_arabic: data.name_arabic,
        registrant_type: data.registrant_type,
        university: data.university,
        education_level: data.education_level,
        faculty: data.faculty,
        major: data.major,
        graduation_year: data.graduation_year,
        whatsapp: data.whatsapp,
        created_at: data.createdAt,
      },
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Failed to verify registration' }, { status: 500 })
  }
}
