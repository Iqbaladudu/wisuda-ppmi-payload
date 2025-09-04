import type { CollectionConfig } from 'payload'

const GoogleTokens: CollectionConfig = {
  slug: 'google-tokens',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'expiresAt'],
    group: 'Authentication',
  },
  fields: [
    {
      name: 'google_user_id',
      type: 'text',
      required: true,
      label: 'Google User ID',
      unique: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'accessToken',
      type: 'text',
      required: true,
      label: 'Google Access Token',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'refreshToken',
      type: 'text',
      label: 'Google Refresh Token',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'expiresAt',
      type: 'text',
      label: 'Access Token Expiry',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'refreshExpiresAt',
      type: 'text',
      label: 'Refresh Token Expiry',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'rawResponse',
      type: 'json',
      label: 'Raw Token Response',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}

export default GoogleTokens
