// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
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
  collections: [Users, Media, Registrants, GoogleTokens, GoogleSheets],
  cors: [process.env.CORS_ORIGIN || 'http://localhost:3000'],
  csrf: [process.env.CSRF_ORIGIN || 'http://localhost:3000'],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: { media: true },
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
