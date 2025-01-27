'use client'

import { cn } from '@/shared/shadcn/lib/utils'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import * as React from 'react'

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, decorative = true, orientation = 'horizontal', ...properties },
    reference,
  ) => (
    <SeparatorPrimitive.Root
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      decorative={decorative}
      orientation={orientation}
      ref={reference}
      {...properties}
    />
  ),
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
