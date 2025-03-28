<?php

use Aws\S3\S3Client;
use Illuminate\Http\Request;
use Aws\Exception\AwsException;
use App\Models\fiscalia\despachos;
use App\Models\fiscalia\dependencias;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\user\UserController;
use App\Http\Controllers\email\MailController;
use App\Http\Controllers\user\RolesController;
use App\Http\Controllers\areas\sedesController;
use App\Http\Controllers\email\EmailController;

use App\Http\Controllers\user\perfilController;
use App\Http\Controllers\areas\regionController;
use App\Http\Controllers\areas\despachosController;
use App\Http\Controllers\fiscal\fiscalesController;
use App\Http\Controllers\logistica\cargaController;
use App\Http\Controllers\user\SesionUserController;
use App\Http\Controllers\archivos\carpetaController;
use App\Http\Controllers\auditoria\ipUserController;
use App\Http\Controllers\importExcel\FileController;
use App\Http\Controllers\logistica\delitoController;
use App\Http\Controllers\archivos\DownloadController;
use App\Http\Controllers\email\verifiEmailController;
use App\Http\Controllers\areas\dependenciasController;
use App\Http\Controllers\exportExcel\listaAreasController;
use App\Http\Controllers\importExcel\importAreasController;
use App\Http\Controllers\email\emailPasswordResetController;
use App\Http\Controllers\email\resetPassword\processResetPasswordController;
use App\Http\Controllers\logistica\reporte\pruebaController;
use App\Http\Controllers\importExcel\importDelitosController;
use App\Http\Controllers\importExcel\excelFuncionesController;
use App\Http\Controllers\importExcel\importCargaCasosController;
use App\Http\Controllers\importExcel\importCargaFiscalController;
use App\Http\Controllers\logistica\delitos\delitosSedeController;
use App\Http\Controllers\exportExcel\user\UsuarioExportController;
use App\Http\Controllers\importExcel\user\UsuarioImportController;
use App\Http\Controllers\logistica\cargaLaboral\dependenciaCargaController;
use App\Http\Controllers\logistica\controlPlazos\plazosController;
use App\Http\Controllers\logistica\reporte\reporteCargaController;
use App\Http\Controllers\logistica\reporte\ReporteBasicoController;
use App\Http\Controllers\logistica\cargaLaboral\sedesCargaController;
use App\Http\Controllers\logistica\controlPlazos\plazosDependenciaController;
use App\Http\Controllers\logistica\delete\eliminarDatosCantroller;
use App\Http\Controllers\logistica\delitos\delitosDependenciaController;
use App\Http\Controllers\logistica\fiscal\cargaFiscalController;
use App\Http\Controllers\logistica\reporte\fileReportController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(['middleware' => ['trust.proxies']], function () {
    Route::get('/ip', function (Illuminate\Http\Request $request) {
        return response()->json([
            'ip_from_getClientIp' => $request->getClientIp(),
            'ip_from_X_Real_IP'    => $request->header('X-Real-IP'),
            'ip_from_X_Forwarded'  => $request->header('X-Forwarded-For'),
        ]);
    });
    // Otras rutas...
});

Route::group(['middleware' => ['trust.proxies']], function () {
    // Todas tus rutas aquí

    Route::get('/listaUsers', [UserController::class, 'listaUSer']);

    Route::post('/login', [UserController::class, 'login'])->middleware('throttle:10,10'); // 10 intentos por IP; //->middleware('throttle:5,1'); //Esto limita a 5 intentos por minuto.

    //Route::get('/verify-email/{id}/{hash}', [verifiEmailController::class, 'verify'])->middleware('signed')->name('verification.verify');

    Route::get('/verify-email/{id}/{hash}', [EmailController::class, 'verifyEmail'])
        ->middleware('signed')
        ->name('verification.verify')
        ->middleware('throttle:5,5'); //limite de peticiones 5


    ///---------------reset Password-------------------------------------------------------///
    Route::post('/reset-password', [UserController::class, 'resetPassword'])  /////pincipal para el envio de correos email
        ->middleware('throttle:5,5'); //limite de peticiones 5;

    //Route::post('/reset-pass', [processResetPasswordController::class, 'processResetPassword'])->name('reser.pass'); ////// ojo con esto 
    Route::post('/reset-pass', [processResetPasswordController::class, 'processResetPassword'])->name('reser.pass'); ////// ojo con esto 
    Route::get('/reset/{id}/{hash}', [emailPasswordResetController::class, 'resetPass'])->name('password.reset'); ////// ojo con esto 
    ///------------------------------------------------------------------------------///



    Route::get('/email/{email}', [MailController::class, 'enviarCorreo']);

    Route::group(['middleware' => ["auth:sanctum", "throttle:100,1"]], function () {

        Route::prefix('panel_control')->middleware(['permission:panel_control', 'throttle:50,1'])->group(function () {});

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Route::prefix('perfil')->middleware('permission:perfil')->group(function () {
            Route::apiResource('', perfilController::class);
            Route::get('/envia-codigo', [perfilController::class, 'sendVerificationCode'])->middleware('throttle:5,60'); /// 5 peticiones por cada 60 minutos
            Route::post('/delete-cuenta', [perfilController::class, 'destroyCode'])->middleware('throttle:5,60'); //////// igual xd :v
            Route::post('/passReset', [perfilController::class, 'passReset']); //->middleware('throttle:1,1440');
            Route::get('/CodePassMail', [perfilController::class, 'CodePassMail']); //->middleware('throttle:1,1440');  /// un venvio de codigo por dia
            Route::post('/codePassReset', [perfilController::class, 'codePassReset']); //->middleware('throttle:1,1440');
        });

        Route::post('/logout', [UserController::class, 'logout']);
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Grupo para el módulo de gestión de usuarios
        Route::prefix('ges_user')->middleware('permission:ges_user')->group(function () {
            // CRUD para los usuarios
            Route::apiResource('/user', UserController::class);
            Route::apiResource('/roles', RolesController::class);
            ///----------------------------EXCEL USUARIOS IMPORT Y EXPORT------------------------------------------------------------------------------------///
            Route::post('/import-user', [UsuarioImportController::class, 'import']);
            Route::get('/export-user', [UsuarioExportController::class, 'export']);
            ///----------------------------------------------------------------------------------------------------------------///
        });

        Route::apiResource('/sesion-user', SesionUserController::class);

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Route::prefix('ges_areas')->middleware('permission:ges_areas')->group(function () {
            ///----------------------------apis sedes, dependeencias y despachos------------------------------------------------------------------------------------///
            Route::apiResource('/region', regionController::class);    //http://localhost/api/region
            Route::apiResource('/sede', sedesController::class);
            Route::apiResource('/dependencia', dependenciasController::class);
            Route::apiResource('/despacho', despachosController::class);

            Route::get('/lista-areas', [sedesController::class, 'listaAreas']);
            ////////-----------------importar y exportar areas-----------------------/////////////
            Route::post('/importAreas', [importAreasController::class, 'import']);
            Route::get('/export-areas', [listaAreasController::class, 'export']);
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Route::prefix('ges_fiscal')->middleware('permission:ges_fiscal')->group(function () {
            ///
            Route::apiResource('/fiscal', fiscalesController::class);
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        Route::prefix('ges_reportes')->middleware('permission:ges_reportes')->group(function () {

            Route::get('/carga-laboral/{id}/{mes}/{anio}', [cargaController::class, 'cargaLaboral']);
            Route::get('/delitos/{id}/{mes}/{anio}', [delitoController::class, 'Detalledelitos']);

            ////// api de carga laboral en sedes y dependencias
            Route::post('/cargaSede', [sedesCargaController::class, 'cargaSedes']);
            //Route::post('/carga-dependencia',[dependenciaCargaController::class,'dependenciaCaga']);
            Route::post('/carga-dependencia', [dependenciaCargaController::class, 'dependenciaCaga']);

            ////// api de control de plazos de sedes y dependencias
            Route::post('/plazo-sede', [plazosController::class, 'plazoSede']);
            //Route::post('/plazo-dependencia',[plazosDependenciaController::class,'plazoDependencia']);
            Route::post('/plazo-dependencia', [plazosDependenciaController::class, 'plazoDependencia']);

            ////// API PARA INCIDENCIA DE DELITOS ---
            Route::post('/delito-sede', [delitosSedeController::class, 'delitoSedes']);
            Route::post('/delito-dependencia', [delitosDependenciaController::class, 'delitoDependencia']);

            Route::post('/carga-fiscal', [cargaFiscalController::class, 'cargaFiscal']);
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        Route::prefix('ges_archivos')->middleware('permission:ges_archivos')->group(function () {

            Route::apiResource('/carpeta', carpetaController::class);
            Route::get('/litsArchivosPorCarpeta', [carpetaController::class, 'litsArchivosPorCarpeta']);

            //Route::post('/file-report',[fileReportController::class,'fileMinioReport']);
            Route::post('/save-file-report', [fileReportController::class, 'fileMinioReport']);

            Route::get('descarga/{archivoId}/{expiration?}', [DownloadController::class, 'getTemporaryDownloadUrl'])
                ->name('descarga.getTemporaryDownloadUrl');

            ////// api para importar los archivos correspondientes de carga, delitos y plazos
            Route::post('/import-carga', [excelFuncionesController::class, 'importCargaYDeltios']);
            Route::post('/import-plazo', [excelFuncionesController::class, 'importPlazos']);
            Route::post('/import-tipo-delitos', [excelFuncionesController::class, 'tipoDelitos']);
            Route::post('/delete-data',[eliminarDatosCantroller::class,'delitoDependencia']);
        });


        Route::get('/dependencia/{id}/despachos', [dependenciasController::class, 'listarDespachosPorDepen']);
        Route::get('/sede/{id}/dependencias', [sedesController::class, 'listarDependenciasPorSede']);

        ///----------------------------apis carpetas y archivos------------------------------------------------------------------------------------///

        Route::get('/retorteBasico', [ReporteBasicoController::class, 'generateGraph']);
    });

    Route::post('/prueba', [pruebaController::class, 'importExcel']);
    /*
Route::middleware('cors')->get('/test-cors', function () {
    return response()->json(['message' => 'CORS funciona']);
});
*/

    Route::get('/reporte-carga-fiscal/{id}/{mes}/{anio}/{uuid}', [reporteCargaController::class, 'generarReporte']);



    Route::get('files/download', [FileController::class, 'download'])
        ->name('files.download')
        ->middleware('signed'); // Verifica la firma de la URL


    /**************** obtener la ip del user **************************************/
    Route::get('/ip-user', [ipUserController::class, 'index']);


    //Route::post('/import-casos', [importCargaCasosController::class, 'importExcel']);


    /*

Route::get('/test-minio', function () {
    try {
        // Subir un archivo público en la carpeta "perfil"
        Storage::disk('minio-public')->put('perfil/foto.txt', 'esto es una foto ');

        // Subir otro archivo privado en la carpeta "archivos"
        Storage::disk('minio-private')->put('archivos/test-jair.txt', 'Este es un archivo privado de prueba.');

        // Obtener la URL pública del archivo
        $publicFilePath = 'perfil/foto.txt';
        $publicUrl = env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET_PUBLIC') . '/' . $publicFilePath;

        // Generar una URL firmada manualmente para el archivo privado
        $privateFilePath = 'archivos/test-jair.txt';
        $privateUrl = env('AWS_ENDPOINT') . '/' . env('AWS_BUCKET_PRIVATE') . '/' . $privateFilePath . '?X-Amz-Expires=3600';

        return response()->json([
            'mensaje' => 'Archivos subidos a MinIO',
            'urlPublic' => $publicUrl,  // Se podrá acceder sin restricciones
            'urlPrivate' => $privateUrl, // Se podrá acceder solo por 1 hora
        ], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error en el disco: ' . $e->getMessage()], 500);
    }
});



use App\Http\Controllers\logistica\cargaLaboral\dependenciaCargaController;
use App\Http\Controllers\email\resetPassword\processResetPasswordController;
use App\Http\Controllers\logistica\controlPlazos\plazosDependenciaController;


Route::get('/get-private-minio-url', function () {
    try {
        $filePath = 'archivos/test-jair.txt';

        $s3 = new S3Client([
            'version' => 'latest',
            'region' => env('AWS_DEFAULT_REGION'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => true,
            'credentials' => [
                'key'    => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
        ]);

        // Generar la URL firmada con expiración de 10 minutos
        $cmd = $s3->getCommand('GetObject', [
            'Bucket' => env('AWS_BUCKET'),
            'Key'    => $filePath,
        ]);

        $request = $s3->createPresignedRequest($cmd, '+10 minutes');
        $signedUrl = (string) $request->getUri();

        return response()->json(['url' => $signedUrl], 200);
    } catch (AwsException $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});



Route::get('/get-minio-url', function () {
    $fileName = 'test-jair.txt';
    $url = 'http://' . env('MINIO_ENDPOINT') . '/' . env('MINIO_BUCKET') . '/' . $fileName;

    return response()->json(['url' => $url], 200);
});
*/
});
