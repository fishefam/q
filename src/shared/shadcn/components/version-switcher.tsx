'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/shadcn/components/ui/sidebar'
import { Check, ChevronsUpDown, GalleryVerticalEnd } from 'lucide-react'
import * as React from 'react'

export function VersionSwitcher({
  defaultVersion,
  versions,
}: {
  defaultVersion: string
  versions: string[]
}) {
  const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Documentation</span>
                <span className="">v{selectedVersion}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width)"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => setSelectedVersion(version)}
              >
                v{version}{' '}
                {version === selectedVersion && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
