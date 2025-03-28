import React from 'react';
import TabsIconRP from '../../components/Tabs/TabsIconRP';

const RolesPermissions = () => {
    return (
        <div className="flex flex-col h-full w-full items-start p-5 gap-4 font-teko">
            <h1 className="text-2xl font-medium">
                ROLES Y PERMISOS
            </h1>
            <div className="flex flex-col h-full w-full">
                <TabsIconRP />
            </div>
        </div>
    );
};

export default RolesPermissions;
