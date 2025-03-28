import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const AlertError = async ({ error }) => {
    try {
        const result = await MySwal.fire({
            title: "Error detectado",
            text: error?.message || "Ha ocurrido un error",
            icon: "error", // Se utiliza el icono de error
            draggable: true,
            showCancelButton: false, // Solo se muestra un botón
            confirmButtonText: "Reiniciar ahora", // Texto del botón
            confirmButtonColor: "#3085d6",
        });

        if (result.isConfirmed) {
            // Funcionalidad que reinicia la página
            window.location.reload();
        }
    } catch (err) {
        console.error("Error en AlertError:", err);
    }
};

export default AlertError;
