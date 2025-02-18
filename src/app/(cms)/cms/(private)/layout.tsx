import '@/app/globals.css'
import { CMSProvider } from '@/shared/components/contexts/cms'
import { CMSControlProvider } from '@/shared/components/contexts/cms-control'
import { GlobalProvider } from '@/shared/components/contexts/global'
import { table } from '@/shared/pg'

export default async function Layout({ children }: LayoutProperties) {
  const [, pages] = await table('page').select('*').execute()
  const [, nodes] = await table('node').select('*').where('page_id', '=', pages?.at(0)?.id).execute()

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
