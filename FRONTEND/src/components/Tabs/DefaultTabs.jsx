import React, { useState } from "react";
import { AppBar, Box, Tabs, Tab } from "@mui/material";
import UserData from "../../pages/UserProfile/components/UserData.jsx";
import UserDispatch from "../../pages/UserProfile/components/UserDispatch";
import ResetUserPassord from "../../pages/UserProfile/components/ResetUserPassword";
import "../../assets/styles/TabPanel.css";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      {...other}
      style={{ display: value === index ? "block" : "none" }}
    >
      <Box sx={{ p: 3 }}>{children}</Box>
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function DefaultTabs({ profileData, isEditing }) {
  const [value, setValue] = useState(0);
  console.log("datos:", profileData);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", width: "100%" }}>
      <AppBar
        position="static"
        sx={{ bgcolor: "white", borderRadius: "30px", boxShadow: "none" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="Tabs Example"
          sx={{ backgroundColor: "white" }}
        >
          <Tab label="Datos" {...a11yProps(0)} />
          <Tab label="Despachos" {...a11yProps(1)} />
          <Tab label="Resetear contraseña" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <UserData profileData={profileData} isEditing={isEditing} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UserDispatch profileData={profileData} isEditing={isEditing} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ResetUserPassord isEditing={isEditing} />
      </TabPanel>
    </Box>
  );
}
