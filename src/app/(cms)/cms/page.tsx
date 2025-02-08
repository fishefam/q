'use client'

import { FloatingMenu } from '@/features/floating-menu'
import { View } from 'lucide-react'
import { AppSidebar } from 'shadcn-blocks/app-sidebar'
import { SidebarInset } from 'shadcn/sidebar'

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
