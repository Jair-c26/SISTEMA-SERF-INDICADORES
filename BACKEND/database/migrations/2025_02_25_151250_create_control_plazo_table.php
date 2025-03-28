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
        Schema::create('control_plazo', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('caso_fk')->nullable();
            $table->timestamp('f_estado')->nullable();
            $table->unsignedBigInteger('color_fk')->nullable();
            $table->integer('plazo')->nullable();
            $table->string('tipo_caso',50)->nullable();
            $table->integer('dias')->nullable();
            $table->string('observacion_plazo',300)->nullable();
            $table->integer('dias_paralizados')->nullable();
            $table->integer('dias_total_transcurridos')->nullable();
            $table->timestamps();

            $table->foreign('caso_fk')->references('id')->on('casos');
            $table->foreign('color_fk')->references('id')->on('color_plazo');

            // Agregar restricción única para evitar duplicados en control_plazo
            $table->unique('caso_fk');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('control_plazo');
    }
};
