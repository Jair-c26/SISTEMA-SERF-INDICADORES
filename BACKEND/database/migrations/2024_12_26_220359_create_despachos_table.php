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
        Schema::create('despachos', function (Blueprint $table) {
            $table->id();
            $table->string('cod_despa',100)->nullable();
            $table->string('nombre_despacho',200)->nullable();
            $table->string('telefono',10)->nullable();
            $table->boolean('activo')->nullable()->default(true);
            $table->string('ruc',20)->nullable();
            $table->unsignedBigInteger('dependencia_fk')->nullable();
            
            $table->timestamps();
            
            $table->foreign('dependencia_fk')->references('id')->on('dependencias');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('despachos');
    }
};
