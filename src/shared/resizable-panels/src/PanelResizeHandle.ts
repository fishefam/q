import { useRef } from 'react'

import type { ResizeEvent, ResizeHandler } from './PanelGroupContext'
import type { PointerHitAreaMargins, ResizeHandlerAction } from './PanelResizeHandleRegistry'
import type {
  CSSProperties,
  HTMLAttributes,
  PropsWithChildren as PropertiesWithChildren,
  ReactElement,
} from './vendor/react'

import useIsomorphicLayoutEffect from './hooks/useIsomorphicEffect'
import useUniqueId from './hooks/useUniqueId'
import { useWindowSplitterResizeHandlerBehavior } from './hooks/useWindowSplitterBehavior'
import { PanelGroupContext } from './PanelGroupContext'
import { registerResizeHandle } from './PanelResizeHandleRegistry'
import { assert } from './utils/assert'
import { createElement, useContext, useEffect, useRef as useReference, useState } from './vendor/react'

export type PanelResizeHandleOnDragging = (isDragging: boolean) => void
export type PanelResizeHandleProperties = Omit<
  HTMLAttributes<keyof HTMLElementTagNameMap>,
  'id' | 'onBlur' | 'onFocus'
> &
  PropertiesWithChildren<{
    className?: string
    disabled?: boolean
    hitAreaMargins?: PointerHitAreaMargins
    id?: string | undefined
    onBlur?: () => void
    onDragging?: PanelResizeHandleOnDragging
    onFocus?: () => void
    style?: CSSProperties
    tabIndex?: number
    tagName?: keyof HTMLElementTagNameMap
  }>

export type ResizeHandlerState = 'drag' | 'hover' | 'inactive'

export function PanelResizeHandle({
  children = undefined,
  className: classNameFromProperties = '',
  disabled = false,
  hitAreaMargins,
  id: idFromProperties,
  onBlur,
  onDragging,
  onFocus,
  style: styleFromProperties = {},
  tabIndex = 0,
  tagName: Type = 'div',
  ...rest
}: PanelResizeHandleProperties): ReactElement {
  const elementReference = useRef<HTMLElement>(null)

  // Use a ref to guard against users passing inline props
  const callbacksReference = useReference<{
    onDragging: PanelResizeHandleOnDragging | undefined
  }>({ onDragging })
  useEffect(() => {
    callbacksReference.current.onDragging = onDragging
  })

  const panelGroupContext = useContext(PanelGroupContext)
  if (panelGroupContext === undefined) {
    throw new Error(`PanelResizeHandle components must be rendered within a PanelGroup container`)
  }

  const {
    direction,
    groupId,
    panelGroupElement,
    registerResizeHandle: registerResizeHandleWithParentGroup,
    startDragging,
    stopDragging,
  } = panelGroupContext

  const resizeHandleId = useUniqueId(idFromProperties)

  const [state, setState] = useState<ResizeHandlerState>('inactive')

  const [isFocused, setIsFocused] = useState(false)

  const [resizeHandler, setResizeHandler] = useState<ResizeHandler | undefined>()

  const committedValuesReference = useReference<{
    state: ResizeHandlerState
  }>({
    state,
  })

  useIsomorphicLayoutEffect(() => {
    committedValuesReference.current.state = state
  })

  useEffect(() => {
    if (disabled) {
      setResizeHandler(undefined)
    } else {
      const resizeHandler = registerResizeHandleWithParentGroup(resizeHandleId)
      setResizeHandler(() => resizeHandler)
    }
  }, [disabled, resizeHandleId, registerResizeHandleWithParentGroup])

  // Extract hit area margins before passing them to the effect's dependency array
  // so that inline object values won't trigger re-renders
  const coarseHitAreaMargins = hitAreaMargins?.coarse ?? 15
  const fineHitAreaMargins = hitAreaMargins?.fine ?? 5

  useEffect(() => {
    if (disabled || resizeHandler == undefined) {
      return
    }

    const element = elementReference.current
    assert(element, 'Element ref not attached')

    const setResizeHandlerState = (action: ResizeHandlerAction, isActive: boolean, event: ResizeEvent | undefined) => {
      if (isActive) {
        switch (action) {
          case 'down': {
            setState('drag')

            assert(event, 'Expected event to be defined for "down" action')

            startDragging(resizeHandleId, event)

            const { onDragging } = callbacksReference.current
            if (onDragging) {
              onDragging(true)
            }
            break
          }
          case 'move': {
            const { state } = committedValuesReference.current

            if (state !== 'drag') {
              setState('hover')
            }

            assert(event, 'Expected event to be defined for "move" action')

            resizeHandler(event)
            break
          }
          case 'up': {
            setState('hover')

            stopDragging()

            const { onDragging } = callbacksReference.current
            if (onDragging) {
              onDragging(false)
            }
            break
          }
        }
      } else {
        setState('inactive')
      }
    }

    return registerResizeHandle(
      resizeHandleId,
      element,
      direction,
      {
        coarse: coarseHitAreaMargins,
        fine: fineHitAreaMargins,
      },
      setResizeHandlerState,
    )
  }, [
    callbacksReference,
    coarseHitAreaMargins,
    committedValuesReference,
    direction,
    disabled,
    elementReference,
    fineHitAreaMargins,
    registerResizeHandleWithParentGroup,
    resizeHandleId,
    resizeHandler,
    startDragging,
    stopDragging,
  ])

  useWindowSplitterResizeHandlerBehavior({
    disabled,
    handleId: resizeHandleId,
    panelGroupElement,
    resizeHandler,
  })

  const style: CSSProperties = {
    touchAction: 'none',
    userSelect: 'none',
  }

  return createElement(Type, {
    ...rest,

    children,
    'className': classNameFromProperties,
    // CSS selectors
    'data-panel-group-direction': direction,
    'data-panel-group-id': groupId,
    'data-panel-resize-handle-enabled': !disabled,
    'data-panel-resize-handle-id': resizeHandleId,
    'data-resize-handle': '',
    'data-resize-handle-active': state === 'drag' ? 'pointer' : isFocused ? 'keyboard' : undefined,
    'data-resize-handle-state': state,

    'id': idFromProperties,
    'onBlur': () => {
      setIsFocused(false)
      onBlur?.()
    },
    'onFocus': () => {
      setIsFocused(true)
      onFocus?.()
    },
    'ref': elementReference,
    'role': 'separator',
    'style': {
      ...style,
      ...styleFromProperties,
    },
    tabIndex,
  })
}

PanelResizeHandle.displayName = 'PanelResizeHandle'
