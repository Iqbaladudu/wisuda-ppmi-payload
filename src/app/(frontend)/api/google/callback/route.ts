import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getPayload } from 'payload'
import config from '@payload-config'

const clientId = process.env.GOOGLE_OAUTH2_CLIENT_ID
const clientSecret = process.env.GOOGLE_OAUTH2_CLIENT_SECRET
const redirectUri = process.env.GOOGLE_OAUTH2_REDIRECT_URI

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

const payload = await getPayload({ config })

export async function GET(request: NextRequest) {
  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: 'Missing Google OAuth env vars' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const storedState = request.cookies.get('google_oauth2_state')?.value

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }
  // Temporarily disable state validation for debugging
  // if (!state || !storedState || state !== storedState) {
  //   return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 })
  // }

  // Always respond with JSON (no redirect)

  try {
    const { tokens } = await oauth2Client.getToken({ code, redirect_uri: redirectUri })
    oauth2Client.setCredentials(tokens)

    if (!tokens.access_token) {
      console.error('Missing access token in response', tokens)
      return NextResponse.json({ error: 'No access token returned' }, { status: 500 })
    }

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const userInfo = await oauth2.userinfo.get()

    if (!userInfo.data || !userInfo.data.id) {
      console.error('Failed to fetch user info', userInfo.data)
      return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 500 })
    }

    const expiresAt = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600 * 1000)
    const refreshExpiresAt = tokens.refresh_token
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      : null

    // Check if token already exists for this user
    const existingTokens = await payload.find({
      collection: 'google-tokens',
      where: { google_user_id: { equals: userInfo.data.id } },
      limit: 1,
    })

    const tokenData = {
      google_user_id: userInfo.data.id,
      email: userInfo.data.email || '',
      name: userInfo.data.name || userInfo.data.email || '',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      expiresAt: expiresAt.toISOString(),
      refreshExpiresAt: refreshExpiresAt ? refreshExpiresAt.toISOString() : null,
      rawResponse: tokens as any,
    }

    if (existingTokens.docs.length > 0) {
      // Update existing
      await payload.update({
        collection: 'google-tokens',
        id: existingTokens.docs[0].id,
        data: tokenData,
      })
    } else {
      // Create new
      await payload.create({
        collection: 'google-tokens',
        data: tokenData,
      })
    }

    // Clear state cookie and return success JSON
    const json = NextResponse.json({
      status: 'ok',
      user: {
        id: userInfo.data.id,
        email: userInfo.data.email,
        name: userInfo.data.name,
      },
      tokens: {
        refreshToken: tokens.refresh_token || null,
        expiryDate: tokens.expiry_date,
        scopes: tokens.scope?.split(' '),
      },
    })
    json.cookies.set('google_oauth2_state', '', { path: '/', maxAge: 0 })
    return json
  } catch (error: any) {
    console.error('Error in Google callback:', {
      message: error?.message,
      code: error?.code,
      response: error?.response?.data,
      stack: error?.stack,
    })
    // Attempt manual token exchange for deeper diagnostics
    try {
      const body = new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri!,
        grant_type: 'authorization_code',
      })
      const manualRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
      const manualJson = await manualRes.json()
      return NextResponse.json(
        {
          error: 'Authentication failed',
          details: 'token_exchange_failed',
          libraryError: error?.response?.data || error?.message,
          manualStatus: manualRes.status,
          manualResponse: manualJson,
          hint: 'Check redirect URI exact match, code reuse, or pending OAuth consent publication.',
        },
        { status: 500 },
      )
    } catch (inner) {
      console.error('Manual token exchange diagnostic failed:', inner)
    }
    return NextResponse.json(
      { error: 'Authentication failed', details: 'token_exchange_failed' },
      { status: 500 },
    )
  }
}
