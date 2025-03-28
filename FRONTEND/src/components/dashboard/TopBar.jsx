// components/dashboard/TopBar.jsx
import { useSidebar } from './Sidebar';
import { Button } from '../../components/ui/Button';
import { PanelLeft, X } from 'lucide-react';

export default function TopBar() {
  const { isOpen, toggleSidebar } = useSidebar()
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center px-6 z-10">
      <Button
        icon={isOpen ? X : PanelLeft}
        onClick={toggleSidebar}
        variant="light"
        className="mr-4"
      />
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
    </header>
  )
}