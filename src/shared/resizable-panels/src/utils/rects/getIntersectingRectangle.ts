import type { Rectangle } from './types'

import { intersects } from './intersects'

export function getIntersectingRectangle(
  rectOne: Rectangle,
  rectTwo: Rectangle,
  strict: boolean,
): Rectangle {
  if (!intersects(rectOne, rectTwo, strict)) {
    return {
      height: 0,
      width: 0,
      x: 0,
      y: 0,
    }
  }

  return {
    height:
      Math.min(rectOne.y + rectOne.height, rectTwo.y + rectTwo.height) -
      Math.max(rectOne.y, rectTwo.y),
    width:
      Math.min(rectOne.x + rectOne.width, rectTwo.x + rectTwo.width) -
      Math.max(rectOne.x, rectTwo.x),
    x: Math.max(rectOne.x, rectTwo.x),
    y: Math.max(rectOne.y, rectTwo.y),
  }
}
