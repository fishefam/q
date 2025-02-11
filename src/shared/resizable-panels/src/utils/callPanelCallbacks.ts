import type { PanelData } from '../Panel'

import { assert } from './assert'
import { fuzzyNumbersEqual } from './numbers/fuzzyCompareNumbers'

// Layout should be pre-converted into percentages
export function callPanelCallbacks(
  panelsArray: PanelData[],
  layout: number[],
  panelIdToLastNotifiedSizeMap: Record<string, number>,
) {
  for (const [index, size] of layout.entries()) {
    const panelData = panelsArray[index]
    assert(panelData, `Panel data not found for index ${index}`)

    const { callbacks, constraints, id: panelId } = panelData
    const { collapsedSize = 0, collapsible } = constraints

    const lastNotifiedSize = panelIdToLastNotifiedSizeMap[panelId]
    if (lastNotifiedSize == undefined || size !== lastNotifiedSize) {
      panelIdToLastNotifiedSizeMap[panelId] = size

      const { onCollapse, onExpand, onResize } = callbacks

      if (onResize) {
        onResize(size, lastNotifiedSize)
      }

      if (collapsible && (onCollapse || onExpand)) {
        if (
          onExpand &&
          (lastNotifiedSize == undefined || fuzzyNumbersEqual(lastNotifiedSize, collapsedSize)) &&
          !fuzzyNumbersEqual(size, collapsedSize)
        ) {
          onExpand()
        }

        if (
          onCollapse &&
          (lastNotifiedSize == undefined || !fuzzyNumbersEqual(lastNotifiedSize, collapsedSize)) &&
          fuzzyNumbersEqual(size, collapsedSize)
        ) {
          onCollapse()
        }
      }
    }
  }
}
