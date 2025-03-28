<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;

class TrustProxies
{
    /**
     * Los proxies de confianza para la aplicación.
     *
     * Puedes usar '*' para confiar en todos o definir un array de IPs/rangos.
     *
     * @var array|string|null
     */
    protected $proxies = '*';

    /**
     * Los encabezados que se usarán para detectar proxies.
     *
     * @var int
     */
    protected $headers = SymfonyRequest::HEADER_X_FORWARDED_FOR |
        SymfonyRequest::HEADER_X_FORWARDED_HOST |
        SymfonyRequest::HEADER_X_FORWARDED_PROTO |
        SymfonyRequest::HEADER_X_FORWARDED_PORT;
    /**
     * Maneja la solicitud entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        return $next($request);
    }
}
