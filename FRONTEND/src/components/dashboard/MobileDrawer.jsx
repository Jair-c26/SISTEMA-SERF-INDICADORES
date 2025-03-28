// components/dashboard/MobileDrawer.jsx
import * as DrawerPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export function Drawer({ children }) {
  return (
    <DrawerPrimitive.Root>
      <DrawerPrimitive.Portal>
        {children}
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  )
}

export function DrawerContent({ children }) {
  return (
    <DrawerPrimitive.Content className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl p-4">
      <div className="flex justify-end mb-4">
        <DrawerPrimitive.Close>
          <X className="w-6 h-6 text-gray-500" />
        </DrawerPrimitive.Close>
      </div>
      {children}
    </DrawerPrimitive.Content>
  )
}