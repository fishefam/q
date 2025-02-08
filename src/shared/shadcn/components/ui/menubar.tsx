'use client'

import { cn } from '@/shared/shadcn/lib/utils'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'
import * as React from 'react'

function Menubar({
  className,
  ...properties
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      className={cn(
        'flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs',
        className,
      )}
      data-slot="menubar"
      {...properties}
    />
  )
}

function MenubarCheckboxItem({
  checked,
  children,
  className,
  ...properties
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-slot="menubar-checkbox-item"
      {...properties}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarContent({
  align = 'start',
  alignOffset = -4,
  className,
  sideOffset = 8,
  ...properties
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        className={cn(
          'z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          className,
        )}
        data-slot="menubar-content"
        sideOffset={sideOffset}
        {...properties}
      />
    </MenubarPortal>
  )
}

function MenubarGroup({
  ...properties
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...properties} />
}

function MenubarItem({
  className,
  inset,
  variant = 'default',
  ...properties
}: {
  inset?: boolean
  variant?: 'default' | 'destructive'
} & React.ComponentProps<typeof MenubarPrimitive.Item>) {
  return (
    <MenubarPrimitive.Item
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:!text-destructive",
        className,
      )}
      data-inset={inset}
      data-slot="menubar-item"
      data-variant={variant}
      {...properties}
    />
  )
}

function MenubarLabel({
  className,
  inset,
  ...properties
}: {
  inset?: boolean
} & React.ComponentProps<typeof MenubarPrimitive.Label>) {
  return (
    <MenubarPrimitive.Label
      className={cn(
        'px-2 py-1.5 text-sm font-semibold data-[inset]:pl-8',
        className,
      )}
      data-inset={inset}
      data-slot="menubar-label"
      {...properties}
    />
  )
}

function MenubarMenu({
  ...properties
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...properties} />
}

function MenubarPortal({
  ...properties
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...properties} />
}

function MenubarRadioGroup({
  ...properties
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup
      data-slot="menubar-radio-group"
      {...properties}
    />
  )
}

function MenubarRadioItem({
  children,
  className,
  ...properties
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-slot="menubar-radio-item"
      {...properties}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarSeparator({
  className,
  ...properties
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      data-slot="menubar-separator"
      {...properties}
    />
  )
}

function MenubarShortcut({
  className,
  ...properties
}: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className,
      )}
      data-slot="menubar-shortcut"
      {...properties}
    />
  )
}

function MenubarSub({
  ...properties
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...properties} />
}

function MenubarSubContent({
  className,
  ...properties
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        className,
      )}
      data-slot="menubar-sub-content"
      {...properties}
    />
  )
}

function MenubarSubTrigger({
  children,
  className,
  inset,
  ...properties
}: {
  inset?: boolean
} & React.ComponentProps<typeof MenubarPrimitive.SubTrigger>) {
  return (
    <MenubarPrimitive.SubTrigger
      className={cn(
        'flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        className,
      )}
      data-inset={inset}
      data-slot="menubar-sub-trigger"
      {...properties}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarTrigger({
  className,
  ...properties
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      className={cn(
        'flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        className,
      )}
      data-slot="menubar-trigger"
      {...properties}
    />
  )
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
}
