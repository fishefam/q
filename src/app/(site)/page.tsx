'use client'

import Image from 'next/image'

export default function Page() {
  return (
    <>
      <Image
        alt="image"
        className="size-auto"
        height={500}
        priority
        src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg"
        width={500}
      />
    </>
  )
}
