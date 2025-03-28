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
        Schema::create('incidencias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('casos_fk')->nullable();
            $table->unsignedBigInteger('t_delito_fk')->nullable();
            $table->timestamps();

            $table->foreign('casos_fk')->references('id')->on('casos');
            $table->foreign('t_delito_fk')->references('id')->on('casos_tipo_delito');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incidencias');
    }
};
