export function getResizeHandleElement(
  id: string,
  scope: HTMLElement | ParentNode = document,
): HTMLElement | undefined {
  const element = scope.querySelector(`[data-panel-resize-handle-id="${id}"]`)
  if (element) {
    return element as HTMLElement
  }
  return undefined
}
