<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('archivos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo',50)->nullable();
            $table->string('nombre',100)->nullable();
            $table->string('peso_arch',10)->nullable();
            $table->string('tipo_arch',50)->nullable();
            $table->string('url_archivo',500)->nullable();
            $table->string('file_path',500)->nullable();
            $table->unsignedBigInteger('user_fk')->nullable();
            $table->unsignedBigInteger('carpeta_fk')->nullable();

            $table->timestamps();
            
            $table->foreign('user_fk')->references('id')->on('users');
            $table->foreign('carpeta_fk')->references('id')->on('carpetas');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archivos');
    }
};
