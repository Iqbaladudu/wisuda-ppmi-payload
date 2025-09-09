import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '../../../../../payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config: payloadConfig })
    
    const settings = await payload.find({
      collection: 'registration-settings',
      sort: '-createdAt',
      limit: 10,
    })

    return NextResponse.json({
      settings: settings.docs,
      activeSettings: settings.docs.find(s => s.is_active) || null,
    })
  } catch (error) {
    console.error('Error fetching registration settings:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil pengaturan registrasi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const { maxRegistrants, description, is_active } = await request.json()

    if (typeof maxRegistrants !== 'number' || maxRegistrants < 0) {
      return NextResponse.json(
        { error: 'maxRegistrants harus berupa angka positif' },
        { status: 400 }
      )
    }

    // If activating this setting, deactivate all others
    if (is_active) {
      await payload.update({
        collection: 'registration-settings',
        where: {
          is_active: { equals: true },
        },
        data: {
          is_active: false,
        },
      })
    }

    // Check if we're updating existing or creating new
    const existingSettings = await payload.find({
      collection: 'registration-settings',
      where: {
        is_active: { equals: true },
      },
      limit: 1,
    })

    let result
    if (existingSettings.docs.length > 0) {
      // Update existing settings
      result = await payload.update({
        collection: 'registration-settings',
        id: existingSettings.docs[0].id,
        data: {
          max_registrants: maxRegistrants,
          description: description || '',
          is_active: is_active !== false,
        },
      })
    } else {
      // Create new settings
      result = await payload.create({
        collection: 'registration-settings',
        data: {
          name: 'Batas Maksimal Pendaftar',
          max_registrants: maxRegistrants,
          description: description || '',
          is_active: is_active !== false,
        },
      })
    }

    // Get current registrant count for context
    const currentCount = await payload.count({
      collection: 'registrants',
    })

    return NextResponse.json({
      message: 'Pengaturan batas maksimal pendaftar berhasil diperbarui',
      settings: result,
      context: {
        currentRegistrants: currentCount.totalDocs,
        remainingSlots: Math.max(0, maxRegistrants - currentCount.totalDocs),
        isAtLimit: currentCount.totalDocs >= maxRegistrants,
      },
    })
  } catch (error) {
    console.error('Error updating registration settings:', error)
    return NextResponse.json(
      { error: 'Gagal memperbarui pengaturan batas maksimal pendaftar' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const { id, maxRegistrants, description, is_active } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID diperlukan untuk update' },
        { status: 400 }
      )
    }

    if (typeof maxRegistrants !== 'number' || maxRegistrants < 0) {
      return NextResponse.json(
        { error: 'maxRegistrants harus berupa angka positif' },
        { status: 400 }
      )
    }

    // If activating this setting, deactivate all others
    if (is_active) {
      await payload.update({
        collection: 'registration-settings',
        where: {
          is_active: { equals: true },
          id: { not_equals: id },
        },
        data: {
          is_active: false,
        },
      })
    }

    const result = await payload.update({
      collection: 'registration-settings',
      id,
      data: {
        max_registrants: maxRegistrants,
        description: description || '',
        is_active: is_active !== false,
      },
    })

    return NextResponse.json({
      message: 'Pengaturan berhasil diperbarui',
      settings: result,
    })
  } catch (error) {
    console.error('Error updating registration settings:', error)
    return NextResponse.json(
      { error: 'Gagal memperbarui pengaturan' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID diperlukan untuk hapus' },
        { status: 400 }
      )
    }

    await payload.delete({
      collection: 'registration-settings',
      id,
    })

    return NextResponse.json({
      message: 'Pengaturan berhasil dihapus',
    })
  } catch (error) {
    console.error('Error deleting registration settings:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus pengaturan' },
      { status: 500 }
    )
  }
}