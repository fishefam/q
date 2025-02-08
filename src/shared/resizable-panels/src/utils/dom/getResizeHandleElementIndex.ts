import { getResizeHandleElementsForGroup } from './getResizeHandleElementsForGroup'

export function getResizeHandleElementIndex(
  groupId: string,
  id: string,
  scope: HTMLElement | ParentNode = document,
): number | undefined {
  const handles = getResizeHandleElementsForGroup(groupId, scope)
  const index = handles.findIndex(
    (handle) => handle.dataset.panelResizeHandleId === id,
  )
  return index ?? undefined
}
