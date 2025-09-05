import type { CollectionConfig } from 'payload'

export const ConfirmationPDF: CollectionConfig = {
  slug: 'confirmation-pdf',
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
    mimeTypes: ['application/pdf'],
    staticDir: 'confirmation-pdfs',
  },
}
