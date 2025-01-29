import { useId, useRef as useReference } from '../vendor/react'

const wrappedUseId: () => string | undefined =
  typeof useId === 'function' ? useId : (): undefined => undefined

let counter = 0

export default function useUniqueId(
  idFromParameters: string | undefined = undefined,
): string {
  const idFromUseId = wrappedUseId()

  const idReference = useReference<string | undefined>(
    idFromParameters || idFromUseId || undefined,
  )
  if (idReference.current === undefined) {
    idReference.current = '' + counter++
  }

  return idFromParameters ?? idReference.current
}
