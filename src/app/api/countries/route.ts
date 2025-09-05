import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.first.org/data/v1/countries', {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error('Failed to fetch countries')
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      throw new Error('API returned non-OK status')
    }

    // Transform to array of { code, name, region }
    const countries = Object.entries(data.data).map(([code, countryData]: [string, any]) => ({
      code,
      name: countryData.country,
      region: countryData.region,
    }))

    // Sort: Indonesia first, then by region, then alphabetically
    countries.sort((a, b) => {
      if (a.code === 'ID') return -1
      if (b.code === 'ID') return 1
      if (a.region !== b.region) return a.region.localeCompare(b.region)
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json(countries)
  } catch (error) {
    console.error('Error fetching countries:', error)
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 })
  }
}
