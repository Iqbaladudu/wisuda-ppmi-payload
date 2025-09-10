import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  const payload = await getPayload({ config })
  try {
    const countdownSettings = await payload.findGlobal({
      slug: 'countdown-settings',
    })

    return NextResponse.json(countdownSettings)
  } catch (error) {
    console.error('Error fetching countdown settings:', error)
    return NextResponse.json({ error: 'Failed to fetch countdown settings' }, { status: 500 })
  }
}
