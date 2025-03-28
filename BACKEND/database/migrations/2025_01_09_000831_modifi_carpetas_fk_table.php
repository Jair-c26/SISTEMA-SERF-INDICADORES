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
        Schema::table('carpetas', function (Blueprint $table) {
            //
            $table->foreign('tipo_repor_fk')->references('id')->on('tipo_repor');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carpetas', function (Blueprint $table) {
            //
        });
    }
};
