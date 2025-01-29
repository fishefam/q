import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { cn } from '@/shared/shadcn/lib/utils'
import { Render } from '@/shared/utilities/components'
import { Resizable } from 're-resizable'
import { useState } from 'react'

import type { Breakpoint } from './breakpoints'

export function Wrapper({
  breakpoint,
  children,
  setBreakpoint,
}: Properties<{
  breakpoint: Breakpoint | undefined
  setBreakpoint: SetState<Breakpoint | undefined>
}>) {
  const { isResponsiveView } = useCMSControlContext()
  const [isInit, setIsInit] = useState(true)
  const [isResizing, setIsResizing] = useState(false)
  const [width, setWidth] = useState<number>()

  return (
    <div
      className="relative mx-auto size-full max-w-full overflow-x-clip rounded-lg"
      style={{ width: breakpoint?.value ? breakpoint.value + 17 : width }}
    >
      {children}
      <Render if={isResponsiveView}>
        <Resizable
          className={cn(
            '!absolute left-1/2 top-0 !h-full overflow-hidden',
            isInit && '!w-1/2',
            !isResizing && 'max-w-[50%]',
          )}
          enable={{ right: true }}
          minWidth={150}
          onResize={(_, __, element) => {
            setIsInit(false)
            setIsResizing(true)
            setBreakpoint(undefined)
            setWidth(element.clientWidth * 2)
          }}
          onResizeStop={() => setIsResizing(false)}
        >
          <div className="size-full" />
        </Resizable>
      </Render>
    </div>
  )
}
