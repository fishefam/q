// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default function debounce<T extends Function>(
  callback: T,
  durationMs: number = 10,
) {
  let timeoutId: NodeJS.Timeout | undefined

  const callable = (...arguments_: unknown[]) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      callback(...arguments_)
    }, durationMs)
  }

  return callable as unknown as T
}
