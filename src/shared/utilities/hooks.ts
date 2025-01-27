'use client'

import { useEffect } from 'react'

export function useLog(...messages: unknown[]) {
  useEffect(() => {
    for (const message of messages) console.log(message)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...messages])
}
