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
        Schema::create('metas', function (Blueprint $table) {
            $table->id();
            $table->integer('cantidad')->nullable();
            $table->dateTime('fe_ingreso')->nullable();
            $table->integer('cantidad_fiscal')->nullable();
            $table->integer('metas_fiscal')->nullable();
            $table->unsignedBigInteger('despacho_fk')->nullable();
            $table->timestamps();

            $table->foreign('despacho_fk')->references('id')->on('despachos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('metas');
    }
};
