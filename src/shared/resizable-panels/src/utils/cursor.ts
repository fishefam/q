import {
  EXCEEDED_HORIZONTAL_MAX,
  EXCEEDED_HORIZONTAL_MIN,
  EXCEEDED_VERTICAL_MAX,
  EXCEEDED_VERTICAL_MIN,
} from '../PanelResizeHandleRegistry'
import { getNonce } from './csp'

type CursorState = 'horizontal' | 'intersection' | 'vertical'

let currentCursorStyle: string | undefined
let enabled: boolean = true
let styleElement: HTMLStyleElement | undefined

export function disableGlobalCursorStyles() {
  enabled = false
}

export function enableGlobalCursorStyles() {
  enabled = true
}

export function getCursorStyle(state: CursorState, constraintFlags: number): string {
  if (constraintFlags) {
    const horizontalMin = (constraintFlags & EXCEEDED_HORIZONTAL_MIN) !== 0
    const horizontalMax = (constraintFlags & EXCEEDED_HORIZONTAL_MAX) !== 0
    const verticalMin = (constraintFlags & EXCEEDED_VERTICAL_MIN) !== 0
    const verticalMax = (constraintFlags & EXCEEDED_VERTICAL_MAX) !== 0

    if (horizontalMin) {
      if (verticalMin) {
        return 'se-resize'
      } else if (verticalMax) {
        return 'ne-resize'
      } else {
        return 'e-resize'
      }
    } else if (horizontalMax) {
      if (verticalMin) {
        return 'sw-resize'
      } else if (verticalMax) {
        return 'nw-resize'
      } else {
        return 'w-resize'
      }
    } else if (verticalMin) {
      return 's-resize'
    } else if (verticalMax) {
      return 'n-resize'
    }
  }

  switch (state) {
    case 'horizontal': {
      return 'ew-resize'
    }
    case 'intersection': {
      return 'move'
    }
    case 'vertical': {
      return 'ns-resize'
    }
  }
}

export function resetGlobalCursorStyle() {
  if (styleElement !== undefined) {
    styleElement.remove()

    currentCursorStyle = undefined
    styleElement = undefined
  }
}

export function setGlobalCursorStyle(state: CursorState, constraintFlags: number) {
  if (!enabled) {
    return
  }

  const style = getCursorStyle(state, constraintFlags)

  if (currentCursorStyle === style) {
    return
  }

  currentCursorStyle = style

  if (styleElement === undefined) {
    styleElement = document.createElement('style')

    const nonce = getNonce()
    if (nonce) {
      styleElement.setAttribute('nonce', nonce)
    }

    document.head.append(styleElement)
  }

  styleElement.innerHTML = `*{cursor: ${style}!important;}`
}
