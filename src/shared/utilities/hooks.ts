'use client'

import throttle from 'lodash/throttle'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useLog(...messages: unknown[]) {
  useEffect(() => {
    for (const message of messages) console.log(message)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...messages])
}

export function usePrevious<T>(value: T) {
  const reference = useRef<T>(undefined)
  useEffect(() => void (reference.current = value), [value])
  return reference.current
}

export function useResizeObserver<T extends HTMLElement = HTMLDivElement>({
  disabled,
  wait = 150,
}: {
  disabled?: boolean
  wait?: number
}) {
  const [rect, setRect] = useState<DOMRect>()
  const reference = useRef<null | T>(null)
  const throttledSetRect = useCallback(
    () => throttle(setRect, wait, { trailing: false }),
    [wait],
  )

  useEffect(() => {
    const element = reference.current
    if (!element) return
    const observer = new ResizeObserver((entries) =>
      disabled === true ? 0 : throttledSetRect()(entries.at(0)?.contentRect),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [disabled, throttledSetRect])

  return { rect, reference }
}
