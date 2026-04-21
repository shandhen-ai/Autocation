import React from "react"

import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title?: React.ReactNode
  eyebrow?: React.ReactNode
  children?: React.ReactNode
  className?: string
  contentClassName?: string
  titleClassName?: string
  eyebrowClassName?: string
}

export function PageHeader({
  title,
  eyebrow,
  children,
  className,
  contentClassName,
  titleClassName,
  eyebrowClassName,
}: PageHeaderProps) {
  return (
    <div className={cn("border-b border-border/60 bg-card/40 px-6 py-5 backdrop-blur-xl lg:px-10", className)}>
      <div className={cn("flex w-full flex-col items-start text-left", children ? "gap-3" : "gap-1", contentClassName)}>
        {eyebrow ? (
          <div className={cn("text-xs text-muted-foreground font-sans", eyebrowClassName)}>
            {eyebrow}
          </div>
        ) : null}

        {title ? (
          <h1 className={cn("text-xl font-bold tracking-tight text-foreground font-display", titleClassName)}>
            {title}
          </h1>
        ) : null}

        {children ? <div className="w-full">{children}</div> : null}
      </div>
    </div>
  )
}
