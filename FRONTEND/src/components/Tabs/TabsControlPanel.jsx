import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CreateBranch from '../../pages/RegisterAreas/components/CreateBranch';
import ImportBranch from '../../pages/RegisterAreas/components/ImportBranch';
import GeneralStatistics from '../../pages/ControlPanel/GeneralStatistics/GeneralStatistics';
import TabsIcon from './TabsIcon';
import '../../pages/RegisterAreas/RegisterAreas.css';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
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
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function RegisterAreas() {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', width: '100%' }}>
            <AppBar
                position="static"
                sx={{
                    bgcolor: 'white',
                    boxShadow: 'none',
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="Registro de Áreas"
                    sx={{
                        backgroundColor: 'white',
                        
                    }}
                >
                    <Tab label="ESTADISTICA GENERAL" {...a11yProps(0)} />
                    <Tab label="GESTIÓN DE REPORTE" {...a11yProps(1)} />
                    <Tab label="GESTIÓN FISCAL" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0} dir={theme.direction}>
                <GeneralStatistics />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
                GESTIÓN DE REPORTE
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
                GESTIÓN FISCAL
            </TabPanel>
        </Box>
    );
}
