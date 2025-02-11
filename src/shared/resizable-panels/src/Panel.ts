import { isBrowser } from '#is-browser'
import { isDevelopment } from '#is-development'

import type {
  ForwardedRef as ForwardedReference,
  HTMLAttributes,
  PropsWithChildren as PropertiesWithChildren,
  ReactElement,
} from './vendor/react'

import useIsomorphicLayoutEffect from './hooks/useIsomorphicEffect'
import useUniqueId from './hooks/useUniqueId'
import { PanelGroupContext } from './PanelGroupContext'
import {
  createElement,
  forwardRef as forwardReference,
  useContext,
  useImperativeHandle,
  useRef as useReference,
} from './vendor/react'

export type ImperativePanelHandle = {
  collapse: () => void
  expand: (minSize?: number) => void
  getId(): string
  getSize(): number
  isCollapsed: () => boolean
  isExpanded: () => boolean
  resize: (size: number) => void
}
export type PanelCallbacks = {
  onCollapse?: PanelOnCollapse
  onExpand?: PanelOnExpand
  onResize?: PanelOnResize
}
export type PanelConstraints = {
  collapsedSize?: number | undefined
  collapsible?: boolean | undefined
  defaultSize?: number | undefined
  maxSize?: number | undefined
  minSize?: number | undefined
}

export type PanelData = {
  callbacks: PanelCallbacks
  constraints: PanelConstraints
  id: string
  idIsFromProps: boolean
  order: number | undefined
}

export type PanelOnCollapse = () => void

export type PanelOnExpand = () => void

export type PanelOnResize = (size: number, previousSize: number | undefined) => void

export type PanelProperties<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = Omit<
  HTMLAttributes<HTMLElementTagNameMap[T]>,
  'id' | 'onResize'
> &
  PropertiesWithChildren<{
    className?: string
    collapsedSize?: number | undefined
    collapsible?: boolean | undefined
    defaultSize?: number | undefined
    id?: string
    maxSize?: number | undefined
    minSize?: number | undefined
    onCollapse?: PanelOnCollapse
    onExpand?: PanelOnExpand
    onResize?: PanelOnResize
    order?: number
    style?: object
    tagName?: T
  }>

export function PanelWithForwardedReference({
  children,
  className: classNameFromProperties = '',
  collapsedSize,
  collapsible,
  defaultSize,
  forwardedRef,
  id: idFromProperties,
  maxSize,
  minSize,
  onCollapse,
  onExpand,
  onResize,
  order,
  style: styleFromProperties,
  tagName: Type = 'div',
  ...rest
}: {
  forwardedRef: ForwardedReference<ImperativePanelHandle>
} & PanelProperties): ReactElement {
  const context = useContext(PanelGroupContext)
  if (context === undefined) {
    throw new Error(`Panel components must be rendered within a PanelGroup container`)
  }

  const {
    collapsePanel,
    expandPanel,
    getPanelSize,
    getPanelStyle,
    groupId,
    isPanelCollapsed,
    reevaluatePanelConstraints,
    registerPanel,
    resizePanel,
    unregisterPanel,
  } = context

  const panelId = useUniqueId(idFromProperties)

  const panelDataReference = useReference<PanelData>({
    callbacks: {
      onCollapse,
      onExpand,
      onResize,
    },
    constraints: {
      collapsedSize,
      collapsible,
      defaultSize,
      maxSize,
      minSize,
    },
    id: panelId,
    idIsFromProps: idFromProperties !== undefined,
    order,
  })

  const developmentWarningsReference = useReference<{
    didLogMissingDefaultSizeWarning: boolean
  }>({
    didLogMissingDefaultSizeWarning: false,
  })

  // Normally we wouldn't log a warning during render,
  // but effects don't run on the server, so we can't do it there
  if (
    isDevelopment &&
    !developmentWarningsReference.current.didLogMissingDefaultSizeWarning &&
    !isBrowser &&
    defaultSize == undefined
  ) {
    developmentWarningsReference.current.didLogMissingDefaultSizeWarning = true
    console.warn(`WARNING: Panel defaultSize prop recommended to avoid layout shift after server rendering`)
  }

  useIsomorphicLayoutEffect(() => {
    const { callbacks, constraints } = panelDataReference.current

    const previousConstraints = { ...constraints }

    panelDataReference.current.id = panelId
    panelDataReference.current.idIsFromProps = idFromProperties !== undefined
    panelDataReference.current.order = order

    callbacks.onCollapse = onCollapse
    callbacks.onExpand = onExpand
    callbacks.onResize = onResize

    constraints.collapsedSize = collapsedSize
    constraints.collapsible = collapsible
    constraints.defaultSize = defaultSize
    constraints.maxSize = maxSize
    constraints.minSize = minSize

    // If constraints have changed, we should revisit panel sizes.
    // This is uncommon but may happen if people are trying to implement pixel based constraints.
    if (
      previousConstraints.collapsedSize !== constraints.collapsedSize ||
      previousConstraints.collapsible !== constraints.collapsible ||
      previousConstraints.maxSize !== constraints.maxSize ||
      previousConstraints.minSize !== constraints.minSize
    ) {
      reevaluatePanelConstraints(panelDataReference.current, previousConstraints)
    }
  })

  useIsomorphicLayoutEffect(() => {
    const panelData = panelDataReference.current

    registerPanel(panelData)

    return () => {
      unregisterPanel(panelData)
    }
  }, [order, panelId, registerPanel, unregisterPanel])

  useImperativeHandle(
    forwardedRef,
    () => ({
      collapse: () => {
        collapsePanel(panelDataReference.current)
      },
      expand: (minSize?: number) => {
        expandPanel(panelDataReference.current, minSize)
      },
      getId() {
        return panelId
      },
      getSize() {
        return getPanelSize(panelDataReference.current)
      },
      isCollapsed() {
        return isPanelCollapsed(panelDataReference.current)
      },
      isExpanded() {
        return !isPanelCollapsed(panelDataReference.current)
      },
      resize: (size: number) => {
        resizePanel(panelDataReference.current, size)
      },
    }),
    [collapsePanel, expandPanel, getPanelSize, isPanelCollapsed, panelDataReference, panelId, resizePanel],
  )

  const style = getPanelStyle(panelDataReference.current, defaultSize)

  return createElement(Type, {
    ...rest,

    children,
    'className': classNameFromProperties,
    // CSS selectors
    'data-panel': '',
    'data-panel-collapsible': collapsible || undefined,

    'data-panel-group-id': groupId,
    'data-panel-id': panelId,
    'data-panel-size': Number.parseFloat('' + style.flexGrow).toFixed(1),
    'id': idFromProperties,
    'style': {
      ...style,
      ...styleFromProperties,
    },
  })
}

export const Panel = forwardReference<ImperativePanelHandle, PanelProperties>(
  (properties: PanelProperties, reference: ForwardedReference<ImperativePanelHandle>) =>
    createElement(PanelWithForwardedReference, {
      ...properties,
      forwardedRef: reference,
    }),
)

PanelWithForwardedReference.displayName = 'Panel'
Panel.displayName = 'forwardRef(Panel)'
