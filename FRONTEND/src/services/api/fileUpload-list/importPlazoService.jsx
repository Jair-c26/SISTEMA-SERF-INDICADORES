// importPlazoService.jsx
import apiImportPlazo from "./apiImportPlazo.jsx";

const importPlazoService = {
    /**
     * Sube el archivo al endpoint /import-plazo
     * @param {File} file - El archivo a subir
     * @returns {Object} La respuesta (data) del servidor
     */
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append("file", file); // Asegura que el campo coincida con el backend

        console.log([...formData.entries()]); // Debug: muestra qué se está enviando

        // POST a la baseURL configurada en apiImportPlazo (que apunta a /import-plazo)
        const response = await apiImportPlazo.post("", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // Retorna la data parseada del servidor
        return response.data;
    },
};

export default importPlazoService;
