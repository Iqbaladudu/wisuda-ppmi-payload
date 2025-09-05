import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { phone, message, is_forwarded, duration } = await request.json()

    // Validate required fields
    if (!phone || !message) {
      return NextResponse.json({ error: 'Phone and message are required' }, { status: 400 })
    }

    // Get WhatsApp API credentials from environment variables
    const whatsappApiUrl = process.env.WHATSAPP_API_URL
    const whatsappUser = process.env.WHATSAPP_API_USER
    const whatsappPassword = process.env.WHATSAPP_API_PASSWORD

    if (!whatsappApiUrl) {
      return NextResponse.json({ error: 'WhatsApp API URL not configured' }, { status: 500 })
    }

    if (!whatsappUser || !whatsappPassword) {
      return NextResponse.json(
        { error: 'WhatsApp API credentials not configured' },
        { status: 500 },
      )
    }

    // Create base64 encoded credentials
    const credentials = Buffer.from(`${whatsappUser}:${whatsappPassword}`).toString('base64')

    // Call external WhatsApp API
    const response = await fetch(`${whatsappApiUrl}/send/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        phone,
        message,
        is_forwarded,
        duration,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `WhatsApp API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: 'WhatsApp message sent successfully',
      phone,
      timestamp: new Date().toISOString(),
      apiResponse: data,
    })
  } catch (error) {
    console.error('WhatsApp API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send WhatsApp message' },
      { status: 500 },
    )
  }
}
