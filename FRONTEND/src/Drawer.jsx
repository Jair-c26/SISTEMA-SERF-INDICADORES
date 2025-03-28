// components/Drawer.jsx
import * as DrawerPrimitives from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import React from "react"
import { Button } from "@tremor/react"

// Utility functions (deben estar definidas en tu proyecto)
const cx = (...classes) => classes.filter(Boolean).join(" ")
const focusRing = "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"

const Drawer = (props) => {
  return <DrawerPrimitives.Root {...props} />
}

const DrawerTrigger = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <DrawerPrimitives.Trigger
      ref={ref}
      className={cx(className)}
      {...props}
    />
  )
})

const DrawerClose = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <DrawerPrimitives.Close
      ref={ref}
      className={cx(className)}
      {...props}
    />
  )
})

const DrawerPortal = DrawerPrimitives.Portal

const DrawerOverlay = React.forwardRef(({ className, ...props }, forwardedRef) => {
  return (
    <DrawerPrimitives.Overlay
      ref={forwardedRef}
      className={cx(
        "fixed inset-0 z-50 overflow-y-auto",
        "bg-black/30",
        "data-[state=open]:animate-dialogOverlayShow data-[state=closed]:animate-hide",
        className
      )}
      style={{
        animationDuration: "400ms",
        animationFillMode: "backwards",
      }}
      {...props}
    />
  )
})

const DrawerContent = React.forwardRef(({ className, ...props }, forwardedRef) => {
  return (
    <DrawerPortal>
      <DrawerOverlay>
        <DrawerPrimitives.Content
          ref={forwardedRef}
          className={cx(
            "fixed inset-y-2 mx-auto flex w-[95vw] flex-1 flex-col overflow-y-auto rounded-md border p-4 shadow-lg focus:outline-none max-sm:inset-x-2 sm:inset-y-2 sm:right-2 sm:max-w-lg sm:p-6",
            "border-gray-200",
            "bg-white",
            "data-[state=closed]:animate-drawerSlideRightAndFade data-[state=open]:animate-drawerSlideLeftAndFade",
            focusRing,
            className
          )}
          {...props}
        />
      </DrawerOverlay>
    </DrawerPortal>
  )
})

const DrawerHeader = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="flex items-start justify-between gap-x-4 border-b border-gray-200 pb-4"
      {...props}
    >
      <div className={cx("mt-1 flex flex-col gap-y-1", className)}>
        {children}
      </div>
      <DrawerPrimitives.Close asChild>
        <Button
          variant="light"
          className="aspect-square p-1 hover:bg-gray-100"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </Button>
      </DrawerPrimitives.Close>
    </div>
  )
})

const DrawerTitle = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <DrawerPrimitives.Title
    ref={forwardedRef}
    className={cx(
      "text-base font-semibold",
      "text-gray-900",
      className
    )}
    {...props}
  />
))

const DrawerBody = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cx("flex-1 py-4", className)} {...props} />
})

const DrawerDescription = React.forwardRef(({ className, ...props }, forwardedRef) => {
  return (
    <DrawerPrimitives.Description
      ref={forwardedRef}
      className={cx("text-gray-500", className)}
      {...props}
    />
  )
})

const DrawerFooter = ({ className, ...props }) => {
  return (
    <div
      className={cx(
        "flex flex-col-reverse border-t border-gray-200 pt-4 sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
}