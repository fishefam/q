export function getPanelGroupElement(
  id: string,
  rootElement: HTMLElement | ParentNode = document,
): HTMLElement | undefined {
  //If the root element is the PanelGroup
  if (
    /html.*element/gi.test(rootElement.constructor.name) &&
    (rootElement as HTMLElement)?.dataset?.panelGroupId == id
  ) {
    return rootElement as HTMLElement
  }

  //Else query children
  const element = rootElement.querySelector(
    `[data-panel-group][data-panel-group-id="${id}"]`,
  )
  if (element) {
    return element as HTMLElement
  }
  return undefined
}
