// Select.jsx (Tremor Select [v0.0.3])
import React, { forwardRef } from "react";
import * as SelectPrimitives from "@radix-ui/react-select";
import {
  RiExpandUpDownLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiCheckLine,
} from "@remixicon/react";
import { cx, focusInput, hasErrorInput } from "@/lib/utils";

export const Select = SelectPrimitives.Root;
export const SelectGroup = SelectPrimitives.Group;
export const SelectValue = SelectPrimitives.Value;

const selectTriggerStyles = cx(
  "group/trigger flex w-full select-none items-center justify-between gap-2 truncate rounded-md border px-3 py-2 shadow-sm outline-none transition sm:text-sm",
  "border-gray-300 bg-white text-gray-900",
  "hover:bg-gray-50",
  ...focusInput
);

export const SelectTrigger = forwardRef(function SelectTrigger(
  { className, hasError, children, ...props },
  forwardedRef
) {
  return (
    <SelectPrimitives.Trigger
      ref={forwardedRef}
      className={cx(
        selectTriggerStyles,
        hasError ? hasErrorInput : "",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <SelectPrimitives.Icon asChild>
        <RiExpandUpDownLine className="size-4 shrink-0 text-gray-400 group-data-[disabled]/trigger:text-gray-300" />
      </SelectPrimitives.Icon>
    </SelectPrimitives.Trigger>
  );
});

export const SelectContent = forwardRef(function SelectContent(
  {
    className,
    position = "popper",
    sideOffset = 8,
    collisionPadding = 10,
    children,
    ...props
  },
  forwardedRef
) {
  return (
    <SelectPrimitives.Portal>
      <SelectPrimitives.Content
        ref={forwardedRef}
        className={cx(
          "relative z-50 overflow-hidden rounded-md border bg-white text-gray-900 shadow-xl",
          "border-gray-200 will-change-[transform,opacity]",
          "data-[state=closed]:animate-hide",
          "data-[side=bottom]:animate-slideDownAndFade data-[side=top]:animate-slideUpAndFade",
          className
        )}
        position={position}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        // Aquí forzamos que el ancho mínimo sea igual al Trigger
        style={{ minWidth: "var(--radix-select-trigger-width)" }}
        {...props}
      >
        <SelectPrimitives.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
          <RiArrowUpSLine className="size-3 shrink-0" aria-hidden="true" />
        </SelectPrimitives.ScrollUpButton>
        <SelectPrimitives.Viewport className="p-1">{children}</SelectPrimitives.Viewport>
        <SelectPrimitives.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
          <RiArrowDownSLine className="size-3 shrink-0" aria-hidden="true" />
        </SelectPrimitives.ScrollDownButton>
      </SelectPrimitives.Content>
    </SelectPrimitives.Portal>
  );
});

export const SelectItem = forwardRef(function SelectItem(
  { className, children, ...props },
  forwardedRef
) {
  return (
    <SelectPrimitives.Item
      ref={forwardedRef}
      className={cx(
        "relative grid cursor-pointer grid-cols-[1fr_20px] gap-x-2 rounded px-3 py-2 outline-none transition-colors data-[state=checked]:font-semibold sm:text-sm",
        "text-gray-900 hover:bg-gray-100",
        className
      )}
      {...props}
    >
      <SelectPrimitives.ItemText className="flex-1 truncate">
        {children}
      </SelectPrimitives.ItemText>
      <SelectPrimitives.ItemIndicator>
        <RiCheckLine
          className="size-5 shrink-0 text-gray-800"
          aria-hidden="true"
        />
      </SelectPrimitives.ItemIndicator>
    </SelectPrimitives.Item>
  );
});
