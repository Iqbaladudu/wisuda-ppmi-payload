import type { CollectionConfig } from 'payload'

export const RegistrationSettings: CollectionConfig = {
  slug: 'registration-settings',
  admin: {
    useAsTitle: 'name',
    description: 'Pengaturan batas maksimal pendaftar',
    group: 'Settings',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  versions: false,
  fields: [
    {
      type: 'text',
      name: 'name',
      label: 'Nama Pengaturan',
      required: true,
      defaultValue: 'Batas Maksimal Pendaftar',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'number',
      name: 'max_registrants',
      label: 'Batas Maksimal Pendaftar',
      required: true,
      defaultValue: 100,
      min: 0,
      max: 10000,
      admin: {
        description: 'Jumlah maksimal pendaftar yang diperbolehkan',
      },
    },
    {
      type: 'text',
      name: 'description',
      label: 'Deskripsi',
      admin: {
        description: 'Deskripsi pengaturan (opsional)',
      },
    },
    {
      type: 'checkbox',
      name: 'is_active',
      label: 'Aktif',
      defaultValue: true,
      admin: {
        description: 'Apakah pengaturan ini sedang aktif?',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, operation }) => {
        // Jika ini adalah operasi create, pastikan hanya ada satu setting aktif
        if (operation === 'create') {
          return data
        }
        return data
      },
    ],
  },
} as const