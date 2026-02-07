import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[4px] border border-transparent px-3 py-1 text-xs font-medium tracking-wide whitespace-nowrap uppercase transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-1 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground shadow-editorial-sm [a&]:hover:opacity-90",
        secondary:
          "bg-secondary text-secondary-foreground border-border [a&]:hover:bg-secondary/80",
        destructive:
          "bg-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-white [a&]:hover:opacity-90",
        outline:
          "border-border text-foreground [a&]:hover:border-accent [a&]:hover:text-accent border-2",
        ghost: "[a&]:hover:text-accent [a&]:hover:underline",
        link: "text-accent underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
