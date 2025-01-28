import { CMSProvider } from '@/shared/components/contexts/cms'

import '../globals.css'

import { CMSControlProvider } from '@/shared/components/contexts/cms-control'
import { GlobalProvider } from '@/shared/components/contexts/global'

export default function Layout({ children }: LayoutProperties) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <CMSProvider>
            <CMSControlProvider>{children}</CMSControlProvider>
          </CMSProvider>
        </GlobalProvider>
      </body>
    </html>
  )
}
