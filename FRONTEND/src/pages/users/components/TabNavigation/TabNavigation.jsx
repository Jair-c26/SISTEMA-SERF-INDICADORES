export const TabNavigation = ({ children, activeTab, setActiveTab }) => (
    <nav className="flex space-x-4 border-b border-gray-200 dark:border-gray-800">
      {children.map((child, index) => (
        <child.type
          {...child.props}
          key={index}
          active={child.props.value === activeTab}
          setActiveTab={setActiveTab}
        />
      ))}
    </nav>
  );
  
  export const TabNavigationLink = ({ children, active, value, setActiveTab }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium ${
        active
          ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
      }`}
    >
      {children}
    </button>
  );