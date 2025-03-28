// ReporteEstadistico.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import WorkLoad from '../../../pages/StatisticalFunctions/WorkLoad/WorkLoad';

import CrimesHighestIncidence from '../../../pages/StatisticalFunctions/CrimesHighestIncidence/CrimesHighestIncidence';

export default function ReporteEstadistico() {
  const { state } = useLocation();
  const reportType = state?.reportType;

  return (
    <div>
      {reportType === 'workload' && <WorkLoad />}
      {reportType === 'crimes' && <CrimesHighestIncidence />}
    </div>
  );
}
