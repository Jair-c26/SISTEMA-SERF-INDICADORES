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
        Schema::create('casos', function (Blueprint $table) {
            $table->id();
            $table->string('codi_caso',100)->unique();
            $table->unsignedBigInteger('fiscal_fk')->nullable();
            $table->dateTime('fe_denuncia')->nullable();
            $table->dateTime('fe_ing_caso')->nullable();
            $table->dateTime('fe_asignacion')->nullable();
            $table->dateTime('fe_conclucion')->nullable();
            $table->string('tx_tipo_caso',100)->nullable();
            $table->unsignedBigInteger('condicion_fk')->nullable();
            $table->unsignedBigInteger('estado_fk')->nullable();
            $table->unsignedBigInteger('etapa_fk')->nullable();
             
            $table->timestamps();
            $table->foreign('fiscal_fk')->references('id')->on('fiscales');
            $table->foreign('estado_fk')->references('id')->on('estado');
            $table->foreign('etapa_fk')->references('id')->on('etapas');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('casos');
    }
};
