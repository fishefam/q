// Forked from NPM stacking-order@2.0.0
// Background at https://github.com/Rich-Harris/stacking-order/issues/3
// Background at https://github.com/Rich-Harris/stacking-order/issues/6

import { assert } from '..'

/**
 * Determine which of two nodes appears in front of the other —
 * if `a` is in front, returns 1, otherwise returns -1
 * @param {HTMLElement | SVGElement} a
 * @param {HTMLElement | SVGElement} b
 */
export function compare(a: HTMLElement | SVGElement, b: HTMLElement | SVGElement): number {
  if (a === b) throw new Error('Cannot compare node with itself')

  const ancestors = {
    a: get_ancestors(a),
    b: get_ancestors(b),
  }

  let common_ancestor

  // remove shared ancestors
  while (ancestors.a.at(-1) === ancestors.b.at(-1)) {
    a = ancestors.a.pop() as HTMLElement
    b = ancestors.b.pop() as HTMLElement

    common_ancestor = a
  }

  assert(common_ancestor, 'Stacking order can only be calculated for elements with a common ancestor')

  const z_indexes = {
    a: get_z_index(find_stacking_context(ancestors.a)),
    b: get_z_index(find_stacking_context(ancestors.b)),
  }

  if (z_indexes.a === z_indexes.b) {
    const children = common_ancestor.childNodes

    const furthest_ancestors = {
      a: ancestors.a.at(-1),
      b: ancestors.b.at(-1),
    }

    let index = children.length
    while (index--) {
      const child = children[index]
      if (child === furthest_ancestors.a) return 1
      if (child === furthest_ancestors.b) return -1
    }
  }

  return Math.sign(z_indexes.a - z_indexes.b)
}

const properties =
  /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/

/** @param {HTMLElement | SVGElement} node */
function creates_stacking_context(node: HTMLElement | SVGElement) {
  const style = getComputedStyle(node)

  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
  if (style.position === 'fixed') return true
  // Forked to fix upstream bug https://github.com/Rich-Harris/stacking-order/issues/3
  // if (
  //   (style.zIndex !== "auto" && style.position !== "static") ||
  //   is_flex_item(node)
  // )
  if (style.zIndex !== 'auto' && (style.position !== 'static' || is_flex_item(node))) return true
  if (+style.opacity < 1) return true
  if ('transform' in style && style.transform !== 'none') return true
  if ('webkitTransform' in style && style.webkitTransform !== 'none') return true
  if ('mixBlendMode' in style && style.mixBlendMode !== 'normal') return true
  if ('filter' in style && style.filter !== 'none') return true
  if ('webkitFilter' in style && style.webkitFilter !== 'none') return true
  if ('isolation' in style && style.isolation === 'isolate') return true
  if (properties.test(style.willChange)) return true
  // @ts-expect-error original code
  if (style.webkitOverflowScrolling === 'touch') return true

  return false
}

/** @param {(HTMLElement| SVGElement)[]} nodes */
function find_stacking_context(nodes: (HTMLElement | SVGElement)[]) {
  let index = nodes.length

  while (index--) {
    const node = nodes[index]
    assert(node, 'Missing node')
    if (creates_stacking_context(node)) return node
  }

  return
}

/** @param {HTMLElement} node */
function get_ancestors(node: HTMLElement | SVGElement | undefined) {
  const ancestors = []

  while (node) {
    ancestors.push(node)
    // @ts-expect-error orinal code
    node = get_parent(node)
  }

  return ancestors // [ node, ... <body>, <html>, document ]
}

/** @param {HTMLElement} node */
function get_parent(node: HTMLElement) {
  const { parentNode } = node
  if (parentNode && parentNode instanceof ShadowRoot) {
    return parentNode.host
  }
  return parentNode
}

/** @param {HTMLElement | SVGElement} node */
function get_z_index(node: HTMLElement | SVGElement | undefined) {
  return (node && Number(getComputedStyle(node).zIndex)) || 0
}

/** @param {HTMLElement | SVGElement} node */
function is_flex_item(node: HTMLElement | SVGElement) {
  // @ts-expect-error original code
  const display = getComputedStyle(get_parent(node) ?? node).display
  return display === 'flex' || display === 'inline-flex'
}
