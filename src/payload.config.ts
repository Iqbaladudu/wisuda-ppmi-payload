// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Registrants } from './collections/Registrants'
import GoogleTokens from './collections/GoogleTokens'
import GoogleSheets from './collections/GoogleSheets'
import { s3Storage } from '@payloadcms/storage-s3'
import { Syahadah } from './collections/Syahadah'
import { ProfilePhoto } from './collections/ProfilePhoto'
import { ConfirmationPDF } from './collections/ConfirmationPDF'
import { RegistrationSettings } from './collections/RegistrationSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeNavLinks: [
        'src/app/(payload)/admin/components/ConnectGoogle.tsx#default',
        'src/app/(payload)/admin/components/ExportToSheet.tsx#default',
      ],
    },
  },
  collections: [
    Users,
    Media,
    Registrants,
    GoogleTokens,
    GoogleSheets,
    Syahadah,
    ProfilePhoto,
    ConfirmationPDF,
    RegistrationSettings,
  ],
  cors: [process.env.CORS_ORIGIN || 'http://localhost:3000'],
  csrf: [process.env.CSRF_ORIGIN || 'http://localhost:3000'],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
        'confirmation-pdf': {
          prefix: 'confirmation-pdfs',
        },
        'profile-photo': {
          prefix: 'profile-photos',
        },
        syahadah: {
          prefix: 'syahadah',
        },
      },
      bucket: process.env.CLOUDFLARE_STORAGE_BUCKET_NAME!,
      config: {
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_STORAGE_ACCESS_KEY!,
          secretAccessKey: process.env.CLOUDFLARE_STORAGE_SECRET_KEY!,
        },
        region: 'auto',
        endpoint: process.env.CLOUDFLARE_STORAGE_ENDPOINT_URL!,
      },
    }),
  ],
})
