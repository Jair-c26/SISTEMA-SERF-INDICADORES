import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2"; // Asegúrate de instalarlo con npm install sweetalert2
const apiIp = import.meta.env.VITE_API;
const RecoverPassword = ({ open, onClose }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false); // Estado para controlar el botón de carga.

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleRecoverPassword = async () => {
        if (!email) {
            Swal.fire({
                title: "Advertencia",
                text: "Por favor, ingrese un correo electrónico.",
                icon: "warning",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://${apiIp}/api/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                Swal.fire({
                    title: "Éxito",
                    text: "Se envió el enlace de recuperación a tu correo.",
                    icon: "success",
                });
                onClose();
            } else {
                const errorData = await response.json().catch(() => ({})); // Maneja si el servidor no responde con JSON
                Swal.fire({
                    title: "Error",
                    text: errorData?.message || "No se pudo enviar la solicitud. Intente nuevamente.",
                    icon: "error",
                });
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            Swal.fire({
                title: "Error",
                text: "Error de conexión con el servidor.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>¿Olvidó su contraseña?</DialogTitle>
            <DialogContent>
                <DialogContentText className="pb-2">
                    Por favor, ingrese su correo electrónico institucional para que podamos notificar al administrador y ayudarle a recuperar su acceso.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Correo electrónico"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={handleEmailChange}
                    disabled={loading} // Deshabilita el campo durante la carga.
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleRecoverPassword}
                    variant="contained"
                    color="primary"
                    disabled={loading} // Deshabilita el botón durante la carga.
                >
                    {loading ? "Enviando..." : "Enviar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RecoverPassword;
