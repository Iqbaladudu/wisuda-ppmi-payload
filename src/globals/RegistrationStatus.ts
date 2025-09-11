import type { GlobalConfig } from 'payload'

export const RegistrationStatus: GlobalConfig = {
  slug: 'registration-status',
  admin: {
    description: 'Pengaturan status pendaftaran wisuda',
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      type: 'checkbox',
      name: 'isOpen',
      label: 'Pendaftaran Dibuka',
      defaultValue: false,
      admin: {
        description: 'Centang untuk membuka pendaftaran',
      },
    },
    {
      type: 'text',
      name: 'closedMessage',
      label: 'Pesan Jika Ditutup',
      defaultValue: 'Pendaftaran wisuda belum dibuka. Silakan tunggu informasi lebih lanjut.',
      admin: {
        description: 'Pesan yang ditampilkan ketika pendaftaran ditutup',
      },
    },
  ],
}
