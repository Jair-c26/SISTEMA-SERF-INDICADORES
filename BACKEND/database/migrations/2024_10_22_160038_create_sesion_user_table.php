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
        Schema::create('sesion_user', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_fk')->nullable();
            $table->boolean('estado_activo')->default(false);
            $table->dateTime('fecha_inicio')->nullable();
            $table->dateTime('fecha_cierre')->nullable();
            $table->string('dispositivos',100)->nullable();
            $table->string('navegador',100)->nullable();
            
            $table->timestamps();

            $table->foreign('user_fk')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sesion_user');
    }
};
