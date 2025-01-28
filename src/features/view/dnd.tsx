/* eslint-disable unicorn/no-null */
import Avatar from '@atlaskit/avatar'
import Badge from '@atlaskit/badge'
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu'
import mergeRefs from '@atlaskit/ds-lib/merge-refs'
import Lozenge from '@atlaskit/lozenge'
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash'
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index'
import * as liveRegion from '@atlaskit/pragmatic-drag-and-drop-live-region'
import { DragHandleButton } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button'
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder'
import { Box, Grid, Inline, Stack, xcss } from '@atlaskit/primitives'
import { token } from '@atlaskit/tokens'
import React, {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import ReactDOM from 'react-dom'
import invariant from 'tiny-invariant'

type CleanupFunction = () => void

type ItemEntry = { element: HTMLElement; itemId: string }

type ItemPosition = 'first' | 'last' | 'middle' | 'only'

type ListContextValue = {
  getListLength: () => number
  instanceId: symbol
  registerItem: (entry: ItemEntry) => CleanupFunction
  reorderItem: (arguments_: {
    closestEdgeOfTarget: Edge | null
    indexOfTarget: number
    startIndex: number
  }) => void
}

const ListContext = createContext<ListContextValue | null>(null)

type Item = {
  id: string
  label: string
}

function useListContext() {
  const listContext = useContext(ListContext)
  invariant(listContext !== null)
  return listContext
}

const itemKey = Symbol('item')
type ItemData = {
  index: number
  instanceId: symbol
  item: Item
  [itemKey]: true
}

function getItemData({
  index,
  instanceId,
  item,
}: {
  index: number
  instanceId: symbol
  item: Item
}): ItemData {
  return {
    index,
    instanceId,
    item,
    [itemKey]: true,
  }
}

function getItemPosition({
  index,
  items,
}: {
  index: number
  items: Item[]
}): ItemPosition {
  if (items.length === 1) {
    return 'only'
  }

  if (index === 0) {
    return 'first'
  }

  if (index === items.length - 1) {
    return 'last'
  }

  return 'middle'
}

function isItemData(data: Record<string | symbol, unknown>): data is ItemData {
  return data[itemKey] === true
}

const listItemContainerStyles = xcss({
  ':last-of-type': {
    borderWidth: 'border.width.0',
  },
  'backgroundColor': 'elevation.surface',
  'borderBottomWidth': token('border.width', '1px'),
  'borderColor': 'color.border',
  'borderStyle': 'solid',
  'borderWidth': 'border.width.0',
  'position': 'relative',
})

const listItemStyles = xcss({
  padding: 'space.100',
  position: 'relative',
})

const listItemDisabledStyles = xcss({ opacity: 0.4 })

type DraggableState =
  | { container: HTMLElement; type: 'preview' }
  | { type: 'dragging' }
  | { type: 'idle' }

const idleState: DraggableState = { type: 'idle' }
const draggingState: DraggableState = { type: 'dragging' }

const listItemPreviewStyles = xcss({
  backgroundColor: 'elevation.surface.overlay',
  borderRadius: 'border.radius.100',
  maxWidth: '360px',
  overflow: 'hidden',
  paddingBlock: 'space.050',
  paddingInline: 'space.100',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const itemLabelStyles = xcss({
  flexGrow: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

function DropDownContent({
  index,
  position,
}: {
  index: number
  position: ItemPosition
}) {
  const { getListLength, reorderItem } = useListContext()

  const isMoveUpDisabled = position === 'first' || position === 'only'
  const isMoveDownDisabled = position === 'last' || position === 'only'

  const moveToTop = useCallback(() => {
    reorderItem({
      closestEdgeOfTarget: null,
      indexOfTarget: 0,
      startIndex: index,
    })
  }, [index, reorderItem])

  const moveUp = useCallback(() => {
    reorderItem({
      closestEdgeOfTarget: null,
      indexOfTarget: index - 1,
      startIndex: index,
    })
  }, [index, reorderItem])

  const moveDown = useCallback(() => {
    reorderItem({
      closestEdgeOfTarget: null,
      indexOfTarget: index + 1,
      startIndex: index,
    })
  }, [index, reorderItem])

  const moveToBottom = useCallback(() => {
    reorderItem({
      closestEdgeOfTarget: null,
      indexOfTarget: getListLength() - 1,
      startIndex: index,
    })
  }, [index, getListLength, reorderItem])

  return (
    <DropdownItemGroup>
      <DropdownItem isDisabled={isMoveUpDisabled} onClick={moveToTop}>
        Move to top
      </DropdownItem>
      <DropdownItem isDisabled={isMoveUpDisabled} onClick={moveUp}>
        Move up
      </DropdownItem>
      <DropdownItem isDisabled={isMoveDownDisabled} onClick={moveDown}>
        Move down
      </DropdownItem>
      <DropdownItem isDisabled={isMoveDownDisabled} onClick={moveToBottom}>
        Move to bottom
      </DropdownItem>
    </DropdownItemGroup>
  )
}

function ListItem({
  index,
  item,
  position,
}: {
  index: number
  item: Item
  position: ItemPosition
}) {
  const { instanceId, registerItem } = useListContext()

  const reference = useRef<HTMLDivElement>(null)
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null)

  const dragHandleReference = useRef<HTMLButtonElement>(null)

  const [draggableState, setDraggableState] =
    useState<DraggableState>(idleState)

  useEffect(() => {
    const element = reference.current
    const dragHandle = dragHandleReference.current
    invariant(element)
    invariant(dragHandle)

    const data = getItemData({ index, instanceId, item })

    return combine(
      registerItem({ element, itemId: item.id }),
      draggable({
        element: dragHandle,
        getInitialData: () => data,
        onDragStart() {
          setDraggableState(draggingState)
        },
        onDrop() {
          setDraggableState(idleState)
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            getOffset: pointerOutsideOfPreview({
              x: token('space.200', '16px'),
              y: token('space.100', '8px'),
            }),
            nativeSetDragImage,
            render({ container }) {
              setDraggableState({ container, type: 'preview' })

              return () => setDraggableState(draggingState)
            },
          })
        },
      }),
      dropTargetForElements({
        canDrop({ source }) {
          return (
            isItemData(source.data) && source.data.instanceId === instanceId
          )
        },
        element,
        getData({ input }) {
          return attachClosestEdge(data, {
            allowedEdges: ['top', 'bottom'],
            element,
            input,
          })
        },
        onDrag({ self, source }) {
          const isSource = source.element === element
          if (isSource) {
            setClosestEdge(null)
            return
          }

          const closestEdge = extractClosestEdge(self.data)

          const sourceIndex = source.data.index
          invariant(typeof sourceIndex === 'number')

          const isItemBeforeSource = index === sourceIndex - 1
          const isItemAfterSource = index === sourceIndex + 1

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === 'bottom') ||
            (isItemAfterSource && closestEdge === 'top')

          if (isDropIndicatorHidden) {
            setClosestEdge(null)
            return
          }

          setClosestEdge(closestEdge)
        },
        onDragLeave() {
          setClosestEdge(null)
        },
        onDrop() {
          setClosestEdge(null)
        },
      }),
    )
  }, [instanceId, item, index, registerItem])

  return (
    <Fragment>
      <Box ref={reference} xcss={listItemContainerStyles}>
        <Grid
          alignItems="center"
          columnGap="space.050"
          templateColumns="auto 1fr auto"
          xcss={[
            listItemStyles,
            /**
             * We are applying the disabled effect to the inner element so that
             * the border and drop indicator are not affected.
             */
            draggableState.type === 'dragging' && listItemDisabledStyles,
          ]}
        >
          <DropdownMenu
            trigger={({ triggerRef, ...triggerProperties }) => (
              <DragHandleButton
                ref={mergeRefs([dragHandleReference, triggerRef])}
                {...triggerProperties}
                label={`Reorder ${item.label}`}
              />
            )}
          >
            <DropdownItemGroup>
              <DropDownContent index={index} position={position} />
            </DropdownItemGroup>
          </DropdownMenu>
          <Box xcss={itemLabelStyles}>{item.label}</Box>
          <Inline alignBlock="center" space="space.100">
            <Badge>{1}</Badge>
            <Avatar size="small" />
            <Lozenge>Todo</Lozenge>
          </Inline>
        </Grid>
        {closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
      </Box>
      {draggableState.type === 'preview' &&
        ReactDOM.createPortal(
          <Box xcss={listItemPreviewStyles}>{item.label}</Box>,
          draggableState.container,
        )}
    </Fragment>
  )
}

const defaultItems: Item[] = [
  {
    id: 'task-1',
    label: 'Organize a team-building event',
  },
  {
    id: 'task-2',
    label: 'Create and maintain office inventory',
  },
  {
    id: 'task-3',
    label: 'Update company website content',
  },
  {
    id: 'task-4',
    label: 'Plan and execute marketing campaigns',
  },
  {
    id: 'task-5',
    label: 'Coordinate employee training sessions',
  },
  {
    id: 'task-6',
    label: 'Manage facility maintenance',
  },
  {
    id: 'task-7',
    label: 'Organize customer feedback surveys',
  },
  {
    id: 'task-8',
    label: 'Coordinate travel arrangements',
  },
]

const containerStyles = xcss({
  borderColor: 'color.border',
  borderStyle: 'solid',
  borderWidth: 'border.width',
  maxWidth: '400px',
})

type ListState = {
  items: Item[]
  lastCardMoved: {
    currentIndex: number
    item: Item
    numberOfItems: number
    previousIndex: number
  } | null
}

export function DndExample() {
  const [{ items, lastCardMoved }, setListState] = useState<ListState>({
    items: defaultItems,
    lastCardMoved: null,
  })
  const [registry] = useState(getItemRegistry)

  // Isolated instances of this component from one another
  const [instanceId] = useState(() => Symbol('instance-id'))

  const reorderItem = useCallback(
    ({
      closestEdgeOfTarget,
      indexOfTarget,
      startIndex,
    }: {
      closestEdgeOfTarget: Edge | null
      indexOfTarget: number
      startIndex: number
    }) => {
      const finishIndex = getReorderDestinationIndex({
        axis: 'vertical',
        closestEdgeOfTarget,
        indexOfTarget,
        startIndex,
      })

      if (finishIndex === startIndex) {
        // If there would be no change, we skip the update
        return
      }

      setListState((listState) => {
        const item = listState.items[startIndex]

        return {
          items: reorder({
            finishIndex,
            list: listState.items,
            startIndex,
          }),
          lastCardMoved: {
            currentIndex: finishIndex,
            item,
            numberOfItems: listState.items.length,
            previousIndex: startIndex,
          },
        }
      })
    },
    [],
  )

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isItemData(source.data) && source.data.instanceId === instanceId
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0]
        if (!target) {
          return
        }

        const sourceData = source.data
        const targetData = target.data
        if (!isItemData(sourceData) || !isItemData(targetData)) {
          return
        }

        const indexOfTarget = items.findIndex(
          (item) => item.id === targetData.item.id,
        )
        if (indexOfTarget === -1) {
          return
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData)

        reorderItem({
          closestEdgeOfTarget,
          indexOfTarget,
          startIndex: sourceData.index,
        })
      },
    })
  }, [instanceId, items, reorderItem])

  // once a drag is finished, we have some post drop actions to take
  useEffect(() => {
    if (lastCardMoved === null) {
      return
    }

    const { currentIndex, item, numberOfItems, previousIndex } = lastCardMoved
    const element = registry.getElement(item.id)
    if (element) {
      triggerPostMoveFlash(element)
    }

    liveRegion.announce(
      `You've moved ${item.label} from position ${
        previousIndex + 1
      } to position ${currentIndex + 1} of ${numberOfItems}.`,
    )
  }, [lastCardMoved, registry])

  // cleanup the live region when this component is finished
  useEffect(() => {
    return function cleanup() {
      liveRegion.cleanup()
    }
  }, [])

  const getListLength = useCallback(() => items.length, [items.length])

  const contextValue: ListContextValue = useMemo(() => {
    return {
      getListLength,
      instanceId,
      registerItem: registry.register,
      reorderItem,
    }
  }, [registry.register, reorderItem, instanceId, getListLength])

  return (
    <ListContext.Provider value={contextValue}>
      <Stack xcss={containerStyles}>
        {/*
          It is not expensive for us to pass `index` to items for this example,
          as when reordering, only two items index will ever change.

          If insertion or removal where allowed, it would be worth making
          `index` a getter (eg `getIndex()`) to avoid re-rendering many items
        */}
        {items.map((item, index) => (
          <ListItem
            index={index}
            item={item}
            key={item.id}
            position={getItemPosition({ index, items })}
          />
        ))}
      </Stack>
    </ListContext.Provider>
  )
}

function getItemRegistry() {
  const registry = new Map<string, HTMLElement>()

  function register({ element, itemId }: ItemEntry) {
    registry.set(itemId, element)

    return function unregister() {
      registry.delete(itemId)
    }
  }

  function getElement(itemId: string): HTMLElement | null {
    return registry.get(itemId) ?? null
  }

  return { getElement, register }
}
