'use client'

import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { cn } from '@/shared/shadcn/lib/utils'
import { Wrap } from '@/shared/utilities/components'

import { Wrapper } from './wrapper'

export function View() {
  const { isResponsiveView } = useCMSControlContext()
  return (
    <div className={cn('relative size-full', isResponsiveView && 'p-4')}>
      <Wrap if={isResponsiveView} wrapper={Wrapper}>
        <iframe
          className={cn('size-full', isResponsiveView && 'rounded-lg border')}
          src="/cms/view"
        />
      </Wrap>
    </div>
  )
}
