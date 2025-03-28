// Calendar.jsx (Tema blanco)

// IMPORTANTE: Ajusta las rutas de imports (lib/utils, etc.) a tu estructura real
import React from "react";
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import { addYears, format } from "date-fns";
import {
  DayPicker,
  useDayPicker,
  useDayRender,
  useNavigation,
} from "react-day-picker";

import { cx, focusRing } from "../../lib/utils";

// ----------------------------------------------------
// Botón de navegación (flechas izq/der, año/mes)
// ----------------------------------------------------
const NavigationButton = React.forwardRef(function NavigationButton(
  { onClick, icon: Icon, disabled, ...props },
  forwardedRef
) {
  return (
    <button
      ref={forwardedRef}
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "flex size-8 shrink-0 select-none items-center justify-center rounded border p-1 outline-none transition sm:size-[30px]",
        // Texto / color principal
        "text-gray-600 hover:text-gray-800",
        // Borde y fondo (tema blanco)
        "border-gray-300",
        "hover:bg-gray-50 active:bg-gray-100",
        // Deshabilitado
        "disabled:pointer-events-none disabled:border-gray-200 disabled:text-gray-400",
        // Focus ring
        focusRing
      )}
      {...props}
    >
      <Icon className="size-full shrink-0" />
    </button>
  );
});

// ----------------------------------------------------
// Calendar (tema claro)
// ----------------------------------------------------
export function Calendar({
  mode = "single",
  weekStartsOn = 1,
  numberOfMonths = 1,
  enableYearNavigation = false,
  disableNavigation,
  locale,
  className,
  classNames,
  ...props
}) {
  return (
    <DayPicker
      mode={mode}
      weekStartsOn={weekStartsOn}
      numberOfMonths={numberOfMonths}
      locale={locale}
      // Si deseas mostrar días fuera del mes incluso en multi mes, elimina la siguiente condición:
      showOutsideDays={numberOfMonths === 1}
      className={cx(className)}
      classNames={{
        months: "flex space-y-0",
        month: "space-y-4 p-3",
        nav: "gap-1 flex items-center rounded-full size-full justify-between p-4",
        table: "w-full border-collapse space-y-1",
        head_cell:
          "w-9 font-medium text-sm sm:text-xs text-center text-gray-400 pb-2",
        row: "w-full mt-0.5",
        cell: cx(
          "relative p-0 text-center focus-within:relative",
          "text-gray-900" // Texto principal
        ),
        day: cx(
          "size-9 rounded text-sm focus:z-10",
          "text-gray-900",
          "hover:bg-gray-200",
          focusRing
        ),
        day_today: "font-semibold",
        day_selected:
          "rounded aria-selected:bg-blue-500 aria-selected:text-white",
        day_disabled:
          "!text-gray-300 line-through disabled:hover:bg-transparent",
        day_outside: "text-gray-400",
        day_range_middle:
          "!rounded-none aria-selected:!bg-gray-100 aria-selected:!text-gray-900",
        day_range_start: "rounded-r-none !rounded-l",
        day_range_end: "rounded-l-none !rounded-r",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => (
          <RiArrowLeftSLine aria-hidden="true" className="size-4" />
        ),
        IconRight: () => (
          <RiArrowRightSLine aria-hidden="true" className="size-4" />
        ),

        // Sobrescribimos la "Caption" para personalizar la navegación
        Caption: (captionProps) => {
          const { goToMonth, nextMonth, previousMonth, currentMonth } =
            useNavigation();
          const { fromDate, toDate } = useDayPicker();
          const displayMonth = captionProps.displayMonth;

          // Funciones para avanzar / retroceder años
          const goToPreviousYear = () => {
            const targetMonth = addYears(currentMonth, -1);
            if (
              previousMonth &&
              (!fromDate || targetMonth.getTime() >= fromDate.getTime())
            ) {
              goToMonth(targetMonth);
            }
          };

          const goToNextYear = () => {
            const targetMonth = addYears(currentMonth, 1);
            if (!nextMonth) return;
            if (!toDate || targetMonth.getTime() <= toDate.getTime()) {
              goToMonth(targetMonth);
            }
          };

          return (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {/* Botón año atrás */}
                {enableYearNavigation && (
                  <NavigationButton
                    disabled={
                      disableNavigation ||
                      !previousMonth ||
                      (fromDate &&
                        addYears(currentMonth, -1).getTime() < fromDate.getTime())
                    }
                    aria-label="Go to previous year"
                    onClick={goToPreviousYear}
                    icon={RiArrowLeftDoubleLine}
                  />
                )}
                {/* Botón mes atrás */}
                <NavigationButton
                  disabled={disableNavigation || !previousMonth}
                  aria-label="Go to previous month"
                  onClick={() => previousMonth && goToMonth(previousMonth)}
                  icon={RiArrowLeftSLine}
                />
              </div>

              <div
                role="presentation"
                aria-live="polite"
                className="text-sm font-medium capitalize tabular-nums text-gray-900"
              >
                {format(displayMonth, "LLLL yyy", { locale })}
              </div>

              <div className="flex items-center gap-1">
                {/* Botón mes adelante */}
                <NavigationButton
                  disabled={disableNavigation || !nextMonth}
                  aria-label="Go to next month"
                  onClick={() => nextMonth && goToMonth(nextMonth)}
                  icon={RiArrowRightSLine}
                />
                {/* Botón año adelante */}
                {enableYearNavigation && (
                  <NavigationButton
                    disabled={
                      disableNavigation ||
                      !nextMonth ||
                      (toDate &&
                        addYears(currentMonth, 1).getTime() > toDate.getTime())
                    }
                    aria-label="Go to next year"
                    onClick={goToNextYear}
                    icon={RiArrowRightDoubleLine}
                  />
                )}
              </div>
            </div>
          );
        },

        // Sobrescribimos la lógica de Day
        Day: (dayProps) => {
          const buttonRef = React.useRef(null);
          const { activeModifiers, buttonProps, divProps, isButton, isHidden } =
            useDayRender(dayProps.date, dayProps.displayMonth, buttonRef);

          const { selected, today, disabled, range_middle } = activeModifiers;

          if (isHidden) return null;

          // No es un botón
          if (!isButton) {
            return (
              <div
                {...divProps}
                className={cx("flex items-center justify-center", divProps.className)}
              />
            );
          }

          // Sí es un botón
          const { children, className: buttonClassName, ...rest } = buttonProps;

          return (
            <button
              ref={buttonRef}
              type="button"
              className={cx("relative", buttonClassName)}
              {...rest}
            >
              {children}
              {/* Indicador para 'today' */}
              {today && (
                <span
                  className={cx(
                    "absolute inset-x-1/2 bottom-1.5 h-0.5 w-4 -translate-x-1/2 rounded-[2px]",
                    {
                      "bg-blue-500": !selected,
                      "!bg-white": selected,
                      "!bg-gray-400": selected && range_middle,
                      "bg-gray-400 text-gray-400": disabled,
                    }
                  )}
                />
              )}
            </button>
          );
        },
      }}
      {...props}
    />
  );
}
