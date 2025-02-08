import type { ResizeHandler } from '../types'

import { assert } from '../utils/assert'
import { getResizeHandleElement } from '../utils/dom/getResizeHandleElement'
import { getResizeHandleElementIndex } from '../utils/dom/getResizeHandleElementIndex'
import { getResizeHandleElementsForGroup } from '../utils/dom/getResizeHandleElementsForGroup'
import { useEffect } from '../vendor/react'

// https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

export function useWindowSplitterResizeHandlerBehavior({
  disabled,
  handleId,
  panelGroupElement,
  resizeHandler,
}: {
  disabled: boolean
  handleId: string
  panelGroupElement: ParentNode | undefined
  resizeHandler: ResizeHandler | undefined
}): void {
  useEffect(() => {
    if (
      disabled ||
      resizeHandler == undefined ||
      panelGroupElement == undefined
    ) {
      return
    }

    const handleElement = getResizeHandleElement(handleId, panelGroupElement)
    if (handleElement == undefined) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'End':
        case 'Home': {
          event.preventDefault()

          resizeHandler(event)
          break
        }
        case 'F6': {
          event.preventDefault()

          const groupId = handleElement.dataset.panelGroupId
          assert(groupId, `No group element found for id "${groupId}"`)

          const handles = getResizeHandleElementsForGroup(
            groupId,
            panelGroupElement,
          )
          const index = getResizeHandleElementIndex(
            groupId,
            handleId,
            panelGroupElement,
          )

          assert(
            index !== undefined,
            `No resize element found for id "${handleId}"`,
          )

          const nextIndex = event.shiftKey
            ? index > 0
              ? index - 1
              : handles.length - 1
            : index + 1 < handles.length
              ? index + 1
              : 0

          const nextHandle = handles[nextIndex] as HTMLElement
          nextHandle.focus()

          break
        }
      }
    }

    handleElement.addEventListener('keydown', onKeyDown)
    return () => {
      handleElement.removeEventListener('keydown', onKeyDown)
    }
  }, [panelGroupElement, disabled, handleId, resizeHandler])
}
