import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'id'],

  // Used when no locale matches
  defaultLocale: 'id',

  // Disable pathname-based locale detection, rely on cookie
  localeDetection: true,

  // Never include locale in pathname, always use cookie
  localePrefix: 'never',
})

export default function middleware(request: NextRequest) {
  // Check if NEXT_LOCALE cookie exists
  const cookie = request.cookies.get('NEXT_LOCALE')
  if (!cookie) {
    // Set default locale cookie
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', 'id', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false, // Allow client-side access
    })
    return response
  }

  // Run next-intl middleware
  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
