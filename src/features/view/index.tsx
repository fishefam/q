'use client'

import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { cn } from '@/shared/shadcn/lib/utils'
import { Render } from '@/shared/utilities/components'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import type { Breakpoint } from './breakpoints'

import { Breakpoints } from './breakpoints'
import { ViewFrame } from './frame'
import { Wrapper } from './wrapper'

export function View({ children }: Properties) {
  const { isResponsiveView } = useCMSControlContext()
  const [breakpoint, setBreakpoint] = useState<Breakpoint>()
  const properties = { breakpoint, setBreakpoint }

  return (
    <div
      className={cn(
        'relative size-full transition-all',
        isResponsiveView && 'p-4',
      )}
    >
      <Wrapper {...properties}>
        <div
          className={cn('relative flex size-full', isResponsiveView && 'pr-2')}
        >
          <div className="relative size-full">
            <Breakpoints {...properties} />
            <ViewFrame>
              {({ window }) => (
                <DndProvider backend={HTML5Backend} context={window}>
                  {children}
                </DndProvider>
              )}
            </ViewFrame>
          </div>
          <Render if={isResponsiveView}>
            <div
              aria-hidden
              className="absolute right-0 top-0 h-full w-1 bg-gray-400 hover:bg-gray-700"
            />
          </Render>
        </div>
      </Wrapper>
    </div>
  )
}
