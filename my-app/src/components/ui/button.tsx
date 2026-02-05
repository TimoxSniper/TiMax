import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[4px] font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:opacity-90 uppercase tracking-wide text-sm",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground shadow-editorial-sm hover:shadow-editorial-md",
        destructive:
          "bg-destructive text-white shadow-editorial-sm hover:shadow-editorial-md focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-2 border-border bg-background text-foreground shadow-editorial-sm hover:shadow-editorial-md hover:border-accent dark:bg-card",
        secondary:
          "border-2 border-border bg-card text-foreground shadow-editorial-sm hover:shadow-editorial-md dark:bg-secondary",
        ghost:
          "text-foreground hover:text-accent relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2 has-[>svg]:px-5",
        xs: "h-8 gap-1 rounded-[4px] px-3 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 rounded-[4px] gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-14 rounded-[4px] px-8 has-[>svg]:px-6 text-base",
        icon: "size-11 rounded-[4px]",
        "icon-xs": "size-8 rounded-[4px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-[4px]",
        "icon-lg": "size-12 rounded-[4px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
