export function assert(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expectedCondition: any,
  message: string,
): asserts expectedCondition {
  if (!expectedCondition) {
    console.error(message)

    throw new Error(message)
  }
}
