import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import PropTypes from 'prop-types';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

const StatisticalFunctions = ({ reports = [], navigate = null, workloadData = [], dependencyId }) => {
  const { setWorkloadData, setDependencyId } = useAuth();  // Traemos dependencyId desde el contexto

  console.log('Datos de workload:', workloadData); // Verifica los datos

  const handleExploreClick = (title, workloadForDependency, dependencyId) => {
    if (title === 'CARGA LABORAL' && typeof navigate === 'function') {
      if (!workloadForDependency) {
        console.error('No hay datos disponibles para esta dependencia.');
        return;
      }
      setWorkloadData(workloadForDependency); // Guarda los datos específicos de la dependencia
      navigate('/workload'); // Navega a la ruta de carga laboral
    } 
    // Nueva lógica para 'DELITOS CON MAYOR INCIDENCIA'
    if (title === 'DELITOS CON MAYOR INCIDENCIA' && typeof navigate === 'function') {
      if (!workloadForDependency) {
        console.error('No hay datos disponibles para esta dependencia en "DELITOS CON MAYOR INCIDENCIA".');
        return;
      } // Guarda los datos específicos de la dependencia
      setDependencyId(dependencyId);  // Establecemos el dependencyId en el contexto
      navigate('/crimeshighestincidence'); // Navega a la nueva ruta con dependencyId
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {reports.map((report, index) => (
        <div key={index} className="flex flex-row gap-2 items-center">
          {/* Ícono del reporte */}
          <div className="flex w-[35px] h-[35px] bg-[#fff] rounded items-center justify-center">
            <DescriptionRoundedIcon style={{ color: '#152B52' }} />
          </div>
          {/* Contenido del reporte */}
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col items-start">
              <div className="font-semibold text-xs text-start">{report.title}</div>
              <div className="font-medium text-[8px] text-gray-600 text-start">
                Cantidad documentos: <span className="text-black">{report.value}</span>
              </div>
            </div>
            <div className="flex items-center">
              {/* Agregamos el botón de "Explorar" también para 'DELITOS CON MAYOR INCIDENCIA' */}
              {(report.title === 'CARGA LABORAL' || report.title === 'DELITOS CON MAYOR INCIDENCIA') && (
                <button
                  className="text-xs font-semibold text-[#152B52] hover:underline"
                  onClick={() => handleExploreClick(report.title, workloadData[0], dependencyId)}
                >
                  Explorar
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

StatisticalFunctions.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  navigate: PropTypes.func,
  workloadData: PropTypes.array.isRequired, // Cambié a array porque estamos acumulando datos
};

export default StatisticalFunctions;
