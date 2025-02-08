import type { ReactElement } from 'react'

import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { cn } from '@/shared/shadcn/lib/utils'
import { getStyleSheets } from '@/shared/utilities/dom'
import has from 'lodash/has'
import isFunction from 'lodash/isFunction'
import { memo, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Children = ContextReactNode | ContextReactNode[] | ReactNode
type ContextReactNode =
  | ((parameters: { document: Document; window: Window }) => ReactNode)
  | ReactNode

export const ViewFrame = memo(Frame)

function Frame({ children }: { children: Children }) {
  const { isResponsiveView } = useCMSControlContext()
  const { body, head, reference } = useFrame()
  const { bodyElements, headElements } = getElements(children)
  const styleSheets = useStyleSheets()

  const { contentDocument, contentWindow } = reference.current ?? {}

  return (
    <iframe
      className={cn(
        'relative z-[1] size-full h-full',
        isResponsiveView && 'rounded-lg border',
      )}
      ref={reference}
    >
      {head && styleSheets?.length
        ? styleSheets.map(({ css, href }, index) =>
            createPortal(
              href ? (
                <link href={href} key={index} rel="stylesheet" />
              ) : (
                <style key={index}>{css}</style>
              ),
              head,
            ),
          )
        : undefined}
      {head ? createPortal(headElements, head) : undefined}
      {body
        ? bodyElements.map((element) =>
            createPortal(
              isFunction(element)
                ? element({ document: contentDocument, window: contentWindow })
                : element,
              body,
            ),
          )
        : undefined}
    </iframe>
  )
}

function getElements(children: Children) {
  const elements = [children].flat() as ReactElement[]
  const headElements = elements.filter((element) =>
    has(element?.props, 'data-head'),
  )
  const bodyElements = elements.filter(
    (element) => !has(element?.props, 'data-head'),
  )
  return { bodyElements, headElements }
}

function useFrame() {
  const reference = useRef<HTMLIFrameElement>(null)
  const [head, setHead] = useState<HTMLHeadElement>()
  const [body, setBody] = useState<HTMLElement>()
  useEffect(() => {
    const { body, head } = reference.current?.contentDocument ?? {}
    setHead(head)
    setBody(body)
  }, [])
  return { body, head, reference }
}

function useStyleSheets() {
  const [styleSheets, setStyleSheets] =
    useState<{ css: string; href?: string }[]>()
  useEffect(() => setStyleSheets(getStyleSheets()), [])
  return styleSheets
}
