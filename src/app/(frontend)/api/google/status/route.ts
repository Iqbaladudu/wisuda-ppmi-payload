import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const tokens = await payload.find({ collection: 'google-tokens', limit: 1 })
    const connected = tokens.docs.length > 0
    return NextResponse.json({ connected })
  } catch (e: any) {
    return NextResponse.json({ connected: false, error: e?.message || 'error' }, { status: 500 })
  }
}
