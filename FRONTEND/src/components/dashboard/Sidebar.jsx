// Sidebar.jsx (Basado en "shadcn's sidebar component")
"use client";

import React, { createContext, useContext, useMemo, useCallback, useState, forwardRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "./Drawer";
import { useIsMobile } from "@/lib/useMobile";
import { cx, focusRing } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { RiCloseLine } from "@remixicon/react";
import { PanelLeft } from "lucide-react";
import { IconLayoutSidebarRight } from '@tabler/icons-react'
import { Button } from "./Button";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";

const SidebarContext = createContext(null);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export const SidebarProvider = forwardRef(function SidebarProvider(
  {
    defaultOpen = true,
    open: openProp,
    onOpenChange,
    className,
    style,
    children,
    ...props
  },
  ref
) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;

  const setOpen = useCallback(
    (value) => {
      const nextValue = typeof value === "function" ? value(open) : value;
      if (onOpenChange) {
        onOpenChange(nextValue);
      } else {
        setInternalOpen(nextValue);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${nextValue}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [onOpenChange, open]
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
    } else {
      setOpen((prev) => !prev);
    }
  }, [isMobile, setOpen]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        ref={ref}
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          ...style,
        }}
        className={cx("flex min-h-screen w-full", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
});

export const Sidebar = forwardRef(function Sidebar({ className, children, ...props }, ref) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Drawer open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <DrawerContent className="bg-gray-50 p-0 text-gray-900">
          <VisuallyHidden.Root>
            <DrawerTitle>Sidebar</DrawerTitle>
          </VisuallyHidden.Root>
          <div className="relative flex h-full w-full flex-col">
            <DrawerClose className="absolute right-4 top-4" asChild>
              <Button variant="ghost" className="!p-2 text-gray-700 hover:text-gray-900">
                <RiCloseLine className="size-5 shrink-0" aria-hidden="true" />
              </Button>
            </DrawerClose>
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div
      ref={ref}
      className="group peer hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? true : false}
    >
      {/* Controla el espacio lateral */}
      <div
        className={cx(
          "relative h-screen w-[--sidebar-width] bg-transparent",
          "transition-[width] duration-150 ease-in-out will-change-transform",
          "group-data-[collapsible=true]:w-0"
        )}
      />
      <div
        className={cx(
          "fixed inset-y-0 z-10 hidden h-screen w-[--sidebar-width] md:flex",
          "transition-[left,right,width] duration-150 ease-in-out will-change-transform",
          "left-0 group-data-[collapsible=true]:left-[calc(var(--sidebar-width)*-1)]",
          "border-r border-gray-200 bg-gray-50",
          className
        )}
        {...props}
      >
        <div data-sidebar="sidebar" className="flex h-full w-full flex-col">
          {children}
        </div>
      </div>
    </div>
  );
});

export const SidebarTrigger = forwardRef(function SidebarTrigger(
  { className, onClick, ...props },
  ref
) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar="trigger"
      className={cx(
        "group inline-flex rounded-md p-1.5 hover:bg-gray-200/50",
        focusRing,
        className
      )}
      onClick={(event) => {
        if (onClick) onClick(event);
        toggleSidebar();
      }}
      {...props}
    >
      <IconLayoutSidebarRight className="size-[18px] shrink-0 text-gray-700" aria-hidden="true" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
});

export const SidebarFooter = forwardRef(function SidebarFooter({ className, ...props }, ref) {
  return <div ref={ref} data-sidebar="footer" className={cx("flex flex-col gap-2 p-3", className)} {...props} />;
});

export const SidebarContent = forwardRef(function SidebarContent({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cx("flex min-h-0 flex-1 flex-col gap-2 overflow-auto", className)}
      {...props}
    />
  );
});

export const SidebarHeader = forwardRef(function SidebarHeader({ className, ...props }, ref) {
  return <div ref={ref} data-sidebar="header" className={cx("flex flex-col gap-2 p-2", className)} {...props} />;
});

export const SidebarLink = forwardRef(function SidebarLink(
  { children, isActive, icon: Icon, notifications, className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
      className={cx(
        "flex items-center justify-between rounded-md p-2 text-base transition hover:bg-gray-200/50 sm:text-sm",
        "text-gray-900 hover:dark:text-gray-50",
        "data-[active=true]:text-blue-600",
        focusRing,
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-x-2.5">
        {Icon && <Icon className="size-[18px] shrink-0" aria-hidden="true" />}
        {children}
      </span>
      {notifications && (
        <span className="inline-flex size-5 items-center justify-center rounded bg-blue-100 text-sm font-medium text-blue-600 sm:text-xs dark:bg-blue-500/10 dark:text-blue-500">
          {notifications}
        </span>
      )}
    </div>
  );
});

export const SidebarGroup = forwardRef(function SidebarGroup({ className, ...props }, ref) {
  return <div ref={ref} data-sidebar="group" className={cx("relative flex w-full min-w-0 flex-col px-3", className)} {...props} />;
});

export const SidebarGroupContent = forwardRef(function SidebarGroupContent({ className, ...props }, ref) {
  return <div ref={ref} data-sidebar="group-content" className={cx("w-full text-sm", className)} {...props} />;
});

export const SidebarMenu = forwardRef(function SidebarMenu({ className, ...props }, ref) {
  return <ul ref={ref} data-sidebar="menu" className={cx("flex w-full min-w-0 flex-col gap-1", className)} {...props} />;
});

export const SidebarMenuItem = forwardRef(function SidebarMenuItem(props, ref) {
  return <li ref={ref} {...props} />;
});

export const SidebarSubLink = forwardRef(function SidebarSubLink(
  { isActive, children, className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
      className={cx(
        "relative flex gap-2 rounded-md py-1.5 pl-9 pr-3 text-base transition sm:text-sm",
        "text-gray-700 hover:text-gray-900",
        "data-[active=true]:bg-white data-[active=true]:text-blue-600 data-[active=true]:shadow data-[active=true]:ring-1 data-[active=true]:ring-gray-200",
        focusRing,
        className
      )}
      {...props}
    >
      {isActive && (
        <div
          className="absolute left-4 top-1/2 h-5 w-px -translate-y-1/2 bg-blue-500"
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
});

export const SidebarMenuSub = forwardRef(function SidebarMenuSub({ className, ...props }, ref) {
  return <ul ref={ref} data-sidebar="menu-sub" className={cx("relative space-y-1 border-l border-transparent", className)} {...props} />;
});
