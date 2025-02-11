'use client'

import { cn } from '@/shared/shadcn/lib/utils'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as React from 'react'

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      data-slot="avatar"
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn('flex size-full items-center justify-center rounded-full bg-muted', className)}
      data-slot="avatar-fallback"
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image className={cn('aspect-square size-full', className)} data-slot="avatar-image" {...props} />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
