'use client'

import '@atlaskit/css-reset'
import { FloatingMenu } from '@/features/floating-menu'
import { View } from '@/features/view'
import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { AppSidebar } from '@/shared/shadcn/components/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
} from '@/shared/shadcn/components/ui/sidebar'

export default function Page() {
  const { isSidebarVisible, setIsSidebarVisible } = useCMSControlContext()
  return (
    <SidebarProvider onOpenChange={setIsSidebarVisible} open={isSidebarVisible}>
      <SidebarInset className="overflow-x-hidden">
        <View />
        <FloatingMenu />
      </SidebarInset>
      <AppSidebar className="[&>div]:bg-transparent" side="right" />
    </SidebarProvider>
  )
}
