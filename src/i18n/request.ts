import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async ({ locale }) => {
  const cookieStore = await cookies()
  const localeFromCookie = cookieStore.get('NEXT_LOCALE')?.value

  const resolvedLocale = localeFromCookie || locale || 'id' // Fallback to 'id' if locale is undefined

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default,
  }
})
