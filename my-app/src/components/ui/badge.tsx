import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-[4px] border border-transparent px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-offset-1 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-300 overflow-hidden uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground shadow-editorial-sm [a&]:hover:opacity-90",
        secondary:
          "bg-secondary text-secondary-foreground border-border [a&]:hover:bg-secondary/80",
        destructive:
          "bg-destructive text-white [a&]:hover:opacity-90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-2 border-border text-foreground [a&]:hover:border-accent [a&]:hover:text-accent",
        ghost: "[a&]:hover:text-accent [a&]:hover:underline",
        link: "text-accent underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
