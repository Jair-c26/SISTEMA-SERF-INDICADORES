// src/components/ui/Input.jsx
import React from "react";
import { RiEyeFill, RiEyeOffFill, RiSearchLine } from "@remixicon/react";
import { tv } from "tailwind-variants";

// Ajusta la ruta a tu utilidades (sin TS)
import { cx, focusInput, focusRing, hasErrorInput } from "../../lib/utils";

// Definición de estilos con tailwind-variants
const inputStyles = tv({
    base: [
        "relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm",
        "border-white-300 dark:border-white-800",
        "text-gray-900 dark:text-gray-900", // Asegurar que el texto sea oscuro para contraste
        "placeholder-gray-400 dark:placeholder-gray-500",
        "bg-white dark:bg-white", // Forzar fondo blanco en modo claro y oscuro
        "disabled:border-white-300 disabled:bg-white disabled:text-gray-400",
        "disabled:dark:border-white-700 disabled:dark:bg-white disabled:dark:text-gray-500",
        [
            "file:-my-2 file:-ml-2.5 file:cursor-pointer file:rounded-l-[5px] file:rounded-r-none file:border-0 file:px-3 file:py-2 file:outline-none focus:outline-none disabled:pointer-events-none file:disabled:pointer-events-none",
            "file:border-solid file:border-gray-300 file:bg-white file:text-gray-500 file:hover:bg-gray-100 file:dark:border-gray-800 file:dark:bg-white file:hover:dark:bg-gray-200 file:disabled:dark:border-gray-700",
            "file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem]",
            "file:disabled:bg-white file:disabled:text-gray-500 file:disabled:dark:bg-white",
        ],
        focusInput,
        "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
    ],
    variants: {
        hasError: {
            true: hasErrorInput,
        },
        enableStepper: {
            false:
                "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        },
    },
    defaultVariants: {
        hasError: false,
        enableStepper: true,
    },
});

// --- Aquí definimos un named export "Input"
export const Input = React.forwardRef(function Input(
    {
        className,
        inputClassName,
        hasError = false,
        enableStepper = true,
        type,
        ...props
    },
    forwardedRef
) {
    const [typeState, setTypeState] = React.useState(type);

    const isPassword = type === "password";
    const isSearch = type === "search";

    return (
        <div className={cx("relative w-full", className)}>
            <input
                ref={forwardedRef}
                type={isPassword ? typeState : type}
                className={cx(
                    inputStyles({ hasError, enableStepper }),
                    {
                        "pl-8": isSearch,
                        "pr-10": isPassword,
                    },
                    inputClassName
                )}
                {...props}
            />
            {isSearch && (
                <div
                    className={cx(
                        "pointer-events-none absolute bottom-0 left-2 flex h-full items-center justify-center",
                        "text-gray-400 dark:text-gray-600"
                    )}
                >
                    <RiSearchLine className="size-[1.125rem] shrink-0" aria-hidden="true" />
                </div>
            )}
            {isPassword && (
                <div className="absolute bottom-0 right-0 flex h-full items-center justify-center px-3">
                    <button
                        aria-label="Change password visibility"
                        className={cx(
                            "h-fit w-fit rounded-sm outline-none transition-all",
                            "text-gray-400 dark:text-gray-600",
                            "hover:text-gray-500 hover:dark:text-gray-500",
                            focusRing
                        )}
                        type="button"
                        onClick={() =>
                            setTypeState(typeState === "password" ? "text" : "password")
                        }
                    >
                        <span className="sr-only">
                            {typeState === "password" ? "Show password" : "Hide password"}
                        </span>
                        {typeState === "password" ? (
                            <RiEyeFill aria-hidden="true" className="size-5 shrink-0" />
                        ) : (
                            <RiEyeOffFill aria-hidden="true" className="size-5 shrink-0" />
                        )}
                    </button>
                </div>
            )}
        </div>
    );
});

Input.displayName = "Input";
