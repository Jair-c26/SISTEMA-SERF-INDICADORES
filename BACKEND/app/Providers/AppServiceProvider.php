<?php

namespace App\Providers;

use DateTime;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        // Forzar la URL raíz definida en config/app.php (usando APP_URL)
        URL::forceRootUrl(config('app.url'));

        // Opcional: Forzar el esquema si usas HTTPS
        // URL::forceScheme('https');
        // Personalizar la generación de URLs temporales para el disco "minio-private"
        Storage::disk('minio-private')->buildTemporaryUrlsUsing(
            function (string $path, DateTime $expiration, array $options) {
                // Construir una URL firmada utilizando una ruta API
                // En este ejemplo, la ruta se llamará "files.download" (la definiremos en api.php)
                return URL::temporarySignedRoute(
                    'files.download', // Nombre de la ruta
                    $expiration,
                    array_merge($options, ['path' => $path])
                );
            }
        );
    }
}
