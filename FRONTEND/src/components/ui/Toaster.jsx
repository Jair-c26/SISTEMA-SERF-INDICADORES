// Toaster.jsx

import React from "react";
import { useToast } from '../../lib/useToast';
import { ToastProvider, ToastViewport, Toast } from "./Toast";

/**
 * Componente Toaster que se encarga de renderizar todos los toasts
 * que se hayan disparado con useToast().
 */
export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, ...props }) => (
        <Toast key={id} {...props} />
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
