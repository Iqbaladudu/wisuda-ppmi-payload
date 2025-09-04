import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Centralize scopes (add others here as needed)
const SCOPES = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
]

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_OAUTH2_CLIENT_ID
    const redirectUri = process.env.GOOGLE_OAUTH2_REDIRECT_URI
    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: 'Missing Google OAuth environment variables' },
        { status: 500 },
      )
    }

    const state = crypto.randomBytes(16).toString('base64url')

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
      state,
      scope: SCOPES.join(' '),
    })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

    // Build redirect response and attach state cookie
    const response = NextResponse.redirect(authUrl)
    response.cookies.set('google_oauth2_state', state, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 60, // 10 hours
    })
    return response
  } catch (error) {
    console.error('Google OAuth2 initiation error:', error)
    return NextResponse.json({ error: 'Failed to initiate Google OAuth2 flow' }, { status: 500 })
  }
}
