// src/components/ui/Label.jsx
import React from "react";
import * as LabelPrimitives from "@radix-ui/react-label";
import { cx } from "../../lib/utils"; // Ajusta la ruta a tu utils

export const Label = React.forwardRef(function Label(
  { className, disabled, ...props },
  forwardedRef
) {
  return (
    <LabelPrimitives.Root
      ref={forwardedRef}
      className={cx(
        "text-sm leading-none",
        "text-gray-900 dark:text-gray-50",
        disabled && "text-gray-400 dark:text-gray-600",
        className
      )}
      aria-disabled={disabled}
      {...props}
    />
  );
});

Label.displayName = "Label";
