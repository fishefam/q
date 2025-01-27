'use client'

import { getAuthActions } from '@/shared/auth'
import Image from 'next/image'

export default function Page() {
  return (
    <>
      <Image
        alt="image"
        className="size-auto"
        height={500}
        priority
        src="https://images.unsplash.com/photo-1736077722346-31ba59414728"
        width={500}
      />
      <button onClick={() => getAuthActions()?.logout('/asdf')}>
        Sign Out
      </button>
    </>
  )
}
