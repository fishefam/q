'use client'

import { cn } from '@/shared/shadcn/lib/utils'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import * as React from 'react'

function Separator({
  className,
  decorative = true,
  orientation = 'horizontal',
  ...properties
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      className={cn(
        'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className,
      )}
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      {...properties}
    />
  )
}

export { Separator }
