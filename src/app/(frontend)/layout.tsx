import React from 'react'
import './styles.css'
import { ReactQueryProvider } from '@/components/reactQueryProvider'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/Navbar'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

export const metadata = {
  description:
    'Platform resmi pendaftaran Wisuda PPMI Mesir 2025. Dapatkan informasi terbaru dan proses pendaftaran wisuda dengan mudah, cepat, dan terpercaya. ',
  title: 'Wisuda PPMI Mesir 2025',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  // Ambil locale & messages dari konteks request (cookie NEXT_LOCALE diproses oleh middleware next-intl)
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className="antialiased connected-root" suppressHydrationWarning>
      <body className="min-h-screen text-neutral-800 selection:bg-[#3E2522] selection:text-[#FCEFEA]">
        <ReactQueryProvider>
          <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
            <Navbar />
            <main className="relative">{children}</main>
            <Toaster richColors position="top-right" closeButton />
          </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
