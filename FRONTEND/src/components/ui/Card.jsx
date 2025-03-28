// Card.jsx
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from '../../lib/utils';

const Card = React.forwardRef(function Card({ className, asChild, ...props }, ref) {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      ref={ref}
      className={cx(
        // Base styles
        "relative w-full rounded-lg border p-4 text-left shadow-sm",
        // Background color (light/dark)
        "bg-[#fff] white:bg-[#090E1A]",
        // Border color (light/dark)
        "border-gray-200 white:border-gray-900",
        className
      )}
      tremor-id="tremor-raw"
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;
