import { cn } from '@/shared/shadcn/lib/utils'
import { Wrap } from '@/shared/utilities/components'

export function View({ isResponsiveView }: { isResponsiveView: boolean }) {
  return (
    <div className={cn('h-screen flex-1', isResponsiveView && 'p-4')}>
      <Wrap
        if={isResponsiveView}
        Wrapper={({ children }) => <div className="size-full">{children}</div>}
      >
        <iframe
          className={cn('size-full', isResponsiveView && 'rounded-lg border')}
          src="/cms/view"
        />
      </Wrap>
    </div>
  )
}
