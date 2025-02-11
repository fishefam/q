import { isDevelopment } from '#is-development'

import type { PanelConstraints } from '../Panel'

import { assert } from './assert'
import { fuzzyNumbersEqual } from './numbers/fuzzyNumbersEqual'
import { resizePanel } from './resizePanel'

// All units must be in percentages; pixel values should be pre-converted
export function validatePanelGroupLayout({
  layout: previousLayout,
  panelConstraints,
}: {
  layout: number[]
  panelConstraints: PanelConstraints[]
}): number[] {
  const nextLayout = [...previousLayout]
  const nextLayoutTotalSize = nextLayout.reduce((accumulated, current) => accumulated + current, 0)

  // Validate layout expectations
  if (nextLayout.length !== panelConstraints.length) {
    throw new Error(
      `Invalid ${panelConstraints.length} panel layout: ${nextLayout.map((size) => `${size}%`).join(', ')}`,
    )
  } else if (!fuzzyNumbersEqual(nextLayoutTotalSize, 100) && nextLayout.length > 0) {
    // This is not ideal so we should warn about it, but it may be recoverable in some cases
    // (especially if the amount is small)
    if (isDevelopment) {
      console.warn(
        `WARNING: Invalid layout total size: ${nextLayout
          .map((size) => `${size}%`)
          .join(', ')}. Layout normalization will be applied.`,
      )
    }
    for (let index = 0; index < panelConstraints.length; index++) {
      const unsafeSize = nextLayout[index]
      assert(unsafeSize != undefined, `No layout data found for index ${index}`)
      const safeSize = (100 / nextLayoutTotalSize) * unsafeSize
      nextLayout[index] = safeSize
    }
  }

  let remainingSize = 0

  // First pass: Validate the proposed layout given each panel's constraints
  for (let index = 0; index < panelConstraints.length; index++) {
    const unsafeSize = nextLayout[index]
    assert(unsafeSize != undefined, `No layout data found for index ${index}`)

    const safeSize = resizePanel({
      panelConstraints,
      panelIndex: index,
      size: unsafeSize,
    })

    if (unsafeSize != safeSize) {
      remainingSize += unsafeSize - safeSize

      nextLayout[index] = safeSize
    }
  }

  // If there is additional, left over space, assign it to any panel(s) that permits it
  // (It's not worth taking multiple additional passes to evenly distribute)
  if (!fuzzyNumbersEqual(remainingSize, 0)) {
    for (let index = 0; index < panelConstraints.length; index++) {
      const previousSize = nextLayout[index]
      assert(previousSize != undefined, `No layout data found for index ${index}`)
      const unsafeSize = previousSize + remainingSize
      const safeSize = resizePanel({
        panelConstraints,
        panelIndex: index,
        size: unsafeSize,
      })

      if (previousSize !== safeSize) {
        remainingSize -= safeSize - previousSize
        nextLayout[index] = safeSize

        // Once we've used up the remainder, bail
        if (fuzzyNumbersEqual(remainingSize, 0)) {
          break
        }
      }
    }
  }

  return nextLayout
}
