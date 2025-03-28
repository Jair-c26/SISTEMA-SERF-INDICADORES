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
        Schema::create('ips_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_fk')->nullable();
            $table->string('ip_origen',20)->nullable();
            $table->string('clase_ip',20)->nullable('clase c');
            $table->dateTime('fecha_registro')->nullable();
            $table->timestamps();

            $table->foreign('user_fk')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ips_users');
    }
};
