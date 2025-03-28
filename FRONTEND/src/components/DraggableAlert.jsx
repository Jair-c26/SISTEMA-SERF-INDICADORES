import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const DraggableAlert = ({ title, text, icon }) => {
    MySwal.fire({
        title: title || "Default Title",
        text: text || "Default Title",
        icon: icon || "info",
        draggable: true,
        didOpen: (modal) => {
            // Aseguramos que el foco esté en el modal
            modal.focus();
        },
    });
};

export default DraggableAlert;
