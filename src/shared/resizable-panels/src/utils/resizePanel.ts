import type { PanelConstraints } from '../Panel'

import { PRECISION } from '../constants'
import { assert } from './assert'
import { fuzzyCompareNumbers } from './numbers/fuzzyCompareNumbers'

// Panel size must be in percentages; pixel values should be pre-converted
export function resizePanel({
  panelConstraints: panelConstraintsArray,
  panelIndex,
  size,
}: {
  panelConstraints: PanelConstraints[]
  panelIndex: number
  size: number
}) {
  const panelConstraints = panelConstraintsArray[panelIndex]
  assert(
    panelConstraints != undefined,
    `Panel constraints not found for index ${panelIndex}`,
  )

  const {
    collapsedSize = 0,
    collapsible,
    maxSize = 100,
    minSize = 0,
  } = panelConstraints

  if (fuzzyCompareNumbers(size, minSize) < 0) {
    if (collapsible) {
      // Collapsible panels should snap closed or open only once they cross the halfway point between collapsed and min size.
      const halfwayPoint = (collapsedSize + minSize) / 2
      size =
        fuzzyCompareNumbers(size, halfwayPoint) < 0 ? collapsedSize : minSize
    } else {
      size = minSize
    }
  }

  size = Math.min(maxSize, size)
  size = Number.parseFloat(size.toFixed(PRECISION))

  return size
}
