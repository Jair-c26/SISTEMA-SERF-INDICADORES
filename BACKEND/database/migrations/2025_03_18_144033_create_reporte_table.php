<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use League\CommonMark\Reference\Reference;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reporte', function (Blueprint $table) {
            $table->id();
            $table->string('cod_report',100)->unique();
            $table->string('tipo_repor',50)->nullable();
            $table->unsignedBigInteger('user_fk')->nullable();
            $table->dateTime('fe_regis')->nullable();
            $table->dateTime('fe_inicio')->nullable();
            $table->dateTime('fe_fin')->nullable();
            $table->boolean('estado')->nullable()->default(true);
            $table->string('condicion',500)->nullable()->default("sin condicion");
            $table->unsignedBigInteger('actividad_fk')->nullable();
            $table->unsignedBigInteger('dependencia_fk')->nullable();
            $table->timestamps();

            $table->foreign('user_fk')->references('id')->on('users');
            $table->foreign('actividad_fk')->references('id')->on('ips_users');
            $table->foreign('dependencia_fk')->references('id')->on('dependencias');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reporte');
    }
};
