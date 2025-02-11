'use client'

import { FloatingMenu } from '@/features/floating-menu'
import { View } from '@/features/view'
import { useCMSContext } from '@/shared/components/contexts/cms'
import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { AppSidebar } from 'shadcn/app-sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from 'shadcn/ui/select'
import { SidebarInset, SidebarProvider } from 'shadcn/ui/sidebar'

export default function Page() {
  const { pages } = useCMSContext()
  const { isSidebarOpen, setIsSidebarOpen } = useCMSControlContext()

  return (
    <SidebarProvider onOpenChange={setIsSidebarOpen} open={isSidebarOpen}>
      <Select>
        <SelectTrigger className="absolute bottom-0 z-50 w-full bg-black text-white">
          Trigger
        </SelectTrigger>
        <SelectContent>
          {pages.map((page) => (
            <SelectItem key={page.id} value={page.id}>
              {page.path} {page.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <SidebarInset className="overflow-x-hidden">
        <View>Hello</View>
        <FloatingMenu />
      </SidebarInset>
      <AppSidebar className="[&>div]:bg-transparent" side="right" />
    </SidebarProvider>
  )
}
