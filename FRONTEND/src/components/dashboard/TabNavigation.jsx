// TabNavigation.jsx
import * as NavigationMenuPrimitives from "@radix-ui/react-navigation-menu";
import React, { forwardRef } from "react";
import { cx, focusRing } from "@/lib/utils";
import { RiArrowDownSLine } from "@remixicon/react";

// Helper para asChild
export function getSubtree({ asChild, children }, content) {
  if (!asChild) {
    return typeof content === "function" ? content(children) : content;
  }
  const firstChild = React.Children.only(children);
  return React.cloneElement(
    firstChild,
    undefined,
    typeof content === "function" ? content(firstChild.props.children) : content
  );
}

export const TabNavigation = forwardRef(function TabNavigation(
  { className, children, ...props },
  forwardedRef
) {
  return (
    <NavigationMenuPrimitives.Root ref={forwardedRef} {...props}>
      <NavigationMenuPrimitives.List
        className={cx(
          "flex items-center justify-start whitespace-nowrap border-b",
          "border-gray-200",
          className
        )}
      >
        {children}
      </NavigationMenuPrimitives.List>
    </NavigationMenuPrimitives.Root>
  );
});

export const TabNavigationLink = forwardRef(function TabNavigationLink(
  { asChild, disabled, className, children, ...props },
  forwardedRef
) {
  return (
    <NavigationMenuPrimitives.Item className="flex" aria-disabled={disabled}>
      <NavigationMenuPrimitives.Link
        aria-disabled={disabled}
        className="group relative flex shrink-0 select-none items-center justify-center"
        ref={forwardedRef}
        onSelect={() => {}}
        asChild={asChild}
        {...props}
      >
        {getSubtree({ asChild, children }, (contentChildren) => (
          <span
            className={cx(
              "-mb-px flex items-center justify-center border-b-2 border-transparent px-3 pb-2 text-sm transition-all",
              "text-gray-500 hover:text-gray-700",
              "group-data-[active]:border-blue-500 group-data-[active]:text-blue-500",
              disabled ? "pointer-events-none text-gray-300" : "",
              focusRing,
              className
            )}
          >
            {contentChildren}
          </span>
        ))}
      </NavigationMenuPrimitives.Link>
    </NavigationMenuPrimitives.Item>
  );
});
