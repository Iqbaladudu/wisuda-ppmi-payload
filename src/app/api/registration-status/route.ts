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

const registrantTypeLabels: Record<string, string> = {
  'SHOFI': 'Shofi',
  'TASHFIYAH': 'Tashfiyah',
  'ATRIBUT': 'Pembeli Atribut',
}

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Get active registration settings
    const settings = await payload.find({
      collection: 'registration-settings',
      where: {
        is_active: { equals: true },
      },
      limit: 1,
    })

    // Get all registrants with detailed data
    const registrantsResult = await payload.find({
      collection: 'registrants',
      depth: 0,
      limit: 1000,
    })

    const totalRegistrants = registrantsResult.totalDocs
    const maxRegistrants = settings.docs.length > 0 ? settings.docs[0].max_registrants : null
    const remainingSlots = maxRegistrants ? Math.max(0, maxRegistrants - totalRegistrants) : null
    const isRegistrationOpen = maxRegistrants ? remainingSlots > 0 : true

    // Count by major
    const majorMap: Record<string, number> = {}
    const typeMap: Record<string, number> = {}
    const educationMap: Record<string, number> = {}
    const facultyMap: Record<string, number> = {}

    for (const doc of registrantsResult.docs as any[]) {
      // Count by major
      const major = doc.major || 'OTHER'
      majorMap[major] = (majorMap[major] || 0) + 1

      // Count by registrant type
      const type = doc.registrant_type || 'OTHER'
      typeMap[type] = (typeMap[type] || 0) + 1

      // Count by education level
      const education = doc.education_level || 'OTHER'
      educationMap[education] = (educationMap[education] || 0) + 1

      // Count by faculty
      const faculty = doc.faculty || 'OTHER'
      facultyMap[faculty] = (facultyMap[faculty] || 0) + 1
    }

    // Format breakdown data
    const majorBreakdown = Object.entries(majorMap)
      .map(([major, count]) => ({
        major,
        label: majorLabels[major] || major,
        count,
        percentage: totalRegistrants > 0 ? Math.round((count / totalRegistrants) * 100) : 0,
        percentageOfLimit: maxRegistrants ? Math.round((count / maxRegistrants) * 100) : null,
      }))
      .sort((a, b) => b.count - a.count)

    const typeBreakdown = Object.entries(typeMap)
      .map(([type, count]) => ({
        type,
        label: registrantTypeLabels[type] || type,
        count,
        percentage: totalRegistrants > 0 ? Math.round((count / totalRegistrants) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    const educationBreakdown = Object.entries(educationMap)
      .map(([level, count]) => ({
        level,
        count,
        percentage: totalRegistrants > 0 ? Math.round((count / totalRegistrants) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    const facultyBreakdown = Object.entries(facultyMap)
      .map(([faculty, count]) => ({
        faculty,
        count,
        percentage: totalRegistrants > 0 ? Math.round((count / totalRegistrants) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)

    // Generate status message
    let statusMessage = ''
    if (!maxRegistrants) {
      statusMessage = 'Pendaftaran terbuka (batas tidak ditentukan)'
    } else if (isRegistrationOpen) {
      statusMessage = `Pendaftaran terbuka. Sisa kuota: ${remainingSlots}`
    } else {
      statusMessage = `Pendaftaran ditutup. Kuota penuh (${maxRegistrants} pendaftar)`
    }

    return NextResponse.json({
      status: {
        isRegistrationOpen,
        message: statusMessage,
        maxRegistrants,
        currentRegistrants: totalRegistrants,
        remainingSlots,
        utilizationRate: maxRegistrants ? Math.round((totalRegistrants / maxRegistrants) * 100) : null,
      },
      breakdowns: {
        byMajor: majorBreakdown,
        byType: typeBreakdown,
        byEducation: educationBreakdown,
        byFaculty: facultyBreakdown,
      },
      settings: settings.docs.length > 0 ? {
        maxRegistrants: settings.docs[0].max_registrants,
        description: settings.docs[0].description,
        isActive: settings.docs[0].is_active,
      } : null,
    })
  } catch (error) {
    console.error('Error checking registration status:', error)
    return NextResponse.json({ error: 'Gagal memeriksa status pendaftaran' }, { status: 500 })
  }
}
