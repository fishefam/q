import { isDevelopment } from '#is-development'
import { useRef } from 'react'

import type { PanelConstraints, PanelData } from './Panel'
import type {
  DragState,
  ResizeEvent,
  TPanelGroupContext,
} from './PanelGroupContext'
import type { Direction } from './types'
import type {
  CSSProperties,
  ForwardedRef as ForwardedReference,
  HTMLAttributes,
  PropsWithChildren as PropertiesWithChildren,
  ReactElement,
} from './vendor/react'

import { useForceUpdate } from './hooks/useForceUpdate'
import useIsomorphicLayoutEffect from './hooks/useIsomorphicEffect'
import useUniqueId from './hooks/useUniqueId'
import { useWindowSplitterPanelGroupBehavior } from './hooks/useWindowSplitterPanelGroupBehavior'
import { PanelGroupContext } from './PanelGroupContext'
import {
  EXCEEDED_HORIZONTAL_MAX,
  EXCEEDED_HORIZONTAL_MIN,
  EXCEEDED_VERTICAL_MAX,
  EXCEEDED_VERTICAL_MIN,
  reportConstraintsViolation,
} from './PanelResizeHandleRegistry'
import { adjustLayoutByDelta } from './utils/adjustLayoutByDelta'
import { areEqual } from './utils/arrays'
import { assert } from './utils/assert'
import { calculateDeltaPercentage } from './utils/calculateDeltaPercentage'
import { calculateUnsafeDefaultLayout } from './utils/calculateUnsafeDefaultLayout'
import { callPanelCallbacks } from './utils/callPanelCallbacks'
import { compareLayouts } from './utils/compareLayouts'
import { computePanelFlexBoxStyle } from './utils/computePanelFlexBoxStyle'
import debounce from './utils/debounce'
import { determinePivotIndices } from './utils/determinePivotIndices'
import { getResizeHandleElement } from './utils/dom/getResizeHandleElement'
import { isKeyDown, isMouseEvent, isPointerEvent } from './utils/events'
import { getResizeEventCursorPosition } from './utils/events/getResizeEventCursorPosition'
import { initializeDefaultStorage } from './utils/initializeDefaultStorage'
import {
  fuzzyCompareNumbers,
  fuzzyNumbersEqual,
} from './utils/numbers/fuzzyCompareNumbers'
import { loadPanelGroupState, savePanelGroupState } from './utils/serialization'
import { validatePanelConstraints } from './utils/validatePanelConstraints'
import { validatePanelGroupLayout } from './utils/validatePanelGroupLayout'
import {
  createElement,
  forwardRef as forwardReference,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef as useReference,
  useState,
} from './vendor/react'

const LOCAL_STORAGE_DEBOUNCE_INTERVAL = 100

export type ImperativePanelGroupHandle = {
  getId: () => string
  getLayout: () => number[]
  setLayout: (layout: number[]) => void
}

export type PanelGroupOnLayout = (layout: number[]) => void

export type PanelGroupStorage = {
  getItem(name: string): string | undefined
  setItem(name: string, value: string): void
}

const defaultStorage: PanelGroupStorage = {
  getItem: (name: string) => {
    initializeDefaultStorage(defaultStorage)
    return defaultStorage.getItem(name)
  },
  setItem: (name: string, value: string) => {
    initializeDefaultStorage(defaultStorage)
    defaultStorage.setItem(name, value)
  },
}

export type PanelGroupProperties = Omit<
  HTMLAttributes<keyof HTMLElementTagNameMap>,
  'id'
> &
  PropertiesWithChildren<{
    autoSaveId?: string | undefined
    className?: string
    // Better TypeScript hinting
    dir?: 'auto' | 'ltr' | 'rtl' | undefined
    direction: Direction
    id?: string | undefined
    keyboardResizeBy?: number | undefined
    onLayout?: PanelGroupOnLayout | undefined
    storage?: PanelGroupStorage
    style?: CSSProperties

    tagName?: keyof HTMLElementTagNameMap
  }>

const debounceMap: {
  [key: string]: typeof savePanelGroupState
} = {}

function PanelGroupWithForwardedReference({
  autoSaveId = undefined,
  children,
  className: classNameFromProperties = '',
  direction,
  forwardedRef,
  id: idFromProperties = undefined,
  keyboardResizeBy = undefined,
  onLayout = undefined,
  storage = defaultStorage,
  style: styleFromProperties,
  tagName: Type = 'div',
  ...rest
}: {
  forwardedRef: ForwardedReference<ImperativePanelGroupHandle>
} & PanelGroupProperties): ReactElement {
  const groupId = useUniqueId(idFromProperties)
  const panelGroupElementReference = useRef<HTMLDivElement | undefined>(
    undefined,
  )
  const [dragState, setDragState] = useState<DragState | undefined>()
  const [layout, setLayout] = useState<number[]>([])
  const forceUpdate = useForceUpdate()

  const panelIdToLastNotifiedSizeMapReference = useReference<
    Record<string, number>
  >({})
  const panelSizeBeforeCollapseReference = useReference<Map<string, number>>(
    new Map(),
  )
  const previousDeltaReference = useReference<number>(0)

  const committedValuesReference = useReference<{
    autoSaveId: string | undefined
    direction: Direction
    dragState: DragState | undefined
    id: string
    keyboardResizeBy: number | undefined
    onLayout: PanelGroupOnLayout | undefined
    storage: PanelGroupStorage
  }>({
    autoSaveId,
    direction,
    dragState,
    id: groupId,
    keyboardResizeBy,
    onLayout,
    storage,
  })

  const eagerValuesReference = useReference<{
    layout: number[]
    panelDataArray: PanelData[]
    panelDataArrayChanged: boolean
  }>({
    layout,
    panelDataArray: [],
    panelDataArrayChanged: false,
  })

  const developmentWarningsReference = useReference<{
    didLogIdAndOrderWarning: boolean
    didLogPanelConstraintsWarning: boolean
    prevPanelIds: string[]
  }>({
    didLogIdAndOrderWarning: false,
    didLogPanelConstraintsWarning: false,
    prevPanelIds: [],
  })

  useImperativeHandle(
    forwardedRef,
    () => ({
      getId: () => committedValuesReference.current.id,
      getLayout: () => {
        const { layout } = eagerValuesReference.current

        return layout
      },
      setLayout: (unsafeLayout: number[]) => {
        const { onLayout } = committedValuesReference.current
        const { layout: previousLayout, panelDataArray } =
          eagerValuesReference.current

        const safeLayout = validatePanelGroupLayout({
          layout: unsafeLayout,
          panelConstraints: panelDataArray.map(
            (panelData) => panelData.constraints,
          ),
        })

        if (!areEqual(previousLayout, safeLayout)) {
          setLayout(safeLayout)

          eagerValuesReference.current.layout = safeLayout

          if (onLayout) {
            onLayout(safeLayout)
          }

          callPanelCallbacks(
            panelDataArray,
            safeLayout,
            panelIdToLastNotifiedSizeMapReference.current,
          )
        }
      },
    }),
    [
      committedValuesReference,
      eagerValuesReference,
      panelIdToLastNotifiedSizeMapReference,
    ],
  )

  useIsomorphicLayoutEffect(() => {
    committedValuesReference.current.autoSaveId = autoSaveId
    committedValuesReference.current.direction = direction
    committedValuesReference.current.dragState = dragState
    committedValuesReference.current.id = groupId
    committedValuesReference.current.onLayout = onLayout
    committedValuesReference.current.storage = storage
  })

  useWindowSplitterPanelGroupBehavior({
    committedValuesRef: committedValuesReference,
    eagerValuesRef: eagerValuesReference,
    groupId,
    layout,
    panelDataArray: eagerValuesReference.current.panelDataArray,
    panelGroupElement: panelGroupElementReference.current ?? undefined,
    setLayout,
  })

  useEffect(() => {
    const { panelDataArray } = eagerValuesReference.current

    // If this panel has been configured to persist sizing information, save sizes to local storage.
    if (autoSaveId) {
      if (layout.length === 0 || layout.length !== panelDataArray.length) {
        return
      }

      let debouncedSave = debounceMap[autoSaveId]

      // Limit the frequency of localStorage updates.
      if (debouncedSave == undefined) {
        debouncedSave = debounce(
          savePanelGroupState,
          LOCAL_STORAGE_DEBOUNCE_INTERVAL,
        )

        debounceMap[autoSaveId] = debouncedSave
      }

      // Clone mutable data before passing to the debounced function,
      // else we run the risk of saving an incorrect combination of mutable and immutable values to state.
      const clonedPanelDataArray = [...panelDataArray]
      const clonedPanelSizesBeforeCollapse = new Map(
        panelSizeBeforeCollapseReference.current,
      )
      debouncedSave(
        autoSaveId,
        clonedPanelDataArray,
        clonedPanelSizesBeforeCollapse,
        layout,
        storage,
      )
    }
  }, [
    autoSaveId,
    eagerValuesReference,
    layout,
    panelSizeBeforeCollapseReference,
    storage,
  ])

  // DEV warnings
  useEffect(() => {
    if (isDevelopment) {
      const { panelDataArray } = eagerValuesReference.current

      const {
        didLogIdAndOrderWarning,
        didLogPanelConstraintsWarning,
        prevPanelIds,
      } = developmentWarningsReference.current

      if (!didLogIdAndOrderWarning) {
        const panelIds = panelDataArray.map(({ id }) => id)

        developmentWarningsReference.current.prevPanelIds = panelIds

        const panelsHaveChanged =
          prevPanelIds.length > 0 && !areEqual(prevPanelIds, panelIds)
        if (
          panelsHaveChanged &&
          panelDataArray.some(
            ({ idIsFromProps, order }) => !idIsFromProps || order == undefined,
          )
        ) {
          developmentWarningsReference.current.didLogIdAndOrderWarning = true

          console.warn(
            `WARNING: Panel id and order props recommended when panels are dynamically rendered`,
          )
        }
      }

      if (!didLogPanelConstraintsWarning) {
        const panelConstraints = panelDataArray.map(
          (panelData) => panelData.constraints,
        )

        for (
          let panelIndex = 0;
          panelIndex < panelConstraints.length;
          panelIndex++
        ) {
          const panelData = panelDataArray[panelIndex]
          assert(panelData, `Panel data not found for index ${panelIndex}`)

          const isValid = validatePanelConstraints({
            panelConstraints,
            panelId: panelData.id,
            panelIndex,
          })

          if (!isValid) {
            developmentWarningsReference.current.didLogPanelConstraintsWarning =
              true

            break
          }
        }
      }
    }
  })

  // External APIs are safe to memoize via committed values ref
  const collapsePanel = useCallback(
    (panelData: PanelData) => {
      const { onLayout } = committedValuesReference.current
      const { layout: previousLayout, panelDataArray } =
        eagerValuesReference.current

      if (panelData.constraints.collapsible) {
        const panelConstraintsArray = panelDataArray.map(
          (panelData) => panelData.constraints,
        )

        const {
          collapsedSize = 0,
          panelSize,
          pivotIndices,
        } = panelDataHelper(panelDataArray, panelData, previousLayout)

        assert(
          panelSize != undefined,
          `Panel size not found for panel "${panelData.id}"`,
        )

        if (!fuzzyNumbersEqual(panelSize, collapsedSize)) {
          // Store size before collapse;
          // This is the size that gets restored if the expand() API is used.
          panelSizeBeforeCollapseReference.current.set(panelData.id, panelSize)

          const isLastPanel =
            findPanelDataIndex(panelDataArray, panelData) ===
            panelDataArray.length - 1
          const delta = isLastPanel
            ? panelSize - collapsedSize
            : collapsedSize - panelSize

          const nextLayout = adjustLayoutByDelta({
            delta,
            initialLayout: previousLayout,
            panelConstraints: panelConstraintsArray,
            pivotIndices,
            prevLayout: previousLayout,
            trigger: 'imperative-api',
          })

          if (!compareLayouts(previousLayout, nextLayout)) {
            setLayout(nextLayout)

            eagerValuesReference.current.layout = nextLayout

            if (onLayout) {
              onLayout(nextLayout)
            }

            callPanelCallbacks(
              panelDataArray,
              nextLayout,
              panelIdToLastNotifiedSizeMapReference.current,
            )
          }
        }
      }
    },
    [
      committedValuesReference,
      eagerValuesReference,
      panelIdToLastNotifiedSizeMapReference,
      panelSizeBeforeCollapseReference,
    ],
  )

  // External APIs are safe to memoize via committed values ref
  const expandPanel = useCallback(
    (panelData: PanelData, minSizeOverride?: number) => {
      const { onLayout } = committedValuesReference.current
      const { layout: previousLayout, panelDataArray } =
        eagerValuesReference.current

      if (panelData.constraints.collapsible) {
        const panelConstraintsArray = panelDataArray.map(
          (panelData) => panelData.constraints,
        )

        const {
          collapsedSize = 0,
          minSize: minSizeFromProperties = 0,
          panelSize = 0,
          pivotIndices,
        } = panelDataHelper(panelDataArray, panelData, previousLayout)

        const minSize = minSizeOverride ?? minSizeFromProperties

        if (fuzzyNumbersEqual(panelSize, collapsedSize)) {
          // Restore this panel to the size it was before it was collapsed, if possible.
          const previousPanelSize =
            panelSizeBeforeCollapseReference.current.get(panelData.id)

          const baseSize =
            previousPanelSize != undefined && previousPanelSize >= minSize
              ? previousPanelSize
              : minSize

          const isLastPanel =
            findPanelDataIndex(panelDataArray, panelData) ===
            panelDataArray.length - 1
          const delta = isLastPanel
            ? panelSize - baseSize
            : baseSize - panelSize

          const nextLayout = adjustLayoutByDelta({
            delta,
            initialLayout: previousLayout,
            panelConstraints: panelConstraintsArray,
            pivotIndices,
            prevLayout: previousLayout,
            trigger: 'imperative-api',
          })

          if (!compareLayouts(previousLayout, nextLayout)) {
            setLayout(nextLayout)

            eagerValuesReference.current.layout = nextLayout

            if (onLayout) {
              onLayout(nextLayout)
            }

            callPanelCallbacks(
              panelDataArray,
              nextLayout,
              panelIdToLastNotifiedSizeMapReference.current,
            )
          }
        }
      }
    },
    [
      committedValuesReference,
      eagerValuesReference,
      panelIdToLastNotifiedSizeMapReference,
      panelSizeBeforeCollapseReference,
    ],
  )

  // External APIs are safe to memoize via committed values ref
  const getPanelSize = useCallback(
    (panelData: PanelData) => {
      const { layout, panelDataArray } = eagerValuesReference.current

      const { panelSize } = panelDataHelper(panelDataArray, panelData, layout)

      assert(
        panelSize != undefined,
        `Panel size not found for panel "${panelData.id}"`,
      )

      return panelSize
    },
    [eagerValuesReference],
  )

  // This API should never read from committedValuesRef
  const getPanelStyle = useCallback(
    (panelData: PanelData, defaultSize: number | undefined) => {
      const { panelDataArray } = eagerValuesReference.current

      const panelIndex = findPanelDataIndex(panelDataArray, panelData)

      return computePanelFlexBoxStyle({
        defaultSize,
        dragState,
        layout,
        panelData: panelDataArray,
        panelIndex,
      })
    },
    [dragState, eagerValuesReference, layout],
  )

  // External APIs are safe to memoize via committed values ref
  const isPanelCollapsed = useCallback(
    (panelData: PanelData) => {
      const { layout, panelDataArray } = eagerValuesReference.current

      const {
        collapsedSize = 0,
        collapsible,
        panelSize,
      } = panelDataHelper(panelDataArray, panelData, layout)

      assert(
        panelSize != undefined,
        `Panel size not found for panel "${panelData.id}"`,
      )

      return collapsible === true && fuzzyNumbersEqual(panelSize, collapsedSize)
    },
    [eagerValuesReference],
  )

  // External APIs are safe to memoize via committed values ref
  const isPanelExpanded = useCallback(
    (panelData: PanelData) => {
      const { layout, panelDataArray } = eagerValuesReference.current

      const {
        collapsedSize = 0,
        collapsible,
        panelSize,
      } = panelDataHelper(panelDataArray, panelData, layout)

      assert(
        panelSize != undefined,
        `Panel size not found for panel "${panelData.id}"`,
      )

      return !collapsible || fuzzyCompareNumbers(panelSize, collapsedSize) > 0
    },
    [eagerValuesReference],
  )

  const registerPanel = useCallback(
    (panelData: PanelData) => {
      const { panelDataArray } = eagerValuesReference.current

      panelDataArray.push(panelData)
      panelDataArray.sort((panelA, panelB) => {
        const orderA = panelA.order
        const orderB = panelB.order
        if (orderA == undefined && orderB == undefined) {
          return 0
        } else if (orderA == undefined) {
          return -1
        } else if (orderB == undefined) {
          return 1
        } else {
          return orderA - orderB
        }
      })

      eagerValuesReference.current.panelDataArrayChanged = true

      forceUpdate()
    },
    [eagerValuesReference, forceUpdate],
  )

  // (Re)calculate group layout whenever panels are registered or unregistered.

  useIsomorphicLayoutEffect(() => {
    if (eagerValuesReference.current.panelDataArrayChanged) {
      eagerValuesReference.current.panelDataArrayChanged = false

      const { autoSaveId, onLayout, storage } = committedValuesReference.current
      const { layout: previousLayout, panelDataArray } =
        eagerValuesReference.current

      // If this panel has been configured to persist sizing information,
      // default size should be restored from local storage if possible.
      let unsafeLayout: number[] | undefined
      if (autoSaveId) {
        const state = loadPanelGroupState(autoSaveId, panelDataArray, storage)
        if (state) {
          panelSizeBeforeCollapseReference.current = new Map(
            Object.entries(state.expandToSizes),
          )
          unsafeLayout = state.layout
        }
      }

      if (unsafeLayout == undefined) {
        unsafeLayout = calculateUnsafeDefaultLayout({
          panelDataArray,
        })
      }

      // Validate even saved layouts in case something has changed since last render
      // e.g. for pixel groups, this could be the size of the window
      const nextLayout = validatePanelGroupLayout({
        layout: unsafeLayout,
        panelConstraints: panelDataArray.map(
          (panelData) => panelData.constraints,
        ),
      })

      if (!areEqual(previousLayout, nextLayout)) {
        setLayout(nextLayout)

        eagerValuesReference.current.layout = nextLayout

        if (onLayout) {
          onLayout(nextLayout)
        }

        callPanelCallbacks(
          panelDataArray,
          nextLayout,
          panelIdToLastNotifiedSizeMapReference.current,
        )
      }
    }
  })

  // Reset the cached layout if hidden by the Activity/Offscreen API
  useIsomorphicLayoutEffect(() => {
    const eagerValues = eagerValuesReference.current
    return () => {
      eagerValues.layout = []
    }
  }, [])

  const registerResizeHandle = useCallback(
    (dragHandleId: string) => {
      let isRTL = false

      const panelGroupElement = panelGroupElementReference.current
      if (panelGroupElement) {
        const style = globalThis.getComputedStyle(panelGroupElement)
        if (style.getPropertyValue('direction') === 'rtl') {
          isRTL = true
        }
      }

      return function resizeHandler(event: ResizeEvent) {
        event.preventDefault()

        const panelGroupElement = panelGroupElementReference.current
        if (!panelGroupElement) {
          return () => {}
        }

        const {
          direction,
          dragState,
          id: groupId,
          keyboardResizeBy,
          onLayout,
        } = committedValuesReference.current
        const { layout: previousLayout, panelDataArray } =
          eagerValuesReference.current

        const { initialLayout } = dragState ?? {}

        const pivotIndices = determinePivotIndices(
          groupId,
          dragHandleId,
          panelGroupElement,
        )

        let delta = calculateDeltaPercentage(
          event,
          dragHandleId,
          direction,
          dragState,
          keyboardResizeBy,
          panelGroupElement,
        )

        const isHorizontal = direction === 'horizontal'

        if (isHorizontal && isRTL) {
          delta = -delta
        }

        const panelConstraints = panelDataArray.map(
          (panelData) => panelData.constraints,
        )

        const nextLayout = adjustLayoutByDelta({
          delta,
          initialLayout: initialLayout ?? previousLayout,
          panelConstraints,
          pivotIndices,
          prevLayout: previousLayout,
          trigger: isKeyDown(event) ? 'keyboard' : 'mouse-or-touch',
        })

        const layoutChanged = !compareLayouts(previousLayout, nextLayout)

        // Only update the cursor for layout changes triggered by touch/mouse events (not keyboard)
        // Update the cursor even if the layout hasn't changed (we may need to show an invalid cursor state)
        if (
          (isPointerEvent(event) || isMouseEvent(event)) && // Watch for multiple subsequent deltas; this might occur for tiny cursor movements.
          // In this case, Panel sizes might not change–
          // but updating cursor in this scenario would cause a flicker.
          previousDeltaReference.current != delta
        ) {
          previousDeltaReference.current = delta

          if (!layoutChanged && delta !== 0) {
            // If the pointer has moved too far to resize the panel any further, note this so we can update the cursor.
            // This mimics VS Code behavior.
            if (isHorizontal) {
              reportConstraintsViolation(
                dragHandleId,
                delta < 0 ? EXCEEDED_HORIZONTAL_MIN : EXCEEDED_HORIZONTAL_MAX,
              )
            } else {
              reportConstraintsViolation(
                dragHandleId,
                delta < 0 ? EXCEEDED_VERTICAL_MIN : EXCEEDED_VERTICAL_MAX,
              )
            }
          } else {
            reportConstraintsViolation(dragHandleId, 0)
          }
        }

        if (layoutChanged) {
          setLayout(nextLayout)

          eagerValuesReference.current.layout = nextLayout

          if (onLayout) {
            onLayout(nextLayout)
          }

          callPanelCallbacks(
            panelDataArray,
            nextLayout,
            panelIdToLastNotifiedSizeMapReference.current,
          )
        }
      }
    },
    [
      committedValuesReference,
      eagerValuesReference,
      panelGroupElementReference,
      panelIdToLastNotifiedSizeMapReference,
      previousDeltaReference,
    ],
  )

  // External APIs are safe to memoize via committed values ref
  const resizePanel = useCallback(
    (panelData: PanelData, unsafePanelSize: number) => {
      const { onLayout } = committedValuesReference.current

      const { layout: previousLayout, panelDataArray } =
        eagerValuesReference.current

      const panelConstraintsArray = panelDataArray.map(
        (panelData) => panelData.constraints,
      )

      const { panelSize, pivotIndices } = panelDataHelper(
        panelDataArray,
        panelData,
        previousLayout,
      )

      assert(
        panelSize != undefined,
        `Panel size not found for panel "${panelData.id}"`,
      )

      const isLastPanel =
        findPanelDataIndex(panelDataArray, panelData) ===
        panelDataArray.length - 1
      const delta = isLastPanel
        ? panelSize - unsafePanelSize
        : unsafePanelSize - panelSize

      const nextLayout = adjustLayoutByDelta({
        delta,
        initialLayout: previousLayout,
        panelConstraints: panelConstraintsArray,
        pivotIndices,
        prevLayout: previousLayout,
        trigger: 'imperative-api',
      })

      if (!compareLayouts(previousLayout, nextLayout)) {
        setLayout(nextLayout)

        eagerValuesReference.current.layout = nextLayout

        if (onLayout) {
          onLayout(nextLayout)
        }

        callPanelCallbacks(
          panelDataArray,
          nextLayout,
          panelIdToLastNotifiedSizeMapReference.current,
        )
      }
    },
    [
      committedValuesReference,
      eagerValuesReference,
      panelIdToLastNotifiedSizeMapReference,
    ],
  )

  const reevaluatePanelConstraints = useCallback(
    (panelData: PanelData, previousConstraints: PanelConstraints) => {
      const { layout, panelDataArray } = eagerValuesReference.current

      const {
        collapsedSize: previousCollapsedSize = 0,
        collapsible: previousCollapsible,
      } = previousConstraints

      const {
        collapsedSize: nextCollapsedSize = 0,
        collapsible: nextCollapsible,
        maxSize: nextMaxSize = 100,
        minSize: nextMinSize = 0,
      } = panelData.constraints

      const { panelSize: previousPanelSize } = panelDataHelper(
        panelDataArray,
        panelData,
        layout,
      )
      if (previousPanelSize == undefined) {
        // It's possible that the panels in this group have changed since the last render
        return
      }

      if (
        previousCollapsible &&
        nextCollapsible &&
        fuzzyNumbersEqual(previousPanelSize, previousCollapsedSize)
      ) {
        if (fuzzyNumbersEqual(previousCollapsedSize, nextCollapsedSize)) {
          // Stay collapsed
        } else {
          resizePanel(panelData, nextCollapsedSize)
        }
      } else if (previousPanelSize < nextMinSize) {
        resizePanel(panelData, nextMinSize)
      } else if (previousPanelSize > nextMaxSize) {
        resizePanel(panelData, nextMaxSize)
      }
    },
    [eagerValuesReference, resizePanel],
  )

  // TODO Multiple drag handles can be active at the same time so this API is a bit awkward now
  const startDragging = useCallback(
    (dragHandleId: string, event: ResizeEvent) => {
      const { direction } = committedValuesReference.current
      const { layout } = eagerValuesReference.current
      if (!panelGroupElementReference.current) {
        return
      }
      const handleElement = getResizeHandleElement(
        dragHandleId,
        panelGroupElementReference.current,
      )
      assert(
        handleElement,
        `Drag handle element not found for id "${dragHandleId}"`,
      )

      const initialCursorPosition = getResizeEventCursorPosition(
        direction,
        event,
      )

      setDragState({
        dragHandleId,
        dragHandleRect: handleElement.getBoundingClientRect(),
        initialCursorPosition,
        initialLayout: layout,
      })
    },
    [
      committedValuesReference,
      eagerValuesReference,
      panelGroupElementReference,
    ],
  )

  const stopDragging = useCallback(() => {
    setDragState(undefined)
  }, [])

  const unregisterPanel = useCallback(
    (panelData: PanelData) => {
      const { panelDataArray } = eagerValuesReference.current

      const index = findPanelDataIndex(panelDataArray, panelData)
      if (index >= 0) {
        panelDataArray.splice(index, 1)

        // TRICKY
        // When a panel is removed from the group, we should delete the most recent prev-size entry for it.
        // If we don't do this, then a conditionally rendered panel might not call onResize when it's re-mounted.
        // Strict effects mode makes this tricky though because all panels will be registered, unregistered, then re-registered on mount.
        delete panelIdToLastNotifiedSizeMapReference.current[panelData.id]

        eagerValuesReference.current.panelDataArrayChanged = true

        forceUpdate()
      }
    },
    [eagerValuesReference, forceUpdate, panelIdToLastNotifiedSizeMapReference],
  )

  const context = useMemo(
    () =>
      ({
        collapsePanel,
        direction,
        dragState,
        expandPanel,
        getPanelSize,
        getPanelStyle,
        groupId,
        isPanelCollapsed,
        isPanelExpanded,
        panelGroupElement: panelGroupElementReference.current,
        reevaluatePanelConstraints,
        registerPanel,
        registerResizeHandle,
        resizePanel,
        startDragging,
        stopDragging,
        unregisterPanel,
      }) satisfies TPanelGroupContext,
    [
      collapsePanel,
      direction,
      dragState,
      expandPanel,
      getPanelSize,
      getPanelStyle,
      groupId,
      isPanelCollapsed,
      isPanelExpanded,
      panelGroupElementReference,
      reevaluatePanelConstraints,
      registerPanel,
      registerResizeHandle,
      resizePanel,
      startDragging,
      stopDragging,
      unregisterPanel,
    ],
  )

  const style: CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  }

  return createElement(
    PanelGroupContext.Provider,
    { value: context },
    createElement(Type, {
      ...rest,

      children,
      'className': classNameFromProperties,
      // CSS selectors
      'data-panel-group': '',
      'data-panel-group-direction': direction,
      'data-panel-group-id': groupId,

      'id': idFromProperties,
      'ref': panelGroupElementReference,
      'style': {
        ...style,
        ...styleFromProperties,
      },
    }),
  )
}

export const PanelGroup = forwardReference<
  ImperativePanelGroupHandle,
  PanelGroupProperties
>(
  (
    properties: PanelGroupProperties,
    reference: ForwardedReference<ImperativePanelGroupHandle>,
  ) =>
    createElement(PanelGroupWithForwardedReference, {
      ...properties,
      forwardedRef: reference,
    }),
)

PanelGroupWithForwardedReference.displayName = 'PanelGroup'
PanelGroup.displayName = 'forwardRef(PanelGroup)'

function findPanelDataIndex(panelDataArray: PanelData[], panelData: PanelData) {
  return panelDataArray.findIndex(
    (previousPanelData) =>
      previousPanelData === panelData || previousPanelData.id === panelData.id,
  )
}

function panelDataHelper(
  panelDataArray: PanelData[],
  panelData: PanelData,
  layout: number[],
) {
  const panelIndex = findPanelDataIndex(panelDataArray, panelData)

  const isLastPanel = panelIndex === panelDataArray.length - 1
  const pivotIndices = isLastPanel
    ? [panelIndex - 1, panelIndex]
    : [panelIndex, panelIndex + 1]

  const panelSize = layout[panelIndex]

  return {
    ...panelData.constraints,
    panelSize,
    pivotIndices,
  }
}
