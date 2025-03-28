// Button.jsx (Tremor Button [v0.2.0])
import React, { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { RiLoader2Fill } from "@remixicon/react";
import { tv } from "tailwind-variants";
import { cx, focusRing } from "@/lib/utils";

const buttonVariants = tv({
  base: [
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-md border px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out",
    "disabled:pointer-events-none disabled:shadow-none",
    ...focusRing,
  ],
  variants: {
    variant: {
      primary: [
        "border-transparent",
        "text-white",
        "bg-blue-500",
        "hover:bg-blue-600",
        "disabled:bg-blue-300 disabled:text-white",
      ],
      secondary: [
        "border-gray-300",
        "text-gray-900",
        "bg-white",
        "hover:bg-gray-50",
        "disabled:text-gray-400",
      ],
      light: [
        "shadow-none",
        "border-transparent",
        "text-gray-900",
        "bg-gray-200",
        "hover:bg-gray-300/70",
        "disabled:bg-gray-100 disabled:text-gray-400",
      ],
      ghost: [
        "shadow-none",
        "border-transparent",
        "text-gray-900",
        "hover:bg-gray-100",
        "disabled:text-gray-400",
      ],
      destructive: [
        "text-white",
        "border-transparent",
        "bg-red-600",
        "hover:bg-red-700",
        "disabled:bg-red-300 disabled:text-white",
      ],
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export const Button = forwardRef(function Button(
  { asChild, isLoading = false, loadingText, className, disabled, variant, children, ...props },
  forwardedRef
) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      ref={forwardedRef}
      className={cx(buttonVariants({ variant }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="pointer-events-none flex shrink-0 items-center justify-center gap-1.5">
          <RiLoader2Fill className="size-4 shrink-0 animate-spin" aria-hidden="true" />
          <span className="sr-only">{loadingText ? loadingText : "Loading"}</span>
          {loadingText ? loadingText : children}
        </span>
      ) : (
        children
      )}
    </Component>
  );
});
