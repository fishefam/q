'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/shared/shadcn/components/ui/select'
import { useResizeObserver } from '@/shared/utilities/hooks'
import { Triangle } from 'lucide-react'

export type Breakpoint = {
  name: string
  value: number
}

const breakpoints: Breakpoint[] = [
  { name: 'Mobile', value: 360 },
  { name: 'Tablet', value: 768 },
  { name: 'Desktop', value: 1366 },
]

export function Breakpoints({
  breakpoint,
  setBreakpoint,
}: {
  breakpoint: Breakpoint | undefined
  setBreakpoint: SetState<Breakpoint | undefined>
}) {
  const { rect, reference } = useResizeObserver({ wait: 0 })
  const changeBreakpoint = (value: string) =>
    setBreakpoint(breakpoints.find((bp) => bp.value.toString() === value))

  return (
    <div
      className="absolute mx-auto h-px w-full max-w-full -translate-y-2 bg-gray-400/50 px-px"
      ref={reference}
    >
      <Select
        onValueChange={changeBreakpoint}
        value={breakpoint?.value.toString()}
      >
        <SelectTrigger className="absolute left-1/2 size-fit min-w-16 -translate-x-1/2 -translate-y-1/2 justify-center gap-1 rounded-sm border-none bg-white px-2 py-0 text-xs text-gray-500 shadow-none focus:ring-0">
          {breakpoint?.value ?? rect?.width ?? 0}
          px
        </SelectTrigger>
        <SelectContent align="center">
          <SelectGroup>
            {breakpoints.map(({ name, value }) => (
              <SelectItem
                className="flex w-full flex-nowrap"
                key={value}
                value={value.toString()}
              >
                {name} {value}px
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Triangle className="absolute size-2 -translate-y-1/2 -rotate-90 bg-white" />
      <Triangle className="absolute right-0 size-2 -translate-y-1/2 rotate-90 bg-white" />
    </div>
  )
}
