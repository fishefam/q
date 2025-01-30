'use client'

import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { cn } from '@/shared/shadcn/lib/utils'
import { Render } from '@/shared/utilities/components'
import { Resizable } from 're-resizable'
import { useEffect, useRef, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { type Breakpoint, Breakpoints } from './breakpoints'
import { ViewFrame } from './frame'

export function View({ children }: Properties) {
  const { isResponsiveView } = useCMSControlContext()
  const references = useReferences()
  const { breakpoint, setBreakpoint } = useBreakpoint(references)

  const handleResize = () => {
    const resizableElement = references.resizable.current?.resizable
    const contentElement = references.content.current
    if (!resizableElement || !contentElement) return
    resizableElement.classList.remove('!w-full')
    contentElement.style.width = `${resizableElement.clientWidth * 2}px`
    setBreakpoint(undefined)
  }

  return (
    <div className={cn('relative size-full', isResponsiveView && 'p-4')}>
      <div className="relative mx-auto flex size-full" ref={references.wrapper}>
        <Render if={isResponsiveView}>
          <Resizable
            className="!absolute left-1/2 !h-full !w-full max-w-[50%] rounded-r-lg"
            handleComponent={{ right: <ResizeHandle /> }}
            minWidth={141}
            onResize={handleResize}
            ref={references.resizable}
          />
        </Render>
        <div className="relative mx-auto size-full" ref={references.content}>
          <Breakpoints breakpoint={breakpoint} setBreakpoint={setBreakpoint} />
          <ViewFrame>
            {({ window }) => (
              <DndProvider backend={HTML5Backend} context={window}>
                {children}
                hello
              </DndProvider>
            )}
          </ViewFrame>
        </div>
      </div>
    </div>
  )
}

function ResizeHandle() {
  return (
    <div
      className={`h-full w-2 translate-x-2 cursor-col-resize bg-gray-200 transition-all duration-150 ease-in-out hover:w-2 hover:bg-blue-500`}
    >
      <div className="flex size-full items-center justify-center">
        <div className="h-1/6 w-0.5 rounded-full bg-gray-400" />
      </div>
    </div>
  )
}

function useBreakpoint(references: ReturnType<typeof useReferences>) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>()
  useEffect(() => {
    const contentElement = references.content.current
    const resizable = references.resizable.current
    const resizableElement = resizable?.resizable
    const canUpdateSize =
      contentElement && resizable && resizableElement && breakpoint

    if (!canUpdateSize) return

    contentElement.style.width = `${breakpoint.value + 2}px`
    resizable.updateSize({ width: Math.round(breakpoint.value / 2) + 1 })
    resizableElement.classList.remove('!w-full')
  }, [breakpoint, references.content, references.resizable])
  return { breakpoint, setBreakpoint }
}

function useReferences<
  T extends HTMLElement = HTMLDivElement,
  U extends HTMLElement = HTMLDivElement,
>() {
  const { isResponsiveView } = useCMSControlContext()
  const wrapper = useRef<T>(null)
  const content = useRef<U>(null)
  const resizable = useRef<Resizable>(null)
  useEffect(() => {
    if (!isResponsiveView) content.current?.style.removeProperty('width')
  }, [isResponsiveView])
  return { content, resizable, wrapper }
}
