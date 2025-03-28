// utils.jsx (JavaScript, sin tipos TS)
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// Combina clases de Tailwind
export function cx(...args) {
  return twMerge(clsx(...args));
}

// Clases para focus en inputs
export const focusInput = [
  "focus:ring-2",
  "focus:ring-blue-200 focus:dark:ring-blue-700/30",
  "focus:border-blue-500 focus:dark:border-blue-700",
];

// Clases para focus en general
export const focusRing = [
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  "outline-blue-500 dark:outline-blue-500",
];

// Clases para inputs con error
export const hasErrorInput = [
  "ring-2",
  "border-red-500 dark:border-red-700",
  "ring-red-200 dark:ring-red-700/30",
];

// Formateadores para monedas, porcentajes, etc.
export const formatters = {
  currency: ({ number, maxFractionDigits = 2, currency = "USD" }) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: maxFractionDigits,
    }).format(number);
  },

  unit: (number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
    }).format(number);
  },

  percentage: ({ number, decimals = 1 }) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  },

  million: ({ number, decimals = 1 }) => {
    return `${new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number)}M`;
  },
};
