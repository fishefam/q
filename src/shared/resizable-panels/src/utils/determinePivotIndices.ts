import { getResizeHandleElementIndex } from './dom/getResizeHandleElementIndex'

export function determinePivotIndices(
  groupId: string,
  dragHandleId: string,
  panelGroupElement: ParentNode,
): [indexBefore: number, indexAfter: number] {
  const index = getResizeHandleElementIndex(groupId, dragHandleId, panelGroupElement)

  return index == undefined ? [-1, -1] : [index, index + 1]
}
