'use client'

import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { cn } from '@/shared/shadcn/lib/utils'
import { Render } from '@/shared/utilities/components'
import { Laptop2, Smartphone, Tablet } from 'lucide-react'
import { Resizable } from 're-resizable'
import { useState } from 'react'

import { WidthIndicator } from './width-indicator'

export type Breakpoint = {
  Icon: typeof Smartphone
  name: string
  value: number
}

const breakpoints: Breakpoint[] = [
  { Icon: Smartphone, name: 'Mobile', value: 360 },
  { Icon: Tablet, name: 'Tablet', value: 768 },
  { Icon: Laptop2, name: 'Desktop', value: 1366 },
]

export function Wrapper({ children }: Properties) {
  const { isResponsiveView } = useCMSControlContext()
  const [isInit, setIsInit] = useState(true)
  const [isResizing, setIsResizing] = useState(false)
  const [width, setWidth] = useState<number>()
  const [breakpoint, setBreakpoint] = useState<Breakpoint>()

  return (
    <div
      className="relative mx-auto size-full max-w-full overflow-x-clip rounded-lg"
      style={{ width: breakpoint?.value ?? width }}
    >
      <Render if={isResponsiveView}>
        <WidthIndicator
          breakpoint={breakpoint}
          breakpoints={breakpoints}
          setBreakpoint={setBreakpoint}
        />
      </Render>
      {children}
      <Render if={isResponsiveView}>
        <Resizable
          className={cn(
            '!absolute left-1/2 top-0 -z-[1] !h-full rounded-r-lg',
            isInit && '!w-1/2',
            !isResizing && 'max-w-[50%]',
          )}
          enable={{ right: true }}
          minWidth={141}
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
