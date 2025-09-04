import type { CollectionConfig } from 'payload'

const GoogleSheets: CollectionConfig = {
  slug: 'google-sheets-creds',
  admin: {
    useAsTitle: 'title',
    group: 'Google Integrations',
    defaultColumns: ['title', 'spreadsheetId', 'spreadsheetUrl', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'spreadsheetId',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'spreadsheetUrl',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'lastRange',
      type: 'text',
      label: 'Last Updated Range',
      admin: { readOnly: true },
    },
    {
      name: 'lastUpdatedCells',
      type: 'number',
      label: 'Last Updated Cells',
      admin: { readOnly: true },
    },
    {
      name: 'rowsSynced',
      type: 'number',
      label: 'Rows Synced (excluding header)',
      admin: { readOnly: true },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
  timestamps: true,
}

export default GoogleSheets
