// importTipoDelitosService.jsx
import apiImportTipoDelitos from "./apiImportTipoDelitos.jsx";

const importTipoDelitosService = {
  /**
   * Sube el archivo al endpoint /import-tipo-delitos
   * @param {File} file - El archivo a subir
   * @param {string|number} id_dependencia - El identificador de la dependencia
   * @returns {Object} La respuesta (data) del servidor
   */
  uploadFile: async (file, id_dependencia) => {
    const formData = new FormData();
    formData.append("file", file); // Asegura que el campo coincida con el backend
    formData.append("id_dependencia", id_dependencia); // Se envía el identificador de la dependencia

    console.log([...formData.entries()]); // Debug: muestra qué se está enviando

    // POST a la baseURL configurada en apiImportTipoDelitos (que apunta a /import-tipo-delitos)
    const response = await apiImportTipoDelitos.post("", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Retorna la data parseada del servidor
    return response.data;
  },
};

export default importTipoDelitosService;
