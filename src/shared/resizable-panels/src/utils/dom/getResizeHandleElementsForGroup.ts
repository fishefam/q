export function getResizeHandleElementsForGroup(
  groupId: string,
  scope: HTMLElement | ParentNode = document,
): HTMLElement[] {
  return [...scope.querySelectorAll<HTMLElement>(`[data-panel-resize-handle-id][data-panel-group-id="${groupId}"]`)]
}
