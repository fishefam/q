import '@/app/globals.css'
import { GlobalProvider } from '@/shared/components/contexts/global'

export default function Layout({ children }: LayoutProperties) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  )
}
