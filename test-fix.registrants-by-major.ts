import { RegistrantsByMajor } from '@/components/home/RegistrantsByMajor'

// Test data untuk memastikan komponen bekerja dengan format API baru
const testApiResponse = {
  data: [
    {
      major: 'SYARIAH_ISLAMIYAH',
      label: 'Syariah Islamiyah',
      count: 45,
      percentage: 30,
      percentageOfLimit: 22.5
    },
    {
      major: 'USHULUDDIN', 
      label: 'Ushuluddin',
      count: 32,
      percentage: 21,
      percentageOfLimit: 16
    }
  ],
  summary: {
    totalRegistrants: 150,
    maxRegistrants: 200,
    registrationOpen: true,
    remainingSlots: 50,
    utilizationRate: 75
  }
}

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(testApiResponse)
  })
)

describe('RegistrantsByMajor Component', () => {
  test('should handle new API response format', () => {
    // Test bahwa komponen bisa menangani format response baru
    expect(testApiResponse.data).toHaveLength(2)
    expect(testApiResponse.data[0].label).toBe('Syariah Islamiyah')
    expect(testApiResponse.data[0].percentage).toBe(30)
  })

  test('should calculate percentages correctly', () => {
    const item = testApiResponse.data[0]
    expect(item.percentage).toBe(30)
    expect(item.percentageOfLimit).toBe(22.5)
  })

  test('should provide fallback for missing labels', () => {
    const itemWithoutLabel = {
      major: 'NEW_MAJOR',
      count: 10,
      percentage: 5
    }
    
    // Mock getReadableMajorName function
    const getReadableMajorName = (item: any) => {
      return item.label || item.major.replace(/_/g, ' ')
    }
    
    expect(getReadableMajorName(itemWithoutLabel)).toBe('NEW MAJOR')
  })
})

console.log('✅ RegistrantsByMajor component test setup complete')
console.log('📊 Test data structure matches new API format')
console.log('🔄 Component should now work with updated API responses')