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
        Schema::create('detalles_archi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_fk')->nullable();
            $table->unsignedBigInteger('archivo_fk')->nullable();
            $table->dateTime('fecha_registro')->nullable();
            $table->timestamps();
            
            $table->foreign('user_fk')->references('id')->on('users');
            $table->foreign('archivo_fk')->references('id')->on('archivos');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_archi');
    }
};
