// Divider.jsx (Tremor Divider [v0.0.2])
import React, { forwardRef } from "react";
import { cx } from "@/lib/utils";

export const Divider = forwardRef(function Divider(
  { className, children, ...props },
  forwardedRef
) {
  return (
    <div
      ref={forwardedRef}
      className={cx(
        "mx-auto my-6 flex w-full items-center justify-between gap-3 text-sm text-gray-500",
        className
      )}
      {...props}
    >
      {children ? (
        <>
          <div className="h-[1px] w-full bg-gray-200" />
          <div className="whitespace-nowrap text-inherit">{children}</div>
          <div className="h-[1px] w-full bg-gray-200" />
        </>
      ) : (
        <div className="h-[1px] w-full bg-gray-200" />
      )}
    </div>
  );
});
