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
        Schema::create('carpetas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_carp',50)->nullable();
            $table->string('nombre_carp',50)->nullable();
            $table->string('tip_carp')->nullable();
            $table->string('direc_carp',200)->nullable();
            $table->unsignedBigInteger('tipo_repor_fk')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carpetas');
    }
};
