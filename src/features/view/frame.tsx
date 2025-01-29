import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { cn } from '@/shared/shadcn/lib/utils'

export function Frame() {
  const { isResponsiveView } = useCMSControlContext()
  return (
    <iframe
      className={cn(
        'relative z-[1] size-full h-full',
        isResponsiveView && 'rounded-lg border',
      )}
      src="/cms/view"
    />
  )
}
