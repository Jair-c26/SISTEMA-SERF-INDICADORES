// reportService.jsx
import apiReport from './apiReport';

const reportService = {
    getReportByDate: async (id, month, year, uuid) => {
        const response = await apiReport.get(`/${id}/${month}/${year}/${uuid}`);
        return response.data; // Devolvemos la data con la URL del reporte PDF
    },

    getAllReports: async () => {
        const response = await apiReport.get('/');
        return response.data;
    },

    createReport: async (reportData) => {
        const response = await apiReport.post('/', reportData);
        return response.data;
    },

    updateReport: async (id, reportData) => {
        const response = await apiReport.put(`/${id}`, reportData);
        return response.data;
    },

    deleteReport: async (id) => {
        const response = await apiReport.delete(`/${id}`);
        return response.data;
    },
};

export default reportService;
