import { GlobalProvider } from '@/shared/components/contexts/global'

import '../globals.css'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  )
}
