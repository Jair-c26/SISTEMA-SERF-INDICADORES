// TabNavigation.jsx (JavaScript, sin TS)
import React, { forwardRef } from "react";
import * as NavigationMenuPrimitives from "@radix-ui/react-navigation-menu";
// Ajusta la ruta según tu proyecto:
import { cx, focusRing } from "@/lib/utils"; 

/**
 * Función auxiliar para manejar asChild y contenido.
 */
function getSubtree({ asChild, children }, content) {
  if (!asChild) {
    return typeof content === "function" ? content(children) : content;
  }

  const firstChild = React.Children.only(children);
  return React.cloneElement(
    firstChild,
    undefined,
    typeof content === "function"
      ? content(firstChild.props.children)
      : content
  );
}

/**
 * Componente principal para una navegación tipo "Tabs".
 */
export const TabNavigation = forwardRef(function TabNavigation(
  { className, children, ...props },
  forwardedRef
) {
  return (
    <NavigationMenuPrimitives.Root
      ref={forwardedRef}
      {...props}
      tremor-id="tremor-raw"
      asChild={false}
    >
      <NavigationMenuPrimitives.List
        className={cx(
          // base
          "flex items-center justify-start whitespace-nowrap border-b [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // border color
          "border-gray-200 dark:border-gray-800",
          className
        )}
      >
        {children}
      </NavigationMenuPrimitives.List>
    </NavigationMenuPrimitives.Root>
  );
});

TabNavigation.displayName = "TabNavigation";

/**
 * Cada tab individual dentro del TabNavigation.
 */
export const TabNavigationLink = forwardRef(function TabNavigationLink(
  { asChild, disabled, className, children, ...props },
  forwardedRef
) {
  return (
    <NavigationMenuPrimitives.Item className="flex" aria-disabled={disabled}>
      <NavigationMenuPrimitives.Link
        aria-disabled={disabled}
        className={cx(
          "group relative flex shrink-0 select-none items-center justify-center",
          disabled ? "pointer-events-none" : ""
        )}
        ref={forwardedRef}
        onSelect={() => {}}
        asChild={asChild}
        {...props}
      >
        {getSubtree({ asChild, children }, (nodeChildren) => (
          <span
            className={cx(
              // base
              "-mb-px flex items-center justify-center whitespace-nowrap border-b-2 border-transparent px-3 pb-2 text-sm font-medium transition-all",
              // text color
              "text-gray-500 dark:text-gray-500",
              // hover
              "group-hover:text-gray-700 group-hover:dark:text-gray-400",
              // border hover
              "group-hover:border-gray-300 group-hover:dark:border-gray-400",
              // selected
              "group-data-[active]:border-blue-500 group-data-[active]:text-blue-500",
              "group-data-[active]:dark:border-blue-500 group-data-[active]:dark:text-blue-500",
              // disabled
              disabled ? "pointer-events-none text-gray-300 dark:text-gray-700" : "",
              focusRing,
              className
            )}
          >
            {nodeChildren}
          </span>
        ))}
      </NavigationMenuPrimitives.Link>
    </NavigationMenuPrimitives.Item>
  );
});

TabNavigationLink.displayName = "TabNavigationLink";
