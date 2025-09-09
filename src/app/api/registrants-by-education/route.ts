import { NextResponse } from 'next/server'

interface EduCount {
  level: string
  count: number
}

// Dummy data untuk jenjang pendidikan
const dummyEduData = [
  { level: 'S1', count: 524 },
  { level: 'S2', count: 231 },
  { level: 'S3', count: 87 },
]

export async function GET() {
  try {
    // Untuk development, gunakan dummy data
    // Comment bagian bawah ini jika ingin menggunakan data dari database
    return NextResponse.json(dummyEduData)

    // Jika ingin menggunakan data dari database, uncomment bagian ini
    /*
    const payload = await getPayloadHMR({ config: payloadConfig })
    const result = await payload.find({ collection: 'registrants', depth: 0, limit: 500 })

    const map: Record<string, number> = { S1: 0, S2: 0, S3: 0, OTHER: 0 }
    for (const doc of result.docs as any[]) {
      const lvl = doc.education_level || 'OTHER'
      map[lvl] = (map[lvl] || 0) + 1
    }
    const counts: EduCount[] = Object.entries(map)
      .filter(([k]) => ['S1', 'S2', 'S3'].includes(k))
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => a.level.localeCompare(b.level))

    return NextResponse.json(counts)
    */
  } catch (e) {
    console.error('Error fetching registrants by education:', e)
    return NextResponse.json({ error: 'Failed to fetch education stats' }, { status: 500 })
  }
}
