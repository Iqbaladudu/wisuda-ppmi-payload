import type { CollectionConfig } from 'payload'

export const ProfilePhoto: CollectionConfig = {
  slug: 'profile-photo',
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
    staticDir: 'profile-photos',
  },
}
