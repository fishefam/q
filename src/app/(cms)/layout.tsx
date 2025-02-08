import { CMSProvider } from '@/shared/components/contexts/cms'

import '../globals.css'

import { CMSControlProvider } from '@/shared/components/contexts/cms-control'
import { GlobalProvider } from '@/shared/components/contexts/global'
import { SidebarProvider } from '@/shared/shadcn/components/ui/sidebar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <CMSProvider>
            <CMSControlProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </CMSControlProvider>
          </CMSProvider>
        </GlobalProvider>
      </body>
    </html>
  )
}
