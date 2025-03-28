import React from 'react';
import OptionListCard from '../../../../components/OptionListCard/OptionListCard';
import DetailedOptionsList from './DetailedOptionsList';
import sedeSVG from '../../../../assets/icons/sede.svg';
import Box from '@mui/material/Box';

const DetailedInformation = () => {
  // Datos para las tres tarjetas
  const cardData = [
    {
      icon: sedeSVG,
      primaryText: "SELECCIONE SEDE",
      secondaryText: "VISTA GENERAL",
      checkboxItems: [
        { text: "First Item", value: 1 },
        { text: "Second Item", value: 2 },
        { text: "Third Item", value: 3 },
      ],
      necessaryValue: "11",
    },
    {
      icon: sedeSVG,
      primaryText: "SELECCIONE DEPARTAMENTO",
      secondaryText: "VISTA GENERAL",
      checkboxItems: [
        { text: "Option A", value: 1 },
        { text: "Option B", value: 2 },
      ],
      necessaryValue: "5",
    },
    {
      icon: sedeSVG,
      primaryText: "SELECCIONE DESPACHO",
      secondaryText: "VISTA GENERAL",
      checkboxItems: [
        { text: "Option X", value: 1 },
        { text: "Option Y", value: 2 },
      ],
      necessaryValue: "3",
    }
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2, // Espaciado entre las tarjetas
        width: '100%',
      }}
    >
      {/* Mapear los datos y generar las tarjetas de forma dinámica */}
      {cardData.map((data, index) => (
        <DetailedOptionsList
          key={index}
          icon={data.icon}
          primaryText={data.primaryText}
          secondaryText={data.secondaryText}
          checkboxItems={data.checkboxItems}
          necessaryValue={data.necessaryValue}
        />
      ))}
    </Box>
  );
};

export default DetailedInformation;
