import '@/app/globals.css'
import { CMSProvider } from '@/shared/components/contexts/cms'
import { CMSControlProvider } from '@/shared/components/contexts/cms-control'
import { GlobalProvider } from '@/shared/components/contexts/global'
import { select } from '@/shared/pg/'

export default async function Layout({ children }: LayoutProperties) {
  const [, pages] = await select('page', '*').query()
  const [, nodes] = await select('node', '*').where('page_id', '=', pages?.at(0)?.id).query()

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
