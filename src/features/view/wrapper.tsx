'use client'

import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { cn } from '@/shared/shadcn/lib/utils'
import { Render } from '@/shared/utilities/components'
import { Resizable } from 're-resizable'
import { useState } from 'react'

export function Wrapper({ children }: Properties) {
  const { isResponsiveView } = useCMSControlContext()
  const [isInit, setIsInit] = useState(true)
  const [isResizing, setIsResizing] = useState(false)
  const [width, setWidth] = useState<number>()

  return (
    <div
      className="relative mx-auto size-full max-w-full overflow-hidden rounded-lg"
      style={{ width }}
    >
      {children}
      <Render if={isResponsiveView}>
        <Resizable
          className={cn(
            '!absolute left-1/2 top-0 !h-full rounded-r-lg bg-gray-500',
            isInit && '!w-1/2',
            !isResizing && 'max-w-[50%]',
          )}
          enable={{ right: true }}
          minWidth={140}
          onResize={(_, __, element) => {
            setIsInit(false)
            setIsResizing(true)
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
