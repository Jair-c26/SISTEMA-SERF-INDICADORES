import { useState } from 'react';

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className="w-full">
      {children(activeTab, setActiveTab)}
    </div>
  );
};

export const TabsList = ({ children }) => (
  <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
    {children}
  </div>
);

export const TabsTrigger = ({ value, children, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`px-4 py-2 text-sm font-medium ${
      activeTab === value
        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
    }`}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, children, activeTab }) => (
  <div className={`${activeTab === value ? 'block' : 'hidden'} mt-4`}>
    {children}
  </div>
);