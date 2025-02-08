import * as vercel from '@vercel/blob'

import type { Delete, List, Upload } from '..'

export const upload: Upload<vercel.PutBlobResult> = ({ body, path }) => {
  return vercel.put(path, body, { access: 'public' })
}

export const list: List = async (options) => {
  const { blobs } = await vercel.list(options)
  return blobs.map(({ url }) => url)
}

export const del: Delete = (path) => {
  return vercel.del(path)
}
