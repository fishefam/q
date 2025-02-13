import '@/app/globals.css'
import { CMSProvider } from '@/shared/components/contexts/cms'
import { CMSControlProvider } from '@/shared/components/contexts/cms-control'
import { GlobalProvider } from '@/shared/components/contexts/global'
import { database } from '@/shared/pg'

export default async function Layout({ children }: LayoutProperties) {
  const [, pages] = await database('page').select('*').query()
  const [, nodes] = await database('node').select('*').where('page_id', '=', pages?.at(0)?.id).query()

  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <CMSProvider nodes={nodes ?? []} pages={pages ?? []}>
            <CMSControlProvider>{children}</CMSControlProvider>
          </CMSProvider>
        </GlobalProvider>
      </body>
    </html>
  )
}
