export function getPanelElementsForGroup(
  groupId: string,
  scope: HTMLElement | ParentNode = document,
): HTMLElement[] {
  return [
    ...scope.querySelectorAll<HTMLElement>(
      `[data-panel][data-panel-group-id="${groupId}"]`,
    ),
  ]
}
