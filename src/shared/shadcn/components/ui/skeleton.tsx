import { cn } from '@/shared/shadcn/lib/utils'

function Skeleton({ className, ...properties }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-primary/10', className)}
      data-slot="skeleton"
      {...properties}
    />
  )
}

export { Skeleton }
