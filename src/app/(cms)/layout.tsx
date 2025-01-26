import { CMSProvider } from '@/shared/components/contexts/cms'

import '../globals.css'

import { GlobalProvider } from '@/shared/components/contexts/global'

export default function Layout({ children }: LayoutProperties) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <CMSProvider>{children}</CMSProvider>
        </GlobalProvider>
      </body>
    </html>
  )
}
