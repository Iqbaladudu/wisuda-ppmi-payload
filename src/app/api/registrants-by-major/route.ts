import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import payloadConfig from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayloadHMR({ config: payloadConfig })

    // Fetch all registrants majors (could optimize with aggregation if API supported)
    const result = await payload.find({
      collection: 'registrants',
      depth: 0,
      limit: 500,
    })

    const map: Record<string, number> = {}
    for (const doc of result.docs as any[]) {
      const m = doc.major || 'OTHER'
      map[m] = (map[m] || 0) + 1
    }

    const counts = Object.entries(map)
      .map(([major, count]) => ({ major, count }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json(counts)
  } catch (error) {
    console.error('Error fetching registrants by major:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
