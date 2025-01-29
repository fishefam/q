import type { DragState, ResizeEvent } from '../PanelGroupContext'
import type { Direction } from '../types'

import { calculateDragOffsetPercentage } from './calculateDragOffsetPercentage'
import { isKeyDown } from './events'

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX
export function calculateDeltaPercentage(
  event: ResizeEvent,
  dragHandleId: string,
  direction: Direction,
  initialDragState: DragState | undefined,
  keyboardResizeBy: number | undefined,
  panelGroupElement: HTMLElement,
): number {
  if (isKeyDown(event)) {
    const isHorizontal = direction === 'horizontal'

    let delta = 0
    if (event.shiftKey) {
      delta = 100
    } else if (keyboardResizeBy == undefined) {
      delta = 10
    } else {
      delta = keyboardResizeBy
    }

    let movement = 0
    switch (event.key) {
      case 'ArrowDown': {
        movement = isHorizontal ? 0 : delta
        break
      }
      case 'ArrowLeft': {
        movement = isHorizontal ? -delta : 0
        break
      }
      case 'ArrowRight': {
        movement = isHorizontal ? delta : 0
        break
      }
      case 'ArrowUp': {
        movement = isHorizontal ? 0 : -delta
        break
      }
      case 'End': {
        movement = 100
        break
      }
      case 'Home': {
        movement = -100
        break
      }
    }

    return movement
  } else {
    if (initialDragState == undefined) {
      return 0
    }

    return calculateDragOffsetPercentage(
      event,
      dragHandleId,
      direction,
      initialDragState,
      panelGroupElement,
    )
  }
}
