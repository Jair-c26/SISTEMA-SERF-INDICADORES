<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\email\resetPassword\processResetPasswordController;

Route::get('/', function () {
    return view('welcome');
});


//Route::post('/reset-pass',[processResetPasswordController::class,'processResetPassword'])->name('reser.pass');
