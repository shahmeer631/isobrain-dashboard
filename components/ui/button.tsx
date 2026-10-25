import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-[10px] text-[14.5px] font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ib-acc)] focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--ib-acc)] text-white border border-[var(--ib-acc)] hover:opacity-92",
        primary:
          "bg-[var(--ib-acc)] text-white border border-[var(--ib-acc)] hover:opacity-92",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-[var(--ib-line)] bg-[var(--ib-card)] text-[var(--ib-ink)] shadow-none hover:bg-[var(--ib-bg)]",
        secondary:
          "bg-[var(--ib-accbg)] text-[var(--ib-acc)] border border-transparent hover:opacity-90",
        ghost:
          "hover:bg-[var(--ib-accbg)] hover:text-[var(--ib-acc)]",
        link: "text-[var(--ib-acc)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto px-[22px] py-3 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-auto rounded-[10px] gap-1.5 px-4 py-[9px] text-sm",
        lg: "h-auto rounded-[10px] px-7 py-3.5 text-[15px]",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
