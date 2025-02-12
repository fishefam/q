'use client'

import { FloatingMenu } from '@/features/floating-menu'
import { NodeRender } from '@/features/nodes'
import { View } from '@/features/view'
import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { AppSidebar } from 'shadcn/app-sidebar'
import { SidebarInset, SidebarProvider } from 'shadcn/ui/sidebar'

export default function Page() {
  const { isSidebarOpen, setIsSidebarOpen } = useCMSControlContext()

  return (
    <SidebarProvider onOpenChange={setIsSidebarOpen} open={isSidebarOpen}>
      <SidebarInset className="overflow-x-hidden">
        <View>
          <NodeRender />
        </View>
        <FloatingMenu />
      </SidebarInset>
      <AppSidebar className="[&>div]:bg-transparent" side="right" />
    </SidebarProvider>
  )
}
