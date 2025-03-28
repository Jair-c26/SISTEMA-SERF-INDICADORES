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
        Schema::create('eventos_sistemas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ips_user_fk')->nullable();
            $table->unsignedBigInteger('t_evento_fk')->nullable();
            $table->string('mopdulo_afec',100)->nullable();
            $table->string('descripcion',300)->nullable();
            $table->dateTime('fecha_registro')->nullable();
            
            $table->timestamps();
            
            $table->foreign('ips_user_fk')->references('id')->on('ips_users');
            $table->foreign('t_evento_fk')->references('id')->on('tipo_evento');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos_sistemas');
    }
};
