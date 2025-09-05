'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

/**
 * Floating navbar displayed on all (frontend) pages.
 */
export function Navbar({ className }: { className?: string }) {
  const t = useTranslations('Navbar')
  const [currentLocale, setCurrentLocale] = useState('id')

  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1]
    if (cookie) {
      setCurrentLocale(cookie)
    }
  }, [])

  const handleLocaleChange = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
    setCurrentLocale(locale)
    window.location.reload()
  }

  return (
    <div className={cn('fixed inset-x-0 top-3 z-50 flex justify-center px-3', className)}>
      <div className="w-full max-w-6xl">
        <div className="relative flex items-center justify-between gap-4 rounded-full border border-white/15 bg-white/60 px-5 py-2.5 backdrop-blur-xl shadow-lg shadow-black/5 dark:bg-neutral-900/70 dark:border-white/10">
          <Link
            href="/"
            className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-100 whitespace-nowrap flex items-center gap-2"
          >
            <span className="inline-block rounded-md bg-gradient-to-br from-[#E07C45] to-[#B8451A] px-2 py-1 text-[10px] font-bold uppercase text-white shadow">
              WP
            </span>
            <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-[#3E2522] to-[#B8451A] dark:from-[#FCEFEA] dark:to-[#EAB195]">
              Wisuda PPMI Mesir
            </span>
            <span className="sm:hidden bg-clip-text text-transparent bg-gradient-to-r from-[#3E2522] to-[#B8451A] dark:from-[#FCEFEA] dark:to-[#EAB195]">
              Wisuda PPMI
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Select value={currentLocale} onValueChange={handleLocaleChange}>
              <SelectTrigger
                size="sm"
                className="rounded-full font-medium border-white/20 bg-white/10 hover:bg-white/20 text-neutral-800 dark:text-neutral-100 w-28 px-2"
              >
                <SelectValue>
                  {currentLocale === 'id' && '🇮🇩 Indonesia'}
                  {currentLocale === 'en' && '🇬🇧 English'}
                  {currentLocale === 'ar' && '🇪🇬 العربية'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="ar">🇪🇬 العربية</SelectItem>
              </SelectContent>
            </Select>
            <Button
              asChild
              size="sm"
              className="rounded-full font-medium bg-gradient-to-r from-[#E07C45] to-[#B8451A] hover:from-[#E07C45]/90 hover:to-[#B8451A]/90"
            >
              <Link href="/intro">{t('joinNow')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
