export function getPanelElement(id: string, scope: HTMLElement | ParentNode = document): HTMLElement | undefined {
  const element = scope.querySelector(`[data-panel-id="${id}"]`)
  if (element) {
    return element as HTMLElement
  }
  return undefined
}
