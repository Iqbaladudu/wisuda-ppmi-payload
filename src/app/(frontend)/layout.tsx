import React from 'react'
import './styles.css'
import { ReactQueryProvider } from '@/components/reactQueryProvider'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#5A3A2F_0%,#3E2522_40%,#2B1816_100%)] text-neutral-800 selection:bg-[#3E2522] selection:text-[#FCEFEA]">
        <ReactQueryProvider>
          <main className="relative">{children}</main>
          <Toaster richColors position="top-right" closeButton />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
