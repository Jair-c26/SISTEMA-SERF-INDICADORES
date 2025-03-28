// DropdownMenu.jsx (Tremor Dropdown Menu [v0.0.2])
"use client";

import React, { forwardRef } from "react";
import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu";
import { RiArrowRightSLine, RiCheckboxBlankCircleLine, RiCheckLine, RiRadioButtonFill } from "@remixicon/react";
import { cx } from "@/lib/utils";

export const DropdownMenu = DropdownMenuPrimitives.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitives.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitives.Group;
export const DropdownMenuSubMenu = DropdownMenuPrimitives.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitives.RadioGroup;

export const DropdownMenuSubMenuTrigger = forwardRef(function DropdownMenuSubMenuTrigger(
  { className, children, ...props },
  forwardedRef
) {
  return (
    <DropdownMenuPrimitives.SubTrigger
      ref={forwardedRef}
      className={cx(
        "relative flex cursor-default select-none items-center rounded py-1.5 pl-2 pr-1 text-sm outline-none transition-colors",
        "text-gray-900",
        "focus-visible:bg-gray-100 data-[state=open]:bg-gray-100",
        "hover:bg-gray-100",
        className
      )}
      {...props}
    >
      {children}
      <RiArrowRightSLine className="ml-auto size-4 shrink-0" aria-hidden="true" />
    </DropdownMenuPrimitives.SubTrigger>
  );
});

export const DropdownMenuSubMenuContent = forwardRef(function DropdownMenuSubMenuContent(
  { className, collisionPadding = 8, ...props },
  forwardedRef
) {
  return (
    <DropdownMenuPrimitives.Portal>
      <DropdownMenuPrimitives.SubContent
        ref={forwardedRef}
        collisionPadding={collisionPadding}
        className={cx(
          "relative z-50 overflow-hidden rounded-md border p-1 shadow-xl",
          "bg-white text-gray-900 border-gray-200",
          "data-[state=closed]:animate-hide",
          "data-[side=bottom]:animate-slideDownAndFade data-[side=left]:animate-slideLeftAndFade data-[side=right]:animate-slideRightAndFade data-[side=top]:animate-slideUpAndFade",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitives.Portal>
  );
});

export const DropdownMenuContent = forwardRef(function DropdownMenuContent(
  { className, sideOffset = 8, collisionPadding = 8, align = "center", loop = true, ...props },
  forwardedRef
) {
  return (
    <DropdownMenuPrimitives.Portal>
      <DropdownMenuPrimitives.Content
        ref={forwardedRef}
        className={cx(
          "relative z-50 overflow-hidden rounded-md border p-1 shadow-xl",
          "bg-white text-gray-900 border-gray-200",
          "data-[state=closed]:animate-hide",
          "data-[side=bottom]:animate-slideDownAndFade data-[side=left]:animate-slideLeftAndFade data-[side=right]:animate-slideRightAndFade data-[side=top]:animate-slideUpAndFade",
          className
        )}
        sideOffset={sideOffset}
        align={align}
        collisionPadding={collisionPadding}
        loop={loop}
        {...props}
      />
    </DropdownMenuPrimitives.Portal>
  );
});

export const DropdownMenuItem = forwardRef(function DropdownMenuItem(
  { className, shortcut, hint, children, ...props },
  forwardedRef
) {
  return (
    <DropdownMenuPrimitives.Item
      ref={forwardedRef}
      className={cx(
        "group relative flex cursor-pointer select-none items-center rounded py-1.5 pl-2 pr-1 text-sm outline-none transition-colors",
        "text-gray-900",
        "focus-visible:bg-gray-100 hover:bg-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitives.Item>
  );
});

export const DropdownMenuRadioItem = forwardRef(function DropdownMenuRadioItem(
  { className, hint, shortcut, children, iconType = "radio", ...props },
  forwardedRef
) {
  return (
    <DropdownMenuPrimitives.RadioItem
      ref={forwardedRef}
      className={cx(
        "relative flex cursor-pointer select-none items-center gap-x-2 rounded py-1.5 pl-8 pr-1 text-sm outline-none transition-colors",
        "text-gray-900",
        "focus-visible:bg-gray-100 hover:bg-gray-100",
        className
      )}
      {...props}
    >
      {iconType === "radio" ? (
        <span className="absolute left-2 flex size-4 items-center justify-center">
          <RiRadioButtonFill className="size-full shrink-0 text-blue-500 hidden data-[state=checked]:block" />
          <RiCheckboxBlankCircleLine className="size-full shrink-0 text-gray-300 block data-[state=checked]:hidden" />
        </span>
      ) : iconType === "check" ? (
        <span className="absolute left-2 flex size-4 items-center justify-center">
          <RiCheckLine className="size-full shrink-0 text-gray-800 data-[state=checked]:flex data-[state=unchecked]:hidden" />
        </span>
      ) : null}
      {children}
    </DropdownMenuPrimitives.RadioItem>
  );
});

export const DropdownMenuCheckboxItem = forwardRef(function DropdownMenuCheckboxItem(
  { className, hint, shortcut, children, checked, ...props },
  forwardedRef
) {
  return (
    <DropdownMenuPrimitives.CheckboxItem
      ref={forwardedRef}
      className={cx(
        "relative flex cursor-pointer select-none items-center gap-x-2 rounded py-1.5 pl-8 pr-1 text-sm outline-none transition-colors",
        "text-gray-900",
        "focus-visible:bg-gray-100 hover:bg-gray-100",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitives.ItemIndicator>
          <RiCheckLine className="size-full shrink-0 text-gray-800" />
        </DropdownMenuPrimitives.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitives.CheckboxItem>
  );
});

export const DropdownMenuLabel = forwardRef(function DropdownMenuLabel(
  { className, ...props },
  forwardedRef
) {
  return (
    <DropdownMenuPrimitives.Label
      ref={forwardedRef}
      className={cx("px-2 py-2 text-xs font-medium tracking-wide text-gray-500", className)}
      {...props}
    />
  );
});

export const DropdownMenuSeparator = forwardRef(function DropdownMenuSeparator(
  { className, ...props },
  forwardedRef
) {
  return (
    <DropdownMenuPrimitives.Separator
      ref={forwardedRef}
      className={cx("-mx-1 my-1 h-px border-t border-gray-200", className)}
      {...props}
    />
  );
});
