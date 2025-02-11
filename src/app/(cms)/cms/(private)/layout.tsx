import '@/app/globals.css'
import { CMSProvider } from '@/shared/components/contexts/cms'
import { CMSControlProvider } from '@/shared/components/contexts/cms-control'
import { GlobalProvider } from '@/shared/components/contexts/global'
import { select } from '@/shared/pg/'

export default async function Layout({ children }: LayoutProperties) {
  const [, pages] = await select('page', '*')

  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <CMSProvider pages={pages ?? []}>
            <CMSControlProvider>{children}</CMSControlProvider>
          </CMSProvider>
        </GlobalProvider>
      </body>
    </html>
  )
}
