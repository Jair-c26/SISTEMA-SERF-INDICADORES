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
        Schema::create('fiscales', function (Blueprint $table) {
            $table->id();
            $table->string('id_fiscal',100)->nullable()->default('sin codigo');
            $table->string('nombres_f',200)->unique();
            $table->string('email_f',100)->nullable()->default('sin correo');
            $table->string('dni_f',15)->nullable()->default('sin dni');
            $table->boolean('activo')->default(true); // si es true el usuario esta activo y false, el usuario esta eliminado
            $table->unsignedBigInteger('ti_fiscal_fk')->nullable();
            $table->unsignedBigInteger('despacho_fk')->nullable();
            $table->unsignedBigInteger('dependencias_fk')->nullable();
            $table->string('espacialidad',200)->nullable();
            $table->timestamps();

            $table->foreign('ti_fiscal_fk')->references('id')->on('fiscal');
            $table->foreign('dependencias_fk')->references('id')->on('dependencias');
            $table->foreign('despacho_fk')->references('id')->on('despachos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fiscales');
    }
};
