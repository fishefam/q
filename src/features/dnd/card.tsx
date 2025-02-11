import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'

import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { ItemTypes } from './type'

const style = {
  backgroundColor: 'white',
  border: '1px dashed gray',
  cursor: 'move',
  marginBottom: '.5rem',
  padding: '0.5rem 1rem',
}

export interface CardProperties {
  id: number
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  text: string
}

interface DragItem {
  id: string
  index: number
  type: string
}

export const Card: FC<CardProperties> = ({ id, index, moveCard, text }) => {
  const reference = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!reference.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = reference.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => {
      return { id, index }
    },
    type: ItemTypes.CARD,
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(reference))
  return (
    <div data-handler-id={handlerId} ref={reference} style={{ ...style, opacity }}>
      {text}
    </div>
  )
}
