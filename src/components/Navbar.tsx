'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'

/**
 * Floating navbar displayed on all (frontend) pages.
 */
export function Navbar({ className }: { className?: string }) {
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
            <Button
              asChild
              size="sm"
              className="rounded-full font-medium bg-gradient-to-r from-[#E07C45] to-[#B8451A] hover:from-[#E07C45]/90 hover:to-[#B8451A]/90"
            >
              <Link href="/intro">Bergabung Sekarang</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
