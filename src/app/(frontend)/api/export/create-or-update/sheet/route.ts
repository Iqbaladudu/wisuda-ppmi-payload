import { NextRequest, NextResponse } from 'next/server'
import { google, sheets_v4 } from 'googleapis'
import { getPayload } from 'payload'
import config from '@payload-config'

type CellPrimitive = string | number | boolean | null
type Row = CellPrimitive[]
type SheetValues = Row[]

type SheetPayload = {
  title?: string
  values?: SheetValues | null
  range?: string
  spreadsheetId?: string // If provided we update instead of create
  clear?: boolean // default true when updating
  google_user_id?: string
  email?: string
}

interface ResultOk {
  success: true
  spreadsheetUrl: string
  spreadsheetId: string
  updatedCells?: number
  updatedRange?: string
  created?: boolean
}

interface ResultErr {
  success: false
  error: string
  details?: any
}

const SERVICE_DISABLED_HINT =
  'Google Sheets API belum diaktifkan untuk project ini. Aktifkan Google Sheets API di Google Cloud Console.'

function is2DArray(values: unknown): values is SheetValues {
  return Array.isArray(values) && values.every((row) => Array.isArray(row))
}

function buildOAuthClient(accessToken: string, refreshToken?: string | null) {
  const clientId = process.env.GOOGLE_OAUTH2_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH2_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_OAUTH2_REDIRECT_URI
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing Google OAuth env vars')
  }
  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
  oauth2.setCredentials({ access_token: accessToken, refresh_token: refreshToken || undefined })
  return oauth2
}

async function writeValues(
  sheetsApi: sheets_v4.Sheets,
  spreadsheetId: string,
  range: string,
  values: SheetValues,
): Promise<{ updatedRange?: string; updatedCells?: number }> {
  const res = await sheetsApi.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values },
  })
  const updatedRange = res.data.updatedRange ?? undefined
  const updatedCells = (res.data.updatedCells ?? undefined) as number | undefined
  return { updatedRange, updatedCells }
}

function looksLikeServiceDisabled(err: any): boolean {
  const msg: string | undefined = err?.message || err?.response?.data?.error?.message
  if (!msg) return false
  return /has not been used|NotFound or insufficient permissions|not enabled/i.test(msg)
}

export async function POST(req: NextRequest) {
  let body: SheetPayload
  try {
    body = (await req.json()) as SheetPayload
  } catch {
    return NextResponse.json<ResultErr>(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 },
    )
  }

  const {
    title = 'Data Peserta Wisuda',
    range = 'Sheet1!A1',
    values,
    spreadsheetId,
    clear = true,
    google_user_id,
    email,
  } = body

  if (values && !is2DArray(values)) {
    return NextResponse.json<ResultErr>(
      { success: false, error: "Invalid 'values' format (expected 2D array)" },
      { status: 400 },
    )
  }

  try {
    const payload = await getPayload({ config })

    // If caller did not supply values, auto-export all Registrants collection
    let sheetValues: SheetValues | null = values as SheetValues | null
    if (!sheetValues) {
      // Paginate through all registrants
      const all: any[] = []
      const pageSize = 500
      let page = 1
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const res = await payload.find({
          collection: 'registrants',
          limit: pageSize,
          page,
          sort: 'id',
        })
        all.push(...res.docs)
        if (page >= res.totalPages) break
        page++
      }
      if (all.length === 0) {
        sheetValues = [['NO DATA']]
      } else {
        // Build dynamic header union of keys
        const keySet = new Set<string>()
        for (const doc of all) {
          Object.keys(doc).forEach((k) => {
            if (!['createdAt', 'updatedAt'].includes(k)) keySet.add(k)
          })
        }
        const headers = Array.from(keySet)
        // Preserve some preferred ordering by moving common fields to front
        const preferred = [
          'id',
          'reg_id',
          'name',
          'name_arabic',
          'gender',
          'email',
          'whatsapp',
          'nationality',
          'university',
          'faculty',
          'major',
          'graduation_year',
          'predicate',
        ]
        headers.sort((a, b) => {
          const ia = preferred.indexOf(a)
          const ib = preferred.indexOf(b)
          if (ia === -1 && ib === -1) return a.localeCompare(b)
          if (ia === -1) return 1
          if (ib === -1) return -1
          return ia - ib
        })
        const rows: Row[] = [headers]
        for (const doc of all) {
          const row: CellPrimitive[] = headers.map((h) => {
            const val = (doc as any)[h]
            if (val == null) return ''
            if (typeof val === 'object') {
              if (Array.isArray(val)) return JSON.stringify(val)
              // Relationship: photo may be number or object
              if (typeof (val as any).id !== 'undefined' && Object.keys(val).length <= 5)
                return (val as any).id ?? ''
              return JSON.stringify(val)
            }
            return val
          })
          rows.push(row)
        }
        sheetValues = rows
      }
    }

    // Fetch stored Google token (optionally filtered by google_user_id or email)
    const tokenWhere: any = {}
    if (google_user_id) tokenWhere.google_user_id = { equals: google_user_id }
    if (email) tokenWhere.email = { equals: email }

    const tokenDocs = await payload.find({
      collection: 'google-tokens',
      where: Object.keys(tokenWhere).length ? tokenWhere : undefined,
      limit: 1,
      sort: '-updatedAt',
    })
    if (tokenDocs.docs.length === 0) {
      return NextResponse.json<ResultErr>(
        { success: false, error: 'No stored Google tokens. Authenticate first.' },
        { status: 400 },
      )
    }
    const token = tokenDocs.docs[0] as any
    const originalAccessToken = token.accessToken
    const oauth2 = buildOAuthClient(token.accessToken, token.refreshToken)
    const sheets = google.sheets({ version: 'v4', auth: oauth2 })

    // Ensure access token is current (auto refresh via google library if expired)
    try {
      const fresh = await oauth2.getAccessToken()
      const newToken = fresh?.token
      // If refreshed (different), update stored token & expiry
      if (newToken && newToken !== originalAccessToken) {
        const creds = oauth2.credentials
        await payload.update({
          collection: 'google-tokens',
          id: token.id,
          data: {
            accessToken: newToken,
            expiresAt: creds.expiry_date
              ? new Date(creds.expiry_date).toISOString()
              : token.expiresAt,
            refreshToken: creds.refresh_token || token.refreshToken || null,
          },
        })
      }
    } catch (refreshErr) {
      console.warn('Access token refresh check failed (continuing with existing token)', refreshErr)
    }

    let targetSpreadsheetId: string | undefined = spreadsheetId
    let created = false
    let spreadsheetUrl: string | undefined

    // Enforce single sheet: look up stored creds first when no spreadsheetId provided
    if (!targetSpreadsheetId) {
      const existingSheetCreds = await payload.find({
        collection: 'google-sheets-creds',
        limit: 1,
        sort: '-updatedAt',
      })
      if (existingSheetCreds.docs.length > 0) {
        const existing = existingSheetCreds.docs[0] as any
        targetSpreadsheetId = existing.spreadsheetId
        spreadsheetUrl = existing.spreadsheetUrl
      }
    }

    if (!targetSpreadsheetId) {
      // None exists -> create first (and only) sheet
      const createRes = await sheets.spreadsheets.create({
        requestBody: { properties: { title } },
        fields: 'spreadsheetId,spreadsheetUrl',
      })
      targetSpreadsheetId = createRes.data.spreadsheetId || undefined
      spreadsheetUrl =
        (createRes.data.spreadsheetUrl ?? undefined) ||
        (targetSpreadsheetId
          ? `https://docs.google.com/spreadsheets/d/${targetSpreadsheetId}`
          : undefined)
      if (!targetSpreadsheetId) {
        return NextResponse.json<ResultErr>(
          { success: false, error: 'Spreadsheet created but no ID returned' },
          { status: 500 },
        )
      }
      created = true
    } else {
      spreadsheetUrl =
        spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${targetSpreadsheetId}`
      if (clear && sheetValues) {
        try {
          await sheets.spreadsheets.values.clear({
            spreadsheetId: targetSpreadsheetId,
            range: 'Sheet1!A2:ZZ',
          })
        } catch (e) {
          console.warn('Failed to clear existing data', e)
        }
      }
    }

    let writeMeta: { updatedRange?: string; updatedCells?: number } | undefined
    if (Array.isArray(sheetValues) && sheetValues.length > 0) {
      writeMeta = await writeValues(sheets, targetSpreadsheetId!, range, sheetValues as SheetValues)
    }

    // Upsert into google-sheets-creds collection (store latest for this spreadsheetId)
    try {
      const collectionSlug = 'google-sheets-creds' as any
      const existing = await payload.find({
        collection: collectionSlug,
        where: { spreadsheetId: { equals: targetSpreadsheetId } },
        limit: 1,
      })
      const rowsSynced =
        Array.isArray(sheetValues) && sheetValues.length > 0 ? sheetValues.length - 1 : 0
      const recordData = {
        title,
        spreadsheetId: targetSpreadsheetId!,
        spreadsheetUrl: spreadsheetUrl!,
        lastRange: writeMeta?.updatedRange,
        lastUpdatedCells: writeMeta?.updatedCells,
        rowsSynced,
      }
      if (existing.docs.length > 0) {
        await payload.update({
          collection: collectionSlug,
          id: (existing.docs[0] as any).id,
          data: recordData as any,
        })
      } else {
        await payload.create({
          collection: collectionSlug,
          data: recordData as any,
        })
      }
    } catch (persistErr) {
      console.warn('Failed to persist sheet credentials record', persistErr)
    }

    return NextResponse.json<ResultOk>({
      success: true,
      spreadsheetId: targetSpreadsheetId!,
      spreadsheetUrl: spreadsheetUrl!,
      updatedCells: writeMeta?.updatedCells,
      updatedRange: writeMeta?.updatedRange,
      created,
    })
  } catch (err: any) {
    if (looksLikeServiceDisabled(err)) {
      return NextResponse.json<ResultErr>(
        { success: false, error: SERVICE_DISABLED_HINT, details: err?.message },
        { status: 400 },
      )
    }
    const status = err?.code && Number.isInteger(err.code) ? err.code : 500
    return NextResponse.json<ResultErr>(
      {
        success: false,
        error: 'Google Sheets operation failed',
        details: err?.response?.data || err?.message || String(err),
      },
      { status },
    )
  }
}

export const dynamic = 'force-dynamic'

// Optional helper so akses via browser (GET) tidak hasilkan 405
export async function GET() {
  return NextResponse.json({
    info: 'Endpoint export Google Sheet tersedia. Gunakan POST untuk mengekspor semua registrants.',
    usage: {
      method: 'POST',
      url: '/api/export/create-or-update/sheet',
      bodyExample: {
        // kosongkan body untuk auto-export semua registrants
      },
      optionalFields: ['title', 'range', 'spreadsheetId', 'clear', 'google_user_id', 'email'],
    },
  })
}
