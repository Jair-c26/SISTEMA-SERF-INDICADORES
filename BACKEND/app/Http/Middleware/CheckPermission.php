<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use App\Models\user\permisos;
use App\Models\user\roles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): 
     * (\Symfony\Component\HttpFoundation\Response)  $next
     */

    /**
     * Manejar la solicitud entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $permission
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $permission)
    {
        $ReUser = $request->user();
    
        // Verifica que el usuario esté autenticado
        if (!$ReUser) {
            Log::error('Usuario no autenticado.');
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }
    
        // Obtiene el rol del usuario a través de una búsqueda directa
        $roles = roles::find($ReUser->roles_fk ?? null);
    
        if (!$roles) {
            Log::error('Rol no asignado o inválido.');
            return response()->json(['message' => 'Rol no válido o no asignado.'], 403);
        }
    
        // Obtiene los permisos del rol a través de una búsqueda directa
        $permisos = permisos::find($roles->permisos_fk ?? null);
    
        //dd($permisos);
        if (!$permisos) {
            Log::error('Permisos no asignados al rol.');
            return response()->json(['message' => 'Permisos no asignados.'], 403);
        }
    
        // Verifica si el permiso requerido está presente en los permisos del rol
        if (!isset($permisos->$permission) || $permisos->$permission != 1) {
            Log::error("Permiso '{$permission}' no encontrado o no autorizado.");
            return response()->json(['message' => 'No tienes permiso para esta acción.'], 403);
        }
    
        // Permite continuar con la solicitud
        return $next($request);
    }
    
}
