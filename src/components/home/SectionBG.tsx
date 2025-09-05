'use client'

import React, { ElementType } from 'react'
import { cn } from '@/lib/utils'

type SectionBGVariant = 'base' | 'withGrid'

interface SectionBGProps {
  children: React.ReactNode
  className?: string
  /** New variant API replacing deprecated grid boolean */
  variant?: SectionBGVariant
  radialPos?: string
  as?: ElementType
  id?: string
  ariaLabelledBy?: string
  padding?: string
  /** @deprecated use variant="withGrid" */
  grid?: boolean
}

export function SectionBG({
  children,
  className,
  variant = 'base',
  radialPos = '28%_30%',
  as: Tag = 'section',
  id,
  ariaLabelledBy,
  padding = 'py-16 md:py-24',
  grid, // deprecated
}: SectionBGProps) {
  const showGrid = variant === 'withGrid' || grid === true
  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        'relative isolate text-white',
        'before:absolute before:inset-0 before:-z-20 before:bg-[#140A08]',
        'after:absolute after:inset-0 after:-z-10',
        `after:bg-[radial-gradient(circle_at_${radialPos},rgba(230,140,90,0.18),transparent_70%)]`,
        padding,
        className,
      )}
    >
      {showGrid && (
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-15 [mask-image:radial-gradient(circle_at_40%_30%,white,transparent_75%)]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="secBgGrid" width="140" height="140" patternUnits="userSpaceOnUse">
                <rect
                  width="140"
                  height="140"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
                <path
                  d="M70 0 L70 140 M0 70 L140 70"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="0.6"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#secBgGrid)" />
          </svg>
        </div>
      )}
      {children}
    </Tag>
  )
}

export default SectionBG
