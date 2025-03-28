<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Rutas que usarán CORS

    'allowed_methods' => ['*'], // Métodos permitidos (GET, POST, PUT, DELETE, etc.)
    
    'allowed_origins' => ['*'], // Orígenes permitidos (puedes especificar tus dominios aquí)
    
    'allowed_headers' => ['*'], // Encabezados permitidos
    
    'exposed_headers' => [], // Encabezados expuestos al cliente
    
    'max_age' => 0, // Tiempo máximo de caché de la respuesta CORS
    
    'supports_credentials' => true, // Si usas cookies o autenticación

];
