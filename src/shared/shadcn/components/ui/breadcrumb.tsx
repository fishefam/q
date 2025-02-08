import { cn } from '@/shared/shadcn/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import * as React from 'react'

function Breadcrumb({ ...properties }: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...properties} />
}

function BreadcrumbEllipsis({
  className,
  ...properties
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden="true"
      className={cn('flex size-9 items-center justify-center', className)}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...properties}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

function BreadcrumbItem({
  className,
  ...properties
}: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn('inline-flex items-center gap-1.5', className)}
      data-slot="breadcrumb-item"
      {...properties}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...properties
}: {
  asChild?: boolean
} & React.ComponentProps<'a'>) {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      className={cn('transition-colors hover:text-foreground', className)}
      data-slot="breadcrumb-link"
      {...properties}
    />
  )
}

function BreadcrumbList({
  className,
  ...properties
}: React.ComponentProps<'ol'>) {
  return (
    <ol
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5',
        className,
      )}
      data-slot="breadcrumb-list"
      {...properties}
    />
  )
}

function BreadcrumbPage({
  className,
  ...properties
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-current="page"
      aria-disabled="true"
      className={cn('font-normal text-foreground', className)}
      data-slot="breadcrumb-page"
      role="link"
      {...properties}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...properties
}: React.ComponentProps<'li'>) {
  return (
    <li
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...properties}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
