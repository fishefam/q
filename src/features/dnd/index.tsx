import type { FC } from 'react'

import update from 'immutability-helper'
import { useCallback, useState } from 'react'

import { Card } from './card'

const style = {
  width: 400,
}

export interface ContainerState {
  cards: Item[]
}

export interface Item {
  id: number
  text: string
}

export const Container: FC = () => {
  {
    const [cards, setCards] = useState([
      {
        id: 1,
        text: 'Write a cool JS library',
      },
      {
        id: 2,
        text: 'Make it generic enough',
      },
      {
        id: 3,
        text: 'Write README',
      },
      {
        id: 4,
        text: 'Create some examples',
      },
      {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
      },
      {
        id: 6,
        text: '???',
      },
      {
        id: 7,
        text: 'PROFIT',
      },
    ])

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
      setCards((previousCards: Item[]) =>
        update(previousCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, previousCards[dragIndex] as Item],
          ],
        }),
      )
    }, [])

    const renderCard = useCallback(
      (card: { id: number; text: string }, index: number) => {
        return <Card id={card.id} index={index} key={card.id} moveCard={moveCard} text={card.text} />
      },
      [moveCard],
    )

    return (
      <>
        <div style={style}>{cards.map((card, index) => renderCard(card, index))}</div>
      </>
    )
  }
}
