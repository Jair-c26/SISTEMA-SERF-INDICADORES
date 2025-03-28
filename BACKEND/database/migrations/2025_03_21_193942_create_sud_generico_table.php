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
        Schema::create('sud_generico', function (Blueprint $table) {
            $table->id();
            $table->string('sub_gen',700)->nullable();
            $table->string('descripcion',700)->nullable();
            //$table->unsignedBigInteger('gen_fk')->nullable();
            //table->foreign('gen_fk')->references('id')->on('generico');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sud_generico');
    }
};
