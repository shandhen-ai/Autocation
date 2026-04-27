import { cn } from "@/lib/utils"

type AutocationLogoProps = {
  className?: string
}

export function AutocationLogo({ className }: AutocationLogoProps) {
  return (
    <img
      src="/autocation-logo.png"
      alt="Autocation"
      className={cn("h-auto w-[176px] object-contain", className)}
    />
  )
}
