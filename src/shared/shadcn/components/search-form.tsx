import { Label } from '@/shared/shadcn/components/ui/label'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from '@/shared/shadcn/components/ui/sidebar'
import { Search } from 'lucide-react'

export function SearchForm({ ...properties }: React.ComponentProps<'form'>) {
  return (
    <form {...properties}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label className="sr-only" htmlFor="search">
            Search
          </Label>
          <SidebarInput
            className="pl-8"
            id="search"
            placeholder="Search the docs..."
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
