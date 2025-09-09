import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const majorLabels: Record<string, string> = {
  'SYARIAH_ISLAMIYAH': 'Syariah Islamiyah',
  'USHULUDDIN': 'Ushuluddin',
  'BAHASA_ARAB': 'Lughoh Arabiyah',
  'DIRASAT_BANIN': 'Dirasat Islamiyah wal Arabiyah Lil Banin',
  'DIRASAT_BANAT': 'Dirasat Islamiyah wal Arabiyah Lil Banat',
  'TAFSIR_ULUMUL_QURAN': 'Tafsir wa Ulumul Quran',
  'HADITS_ULUM': 'Hadits wa Ulumul Hadits',
  'AQIDAH_FALSAFAH': 'Aqidah wal Falsafah',
  'DAKWAH_TSAQOFAH': 'Dakwah wa Tsaqofah',
  'SYARIAH_QANUN': 'Syariah wal Qonun',
  'BAHASA_ARAB_AMMAH': 'Lughoh Arabiyah Ammah',
  'TARIKH_HADHARAH': 'Tarikh wal Hadharah',
  'FIQH_AM': 'Fiqh Am',
  'FIQIH_MUQARRAN': 'Fiqih Muqarran',
  'USHUL_FIQH': 'Ushul Fiqh',
  'LUGHAYWIYAT': 'Lughawiyyat',
  'BALAGHAH_NAQD': 'Balaghah Wa Naqd',
  'ADAB_NAQD': 'Adab Wa Naqd',
  'OTHER': 'Lainnya',
  'TIDAK ADA': 'Tidak Ada',
}

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Get current registrants data dengan limit yang lebih tinggi untuk akurasi
    const result = await payload.find({
      collection: 'registrants',
      depth: 0,
      limit: 5000, // Increased for accuracy
    })

    // Get registration settings
    const settings = await payload.find({
      collection: 'registration-settings',
      where: {
        is_active: { equals: true },
      },
      limit: 1,
    })

    const maxRegistrants = settings.docs.length > 0 ? settings.docs[0].max_registrants : null
    const totalRegistrants = result.totalDocs

    // Count by major dengan akurasi penuh
    const map: Record<string, number> = {}
    for (const doc of result.docs as any[]) {
      const m = doc.major || 'OTHER'
      map[m] = (map[m] || 0) + 1
    }

    // Hitung ulang total untuk memastikan akurasi
    const totalCountFromMap = Object.values(map).reduce((sum, count) => sum + count, 0)
    const actualTotal = Math.max(totalRegistrants, totalCountFromMap)

    // Calculate percentages dengan presisi tinggi
    const majorData = Object.entries(map)
      .map(([major, count]) => ({
        major,
        label: majorLabels[major] || major,
        count,
        // Persentase terhadap total pendaftar (2 desimal untuk akurasi)
        percentage: actualTotal > 0 ? Math.round((count / actualTotal) * 100 * 100) / 100 : 0,
        // Persentase terhadap batas maksimal (jika ada)
        percentageOfLimit: maxRegistrants ? Math.round((count / maxRegistrants) * 100 * 100) / 100 : null,
        // Persentase dari total keseluruhan (sama seperti percentage tapi untuk kejelasan)
        percentageOfTotal: actualTotal > 0 ? Math.round((count / actualTotal) * 100 * 100) / 100 : 0,
        // Ranking berdasarkan jumlah
        rank: 0, // Akan diisi setelah sorting
      }))
      .sort((a, b) => b.count - a.count)

    // Tambahkan ranking setelah sorting
    const rankedMajorData = majorData.map((item, index) => ({
      ...item,
      rank: index + 1,
    }))

    return NextResponse.json({
      data: rankedMajorData,
      summary: {
        totalRegistrants: actualTotal,
        maxRegistrants,
        registrationOpen: maxRegistrants ? actualTotal < maxRegistrants : true,
        remainingSlots: maxRegistrants ? Math.max(0, maxRegistrants - actualTotal) : null,
        utilizationRate: maxRegistrants ? Math.round((actualTotal / maxRegistrants) * 100 * 100) / 100 : null,
        lastUpdated: new Date().toISOString(),
        dataAccuracy: {
          totalFromAPI: totalRegistrants,
          totalFromMap: totalCountFromMap,
          difference: Math.abs(totalRegistrants - totalCountFromMap),
          isAccurate: totalRegistrants === totalCountFromMap,
        }
      },
    })
  } catch (error) {
    console.error('Error fetching registrants by major:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
