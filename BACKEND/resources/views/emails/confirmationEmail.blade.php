<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Correo Electrónico - Ministerio Público</title>
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
        .content a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #2535aa;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .content a:hover {
            background-color: #2535aa;
            color: #ffffff;
            box-shadow: #333333 2px 2px 2px;
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
        .footer .social-icons img {
            max-width: 24px;
            margin: 0 10px;
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
            <h2>CONFIRMACIÓN DE CORREO ELECTRÓNICO</h2>
            <p>Hola, <strong>{{ $user->nombre }}</strong></p>
            <p>Siendo las <strong><i> {{ now()->format('H:i:s')??'00:00' }} </i></strong></p>
            
            <p>Estado de su cuenta: <span>{{ $mensaje }}</span></p>

        </div>
        <div class="footer">
            <p>Para amyor información,:</p>
            <!-- 
            <div class="social-icons">
                <a href="#"><img src="facebook.png" alt="Facebook"></a>
                <a href="#"><img src="twitter.png" alt="Twitter"></a>
                <a href="#"><img src="instagram.png" alt="Instagram"></a>
                <a href="#"><img src="youtube.png" alt="YouTube"></a>
                <a href="#"><img src="linkedin.png" alt="LinkedIn"></a>
            </div>-->
            <p>Contáctenos: (+51) --- | ---@mpfn.gob.pe</p>
            <p><a href="#">Aviso de Privacidad</a> | <a href="#">Términos y Condiciones</a></p>
            <p>Este correo fue enviado desde el Ministerio Público - Fiscalía de la Nación. Si no desea recibir más correos, puede <a href="#">cancelar su suscripción aquí</a>.</p>
        </div>
    </div>
</body>
</html>
