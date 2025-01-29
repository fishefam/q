let nonce: string | undefined

export function getNonce(): string | undefined {
  return nonce
}

export function setNonce(value: string | undefined) {
  nonce = value
}
