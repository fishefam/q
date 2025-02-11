'use client'

import { FloatingMenu } from '@/features/floating-menu'
import { View } from '@/features/view'
import { useCMSContext } from '@/shared/components/contexts/cms'
import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { AppSidebar } from 'shadcn-blocks/app-sidebar'
import { SidebarInset, SidebarProvider } from 'shadcn/sidebar'

export default function Page() {
  const { nodes } = useCMSContext()
  const { isSidebarOpen, setIsSidebarOpen } = useCMSControlContext()

  console.log(nodes)

  return (
    <SidebarProvider onOpenChange={setIsSidebarOpen} open={isSidebarOpen}>
      <SidebarInset className="overflow-x-hidden">
        <View />
        <FloatingMenu />
      </SidebarInset>
      <AppSidebar className="[&>div]:bg-transparent" side="right" />
    </SidebarProvider>
  )
}
