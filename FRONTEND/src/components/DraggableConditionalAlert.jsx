import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const DraggableConditionalAlert = ({ title, text, icon, onConfirm, onCancel }) => {
    MySwal.fire({
        title: title || "Default Title",
        text: text || "Default Text",
        icon: icon || "info",
        draggable: true,
        showCancelButton: true,
        confirmButtonText: "Yes, confirm it!",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        didOpen: (modal) => {
            // Garantiza que el foco esté en el modal
            modal.focus();
        },
    }).then((result) => {
        if (result.isConfirmed) {
            if (onConfirm) onConfirm();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            if (onCancel) onCancel();
        }
    });
};

export default DraggableConditionalAlert;
