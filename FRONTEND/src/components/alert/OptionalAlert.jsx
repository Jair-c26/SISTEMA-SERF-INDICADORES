import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const OptionalAlert = async ({ title, text, onConfirm }) => {
  try {
    const result = await MySwal.fire({
      title: title || "¿Estás seguro?",
      text: text || "¡No podrás revertir esto!",
      icon: "warning",
      draggable: true,
      showCancelButton: true,
      confirmButtonText: "¡Sí, confírmalo!",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      const loadingAlert = Swal.fire({
        title: "Procesando...",
        html: "Eliminando, por favor espera...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        await onConfirm(); // Ejecuta la eliminación
        loadingAlert.close();
        await MySwal.fire({
          title: "¡Eliminado!",
          text: "Se ha eliminado con éxito.",
          icon: "success",
        });
      } catch (error) {
        loadingAlert.close();
        console.error("Error en OptionalAlert:", error);

        const errorMessage = error.response?.data?.message || error.message || "Ocurrió un problema al intentar eliminar.";
        await MySwal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
        });
      }
    }
  } catch (error) {
    console.error("Error en OptionalAlert:", error);
  }
};

export default OptionalAlert;
