import type { Where } from '@/shared/pg/types'

import '../globals.css'

import { CMSProvider } from '@/shared/components/contexts/cms'
import { CMSControlProvider } from '@/shared/components/contexts/cms-control'
import { GlobalProvider } from '@/shared/components/contexts/global'
import { select } from '@/shared/pg/'

export default async function Layout({ children }: LayoutProperties) {
  const [, pages] = await select('page', '*')
  const whereNode: Where<'node'>[] = [['page_id', '=', pages?.at(0)?.id]]
  const [, nodes] = await select('node', '*', { where: whereNode })

  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <CMSProvider initialNodes={nodes ?? []} initialPages={pages ?? []}>
            <CMSControlProvider>{children}</CMSControlProvider>
          </CMSProvider>
        </GlobalProvider>
      </body>
    </html>
  )
}
