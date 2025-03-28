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
        Schema::create('dependencias', function (Blueprint $table) {
            $table->id();
            $table->string('cod_depen',100)->nullable();
            $table->string('fiscalia',200)->nullable();
            $table->string('tipo_fiscalia',200)->nullable();
            $table->string('nombre_fiscalia',200)->nullable();
            $table->boolean('activo')->nullable()->default(true);
            $table->boolean('carga')->nullable()->default(true);
            $table->boolean('delitos')->nullable()->default(true);
            $table->boolean('plazo')->nullable()->default(true);
            $table->string('telefono',20)->nullable();
            $table->string('ruc',20)->nullable();
            $table->unsignedBigInteger('sede_fk')->nullable();
            //$table->unsignedBigInteger('user_fk')->nullable();
            
            $table->timestamps();
            
            $table->foreign('sede_fk')->references('id')->on('sedes');
            //$table->foreign('user_fk')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dependencias');
    }
};
