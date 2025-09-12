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
  hooks: {
    beforeOperation: [
      ({ operation, req, context }) => {
        console.log('Operation in profile photo collection:', operation)
        console.log('Context:', context)

        if (operation === 'update' && req.file) {
          console.log('Previous profile photo name:', req.file.name)
          req.file.name = context.name as string
          console.log('Updated profile photo name:', req.file.name)
        }
      },
    ],
  },
}
