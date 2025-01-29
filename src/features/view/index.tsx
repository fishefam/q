'use client'

import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { cn } from '@/shared/shadcn/lib/utils'
import { Render, Wrap } from '@/shared/utilities/components'
import { useState } from 'react'

import type { Breakpoint } from './breakpoints'

import { Breakpoints } from './breakpoints'
import { Frame } from './frame'
import { Wrapper } from './wrapper'

export function View() {
  const { isResponsiveView } = useCMSControlContext()
  const [breakpoint, setBreakpoint] = useState<Breakpoint>()
  const properties = { breakpoint, setBreakpoint }

  return (
    <div className={cn('relative size-full', isResponsiveView && 'p-4')}>
      <Wrap
        if={isResponsiveView}
        wrapper={({ children }) => (
          <Wrapper {...properties}>{children}</Wrapper>
        )}
      >
        <div
          className={cn('relative flex size-full', isResponsiveView && 'pr-2')}
        >
          <div className="relative size-full">
            <Breakpoints {...properties} />
            <Frame />
          </div>
          <Render if={isResponsiveView}>
            <div className="absolute right-0 top-0 h-full w-1 bg-gray-400 hover:bg-gray-700" />
          </Render>
        </div>
      </Wrap>
    </div>
  )
}
