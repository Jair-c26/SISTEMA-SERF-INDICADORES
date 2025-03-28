import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs/Tabs';
import { TabNavigation, TabNavigationLink } from './components/TabNavigation/TabNavigation';

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Perfil' },
    { id: 'settings', label: 'Configuración' },
    { id: 'security', label: 'Seguridad' },
  ];

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      

      {/* Tabs Content */}
      <Tabs defaultValue="profile">
        {(activeTab, setActiveTab) => (
          <>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4">
              <TabsContent value="profile" activeTab={activeTab}>
                <div className="p-4 bg-white dark:bg-white rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Información del Perfil</h2>
                  <p>Contenido del perfil del usuario...</p>
                </div>
              </TabsContent>

              <TabsContent value="settings" activeTab={activeTab}>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Configuraciones</h2>
                  <p>Preferencias de configuración...</p>
                </div>
              </TabsContent>

              <TabsContent value="security" activeTab={activeTab}>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Seguridad</h2>
                  <p>Configuraciones de seguridad avanzada...</p>
                </div>
              </TabsContent>
            </div>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default UsersPage;