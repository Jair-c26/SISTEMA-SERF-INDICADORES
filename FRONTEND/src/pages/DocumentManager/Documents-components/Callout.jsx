// Callout.jsx (JavaScript, sin TypeScript)
import React from "react";
import { tv } from "tailwind-variants";
import { cx } from "@/lib/utils"; // Asegúrate de que exista un helper 'cx'

// Define tus variantes usando tailwind-variants
const calloutVariants = tv({
  base: "flex flex-col overflow-hidden rounded-md p-4 text-sm",
  variants: {
    variant: {
      default: [
        // text color
        "text-gray-900 dark:text-gray-400",
        // background color
        "bg-gray-100 dark:bg-gray-800/70",
      ],
      success: [
        "text-emerald-900 dark:text-emerald-500",
        "bg-emerald-50 dark:bg-emerald-950/70",
      ],
      error: [
        "text-red-900 dark:text-red-500",
        "bg-red-50 dark:bg-red-950/70",
      ],
      warning: [
        "text-yellow-900 dark:text-yellow-500",
        "bg-yellow-50 dark:bg-yellow-950/70",
      ],
      neutral: [
        "text-gray-900 dark:text-gray-400",
        "bg-gray-100 dark:bg-gray-800/70",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Callout = React.forwardRef((props, forwardedRef) => {
  // Extraemos las props, incluyendo 'variant', 'title', 'icon', etc.
  const {
    title,
    icon: Icon,
    className,
    variant = "default", // Valor por defecto para 'variant'
    children,
    ...rest
  } = props;

  return (
    <div
      ref={forwardedRef}
      className={cx(calloutVariants({ variant }), className)}
      {...rest}
    >
      <div className="flex items-start">
        {Icon && typeof Icon === "function" ? (
          <Icon className="mr-1.5 h-5 w-5 shrink-0" aria-hidden="true" />
        ) : (
          Icon
        )}
        <span className="font-semibold">{title}</span>
      </div>
      {children && (
        <div className="overflow-y-auto mt-2">
          {children}
        </div>
      )}
    </div>
  );
});

Callout.displayName = "Callout";

export { Callout, calloutVariants };
