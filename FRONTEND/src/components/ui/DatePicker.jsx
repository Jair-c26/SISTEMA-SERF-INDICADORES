// DatePicker.jsx (Tema blanco simplificado)
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import * as PopoverPrimitives from "@radix-ui/react-popover";

import { IconCalendarMonth } from '@tabler/icons-react'
import { Calendar } from "./Calendar"; // Ajusta la ruta a tu Calendar.jsx
import { Button } from "./Button";     // Ajusta la ruta a tu botón
import { cx } from "@/lib/utils";       // Ajusta o elimina según tu proyecto

////////////////////////////////////////////////////////////////////////////////
// Helper: formatear fecha sin horas
////////////////////////////////////////////////////////////////////////////////
function formatDate(date, locale) {
  return format(date, "dd MMM, yyyy", { locale });
}

////////////////////////////////////////////////////////////////////////////////
// Trigger para abrir el popover
////////////////////////////////////////////////////////////////////////////////
const Trigger = React.forwardRef(function Trigger(
  {
    className,
    children,
    placeholder = "Select date",
    disabled,
    hasError,
    ...props
  },
  forwardedRef
) {
  return (
    <PopoverPrimitives.Trigger asChild>
      <button
        ref={forwardedRef}
        type="button"
        className={cx(
          "peer flex w-full cursor-pointer appearance-none items-center gap-x-2 truncate rounded-md border px-3 py-2 shadow-sm outline-none transition-all sm:text-sm",
          "bg-white",          // tema blanco
          "border-gray-300",
          "text-gray-900",
          "hover:bg-gray-50",
          "disabled:pointer-events-none disabled:bg-gray-100 disabled:text-gray-400",
          "focus:ring-2 focus:ring-blue-200",
          hasError && "ring-2 ring-red-200 border-red-500",
          className
        )}
        disabled={disabled}
        {...props}
      >
        <IconCalendarMonth className="size-5 shrink-0 text-gray-800" />
        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-gray-900">
          {children || <span className="text-gray-400">{placeholder}</span>}
        </span>
      </button>
    </PopoverPrimitives.Trigger>
  );
});

////////////////////////////////////////////////////////////////////////////////
// Popover contenedor del calendario
////////////////////////////////////////////////////////////////////////////////
const CalendarPopover = React.forwardRef(function CalendarPopover(
  { align = "center", className, children, ...props },
  forwardedRef
) {
  return (
    <PopoverPrimitives.Portal>
      <PopoverPrimitives.Content
        ref={forwardedRef}
        sideOffset={10}
        side="bottom"
        align={align}
        avoidCollisions
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cx(
          "relative z-50 w-fit rounded-md border text-sm shadow-xl shadow-black/[2.5%]",
          "min-w-[calc(var(--radix-select-trigger-width)-2px)] max-w-[95vw]",
          "border-gray-200",
          "bg-white", // tema blanco
          "will-change-[transform,opacity]",
          "data-[state=closed]:animate-hide",
          "data-[state=open]:data-[side=bottom]:animate-slideDownAndFade data-[state=open]:data-[side=left]:animate-slideLeftAndFade data-[state=open]:data-[side=right]:animate-slideRightAndFade data-[state=open]:data-[side=top]:animate-slideUpAndFade",
          className
        )}
        {...props}
      >
        {children}
      </PopoverPrimitives.Content>
    </PopoverPrimitives.Portal>
  );
});

////////////////////////////////////////////////////////////////////////////////
// Implementación de SingleDatePicker
////////////////////////////////////////////////////////////////////////////////
function SingleDatePicker({
  defaultValue,
  value,
  onChange,
  presets,
  disabled,
  disabledDays,
  locale = enUS,
  placeholder = "Select date",
  hasError,
  align = "center",
  className,
  translations = {},
  ...props
}) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ?? defaultValue ?? null);
  const [month, setMonth] = useState(selectedDate);

  useEffect(() => {
    setSelectedDate(value ?? defaultValue ?? null);
  }, [value, defaultValue]);

  useEffect(() => {
    if (selectedDate) {
      setMonth(selectedDate);
    }
  }, [selectedDate]);

  const displayDate = useMemo(() => {
    if (!selectedDate) return null;
    return format(selectedDate, "dd MMM, yyyy", { locale });
  }, [selectedDate, locale]);

  const onApply = () => {
    setOpen(false);
    onChange?.(selectedDate);
  };

  const onCancel = () => {
    setOpen(false);
  };

  return (
    <PopoverPrimitives.Root open={open} onOpenChange={setOpen}>
      <Trigger
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        hasError={hasError}
      >
        {displayDate}
      </Trigger>
      <CalendarPopover align={align}>
        <div className="flex flex-col">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={month}
            onMonthChange={setMonth}
            numberOfMonths={1}
            disabled={disabledDays}
            locale={locale}
            initialFocus
            {...props}
          />
          <div className="border-t border-gray-200 p-3 flex items-center justify-end gap-x-2">
            <Button variant="secondary" type="button" onClick={onCancel}>
              {translations.cancel ?? "Cancel"}
            </Button>
            <Button variant="primary" type="button" onClick={onApply}>
              {translations.apply ?? "Apply"}
            </Button>
          </div>
        </div>
      </CalendarPopover>
    </PopoverPrimitives.Root>
  );
}

////////////////////////////////////////////////////////////////////////////////
// Implementación de RangeDatePicker (ya definida)
////////////////////////////////////////////////////////////////////////////////
function RangeDatePicker({
  defaultValue,
  value,
  onChange,
  presets,
  disabled,
  disabledDays,
  disableNavigation = false,
  enableYearNavigation = false,
  locale = enUS,
  placeholder = "Seleccione la fecha del reporte",
  hasError,
  translations = {},
  align = "center",
  className,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState(value ?? defaultValue ?? undefined);
  const [month, setMonth] = useState(range?.from);

  const initialRange = useMemo(() => range, [open]);

  useEffect(() => {
    setRange(value ?? defaultValue ?? undefined);
  }, [value, defaultValue]);

  useEffect(() => {
    if (range) {
      setMonth(range.from);
    }
  }, [range]);

  useEffect(() => {
    if (!open) {
      setMonth(range?.from);
    }
  }, [open, range]);

  const onCancel = () => {
    setRange(initialRange);
    setOpen(false);
  };

  const onOpenChange = (nextOpen) => {
    if (!nextOpen) {
      onCancel();
    }
    setOpen(nextOpen);
  };

  const onRangeChange = (selectedRange) => {
    setRange(selectedRange);
  };

  const displayRange = useMemo(() => {
    if (!range) return null;
    const fromString = range.from ? formatDate(range.from, locale) : "";
    const toString = range.to ? formatDate(range.to, locale) : "";
    return `${fromString} - ${toString}`;
  }, [range, locale]);

  const onApply = () => {
    setOpen(false);
    onChange?.(range);
  };

  return (
    <PopoverPrimitives.Root open={open} onOpenChange={onOpenChange}>
      <Trigger
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        hasError={hasError}
      >
        {displayRange}
      </Trigger>

      <CalendarPopover align={align}>
        <div className="flex">
          <div className="flex flex-col overflow-x-auto sm:flex-row sm:items-start">
            {presets?.length > 0 && (
              <div className="relative flex h-16 w-full items-center sm:h-full sm:w-40 border-b border-gray-200 sm:border-b-0 sm:border-r overflow-auto">
                <div className="absolute px-3 sm:inset-0 sm:left-0 sm:p-2">
                  {/* Tu lógica de presets */}
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <Calendar
                mode="range"
                selected={range}
                onSelect={onRangeChange}
                month={month}
                onMonthChange={setMonth}
                numberOfMonths={2}
                disabled={disabledDays}
                disableNavigation={disableNavigation}
                enableYearNavigation={enableYearNavigation}
                locale={locale}
                initialFocus
                classNames={{
                  months: "flex flex-row divide-x divide-gray-200 overflow-x-auto",
                }}
                {...props}
              />
              <div className="border-t border-gray-200 p-3 sm:flex sm:items-center sm:justify-between">
                <p className="tabular-nums text-gray-900">
                  <span className="text-gray-700">
                    {translations.range ?? "Range"}:
                  </span>{" "}
                  <span className="font-medium">{displayRange}</span>
                </p>
                <div className="mt-2 flex items-center gap-x-2 sm:mt-0">
                  <Button variant="secondary" className="h-8 w-full sm:w-fit" type="button" onClick={onCancel}>
                    {translations.cancel ?? "Cancel"}
                  </Button>
                  <Button variant="primary" className="h-8 w-full sm:w-fit" type="button" onClick={onApply}>
                    {translations.apply ?? "Apply"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CalendarPopover>
    </PopoverPrimitives.Root>
  );
}

////////////////////////////////////////////////////////////////////////////////
// Exports: DatePicker y DateRangePicker
////////////////////////////////////////////////////////////////////////////////
export function DatePicker({ presets, ...props }) {
  return <SingleDatePicker presets={presets} {...props} />;
}

export function DateRangePicker({ presets, ...props }) {
  return <RangeDatePicker presets={presets} {...props} />;
}
