import type { Rectangle } from './types'

export function intersects(
  rectOne: Rectangle,
  rectTwo: Rectangle,
  strict: boolean,
): boolean {
  return strict
    ? rectOne.x < rectTwo.x + rectTwo.width &&
        rectOne.x + rectOne.width > rectTwo.x &&
        rectOne.y < rectTwo.y + rectTwo.height &&
        rectOne.y + rectOne.height > rectTwo.y
    : rectOne.x <= rectTwo.x + rectTwo.width &&
        rectOne.x + rectOne.width >= rectTwo.x &&
        rectOne.y <= rectTwo.y + rectTwo.height &&
        rectOne.y + rectOne.height >= rectTwo.y
}
