'use client'

import '@atlaskit/css-reset'
import { FloatingMenu } from '@/features/floating-menu'
import { View } from '@/features/view'
import { AppSidebar } from '@/shared/shadcn/components/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
} from '@/shared/shadcn/components/ui/sidebar'

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarInset className="overflow-hidden">
        <View />
        <FloatingMenu />
      </SidebarInset>
      <AppSidebar className="[&>div]:bg-transparent" side="right" />
    </SidebarProvider>
  )
}
