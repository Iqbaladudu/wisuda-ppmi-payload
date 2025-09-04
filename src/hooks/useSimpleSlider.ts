import * as React from 'react'

export interface UseSimpleSliderOptions {
  length: number
  loop?: boolean
  startIndex?: number
  interval?: number
  pauseOnHover?: boolean
  draggable?: boolean
  slidesPerView?: number
  onIndexChange?: (i: number) => void
  enableVelocityFlick?: boolean
}

interface DragMeta {
  startX: number
  delta: number
  dragging: boolean
  lastPositions: { x: number; t: number }[]
}

export function useSimpleSlider({
  length,
  loop = true,
  startIndex = 0,
  interval = 0,
  pauseOnHover = true,
  draggable = true,
  slidesPerView = 1,
  onIndexChange,
  enableVelocityFlick = true,
}: UseSimpleSliderOptions) {
  const [index, setIndex] = React.useState(startIndex)
  const [isPaused, setIsPaused] = React.useState(false)
  const autoplayRef = React.useRef<NodeJS.Timeout | null>(null)
  const trackRef = React.useRef<HTMLDivElement | null>(null)
  const drag = React.useRef<DragMeta>({
    startX: 0,
    delta: 0,
    dragging: false,
    lastPositions: [],
  })

  const clampIndex = React.useCallback(
    (i: number) => {
      if (loop) return (i + length) % length
      return Math.min(length - 1, Math.max(0, i))
    },
    [length, loop],
  )

  const goTo = React.useCallback(
    (i: number) => {
      setIndex((prev) => {
        const next = clampIndex(i)
        if (next !== prev) onIndexChange?.(next)
        return next
      })
    },
    [clampIndex, onIndexChange],
  )

  const next = React.useCallback(() => goTo(index + 1), [index, goTo])
  const prev = React.useCallback(() => goTo(index - 1), [index, goTo])

  // Autoplay
  React.useEffect(() => {
    if (!interval || interval <= 0 || length <= 1) return
    if (isPaused) return
    autoplayRef.current && clearTimeout(autoplayRef.current)
    autoplayRef.current = setTimeout(() => {
      next()
    }, interval)
    return () => autoplayRef.current && clearTimeout(autoplayRef.current)
  }, [index, interval, next, isPaused, length])

  // Visibility pause
  React.useEffect(() => {
    const handler = () => setIsPaused(document.hidden)
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [])

  // Drag handling
  const startDrag = (clientX: number) => {
    if (!draggable || length <= 1) return
    drag.current.startX = clientX
    drag.current.delta = 0
    drag.current.dragging = true
    drag.current.lastPositions = [{ x: clientX, t: performance.now() }]
    setIsPaused(true)
  }

  const moveDrag = (clientX: number) => {
    if (!drag.current.dragging || !trackRef.current) return
    drag.current.delta = clientX - drag.current.startX
    const timestamp = performance.now()
    drag.current.lastPositions.push({ x: clientX, t: timestamp })
    if (drag.current.lastPositions.length > 6) drag.current.lastPositions.shift()
    const percent = (drag.current.delta / trackRef.current.clientWidth) * 100
    trackRef.current.style.transition = 'none'
    trackRef.current.style.transform = `translateX(calc(-${(index * 100) / slidesPerView}% + ${percent}%))`
  }

  const endDrag = () => {
    if (!drag.current.dragging || !trackRef.current) return
    const { delta, lastPositions } = drag.current
    drag.current.dragging = false
    trackRef.current.style.transition = ''
    const width = trackRef.current.clientWidth
    const threshold = width * 0.08
    let velocity = 0
    if (enableVelocityFlick && lastPositions.length >= 2) {
      const a = lastPositions[lastPositions.length - 2]
      const b = lastPositions[lastPositions.length - 1]
      const dt = b.t - a.t
      if (dt > 0) velocity = (b.x - a.x) / dt // px per ms
    }
    const flick = Math.abs(velocity) > 0.6 // tuned threshold
    if (Math.abs(delta) > threshold || flick) {
      if (delta < 0) next()
      else prev()
    } else {
      trackRef.current.style.transform = `translateX(-${(index * 100) / slidesPerView}%)`
    }
    setIsPaused(false)
  }

  const dragBindings = {
    onMouseDown: (e: React.MouseEvent) => startDrag(e.clientX),
    onMouseMove: (e: React.MouseEvent) => moveDrag(e.clientX),
    onMouseUp: endDrag,
    onMouseLeave: () => drag.current.dragging && endDrag(),
    onTouchStart: (e: React.TouchEvent) => startDrag(e.touches[0].clientX),
    onTouchMove: (e: React.TouchEvent) => moveDrag(e.touches[0].clientX),
    onTouchEnd: endDrag,
  }

  const pauseHandlers = {
    onMouseEnter: () => pauseOnHover && setIsPaused(true),
    onMouseLeave: () => pauseOnHover && setIsPaused(false),
  }

  return {
    index,
    setIndex: goTo,
    next,
    prev,
    isPaused,
    setIsPaused,
    trackRef,
    dragBindings,
    pauseHandlers,
  }
}

export type UseSimpleSliderReturn = ReturnType<typeof useSimpleSlider>
