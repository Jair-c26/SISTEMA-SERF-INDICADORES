<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Verificación</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
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
            background-color: #1d3e82;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .header img {
            max-width: 250px;
            margin: 20px 0;
        }
        .header h1 {
            margin: 10px 0;
            font-size: 22px;
        }
        .content {
            padding: 20px;
            text-align: left;
        }
        .content h2 {
            font-size: 18px;
            color: #1d3e82;
        }
        .content p {
            font-size: 16px;
            color: #666666;
            line-height: 1.5;
        }
        .code-box {
            display: block;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #1d3e82;
            padding: 15px;
            border: 2px dashed #1d3e82;
            margin: 20px auto;
            width: fit-content;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            font-size: 14px;
            color: #545454;
        }
        .footer p {
            margin: 5px 0;
        }
        i{
            color: #9f1010;
            
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Ministerio Público - Fiscalía de la Nación</h1>
            <h2>Madre de Dios, Perú</h2>
        </div>
        <div class="content">
            <h2>Estimado(a) {{ $nombre }},</h2>
            <p>Correo registrado: <strong>{{ $email }}</strong></p>
            <p>Siendo las {{ now()->format('H:i:s')??'00:00' }}, se ha solicitado un código de <strong><i>Eliminación</i></strong> de su cuenta. Use el siguiente código para confirmar su petición:</p>
            <div class="code-box">{{ $codigo }}</div>
            <p>Este código es válido por 10 minutos, <strong>¡no lo comparta con nadie!.</strong></p>
            <p>Si usted no solicitó este código, ignore este mensaje.</p>
            <p>Atentamente,<br>Área de Indicadores - Ministerio Público - Fiscalía de la Nación<br>Madre de Dios, Perú</p>
        </div>
        <div class="footer">
            <p>Teléfono: (51) --- | Correo: ---@fiscalia.gob.pe</p>
            <p>&copy; 2025 Ministerio Público - Fiscalía de la Nación, Madre de Dios.</p>
        </div>
    </div>
</body>
</html>
