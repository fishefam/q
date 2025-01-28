'use client'

import throttle from 'lodash/throttle'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useLog(...messages: unknown[]) {
  useEffect(() => {
    for (const message of messages) console.log(message)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...messages])
}

export function useResizeObserver<T extends HTMLElement = HTMLDivElement>(
  wait = 150,
) {
  const [rect, setRect] = useState<DOMRect>()
  const reference = useRef<null | T>(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledSetRect = useCallback(
    throttle(setRect, wait, { trailing: false }),
    [],
  )

  useEffect(() => {
    const element = reference.current
    if (!element) return
    const observer = new ResizeObserver((entries) =>
      throttledSetRect(entries.at(0)?.contentRect),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [throttledSetRect])

  return { rect, reference }
}
