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
  hooks: {
    beforeOperation: [
      ({ operation, req, context }) => {
        console.log('Operation in syahadah collection:', operation)
        console.log('Request File:', req.file)
        console.log('Context:', context)

        if (operation === 'update' && req.file) {
          console.log('Previous syahadah name:', req.file.name)
          req.file.name = context.name as string
          console.log('Updated syahadah name:', req.file.name)
        }
      },
    ],
  },
}
