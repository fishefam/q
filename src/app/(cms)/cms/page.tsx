'use client'

import { FloatingMenu } from '@/features/floating-menu'
import { View } from '@/features/view'
import { AppSidebar } from '@/shared/shadcn/components/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
} from '@/shared/shadcn/components/ui/sidebar'
import { useState } from 'react'

export default function Page() {
  const [isResponsiveView, setIsResponsiveView] = useState(false)

  return (
    <SidebarProvider>
      <SidebarInset className="relative">
        <View isResponsiveView={isResponsiveView} />
        <FloatingMenu
          isResponsiveView={isResponsiveView}
          setIsResponsiveView={setIsResponsiveView}
        />
      </SidebarInset>
      <AppSidebar className="[&>div]:bg-transparent" side="right" />
    </SidebarProvider>
  )
}
