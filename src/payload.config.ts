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
import { CountdownSettings } from './globals/CountdownSettings'
import { RegistrationStatus } from './globals/RegistrationStatus'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Derive allowed origins (CORS + CSRF). In dev, BASE_URL may be undefined which can cause
// Payload to reject admin POST (e.g. updating globals) with Unauthorized. Provide sane fallbacks.
const allowedOrigins = [
  process.env.BASE_URL, // primary configured base URL
  process.env.NEXT_PUBLIC_SITE_URL, // optional public site URL
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean) as string[]

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
  globals: [CountdownSettings, RegistrationStatus],
  cors: allowedOrigins,
  csrf: allowedOrigins,
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
