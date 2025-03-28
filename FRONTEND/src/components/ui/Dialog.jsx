import React from "react";
import * as DialogPrimitives from "@radix-ui/react-dialog";

import { cx, focusRing } from "@/lib/utils";

const Dialog = (props) => {
  return <DialogPrimitives.Root {...props} />;
};
Dialog.displayName = "Dialog";

const DialogTrigger = DialogPrimitives.Trigger;
DialogTrigger.displayName = "DialogTrigger";

const DialogClose = DialogPrimitives.Close;
DialogClose.displayName = "DialogClose";

const DialogPortal = DialogPrimitives.Portal;
DialogPortal.displayName = "DialogPortal";

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <DialogPrimitives.Overlay
      ref={ref}
      className={cx(
        "fixed inset-0 z-50 overflow-y-auto bg-black/70 data-[state=open]:animate-dialogOverlayShow",
        className
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay>
      <DialogPrimitives.Content
          ref={ref}
          className={cx(
            // Posiciona centrado
            "fixed left-1/2 top-1/2 z-50",
            // Tamaño máximo
            "w-[95vw] max-w-7xl max-h-[90vh]",
            // Centra en pantalla
            "-translate-x-1/2 -translate-y-1/2",
            // Fondo blanco, sin dark
            "overflow-y-auto rounded-md border p-6 shadow-lg bg-white text-gray-800",
            // Opcional: si usas 'border-gray-200' en light mode
            "border-gray-200",
            // Animación
            "data-[state=open]:animate-dialogContentShow",
            className
          )}
          {...props}
        />
      </DialogOverlay>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => {
  return <div className={cx("flex flex-col gap-y-1", className)} {...props} />;
};
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitives.Title
    ref={ref}
    className={cx("text-lg font-semibold text-gray-900 dark:text-gray-900", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <DialogPrimitives.Description
      ref={ref}
      className={cx("text-gray-500 dark:text-gray-500", className)}
      {...props}
    />
  );
});
DialogDescription.displayName = "DialogDescription";

const DialogFooter = ({ className, ...props }) => {
  return (
    <div className={cx(
        "flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 mt-4 sm:flex-row sm:justify-end sm:gap-3",
        className
      )}
      {...props} />
  );
};
DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
