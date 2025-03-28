// src/components/ui/Drawer.jsx
import React from "react"
import * as DrawerPrimitives from "@radix-ui/react-dialog"
import { cx } from "@/lib/utils"

export function Drawer({ open, onOpenChange, children, ...props }) {
  return (
    <DrawerPrimitives.Root open={open} onOpenChange={onOpenChange} {...props}>
      {children}
    </DrawerPrimitives.Root>
  )
}

export const DrawerContent = React.forwardRef(function DrawerContent(
  { className, children, ...props },
  ref
) {
  return (
    <DrawerPrimitives.Portal>
      <DrawerPrimitives.Overlay className="fixed inset-0 bg-black/30" />
      <DrawerPrimitives.Content
        ref={ref}
        className={cx(
          // Importante: convertimos en flex-col para que Header, Body y Footer
          // se dispongan en columna y el Footer quede al final.
          "fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-lg flex flex-col",
          className
        )}
        {...props}
      >
        {children}
      </DrawerPrimitives.Content>
    </DrawerPrimitives.Portal>
  )
})

export const DrawerHeader = ({ children, className, ...props }) => (
  <div className={cx("p-4 border-b", className)} {...props}>
    {children}
  </div>
)

export const DrawerTitle = DrawerPrimitives.Title
export const DrawerDescription = DrawerPrimitives.Description

// El Body se queda con flex-1 para “empujar” el Footer abajo
export const DrawerBody = ({ children, className, ...props }) => (
  <div className={cx("p-4 flex-1 overflow-auto", className)} {...props}>
    {children}
  </div>
)

export const DrawerFooter = ({ children, className, ...props }) => (
  <div className={cx("p-4 border-t flex justify-end gap-2", className)} {...props}>
    {children}
  </div>
)

export const DrawerClose = DrawerPrimitives.Close
