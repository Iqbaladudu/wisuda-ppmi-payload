'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSimpleSlider } from '@/hooks/useSimpleSlider'

interface SliderProps<T> {
  items: T[]
  renderItem: (item: T, idx: number) => React.ReactNode
  /** Autoplay interval (ms). Set to 0 or undefined to disable */
  interval?: number
  className?: string
  slidesPerView?: number
  title?: string
  loop?: boolean
  showArrows?: boolean
  showDots?: boolean
  pauseOnHover?: boolean
  ariaLabel?: string
  startIndex?: number
  /** Enable swipe / drag (defaults true) */
  draggable?: boolean
  variant?: 'slide' | 'fade' | 'scale'
  lazy?: boolean // only mount nearby slides
}

export function SimpleSlider<T>({
  items,
  renderItem,
  interval = 5000,
  className,
  slidesPerView = 1,
  title,
  loop = true,
  showArrows = true,
  showDots = true,
  pauseOnHover = true,
  ariaLabel,
  startIndex = 0,
  draggable = true,
  variant = 'slide',
  lazy = true,
}: SliderProps<T>) {
  const length = items.length
  const {
    index,
    next,
    prev,
    isPaused,
    setIsPaused,
    trackRef,
    dragBindings,
    pauseHandlers,
    setIndex,
  } = useSimpleSlider({
    length,
    loop,
    startIndex,
    interval,
    pauseOnHover,
    draggable,
    slidesPerView,
  })

  // Height management for fade/scale variants (absolute slides collapse parent height otherwise)
  const layeredRef = React.useRef<HTMLDivElement | null>(null)
  const [layeredHeight, setLayeredHeight] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (variant === 'slide') return
    const el = layeredRef.current?.querySelector<HTMLDivElement>("[data-active='true']")
    if (el) {
      const h = el.scrollHeight
      if (h && h !== layeredHeight) setLayeredHeight(h)
    }
  }, [index, items, variant, layeredHeight])

  React.useEffect(() => {
    if (variant === 'slide') return
    const handle = () => {
      const el = layeredRef.current?.querySelector<HTMLDivElement>("[data-active='true']")
      if (el) setLayeredHeight(el.scrollHeight)
    }
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [variant])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
  }

  const shouldMount = (i: number) => {
    if (!lazy) return true
    // mount current, prev, next for smoothness
    const diff = Math.abs(i - index)
    if (diff <= 1) return true
    // handle loop edges
    if (index === 0 && i === length - 1) return true
    if (index === length - 1 && i === 0) return true
    return false
  }

  return (
    <div
      className={cn(
        'relative w-full select-none',
        'rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm p-2 md:p-3',
        'shadow-[0_4px_18px_-4px_rgba(0,0,0,0.5)]',
        className,
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel || title || 'slider'}
      tabIndex={0}
      onKeyDown={onKeyDown}
      {...pauseHandlers}
    >
      {title && (
        <div className="mb-3 flex items-center justify-between gap-4 px-1">
          <h3 className="text-sm font-semibold tracking-wide text-white/80 md:text-base">
            {title}
          </h3>
          {showArrows && length > 1 && (
            <div className="hidden md:flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="group rounded-lg border border-white/15 bg-white/5 p-2 text-white/70 transition hover:bg-white/15 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="group rounded-lg border border-white/15 bg-white/5 p-2 text-white/70 transition hover:bg-white/15 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="relative overflow-hidden rounded-xl">
        {variant === 'slide' && (
          <div
            ref={trackRef}
            className={cn('flex transition-transform duration-600 ease-[cubic-bezier(.4,.8,.2,1)]')}
            style={{
              transform: `translateX(-${(index * 100) / slidesPerView}%)`,
              width: `${(length * 100) / slidesPerView}%`,
            }}
            {...dragBindings}
            aria-live="polite"
          >
            {items.map((item, i) => (
              <div
                key={i}
                role="group"
                aria-label={`Slide ${i + 1} of ${length}`}
                style={{ width: `${100 / length}%` }}
                className="px-1 md:px-2"
              >
                {shouldMount(i) ? renderItem(item, i) : <div className="h-full w-full" />}
              </div>
            ))}
          </div>
        )}
        {variant !== 'slide' && (
          <div
            ref={layeredRef}
            className="relative"
            aria-live="polite"
            style={{ height: layeredHeight ? `${layeredHeight}px` : undefined }}
          >
            {items.map((item, i) => {
              const active = i === index
              return (
                <div
                  key={i}
                  role="group"
                  aria-label={`Slide ${i + 1} of ${length}`}
                  className={cn(
                    'absolute inset-0 px-1 md:px-2 transition-opacity duration-600',
                    variant === 'fade' &&
                      'data-[active=false]:opacity-0 data-[active=true]:opacity-100',
                    variant === 'scale' &&
                      'data-[active=true]:opacity-100 data-[active=false]:opacity-0 transform transition-[opacity,transform] data-[active=true]:scale-100 data-[active=false]:scale-95',
                  )}
                  data-active={active}
                  style={{ pointerEvents: active ? 'auto' : 'none' }}
                >
                  {shouldMount(i) && renderItem(item, i)}
                </div>
              )
            })}
          </div>
        )}

        {showArrows && length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-2 text-white/80 backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-2 text-white/80 backdrop-blur hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:hidden"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {showDots && length > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'group relative h-2 w-2 rounded-full bg-white/25 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                i === index && 'bg-gradient-to-r from-[#E07C45] to-[#B8451A] w-5',
              )}
            >
              <span className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-40 bg-white/20" />
            </button>
          ))}
        </div>
      )}

      {interval && interval > 0 && length > 1 && (
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            key={index}
            className="h-full w-full origin-left animate-[sliderProgress_var(--dur)_linear] rounded-full bg-gradient-to-r from-[#E07C45] via-[#D9683A] to-[#B8451A]"
            style={{
              //@ts-ignore custom property for animation duration
              '--dur': `${interval}ms`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        </div>
      )}
    </div>
  )
}
