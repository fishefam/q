import type { Readable } from 'node:stream'

import * as vercel from './providers/vercel'

export type Delete = (path: string | string[]) => Promise<void>
export type List = (options?: {
  cursor?: string
  limit?: number
}) => Promise<string[]>
export type Upload<T = unknown> = (data: Data, options?: Options) => Promise<T>

type Data = {
  body: ArrayBuffer | Blob | Buffer | File | Readable | ReadableStream | string
  path: string
}
type Options = { access: 'private' | 'public' }

const HANDLERS = {
  vercel: {
    delete: vercel.del,
    list: vercel.list,
    upload: vercel.upload,
  },
} as const

export function getHandlers(provider: keyof typeof HANDLERS) {
  return HANDLERS[provider]
}
