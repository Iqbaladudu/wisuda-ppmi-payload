import { NextResponse } from 'next/server'

// Dummy data untuk 10 jurusan wisudawan
const dummyMajorData = [
  { major: 'SYARIAH_ISLAMIYAH', count: 145 },
  { major: 'USHULUDDIN', count: 128 },
  { major: 'LUGHAH_ARABIYAH', count: 112 },
  { major: 'DAKWAH_WA_USHULUDDIN', count: 98 },
  { major: 'TARBIYAH_WA_TA_LIM', count: 87 },
  { major: 'ALQURAN_WAL_ULUM', count: 76 },
  { major: 'FIQH_WA_USULUHI', count: 65 },
  { major: 'TARIKH_WA_TAMADDUN', count: 54 },
  { major: 'IQTISAD_WA_IDARAH', count: 43 },
  { major: 'JAMIAT_WA_MUAMALAH', count: 32 },
]

export async function GET() {
  try {
    // Untuk development, gunakan dummy data
    // Comment bagian bawah ini jika ingin menggunakan data dari database
    return NextResponse.json(dummyMajorData)

    // Jika ingin menggunakan data dari database, uncomment bagian ini
    /*
    const payload = await getPayloadHMR({ config: payloadConfig })
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
    */
  } catch (error) {
    console.error('Error fetching registrants by major:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
