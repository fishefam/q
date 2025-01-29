import type { PanelData } from '../Panel'

import { assert } from './assert'

export function calculateUnsafeDefaultLayout({
  panelDataArray,
}: {
  panelDataArray: PanelData[]
}): number[] {
  const layout = Array.from({ length: panelDataArray.length }) as number[]

  const panelConstraintsArray = panelDataArray.map(
    (panelData) => panelData.constraints,
  )

  let numberPanelsWithSizes = 0
  let remainingSize = 100

  // Distribute default sizes first
  for (let index = 0; index < panelDataArray.length; index++) {
    const panelConstraints = panelConstraintsArray[index]
    assert(panelConstraints, `Panel constraints not found for index ${index}`)
    const { defaultSize } = panelConstraints

    if (defaultSize != undefined) {
      numberPanelsWithSizes++
      layout[index] = defaultSize
      remainingSize -= defaultSize
    }
  }

  // Remaining size should be distributed evenly between panels without default sizes
  for (let index = 0; index < panelDataArray.length; index++) {
    const panelConstraints = panelConstraintsArray[index]
    assert(panelConstraints, `Panel constraints not found for index ${index}`)
    const { defaultSize } = panelConstraints

    if (defaultSize != undefined) {
      continue
    }

    const numberRemainingPanels = panelDataArray.length - numberPanelsWithSizes
    const size = remainingSize / numberRemainingPanels

    numberPanelsWithSizes++
    layout[index] = size
    remainingSize -= size
  }

  return layout
}
