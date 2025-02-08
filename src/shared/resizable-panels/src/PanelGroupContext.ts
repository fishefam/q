import type { PanelConstraints, PanelData } from './Panel'
import type { CSSProperties } from './vendor/react'

import { createContext } from './vendor/react'

export type DragState = {
  dragHandleId: string
  dragHandleRect: DOMRect
  initialCursorPosition: number
  initialLayout: number[]
}
// The "contextmenu" event is not supported as a PointerEvent in all browsers yet, so MouseEvent still need to be handled
export type ResizeEvent = KeyboardEvent | MouseEvent | PointerEvent

export type ResizeHandler = (event: ResizeEvent) => void

export type TPanelGroupContext = {
  collapsePanel: (panelData: PanelData) => void
  direction: 'horizontal' | 'vertical'
  dragState: DragState | undefined
  expandPanel: (panelData: PanelData, minSizeOverride?: number) => void
  getPanelSize: (panelData: PanelData) => number
  getPanelStyle: (
    panelData: PanelData,
    defaultSize: number | undefined,
  ) => CSSProperties
  groupId: string
  isPanelCollapsed: (panelData: PanelData) => boolean
  isPanelExpanded: (panelData: PanelData) => boolean
  panelGroupElement: ParentNode | undefined
  reevaluatePanelConstraints: (
    panelData: PanelData,
    previousConstraints: PanelConstraints,
  ) => void
  registerPanel: (panelData: PanelData) => void
  registerResizeHandle: (dragHandleId: string) => ResizeHandler
  resizePanel: (panelData: PanelData, size: number) => void
  startDragging: (dragHandleId: string, event: ResizeEvent) => void
  stopDragging: () => void
  unregisterPanel: (panelData: PanelData) => void
}
export const PanelGroupContext = createContext<TPanelGroupContext | undefined>(
  undefined,
)

PanelGroupContext.displayName = 'PanelGroupContext'
