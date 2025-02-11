import { isDevelopment } from '#is-development'

import type { PanelData } from '../Panel'
import type { Direction } from '../types'
import type { RefObject as ReferenceObject } from '../vendor/react'

import { adjustLayoutByDelta } from '../utils/adjustLayoutByDelta'
import { assert } from '../utils/assert'
import { calculateAriaValues } from '../utils/calculateAriaValues'
import { determinePivotIndices } from '../utils/determinePivotIndices'
import { getPanelGroupElement } from '../utils/dom/getPanelGroupElement'
import { getResizeHandleElementsForGroup } from '../utils/dom/getResizeHandleElementsForGroup'
import { getResizeHandlePanelIds } from '../utils/dom/getResizeHandlePanelIds'
import { fuzzyNumbersEqual } from '../utils/numbers/fuzzyNumbersEqual'
import { useEffect, useRef as useReference } from '../vendor/react'
import useIsomorphicLayoutEffect from './useIsomorphicEffect'

// https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

export function useWindowSplitterPanelGroupBehavior({
  committedValuesRef,
  eagerValuesRef,
  groupId,
  layout,
  panelDataArray,
  panelGroupElement,
  setLayout,
}: {
  committedValuesRef: ReferenceObject<{
    direction: Direction
  }>
  eagerValuesRef: ReferenceObject<{
    panelDataArray: PanelData[]
  }>
  groupId: string
  layout: number[]
  panelDataArray: PanelData[]
  panelGroupElement: ParentNode | undefined
  setLayout: (sizes: number[]) => void
}): void {
  const developmentWarningsReference = useReference<{
    didWarnAboutMissingResizeHandle: boolean
  }>({
    didWarnAboutMissingResizeHandle: false,
  })

  useIsomorphicLayoutEffect(() => {
    if (!panelGroupElement) {
      return
    }
    const resizeHandleElements = getResizeHandleElementsForGroup(groupId, panelGroupElement)

    for (let index = 0; index < panelDataArray.length - 1; index++) {
      const { valueMax, valueMin, valueNow } = calculateAriaValues({
        layout,
        panelsArray: panelDataArray,
        pivotIndices: [index, index + 1],
      })

      const resizeHandleElement = resizeHandleElements[index]
      if (resizeHandleElement == undefined) {
        if (isDevelopment) {
          const { didWarnAboutMissingResizeHandle } = developmentWarningsReference.current

          if (!didWarnAboutMissingResizeHandle) {
            developmentWarningsReference.current.didWarnAboutMissingResizeHandle = true

            console.warn(`WARNING: Missing resize handle for PanelGroup "${groupId}"`)
          }
        }
      } else {
        const panelData = panelDataArray[index]
        assert(panelData, `No panel data found for index "${index}"`)

        resizeHandleElement.setAttribute('aria-controls', panelData.id)
        resizeHandleElement.setAttribute('aria-valuemax', '' + Math.round(valueMax))
        resizeHandleElement.setAttribute('aria-valuemin', '' + Math.round(valueMin))
        resizeHandleElement.setAttribute('aria-valuenow', valueNow == undefined ? '' : '' + Math.round(valueNow))
      }
    }

    return () => {
      for (const [_index, resizeHandleElement] of resizeHandleElements.entries()) {
        resizeHandleElement.removeAttribute('aria-controls')
        resizeHandleElement.removeAttribute('aria-valuemax')
        resizeHandleElement.removeAttribute('aria-valuemin')
        resizeHandleElement.removeAttribute('aria-valuenow')
      }
    }
  }, [groupId, layout, panelDataArray, panelGroupElement])

  useEffect(() => {
    if (!panelGroupElement) {
      return
    }
    const eagerValues = eagerValuesRef.current
    assert(eagerValues, `Eager values not found`)

    const { panelDataArray } = eagerValues
    const groupElement = getPanelGroupElement(groupId, panelGroupElement)
    assert(groupElement != undefined, `No group found for id "${groupId}"`)

    const handles = getResizeHandleElementsForGroup(groupId, panelGroupElement)
    assert(handles, `No resize handles found for group id "${groupId}"`)

    const cleanupFunctions = handles.map((handle) => {
      const handleId = handle.dataset.panelResizeHandleId
      assert(handleId, `Resize handle element has no handle id attribute`)

      const [idBefore, idAfter] = getResizeHandlePanelIds(groupId, handleId, panelDataArray, panelGroupElement)
      if (idBefore == undefined || idAfter == undefined) {
        return () => {}
      }

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.defaultPrevented) {
          return
        }

        switch (event.key) {
          case 'Enter': {
            event.preventDefault()

            const index = panelDataArray.findIndex((panelData) => panelData.id === idBefore)
            if (index !== -1) {
              const panelData = panelDataArray[index]
              assert(panelData, `No panel data found for index ${index}`)

              const size = layout[index]

              const { collapsedSize = 0, collapsible, minSize = 0 } = panelData.constraints

              if (size != undefined && collapsible) {
                const nextLayout = adjustLayoutByDelta({
                  delta: fuzzyNumbersEqual(size, collapsedSize) ? minSize - collapsedSize : collapsedSize - size,
                  initialLayout: layout,
                  panelConstraints: panelDataArray.map((panelData) => panelData.constraints),
                  pivotIndices: determinePivotIndices(groupId, handleId, panelGroupElement),
                  prevLayout: layout,
                  trigger: 'keyboard',
                })
                if (layout !== nextLayout) {
                  setLayout(nextLayout)
                }
              }
            }
            break
          }
        }
      }

      handle.addEventListener('keydown', onKeyDown)

      return () => {
        handle.removeEventListener('keydown', onKeyDown)
      }
    })

    return () => {
      for (const cleanupFunction of cleanupFunctions) cleanupFunction()
    }
  }, [panelGroupElement, committedValuesRef, eagerValuesRef, groupId, layout, panelDataArray, setLayout])
}
