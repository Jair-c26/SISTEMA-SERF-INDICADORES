// importCargaService.jsx
import apiImportCarga from "./apiImportCarga.jsx";

const importCargaService = {
  /**
   * Sube el archivo al endpoint /import-carga
   * @param {File} file - El archivo a subir
   * @param {string|number} id_id_dependencia - El identificador de la dependencia
   * @returns {Object} La respuesta (data) del servidor
   */
  uploadFile: async (file, id_id_dependencia) => {
    const formData = new FormData();
    formData.append("file", file); // Asegura que el campo coincida con el backend
    formData.append("id_id_dependencia", id_id_dependencia); // Agregamos el nuevo parámetro

    console.log([...formData.entries()]); // Debug: muestra qué se está enviando

    // POST a la baseURL configurada en apiImportCarga (que apunta a /import-carga)
    const response = await apiImportCarga.post("", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Retorna la data parseada del servidor
    return response.data;
  },
};

export default importCargaService;
