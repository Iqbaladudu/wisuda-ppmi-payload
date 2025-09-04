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
  } = body

  if (values && !is2DArray(values)) {
    return NextResponse.json<ResultErr>(
      { success: false, error: "Invalid 'values' format (expected 2D array)" },
      { status: 400 },
    )
  }

  try {
    const payload = await getPayload({ config })

    // Fetch stored Google tokens (assuming only one record or pick latest)
    const tokenDocs = await payload.find({
      collection: 'google-tokens',
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
    const oauth2 = buildOAuthClient(token.accessToken, token.refreshToken)
    const sheets = google.sheets({ version: 'v4', auth: oauth2 })

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
      if (clear && values) {
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
    if (Array.isArray(values) && values.length > 0) {
      writeMeta = await writeValues(sheets, targetSpreadsheetId!, range, values as SheetValues)
    }

    // Upsert into google-sheets-creds collection (store latest for this spreadsheetId)
    try {
      const collectionSlug = 'google-sheets-creds' as any
      const existing = await payload.find({
        collection: collectionSlug,
        where: { spreadsheetId: { equals: targetSpreadsheetId } },
        limit: 1,
      })
      const rowsSynced = Array.isArray(values) && values.length > 0 ? values.length - 1 : 0
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
