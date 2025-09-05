import type { CollectionConfig } from 'payload'

export const Syahadah: CollectionConfig = {
  slug: 'syahadah',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    staticDir: 'syahadah-photos',
  },
}
