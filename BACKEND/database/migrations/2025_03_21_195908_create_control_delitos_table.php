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
        Schema::create('control_delitos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('gen_fk')->nullable();
            $table->unsignedBigInteger('sub_gen_fk')->nullable();
            $table->unsignedBigInteger('tipo_delito_fk')->nullable();
            $table->unsignedBigInteger('dependencia_fk')->nullable();
            $table->foreign('gen_fk')->references('id')->on('generico');
            $table->foreign('sub_gen_fk')->references('id')->on('sud_generico');
            $table->foreign('tipo_delito_fk')->references('id')->on('casos_tipo_delito');
            $table->foreign('dependencia_fk')->references('id')->on('dependencias');
            $table->timestamps();

            // Restricción única compuesta:
            $table->unique(['gen_fk', 'sub_gen_fk', 'tipo_delito_fk', 'dependencia_fk'], 'unique_delito');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('control_delitos');
    }
};
