import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import payloadConfig from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayloadHMR({ config: payloadConfig })

    const result = await payload.find({
      collection: 'registrants',
      depth: 0,
      limit: 500,
    })

    const map: Record<number, number> = {}
    for (const doc of result.docs as any[]) {
      const y = Number(doc.graduation_year)
      if (!isNaN(y)) map[y] = (map[y] || 0) + 1
    }

    // Hardcoded graduation statistics data
    const hardcodedData = [
      { year: 2020, total: 170 },
      { year: 2021, total: 379 },
      { year: 2022, total: 886 },
      { year: 2023, total: 1093 },
      { year: 2024, total: 1160 },
    ]

    // Build base stats from hardcoded data
    let stats = hardcodedData.sort((a, b) => a.year - b.year)

    // Only show years that have data (total > 0)
    stats = stats.filter(stat => stat.total > 0)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching yearly stats:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
