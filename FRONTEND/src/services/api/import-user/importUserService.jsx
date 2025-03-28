import apiImportUser from "./apiImportUser";

const importUserService = {
  importUsers: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    console.log([...formData.entries()]); // Verificar qué se está enviando

    try {
      const response = await apiImportUser.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });

      // Verificamos que la respuesta sea exitosa
      if (response.status !== 200) {
        // Podrías arrojar un error si esperas 200 siempre:
        throw new Error(
          `Error subiendo archivo. Status: ${response.status} - ${response.statusText}`
        );
      }

      // Retornamos la data para que FileUpload muestre el toast de éxito
      return response.data;
    } catch (error) {
      // Manejo de errores: arrojamos el mensaje, 
      // para que el bloque catch de FileUpload muestre el toast de error
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Error desconocido al subir el archivo."
      );
    }
  },
};

export default importUserService;
