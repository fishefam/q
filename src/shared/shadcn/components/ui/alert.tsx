import { cn } from '@/shared/shadcn/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:text-destructive-foreground/80 dark:border-destructive [&>svg]:text-current dark:bg-destructive/50',
      },
    },
  },
)

function Alert({
  className,
  variant,
  ...properties
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...properties}
    />
  )
}

function AlertDescription({
  className,
  ...properties
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className,
      )}
      data-slot="alert-description"
      {...properties}
    />
  )
}

function AlertTitle({ className, ...properties }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        className,
      )}
      data-slot="alert-title"
      {...properties}
    />
  )
}

export { Alert, AlertDescription, AlertTitle }
