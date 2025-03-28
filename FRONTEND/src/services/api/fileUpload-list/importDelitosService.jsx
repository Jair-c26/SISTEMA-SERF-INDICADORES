// importDelitosService.jsx
import apiImportDelitos from "./apiImportDelitos.jsx";

const importDelitosService = {
    /**
     * Sube el archivo al endpoint /import-delitos
     * @param {File} file - El archivo a subir
     * @returns {Object} La respuesta (data) del servidor
     */
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append("file", file); // Asegura que el campo coincida con el backend

        console.log([...formData.entries()]); // Debug: muestra qué se está enviando

        // POST a la baseURL configurada en apiImportDelitos (que apunta a /import-delitos)
        const response = await apiImportDelitos.post("", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // Retorna la data parseada del servidor
        return response.data;
    },
};

export default importDelitosService;
