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

const educationLabels: Record<string, string> = {
  'S1': 'Strata 1/Sarjana',
  'S2': 'Strata 2/Magister',
  'S3': 'Strata 3/Doktor',
}

const genderLabels: Record<string, string> = {
  'L': 'Laki-laki',
  'P': 'Perempuan',
}

const continuingStudyLabels: Record<string, string> = {
  'YES': 'Ya',
  'NO': 'Tidak',
  'UNDECIDED': 'Belum Memutuskan',
}

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Get current timestamp
    const timestamp = new Date().toISOString()

    // Get registration settings
    const settings = await payload.find({
      collection: 'registration-settings',
      where: {
        is_active: { equals: true },
      },
      limit: 1,
    })

    // Get all registrants
    const registrantsResult = await payload.find({
      collection: 'registrants',
      depth: 0,
      limit: 5000, // Increased limit for accurate stats
    })

    const totalRegistrants = registrantsResult.totalDocs
    const maxRegistrants = settings.docs.length > 0 ? settings.docs[0].max_registrants : null
    const remainingSlots = maxRegistrants ? Math.max(0, maxRegistrants - totalRegistrants) : null
    const isRegistrationOpen = maxRegistrants ? remainingSlots > 0 : true

    // Initialize comprehensive counters
    const counters = {
      major: {} as Record<string, number>,
      type: {} as Record<string, number>,
      education: {} as Record<string, number>,
      faculty: {} as Record<string, number>,
      gender: {} as Record<string, number>,
      university: {} as Record<string, number>,
      graduationYear: {} as Record<string, number>,
      kekeluargaan: {} as Record<string, number>,
      continuingStudy: {} as Record<string, number>,
      kulliyah: {} as Record<string, number>,
      syubah: {} as Record<string, number>,
    }

    // Calculate advanced metrics
    let totalQuranMemorization = 0
    let totalStudyDuration = 0
    let validDurationCount = 0

    // Process each registrant
    for (const doc of registrantsResult.docs as any[]) {
      // Count by major
      const major = doc.major || 'OTHER'
      counters.major[major] = (counters.major[major] || 0) + 1

      // Count by registrant type
      const type = doc.registrant_type || 'OTHER'
      counters.type[type] = (counters.type[type] || 0) + 1

      // Count by education level
      const education = doc.education_level || 'OTHER'
      counters.education[education] = (counters.education[education] || 0) + 1

      // Count by faculty
      const faculty = doc.faculty || 'OTHER'
      counters.faculty[faculty] = (counters.faculty[faculty] || 0) + 1

      // Count by gender
      const gender = doc.gender || 'OTHER'
      counters.gender[gender] = (counters.gender[gender] || 0) + 1

      // Count by university
      const university = doc.university || 'OTHER'
      counters.university[university] = (counters.university[university] || 0) + 1

      // Count by graduation year
      const year = doc.graduation_year?.toString() || 'OTHER'
      counters.graduationYear[year] = (counters.graduationYear[year] || 0) + 1

      // Count by kekeluargaan
      const kekeluargaan = doc.kekeluargaan || 'OTHER'
      counters.kekeluargaan[kekeluargaan] = (counters.kekeluargaan[kekeluargaan] || 0) + 1

      // Count by continuing study (only for S1)
      if (doc.education_level === 'S1') {
        const continuing = doc.continuing_study || 'OTHER'
        counters.continuingStudy[continuing] = (counters.continuingStudy[continuing] || 0) + 1
      }

      // Count by kulliyah (for continuing study)
      if (doc.kulliyah && doc.kulliyah !== 'TIDAK ADA') {
        const kulliyah = doc.kulliyah
        counters.kulliyah[kulliyah] = (counters.kulliyah[kulliyah] || 0) + 1
      }

      // Count by syubah (for continuing study)
      if (doc.syubah && doc.syubah !== 'TIDAK ADA') {
        const syubah = doc.syubah
        counters.syubah[syubah] = (counters.syubah[syubah] || 0) + 1
      }

      // Calculate metrics
      totalQuranMemorization += doc.quran_memorization || 0
      if (doc.study_duration && doc.study_duration > 0) {
        totalStudyDuration += doc.study_duration
        validDurationCount++
      }
    }

    // Helper function to format breakdown data with accurate percentages
    const formatBreakdown = (
      data: Record<string, number>,
      labelMap?: Record<string, string>,
      sortByCount = true,
      includePercentageOfLimit = false
    ) => {
      const total = Object.values(data).reduce((sum, count) => sum + count, 0)
      
      return Object.entries(data)
        .map(([key, count]) => ({
          key,
          label: labelMap?.[key] || key,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100 * 100) / 100 : 0, // 2 decimal places
          percentageOfLimit: includePercentageOfLimit && maxRegistrants 
            ? Math.round((count / maxRegistrants) * 100 * 100) / 100 
            : null,
          percentageOfTotal: total > 0 ? Math.round((count / total) * 100 * 100) / 100 : 0,
        }))
        .sort(sortByCount ? (a, b) => b.count - a.count : (a, b) => a.key.localeCompare(b.key))
    }

    // Format all breakdowns with accurate percentages
    const breakdowns = {
      byMajor: formatBreakdown(counters.major, majorLabels, true, true),
      byType: formatBreakdown(counters.type, registrantTypeLabels),
      byEducation: formatBreakdown(counters.education, educationLabels),
      byFaculty: formatBreakdown(counters.faculty),
      byGender: formatBreakdown(counters.gender, genderLabels),
      byUniversity: formatBreakdown(counters.university),
      byGraduationYear: formatBreakdown(counters.graduationYear, undefined, false),
      byKekeluargaan: formatBreakdown(counters.kekeluargaan),
      byContinuingStudy: formatBreakdown(counters.continuingStudy, continuingStudyLabels),
      byKulliyah: formatBreakdown(counters.kulliyah),
      bySyubah: formatBreakdown(counters.syubah),
    }

    // Calculate accurate metrics
    const avgQuranMemorization = totalRegistrants > 0 ? totalQuranMemorization / totalRegistrants : 0
    const avgStudyDuration = validDurationCount > 0 ? totalStudyDuration / validDurationCount : 0

    // Generate accurate insights
    const topMajors = breakdowns.byMajor.slice(0, 5)
    const topFaculties = breakdowns.byFaculty.slice(0, 5)
    const genderDistribution = {
      male: breakdowns.byGender.find(g => g.key === 'L')?.percentage || 0,
      female: breakdowns.byGender.find(g => g.key === 'P')?.percentage || 0,
    }

    const educationDistribution = {
      s1: breakdowns.byEducation.find(e => e.key === 'S1')?.percentage || 0,
      s2: breakdowns.byEducation.find(e => e.key === 'S2')?.percentage || 0,
      s3: breakdowns.byEducation.find(e => e.key === 'S3')?.percentage || 0,
    }

    const continuingStudyData = counters.continuingStudy
    const totalS1WithDecision = (continuingStudyData['YES'] || 0) + (continuingStudyData['NO'] || 0) + (continuingStudyData['UNDECIDED'] || 0)
    const continuingStudyRate = totalS1WithDecision > 0 
      ? Math.round(((continuingStudyData['YES'] || 0) / totalS1WithDecision) * 100 * 100) / 100 
      : 0

    const insights = {
      mostPopularMajor: topMajors[0]?.label || 'N/A',
      mostPopularMajorCount: topMajors[0]?.count || 0,
      mostPopularMajorPercentage: topMajors[0]?.percentage || 0,
      mostPopularFaculty: topFaculties[0]?.faculty || 'N/A',
      mostPopularFacultyCount: topFaculties[0]?.count || 0,
      mostPopularFacultyPercentage: topFaculties[0]?.percentage || 0,
      genderDistribution,
      educationDistribution,
      continuingStudyRate,
      totalS1Students: counters.education['S1'] || 0,
      totalContinuingStudy: continuingStudyData['YES'] || 0,
    }

    return NextResponse.json({
      timestamp,
      overview: {
        totalRegistrants,
        maxRegistrants,
        remainingSlots,
        isRegistrationOpen,
        utilizationRate: maxRegistrants ? Math.round((totalRegistrants / maxRegistrants) * 100 * 100) / 100 : null,
        avgQuranMemorization: Math.round(avgQuranMemorization * 100) / 100,
        avgStudyDuration: Math.round(avgStudyDuration * 100) / 100,
        lastUpdated: timestamp,
      },
      breakdowns,
      insights,
      settings: settings.docs.length > 0 ? {
        maxRegistrants: settings.docs[0].max_registrants,
        description: settings.docs[0].description,
        isActive: settings.docs[0].is_active,
        updatedAt: settings.docs[0].updatedAt,
      } : null,
    })
  } catch (error) {
    console.error('Error fetching real-time stats:', error)
    return NextResponse.json({ error: 'Gagal mengambil data stats real-time' }, { status: 500 })
  }
}