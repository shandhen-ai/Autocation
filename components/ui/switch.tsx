'use client'

import * as SwitchPrimitives from '@radix-ui/react-switch'
import * as React from 'react'

import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border/50 bg-muted/40 shadow-[inset_0_1px_0_oklch(0.95_0.005_80_/_0.04)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[#22c55e]/70 data-[state=checked]:bg-[#22c55e] data-[state=checked]:shadow-[0_0_18px_rgba(34,197,94,0.55),0_0_34px_rgba(34,197,94,0.22),inset_0_1px_0_rgba(255,255,255,0.22)] data-[state=unchecked]:border-border/50 data-[state=unchecked]:bg-muted/40',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 data-[state=checked]:translate-x-5 data-[state=checked]:shadow-[0_0_10px_rgba(255,255,255,0.55)] data-[state=unchecked]:translate-x-0',
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
