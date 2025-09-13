import type { GlobalConfig } from 'payload'

export const CountdownSettings: GlobalConfig = {
  slug: 'countdown-settings',
  admin: {
    description: 'Pengaturan countdown untuk halaman utama',
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      type: 'date',
      name: 'targetDate',
      label: 'Tanggal Target Countdown',
      required: true,
      admin: {
        description: 'Tanggal dan waktu target untuk countdown',
        date: {
          // Tampilkan pemilih tanggal & waktu
          pickerAppearance: 'dayAndTime',
          // Format tampilan di panel admin (dd MMMM yyyy HH:mm:ss)
          displayFormat: 'dd MMMM yyyy HH:mm:ss',
        },
      },
    },
    {
      type: 'text',
      name: 'eventName',
      label: 'Nama Acara',
      required: true,
      defaultValue: 'Convocation Ceremony PPMI Mesir 2025',
    },
    {
      type: 'text',
      name: 'label',
      label: 'Label',
    },
    {
      type: 'checkbox',
      name: 'isActive',
      label: 'Aktifkan Countdown',
      defaultValue: true,
      admin: {
        description: 'Apakah countdown ini sedang aktif ditampilkan?',
      },
    },
  ],
}
