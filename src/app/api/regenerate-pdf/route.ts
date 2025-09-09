import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  const payload = await getPayload({ config })
  try {
    const { registrantId } = await request.json()

    if (!registrantId) {
      return NextResponse.json({ error: 'Registrant ID is required' }, { status: 400 })
    }

    // Get the registrant data
    const registrant = await payload.findByID({
      collection: 'registrants',
      id: registrantId,
    })

    if (!registrant) {
      return NextResponse.json({ error: 'Registrant not found' }, { status: 404 })
    }

    // Regenerate PDF and send WhatsApp
    const updatedRegistrant = await payload.update({
      collection: 'registrants',
      id: registrantId,
      data: {
        // Trigger the afterChange hook by updating a field that will force PDF regeneration
        updatedAt: new Date().toISOString(),
        // Force PDF regeneration by clearing the existing PDF
        confirmation_pdf: null,
      },
      context: { skipPdf: false }, // Ensure PDF generation runs
    })

    return NextResponse.json({
      success: true,
      message: 'PDF regenerated and WhatsApp sent successfully',
      registrant: updatedRegistrant,
    })
  } catch (error: any) {
    console.error('Error in regenerate-pdf API:', error)
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 },
    )
  }
}
