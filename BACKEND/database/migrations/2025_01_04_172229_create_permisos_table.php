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
        Schema::create('permisos', function (Blueprint $table) {
            $table->id();
            $table->boolean('panel_control')->nullable();
            $table->boolean('ges_user')->nullable();
            $table->boolean('ges_areas')->nullable();
            $table->boolean('ges_fiscal')->nullable();
            $table->boolean('ges_reportes')->nullable();
            $table->boolean('ges_archivos')->nullable();
            $table->boolean('perfil')->nullable();
            $table->boolean('configuracion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permisos');
    }
};
