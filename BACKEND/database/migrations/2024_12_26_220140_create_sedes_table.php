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
        Schema::create('sedes', function (Blueprint $table) {
            $table->id();
            $table->string('cod_sede',100)->nullable();
            $table->string('nombre',200)->nullable();
            $table->string('telefono',10)->nullable();
            $table->string('ruc',20)->nullable();
            $table->string('provincia',200)->nullable();
            $table->boolean('activo')->nullable()->default(true);
            $table->string('distrito_fiscal',200)->nullable();
            $table->string('codigo_postal',20)->nullable();
            $table->unsignedBigInteger('regional_fk')->nullable();
            //$table->unsignedBigInteger('user_fk')->nullable();
            
            $table->timestamps();

            $table->foreign('regional_fk')->references('id')->on('region');
            //$table->foreign('user_fk')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sedes');
    }
};
