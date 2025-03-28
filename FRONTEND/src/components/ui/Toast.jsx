// Toast.jsx

import React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";

import { cx } from "../../lib/utils";
import { IconLoader } from '@tabler/icons-react';
import { IconAlertCircle } from '@tabler/icons-react';
import { IconCircleCheck } from '@tabler/icons-react';
import { IconInfoCircle } from '@tabler/icons-react'
import { IconCircleX } from '@tabler/icons-react'
/**
 * Proveedor de Toasts (usa @radix-ui/react-toast).
 * Envuelve la aplicación para que los toasts puedan mostrarse.
 */
export const ToastProvider = ToastPrimitives.Provider;
ToastProvider.displayName = "ToastProvider";

/**
 * Viewport (contenedor) donde se muestran los toasts en la pantalla.
 */
export const ToastViewport = React.forwardRef(function ToastViewport(
  { className, ...props },
  forwardedRef
) {
  return (
    <ToastPrimitives.Viewport
      ref={forwardedRef}
      className={cx(
        "fixed right-0 top-0 z-[9999] m-0 flex w-full max-w-[100vw] list-none flex-col gap-2 p-[var(--viewport-padding)] [--viewport-padding:_15px] sm:max-w-md sm:gap-4",
        className
      )}
      {...props}
    />
  );
});
ToastViewport.displayName = "ToastViewport";

/**
 * @typedef {Object} ActionProps
 * @property {string} label - Texto del botón de acción
 * @property {string} altText - Texto alternativo para accesibilidad
 * @property {() => void | Promise<void>} onClick - Función que se ejecuta al hacer clic
 */

/**
 * @typedef {Object} ToastProps
 * @property {"info" | "success" | "warning" | "error" | "loading"} [variant] - Tipo de toast
 * @property {string} [title] - Título del toast
 * @property {string} [description] - Descripción o contenido adicional
 * @property {ActionProps} [action] - Acción opcional
 * @property {boolean} [disableDismiss] - Si se desactiva el botón de cierre
 * @property {boolean} [open] - Controla si el toast está abierto o cerrado
 * @property {(open: boolean) => void} [onOpenChange] - Callback cuando cambia el estado abierto
 */

/**
 * Componente Toast individual, forzando tema claro (fondo blanco).
 * Usa @radix-ui/react-toast para la lógica de mostrar/ocultar.
 */
export const Toast = React.forwardRef(function Toast(
  {
    className,
    variant = "info",
    title,
    description,
    action,
    disableDismiss = false,
    ...props
  },
  forwardedRef
) {
  let Icon = null;

  switch (variant) {
    case "success":
      Icon = (
        <IconCircleCheck
          className="size-5 shrink-0 text-emerald-600"
          aria-hidden="true"
        />
      );
      break;
    case "warning":
      Icon = (
        <IconAlertCircle
          className="size-5 shrink-0 text-amber-500"
          aria-hidden="true"
        />
      );
      break;
    case "error":
      Icon = (
        <IconCircleX
          className="size-5 shrink-0 text-red-600"
          aria-hidden="true"
        />
      );
      break;
    case "loading":
      Icon = (
        <IconLoader
          className="size-5 shrink-0 animate-spin text-gray-600"
          aria-hidden="true"
        />
      );
      break;
    default:
      Icon = (
        <IconInfoCircle
          className="size-5 shrink-0 text-blue-500"
          aria-hidden="true"
        />
      );
      break;
  }

  return (
    <ToastPrimitives.Root
      ref={forwardedRef}
      className={cx(
        // Base
        "flex h-fit min-h-16 w-full overflow-hidden rounded-md border shadow-lg shadow-black/5",
        // Fondo siempre blanco
        "bg-white",
        // Borde color
        "border-gray-200",
        // Animaciones
        "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
        "data-[state=open]:animate-slideLeftAndFade",
        "data-[state=closed]:animate-hide",
        className
      )}
      {...props}
    >
      <div
        className={cx(
          "flex flex-1 items-start gap-3 p-4",
          (!disableDismiss || action) && "border-r border-gray-200"
        )}
      >
        {Icon}
        <div className="flex flex-col gap-1">
          {title && (
            <ToastPrimitives.Title className="text-sm font-semibold text-gray-900">
              {title}
            </ToastPrimitives.Title>
          )}
          {description && (
            <ToastPrimitives.Description className="text-sm text-gray-600">
              {description}
            </ToastPrimitives.Description>
          )}
        </div>
      </div>

      {/* Sección de acción y botón de cierre */}
      <div className="flex flex-col">
        {action && (
          <>
            <ToastPrimitives.Action
              altText={action.altText}
              className={cx(
                "flex flex-1 items-center justify-center px-6 text-sm font-semibold transition-colors",
                "hover:bg-gray-50",
                "text-gray-800",
                "active:bg-gray-100",
                variant === "error" && "text-red-600"
              )}
              onClick={(event) => {
                event.preventDefault();
                action.onClick();
              }}
              type="button"
            >
              {action.label}
            </ToastPrimitives.Action>
            <div className="h-px w-full bg-gray-200" />
          </>
        )}
        {!disableDismiss && (
          <ToastPrimitives.Close
            className={cx(
              "flex flex-1 items-center justify-center px-6 text-sm transition-colors",
              "text-gray-600",
              "hover:bg-gray-50",
              "active:bg-gray-100",
              action ? "h-1/2" : "h-full"
            )}
            aria-label="Close"
          >
            Close
          </ToastPrimitives.Close>
        )}
      </div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = "Toast";