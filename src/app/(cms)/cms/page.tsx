'use client'

import { FloatingMenu } from '@/features/floating-menu'
import { AppSidebar } from '@/shared/shadcn/components/app-sidebar'
import { SidebarInset } from '@/shared/shadcn/components/ui/sidebar'
import { View } from 'lucide-react'

export default function Page() {
  return (
    <>
      <SidebarInset className="overflow-x-hidden">
        <View />
        <FloatingMenu />
      </SidebarInset>
      <AppSidebar className="[&>div]:bg-transparent" side="right" />
    </>
  )
}
