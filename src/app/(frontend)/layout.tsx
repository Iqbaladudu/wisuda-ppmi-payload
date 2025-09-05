import React from 'react'
import './styles.css'
import { ReactQueryProvider } from '@/components/reactQueryProvider'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/Navbar'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="antialiased connected-root">
      <body className="min-h-screen text-neutral-800 selection:bg-[#3E2522] selection:text-[#FCEFEA]">
        <ReactQueryProvider>
          <Navbar />
          <main className="relative">{children}</main>
          <Toaster richColors position="top-right" closeButton />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
