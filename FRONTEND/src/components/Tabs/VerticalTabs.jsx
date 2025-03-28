import * as React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import UserDataFields from '../../pages/UserManagement/CreateUser/components/UserDataFields';
import AdditionalData from '../../pages/UserManagement/CreateUser/AdditionalData/AdditionalData';
import RoleInformation from '../../pages/UserManagement/CreateUser/AdditionalData/RoleInformation';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      className={`flex flex-col ${value === index ? 'block' : 'hidden'}`}
    >
      {children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="flex w-full gap-4">
      <div className="flex flex-col w-1/5 border-r-2 border-gray-200">
        <div className="flex flex-col gap-4 text-base font-teko">
          <button
            className={`p-4 text-left ${value === 0 ? 'bg-gray-200' : ''}`}
            onClick={(event) => handleChange(event, 0)}
            {...a11yProps(0)}
          >
            REGISTRAR
          </button>
          <button
            className={`p-4 text-left ${value === 1 ? 'bg-gray-200' : ''}`}
            onClick={(event) => handleChange(event, 1)}
            {...a11yProps(1)}
          >
            DEPENDENCIAS
          </button>
          <button
            className={`p-4 text-left ${value === 2 ? 'bg-gray-200' : ''}`}
            onClick={(event) => handleChange(event, 2)}
            {...a11yProps(2)}
          >
            ROLES
          </button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <TabPanel value={value} index={0}>
          <UserDataFields />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AdditionalData />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <RoleInformation />
        </TabPanel>
      </div>
    </div>
  );
}
