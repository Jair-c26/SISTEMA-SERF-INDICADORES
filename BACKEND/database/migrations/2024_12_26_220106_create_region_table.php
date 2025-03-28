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
        Schema::create('region', function (Blueprint $table) {
            $table->id();
            $table->string('cod_regi',100)->nullable();
            $table->string('nombre',200)->nullable();
            $table->string('telefono',10)->nullable();
            $table->string('ruc',20)->nullable();
            $table->string('departamento',100)->nullable();
            $table->string('cod_postal')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('region');
    }
};
