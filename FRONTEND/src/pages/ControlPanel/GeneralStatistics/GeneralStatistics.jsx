import React from 'react';
import DetailedInformation from '../Components/RouteSelection/DetailedInformation';
import StatisticalOptions from '../Components/StatisticalOptions/StatisticalOptions';
import functionSVG from '../../../assets/icons/function.svg';
const GeneralStatistics = () => {
  return (
    <div className='flex flex-col h-full w-full gap-3 p-5 bg-white'>
      <h1 className='text-lg text-start font-bold'>PANEL DE CONTROL</h1>
      <StatisticalOptions
        icon={functionSVG} // URL del icono o imagen
        primaryText="Estadísticas Generales"
        checkboxItems={[
          { text: "Opción 1", value: "opcion1" },
          { text: "Opción 2", value: "opcion2" },
          { text: "Opción 3", value: "opcion3" },
        ]}
      />
      <DetailedInformation />
    </div>
  );
};

export default GeneralStatistics;