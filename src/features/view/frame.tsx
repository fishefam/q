'use client'

import type { CSSProperties, DependencyList, ReactElement, RefObject } from 'react'

import { useCMSContext } from '@/shared/components/contexts/cms'
import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { cn } from '@/shared/shadcn/lib/utils'
import { isClientSide } from '@/shared/utilities'
import { Render } from '@/shared/utilities/components'
import { getStyleSheets } from '@/shared/utilities/dom'
import has from 'lodash/has'
import isFunction from 'lodash/isFunction'
import { Fragment, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Children = ContextReactNode | ContextReactNode[] | ReactNode
type ContextReactNode = ((parameters: { document: Document; window: Window }) => ReactNode) | ReactNode
type Elements = ReturnType<typeof getElements>
type FrameProperties = { children: Children }
type RenderBodyProperties = {
  body: HTMLElement | undefined
  bodyElements: ReactElement[] | undefined
  dependencyList: DependencyList
  isLoading: boolean
  reference: RefObject<HTMLIFrameElement | null>
}
type RenderHeadProperties = {
  children: Children
  dependencyList: DependencyList
  head: HTMLHeadElement | undefined
  headElements: ReactElement[] | undefined
  setElements: SetState<Elements | undefined>
}

export function ViewFrame(properties: FrameProperties) {
  const { isResponsiveView } = useCMSControlContext()
  const { isLoading, setIsLoading } = useLoading()
  const { body, head, reference } = useFrame()
  const [elements, setElements] = useState<Elements>()

  const { children } = properties
  const { bodyElements, headElements } = elements ?? {}
  const headProperties = { children, dependencyList: [], head, headElements, setElements }
  const bodyProperties = { body, bodyElements, dependencyList: [], isLoading, reference }
  const handleFrameLoaded = () => setIsLoading(false)
  const baseFrameCN = 'relative z-[1] size-full h-full'

  return (
    <iframe
      className={cn(baseFrameCN, isResponsiveView && 'rounded-lg border')}
      onLoad={handleFrameLoaded}
      ref={reference}
    >
      <RenderHead {...headProperties} />
      <RenderBody {...bodyProperties} />
    </iframe>
  )
}

function FrameLoader() {
  return (
    <>
      <style>
        {`
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
          }

          .loader {
            width: 50px;
            height: 50px;
            border: 5px solid transparent;
            border-top: 5px solid #333;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .dark .loader {
            border-top-color: #fff;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div className="loader-container">
        <div className="loader" />
      </div>
    </>
  )
}

function getElements(children: Children) {
  const elements = [children].flat() as ReactElement[]
  const predicate = (item: ReactElement) => has(item.props, 'data-head')
  const negatedPredicate = (item: ReactElement) => !has(item.props, 'data-head')
  const filter = (type: string) => elements.filter(type === 'head' ? predicate : negatedPredicate)
  const [headElements, bodyElements] = ['head', 'body'].map(filter)
  return { bodyElements, headElements }
}

function RenderBody(properties: RenderBodyProperties) {
  const { body, bodyElements, isLoading, reference } = properties
  const { contentDocument, contentWindow } = reference.current ?? {}
  const rootProperties: { style?: CSSProperties } = isLoading ? { style: { display: 'none' } } : {}

  if (body)
    return createPortal(
      <>
        <Render if={isLoading}>
          <FrameLoader />
        </Render>
        <div id="root" {...rootProperties}>
          {bodyElements?.map((element, index) => (
            <Fragment key={index}>
              {isFunction(element) ? element({ document: contentDocument, window: contentWindow }) : element}
            </Fragment>
          ))}
        </div>
      </>,
      body,
    )
}

function RenderHead(properties: RenderHeadProperties) {
  const { children, head, headElements, setElements } = properties
  const styleSheets = isClientSide() ? getStyleSheets() : []
  const handleStyleLoaded = (index: number) => {
    if (index === styleSheets.length - 1) {
      setElements(getElements(children))
    }
  }

  if (head)
    return (
      <>
        {createPortal(headElements, head)}
        {styleSheets?.map(({ css, href }, index) =>
          createPortal(
            href ? (
              <link href={href} key={index} onLoad={() => handleStyleLoaded(index)} rel="stylesheet" />
            ) : (
              <style key={index} onLoad={() => handleStyleLoaded(index)}>
                {css}
              </style>
            ),
            head,
          ),
        )}
      </>
    )
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

function useLoading() {
  const { page } = useCMSContext()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => setIsLoading(true), [page])
  return { isLoading, setIsLoading }
}
