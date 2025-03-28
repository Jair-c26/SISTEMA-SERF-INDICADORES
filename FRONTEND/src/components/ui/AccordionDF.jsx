// AccordionDF.jsx (Tremor Accordion [v0.0.1] sin ícono)
import React, { forwardRef } from "react";
import * as AccordionPrimitives from "@radix-ui/react-accordion";
import { cx } from "@/lib/utils";

export const Accordion = AccordionPrimitives.Root;

export const AccordionItem = forwardRef(function AccordionItem(
  { className, ...props },
  forwardedRef
) {
  return (
    <AccordionPrimitives.Item
      ref={forwardedRef}
      className={cx("overflow-hidden", className)}
      {...props}
    />
  );
});

export const AccordionTrigger = forwardRef(function AccordionTrigger(
  { className, children, ...props },
  forwardedRef
) {
  return (
    <AccordionPrimitives.Header className="flex">
      <AccordionPrimitives.Trigger
        ref={forwardedRef}
        className={cx(
          "group flex flex-1 cursor-pointer items-center justify-between text-left text-sm font-medium leading-none text-gray-900",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          className
        )}
        {...props}
      >
        {children}
      </AccordionPrimitives.Trigger>
    </AccordionPrimitives.Header>
  );
});

export const AccordionContent = forwardRef(function AccordionContent(
  { className, children, ...props },
  forwardedRef
) {
  return (
    <AccordionPrimitives.Content
      ref={forwardedRef}
      className="data-[state=closed]:animate-accordionClose data-[state=open]:animate-accordionOpen"
      {...props}
    >
      <div className={cx("overflow-hidden px-4 pt-2 text-sm text-gray-700", className)}>
        {children}
      </div>
    </AccordionPrimitives.Content>
  );
});
