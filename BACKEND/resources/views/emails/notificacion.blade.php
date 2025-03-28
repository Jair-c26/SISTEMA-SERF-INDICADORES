<!DOCTYPE html>
<html>
<head>
    <title>Notificación</title>
</head>
<body>
    <h1>¡Hola, {{ $nombre }}!</h1>
    <p>Este es un ejemplo de correo enviado desde Laravel.</p>
    <p>Gracias,</p>
    <p>El equipo de {{ config('app.name') }}</p>
</body>
</html>
