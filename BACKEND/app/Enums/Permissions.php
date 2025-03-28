<?php

namespace App\Enums;

enum Permissions: string
{
    case PANEL_CONTROL = 'panel_control';
    case GES_USER = 'ges_user';
    case GES_AREAS = 'ges_areas';
    case GES_REPORTES = 'ges_reportes';
    case PERFIL = 'perfil';
    case CONFIGURACION = 'configuracion';
    // ... otros permisos
}