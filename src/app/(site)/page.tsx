import { getActions } from '@/features/auth'
import Image from 'next/image'

export default async function Page() {
  return (
    <>
      <Image
        alt="image"
        height={500}
        src="https://images.unsplash.com/photo-1736077722346-31ba59414728"
        width={500}
      />
      <button onClick={getActions()?.logout}>Sign Out</button>
    </>
  )
}
