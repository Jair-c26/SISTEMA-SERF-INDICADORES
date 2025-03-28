<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login con Google OAuth 2.0</title>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>

<body>
    <h2>Iniciar sesión con Google</h2>
    <div id="g_id_onload" data-client_id="205138303226-0ggbi5j6p6ch77t3emnds513s0bml7vo.apps.googleusercontent.com"
        data-context="signin" data-ux_mode="popup" data-callback="handleCredentialResponse" data-auto_prompt="false">
    </div>
    <div class="g_id_signin" data-type="standard"></div>

    <script>
        function handleCredentialResponse(response) {
            console.log("ID Token recibido: ", response.credential);
            // Enviar el token al backend para validación
            fetch("http://localhost:8000/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: response.credential })
            })
                .then(res => res.json())
                .then(data => console.log("Respuesta del backend:", data))
                .catch(error => console.error("Error:", error));
        }
    </script>
</body>

</html>