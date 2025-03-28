<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña - Ministerio Público</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7faff;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow: hidden;
        }
        .header {
            background-color: #1c2331;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .header img {
            max-width: 70px;
        }
        .header h1 {
            margin: 10px 0 0 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content img {
            max-width: 250px;
            margin: 20px 0;
        }
        .content h2 {
            font-size: 20px;
            color: #333333;
        }
        .content p {
            font-size: 16px;
            color: #666666;
            line-height: 1.5;
        }
        .content p span {
            font-size: 16px;
            color: #2535aa;
            line-height: 1.5;
            font-weight: bold;
        }
        .content form {
            margin-top: 20px;
        }
        .content form input {
            display: block;
            width: calc(100% - 40px);
            margin: 10px auto;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
        }
        .content form button {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #2535aa;
            color: #ffffff;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .content form button:hover {
            background-color: #1c2331;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666666;
        }
        .footer a {
            color: #2535aa;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Ministerio Público - Fiscalía de la Nación</h1>
        </div>
        <div class="content">
            <img src="https://portal.mpfn.gob.pe/images/logo_nuevo.png" alt="Ministerio Público">
            <h2>RESTABLECER CONTRASEÑA</h2>
            <p>Hola, <strong>{{ $nombre }}</strong></p>
            <p>Siendo las <strong><i> {{ now()->format('H:i:s')??'00:00' }} </i></strong></p>
            <p>Su DNI registrado es: <span>{{ $dni }}</span></p>
            <p>Correo asociado: <span>{{ $gmail }}</span></p>
            <p>Por favor, ingrese su nueva contraseña y confírmela a continuación:</p>
            <a href="{{ $verificationUrl }}">Restablecer Contraseña</a>
        </div>
        <div class="footer">
            <p>Contáctenos: (+51) --- | ---@mpfn.gob.pe</p>
            <p><a href="#">Aviso de Privacidad</a> | <a href="#">Términos y Condiciones</a></p>
            <p>Este correo fue enviado desde el Ministerio Público - Fiscalía de la Nación. Si no solicitó este cambio, ignore este mensaje o contáctenos.</p>
        </div>
    </div>
</body>
</html>
