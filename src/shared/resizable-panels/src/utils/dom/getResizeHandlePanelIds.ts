import type { PanelData } from '../../Panel'

import { getResizeHandleElement } from './getResizeHandleElement'
import { getResizeHandleElementsForGroup } from './getResizeHandleElementsForGroup'

export function getResizeHandlePanelIds(
  groupId: string,
  handleId: string,
  panelsArray: PanelData[],
  scope: HTMLElement | ParentNode = document,
): [idBefore: string | undefined, idAfter: string | undefined] {
  const handle = getResizeHandleElement(handleId, scope)
  const handles = getResizeHandleElementsForGroup(groupId, scope)
  const index = handle ? handles.indexOf(handle) : -1

  const idBefore: string | undefined = panelsArray[index]?.id ?? undefined
  const idAfter: string | undefined = panelsArray[index + 1]?.id ?? undefined

  return [idBefore, idAfter]
}
