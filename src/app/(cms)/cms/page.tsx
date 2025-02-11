'use client'

import { FloatingMenu } from '@/features/floating-menu'
import { View } from '@/features/view'
import { useCMSContext } from '@/shared/components/contexts/cms'
import { useCMSControlContext } from '@/shared/components/contexts/cms-control'
import { useLog } from '@/shared/utilities/hooks'
import { AppSidebar } from 'shadcn-blocks/app-sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from 'shadcn-blocks/ui/select'
import { SidebarInset, SidebarProvider } from 'shadcn/sidebar'

export default function Page() {
  const { pages } = useCMSContext()
  const { isSidebarOpen, setIsSidebarOpen } = useCMSControlContext()
  // const [state, dispatch] = useActionState(action, [])

  useLog(pages)

  return (
    <SidebarProvider onOpenChange={setIsSidebarOpen} open={isSidebarOpen}>
      <Select
        onValueChange={(value) => {
          const formData = new FormData()
          formData.set('page_id', value)
          // dispatch(formData)
        }}
      >
        <SelectTrigger>Trigger</SelectTrigger>
        <SelectContent>
          {pages.map((page) => (
            <SelectItem key={page.id} value={page.id}>
              {page.path}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <SidebarInset className="overflow-x-hidden">
        <View />
        <FloatingMenu />
      </SidebarInset>
      <AppSidebar className="[&>div]:bg-transparent" side="right" />
    </SidebarProvider>
  )
}
